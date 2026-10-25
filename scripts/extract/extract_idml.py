"""從 InDesign 交換檔（IDML）抽出乾淨的全文，取代 PDF 抽取版。

為什麼：PDF 抽取會把圖表裡的文字（「注視 5~10 秒」「Shift budgets to…」）和內文混在一起。
IDML 的內文是一整條串接的 story，段落樣式（內文、插題A、圖說…）與圖表文字框各自分開，順序也正確。

做法：
  1. 每篇 IDML：依段落樣式拆出 扉頁（標題、作者、前言）、內文、插題（小標）、圖說、側欄表格、註腳；
     圖表裡的標籤（表格_* 的短文字框）另存成 content/figtext/aNN.md，不放進閱讀用的全文。
  2. IDML 沒有印刷頁碼，所以用 PDF 抽取版（content/fulltext-pdf/aNN.md）決定頁碼：
     逐句取前 10 個字（正規化）在 PDF 各頁中找，頁碼只往後走。
  3. 去掉註腳編號（字元樣式「註腳編號」）、強制換行（U+2028）與 InDesign 的特殊字元標記。

輸出：content/fulltext/aNN.md（與舊格式相同：<!-- p.N -->、## 標題；新增 > 圖說、| 側欄）
用法：python -I -X utf8 scripts/extract/extract_idml.py <IDML 資料夾>
"""
import html
import re
import sys
import unicodedata
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PDF_TEXT = ROOT / "content" / "fulltext-pdf"
OUT = ROOT / "content" / "fulltext"
FIGTEXT = ROOT / "content" / "figtext"

# IDML 檔名關鍵字 → 文章編號（檔名的編號與印刷順序不一致，所以用標題關鍵字對應）
KEYS = [
    ("AI for Growth", "a01"), ("Agentic 時代", "a02"), ("真實的力量", "a03"), ("Agents of Growth", "a04"),
    ("增長架構師", "a05"), ("信任為何", "a06"), ("幫人買東西", "a07"), ("當注意力成為稀缺資源", "a08"),
    ("討好演算法", "a09"), ("別買曝光了", "a10"), ("從金曲獎到甄嬛傳", "a11"), ("People Model", "a12"),
    ("重建 SOV", "a13"), ("衡斷力", "a14"), ("生成式體驗", "a15"), ("文化暗流", "a16"),
    ("顧客為何停下來", "a17"), ("體驗這件事", "a18"), ("GEO", "a19"), ("SLIP", "a20"),
    ("超越效率", "a21"), ("AI Agent 走進消費旅程", "a22"),
]

PSR = re.compile(r'<ParagraphStyleRange[^>]*AppliedParagraphStyle="ParagraphStyle/([^"]+)"[^>]*>(.*?)</ParagraphStyleRange>', re.S)
CSR = re.compile(r'<CharacterStyleRange[^>]*AppliedCharacterStyle="CharacterStyle/([^"]+)"[^>]*>(.*?)</CharacterStyleRange>', re.S)
TOKEN = re.compile(r"<Content>(.*?)</Content>|<Br\s*/>", re.S)
CJK = re.compile(r"[　-鿿＀-￯]")


def clean(s):
    s = html.unescape(re.sub(r"<\?ACE \d+\?>", "", s))
    s = s.replace("﻿", "").replace("​", "")
    # 強制換行：兩側都是中日文就直接接起來，否則補一個空格
    s = re.sub(r"(.)? (.)?", lambda m: (m.group(1) or "") + ("" if (m.group(1) and CJK.match(m.group(1))) and (m.group(2) and CJK.match(m.group(2))) else " ") + (m.group(2) or ""), s)
    return re.sub(r"[ \t]+", " ", s).strip()


def paragraphs(xml):
    """回傳 [(段落樣式, 文字)]；<Br/> 是段落結束；註腳編號字元樣式整段略過。"""
    out = []
    for style, body in PSR.findall(xml):
        buf = ""
        for cstyle, cbody in CSR.findall(body) or [("", body)]:
            skip = "註腳編號" in cstyle
            for m in TOKEN.finditer(cbody):
                if m.group(0).startswith("<Br"):
                    if buf.strip():
                        out.append((style, clean(buf)))
                    buf = ""
                elif not skip:
                    buf += m.group(1)
        if buf.strip():
            out.append((style, clean(buf)))
    return out


def kind_of(style):
    s = html.unescape(style).replace("%3a", ":")
    if "註腳" in s:
        return "note"
    if "圖說" in s:
        return "cap"
    if s.startswith("扉頁"):
        return "title" if "大標" in s else "byline" if "作者" in s else "dek"
    if "插題" in s or s.startswith("小標"):
        return "h"
    if s.startswith("表格") or s.startswith("Quote") or "圓形框" in s:
        return "fig"
    return "p"


# ---------- 頁碼：用 PDF 抽取版逐句定位 ----------
def norm(s):
    out = []
    for c in s:
        if c.isspace():
            continue
        n = unicodedata.normalize("NFKC", c)
        out.append("「" if n in "「『“\"" else "」" if n in "」』”\"" else "-" if n in "—–－―‐-" else n)
    return "".join(out)


def pdf_pages(aid):
    pages, page = {}, None
    for line in (PDF_TEXT / f"{aid}.md").read_text(encoding="utf-8").replace("\r\n", "\n").split("\n"):
        m = re.match(r"<!-- p\.(\d+) -->", line)
        if m:
            page = int(m.group(1))
        elif page is not None:
            pages[page] = pages.get(page, "") + norm(line)
    return pages


def page_of(text, pages, order, start_idx):
    """在 PDF 頁中找這段文字的開頭；回傳頁序索引（只往後找，找不到回傳 None）"""
    key = norm(text)
    for size in (12, 8, 5):
        k = key[:size]
        if len(k) < 4:
            continue
        for i in range(start_idx, len(order)):
            if k in pages[order[i]]:
                return i
    return None


def sentences(text):
    """以子句為單位（句號、逗號、分號後切開），頁界常落在句子中間，切細一點頁碼才準"""
    parts = [s for s in re.split(r"(?<=[。！？，；：])", text) if s]
    # 太短的子句（< 6 字）併到前一段，避免用很短的字串去找頁碼而誤判
    out = []
    for s in parts:
        if out and len(norm(s)) < 6:
            out[-1] += s
        else:
            out.append(s)
    return out


def locate(text, pages, order):
    """這段文字開頭在 PDF 的（頁序, 頁內位置）；找不到回傳 None"""
    key = norm(text)
    for size in (12, 8):
        k = key[:size]
        if len(k) < 5:
            continue
        for i, p in enumerate(order):
            at = pages[p].find(k)
            if at >= 0:
                return (i, at)
    return None


def build(idml, aid):
    z = zipfile.ZipFile(idml)
    stories = [z.read(n).decode("utf-8") for n in z.namelist() if n.startswith("Stories/")]
    parsed = [[(kind_of(st), t) for st, t in paragraphs(x)] for x in stories]
    pages = pdf_pages(aid)
    order = sorted(pages)

    head, notes, caps, boxes, figs, bodies = [], [], [], [], [], []
    for ps in parsed:
        body_chars = sum(len(t) for k, t in ps if k in ("p", "h"))
        for k, t in ps:
            if k in ("title", "byline", "dek"):
                head.append((k, t))
            elif k == "note":
                notes.append(t)
            elif k == "cap":
                # 「資料來源：…」接回上一則圖說
                if caps and re.match(r"(資料來源|圖片來源|來源)", t) and "來源" not in caps[-1]:
                    caps[-1] += "｜" + t
                else:
                    caps.append(t)
        rest = [(k, t) for k, t in ps if k in ("p", "h", "fig")]
        if not rest:
            continue
        text = "".join(t for _, t in rest)
        # 有些篇的作者欄沒套扉頁樣式：短文字、含「｜英文名」、沒有句號，就當作者欄
        if len(text) < 90 and "。" not in text and re.search(r"[｜|]\s*[A-Z][a-z]+", text) and not any(k == "byline" for k, _ in head):
            head.append(("byline", " ".join(t for _, t in rest)))
            continue
        if body_chars >= 120:
            bodies.append([(k if k != "fig" else "p", t) for k, t in rest])  # 內文 story（可能有好幾條沒有串接）
        elif len(text) >= 80 and re.search(r"[。？！]", text):
            boxes.append(" ".join(t for _, t in rest))  # 側欄、表格裡的完整句子（例如結尾的三個問題）
        else:
            figs.extend(t for _, t in rest)  # 圖表標籤

    # 內文 story 依「在 PDF 中開始的位置」排序，就是閱讀順序
    def start(story):
        for _, t in story:
            loc = locate(t, pages, order)
            if loc:
                return loc
        return (len(order), 0)
    bodies.sort(key=start)

    head.sort(key=lambda x: ["title", "byline", "dek"].index(x[0]))
    blocks = [("page", order[0])] + [("h" if k == "title" else "p", t) for k, t in head]

    placed = []  # (頁序, 順序, kind, text)
    seq = 0
    for story in bodies:
        cur = start(story)[0] if start(story)[0] < len(order) else 0
        for k, t in story:
            if k == "h":
                i = page_of(t, pages, order, cur)
                cur = i if i is not None else cur
                placed.append((cur, seq, k, t)); seq += 1
                continue
            # 內文：逐句定位，頁碼變了就在句子之間切段
            chunk, chunk_page = "", cur
            for s in sentences(t):
                i = page_of(s, pages, order, cur)
                if i is not None and i != chunk_page and chunk:
                    placed.append((chunk_page, seq, "p", chunk)); seq += 1
                    chunk = ""
                if i is not None:
                    cur = i
                    if not chunk:
                        chunk_page = i
                chunk += s
            if chunk:
                placed.append((chunk_page, seq, "p", chunk)); seq += 1
    for k, items in (("cap", caps), ("box", boxes)):
        for t in items:
            loc = locate(t, pages, order)
            placed.append((loc[0] if loc else len(order) - 1, 10**6 + seq, k, t)); seq += 1

    # 依頁排列：每頁先內文（依 story 順序），再圖說與側欄。
    # 若這一頁的內文停在句子中間（跨頁的句子），圖說延到下一頁那半句之後，才不會插在句子中間。
    ordered, pending = [], []
    ends = lambda s: bool(re.search(r"[。！？」）]$", s))
    for idx, _, k, t in sorted(placed, key=lambda p: (p[0], p[1])):
        if k in ("cap", "box"):
            last_body = next((x for x in reversed(ordered) if x[1] in ("p", "h")), None)
            if last_body is None or last_body[1] == "h" or ends(last_body[2]):
                ordered.append((idx, k, t))
            else:
                pending.append((idx, k, t))
            continue
        ordered.append((idx, k, t))
        if pending and ends(t):
            # 保留圖說原本的頁碼；組裝時頁碼不同會自動補上頁界標記
            ordered += pending
            pending = []
    ordered += pending
    last = 0
    for idx, k, t in ordered:
        if idx != last or (idx == 0 and blocks[-1][0] != "page"):
            if idx != last:
                blocks.append(("page", order[idx]))
            last = idx
        blocks.append((k, t))
    md = []
    for k, t in blocks:
        md.append(f"<!-- p.{t} -->" if k == "page" else f"## {t}" if k == "h" else f"> {t}" if k == "cap" else f"| {t}" if k == "box" else t)
    if notes:
        md.append("## 註解")
        md += [f"[註] {n}" for n in notes]
    fig_md = [f"<!-- p.{order[page_of(f, pages, order, 0) or 0]} -->\n{f}" for f in figs]
    return "\n\n".join(md) + "\n", "\n\n".join(fig_md) + "\n"


def main(src):
    OUT.mkdir(parents=True, exist_ok=True)
    FIGTEXT.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in Path(src).iterdir() if p.suffix == ".idml")
    for key, aid in KEYS:
        idml = next((p for p in files if key in p.name), None)
        if not idml:
            print(f"{aid}: 找不到 IDML（{key}）")
            continue
        md, fig = build(idml, aid)
        (OUT / f"{aid}.md").write_text(md, encoding="utf-8")
        (FIGTEXT / f"{aid}.md").write_text(fig, encoding="utf-8")
        print(f"{aid}: {len(re.sub(r'<!--.*?-->|\\s', '', md))} 字  ← {idml.name[:40]}")


if __name__ == "__main__":
    main(sys.argv[1])
