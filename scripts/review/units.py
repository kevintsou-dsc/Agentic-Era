"""把 src/data/stories/a*.ts 拆成「審查單位」：每段主文（或圖表細節）連同它引用的原文上下文。
給 jev_pilot.py / jev_review.py 使用。只做解析，不呼叫任何 API。"""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORIES = ROOT / "src" / "data" / "stories"
FULLTEXT = ROOT / "content" / "fulltext"

QUOTE_L, QUOTE_R = "「『“\"", "」』”\""


def norm_char(c):
    if c.isspace():
        return ""
    n = unicodedata.normalize("NFKC", c)
    if n in QUOTE_L:
        return "「"
    if n in QUOTE_R:
        return "」"
    if n in "—–－―‐-":
        return "-"
    if n in "|｜":
        return "|"
    return n


def mapped(raw):
    out, idx = [], []
    for i, c in enumerate(raw):
        for ch in norm_char(c):
            out.append(ch)
            idx.append(i)
    return "".join(out), idx


def pages(article):
    text = (FULLTEXT / f"{article}.md").read_text(encoding="utf-8").replace("\r\n", "\n")
    out, page = {}, None
    for line in text.split("\n"):
        m = re.match(r"<!-- p\.(\d+) -->", line)
        if m:
            page = int(m.group(1))
            continue
        if page is not None and line.strip() and not line.startswith("##"):
            out[page] = out.get(page, "") + line.strip()
    return out


_cache = {}


def context(src, pad=140):
    """引文所在段落前後各約 pad 字（原文），找不到就回傳引文本身。"""
    p = _cache.setdefault(src["article"], pages(src["article"]))
    target = mapped(src["text"])[0]
    for raw in (p.get(src["page"], ""), p.get(src["page"], "") + p.get(src["page"] + 1, "")):
        n, idx = mapped(raw)
        at = n.find(target)
        if at >= 0:
            s, e = idx[at], idx[at + len(target) - 1] + 1
            return raw[max(0, s - pad): min(len(raw), e + pad)]
    return src["text"]


SRC_RE = re.compile(r"\{\s*article:\s*'(a\d\d)',\s*page:\s*(\d+),\s*text:\s*'((?:[^'\\]|\\.)*)'\s*\}")
UNIT_RE = re.compile(r"(detail:\s*\{\s*)?text:\s*'((?:[^'\\]|\\.)*)',\s*src:\s*\[", re.S)


def parse_story(path):
    code = path.read_text(encoding="utf-8")
    sid = path.stem
    one = re.search(r"oneLiner:\s*'([^']*)'", code)
    units = []
    for m in UNIT_RE.finditer(code):
        # 從 src: [ 之後找到對應的 ]
        start = m.end()
        depth, i = 1, start
        while depth and i < len(code):
            depth += {"[": 1, "]": -1}.get(code[i], 0)
            i += 1
        srcs = [{"article": a, "page": int(p), "text": t} for a, p, t in SRC_RE.findall(code[start:i])]
        units.append({
            "story": sid,
            "kind": "detail" if m.group(1) else "main",
            "text": m.group(2).replace("**", ""),
            "src": srcs,
            "source": "\n…\n".join(context(s) for s in srcs),
        })
    return {"id": sid, "oneLiner": one.group(1) if one else "", "units": units}


def load_all():
    return [parse_story(p) for p in sorted(STORIES.glob("a[0-9][0-9].ts"))]


def article_summaries():
    """docs/source/toc-summary.txt：每列 No | 標題 | 摘要 | 作者 | 作者含職稱 | 必看三要素"""
    out = {}
    for line in (ROOT / "docs" / "source" / "toc-summary.txt").read_text(encoding="utf-8").splitlines():
        cols = [c.strip() for c in line.split(" | ")]
        if len(cols) >= 6 and cols[0].isdigit():
            out[f"a{int(cols[0]):02d}"] = cols[2] + "\n" + cols[5]
    return out


if __name__ == "__main__":
    data = load_all()
    for s in data:
        print(s["id"], len(s["units"]), "units")
    print(json.dumps(data[0]["units"][0], ensure_ascii=False, indent=1)[:800])
