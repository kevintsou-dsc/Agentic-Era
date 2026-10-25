"""全文涵蓋率檢查：PDF 抽取版的每一句（≥ 15 字），是否都出現在 IDML 版全文或圖表文字中。
用來確認換成 IDML 之後沒有漏掉內文。找不到的句子多半是 PDF 把圖表文字黏進內文造成的，需人工看一下。
用法：python -I -X utf8 scripts/verify/coverage.py [aNN ...]
"""
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def norm(s):
    out = []
    for c in s:
        if c.isspace():
            continue
        n = unicodedata.normalize("NFKC", c)
        out.append("「" if n in "「『“\"" else "」" if n in "」』”\"" else "-" if n in "—–－―‐-" else n)
    return "".join(out)


def body(md):
    return "\n".join(l for l in md.replace("\r\n", "\n").split("\n") if not l.startswith("<!--"))


ids = sys.argv[1:] or [p.stem for p in sorted((ROOT / "content" / "fulltext").glob("a*.md"))]
for aid in ids:
    new = norm(body((ROOT / "content" / "fulltext" / f"{aid}.md").read_text(encoding="utf-8")))
    fig = ROOT / "content" / "figtext" / f"{aid}.md"
    new += norm(body(fig.read_text(encoding="utf-8"))) if fig.exists() else ""
    old = body((ROOT / "content" / "fulltext-pdf" / f"{aid}.md").read_text(encoding="utf-8"))
    sents = [s for s in re.split(r"(?<=[。！？])", old.replace("\n", "")) if len(norm(s)) >= 15]
    # 取句首、句中、句尾各 10 個字；三個都找不到才算漏掉（PDF 常把圖表文字黏在句子前後）
    missing = []
    for s in sents:
        n = norm(re.sub(r"## ", "", s))
        probes = [n[2:12], n[len(n) // 2 - 5: len(n) // 2 + 5], n[-12:-2]]
        if not any(p and p in new for p in probes if len(p) >= 8):
            missing.append(s.strip())
    ok = 100 * (1 - len(missing) / max(1, len(sents)))
    print(f"{aid}: {len(sents)} 句，涵蓋 {ok:.1f}%")
    for m in missing[:4]:
        print("    缺：", m[:70])
