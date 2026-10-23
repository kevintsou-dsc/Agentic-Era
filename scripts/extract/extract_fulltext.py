"""從單篇完稿 PDF 抽出全文，依印刷頁碼與欄位排序，輸出 content/fulltext/aNN.md。

每個 PDF 頁是一個跨頁（左右兩個印刷頁），各篇都從左頁（偶數頁）開始。
排序：印刷頁 → 欄（每頁兩欄）→ 由上到下。字級明顯大於內文的區塊標為標題。

用法：python -I scripts/extract/extract_fulltext.py <單篇完稿PDF資料夾> <輸出資料夾>
"""
import json
import re
import statistics
import sys
from pathlib import Path

import fitz  # PyMuPDF

# PDF 檔名前綴 → (文章編號, 紙本起始頁, 章節)；起始頁取自 0-0_簡介目錄.pdf
ARTICLES = {
    "0-1": (1, 6, "intro"), "0-2": (2, 12, "intro"),
    "1-3": (3, 20, "people"), "1-4": (4, 28, "people"), "1-5": (5, 36, "people"),
    "1-6": (6, 44, "people"), "1-7": (7, 50, "people"), "1-8": (8, 58, "people"),
    "1-9": (9, 66, "people"), "1-10": (10, 72, "people"), "1-11": (11, 80, "people"),
    # 注意：檔名 2-14／2-15 與印刷順序相反。依頁眉頁碼核對：2-14＝p.136（生成式體驗）、2-15＝p.128（衡斷力）
    "2-12": (12, 96, "model"), "2-13": (13, 116, "model"), "2-15": (14, 128, "model"),
    "2-14": (15, 136, "model"), "2-16": (16, 144, "model"),
    "3-17": (17, 152, "ai"), "3-18": (18, 160, "ai"), "3-19": (19, 168, "ai"),
    "3-20": (20, 176, "ai"), "3-21": (21, 182, "ai"), "3-22": (22, 188, "ai"),
}

RUNNING_HEAD = re.compile(
    r"^\s*(?:[:：]?\s*(?:People|Model|A\.?I|Intro)\s*)+\d{0,6}\s*$"   # People/AI 章：「:People45」
    r"|^\s*\d{1,3}(?:\s+\d{1,3})?\s*(?:[:：]\s*(?:People|Model|A\.?I|Intro)\s*)+$"  # Model 章：「97 :Model」
    r"|^\s*\d{1,3}\s*$")
TERMINAL = tuple("。！？」』）)：:…")


def block_info(block):
    sizes, lines = [], []
    for line in block.get("lines", []):
        text = "".join(span["text"] for span in line["spans"])
        if text.strip():
            lines.append(text)
            sizes.extend(span["size"] for span in line["spans"] if span["text"].strip())
    return "".join(lines).strip(), (max(sizes) if sizes else 0)


def extract(pdf_path, start_page):
    doc = fitz.open(pdf_path)
    items, images = [], []
    for pno, page in enumerate(doc):
        half = page.rect.width / 2
        quarter = half / 2
        n_images = 0
        for block in page.get_text("dict")["blocks"]:
            x0, y0, x1, y1 = block["bbox"]
            cx = (x0 + x1) / 2
            side = 1 if cx >= half else 0
            printed = start_page + pno * 2 + side
            if block["type"] == 1:
                n_images += 1
                images.append({"printedPage": printed, "w": round(x1 - x0), "h": round(y1 - y0)})
                continue
            text, size = block_info(block)
            if not text or RUNNING_HEAD.match(text):
                continue
            col = 1 if (cx - side * half) >= quarter else 0
            items.append({"page": printed, "col": col, "y": y0, "y1": y1, "size": size, "text": text})
    items.sort(key=lambda b: (b["page"], b["col"], b["y"]))
    body = statistics.median([b["size"] for b in items]) if items else 10
    return items, body, images, doc.page_count


def to_markdown(items, body):
    """把逐行的區塊併成段落：同頁同欄、同類（標題/內文）、行距正常的區塊接在一起。"""
    paras = []  # [page, kind, text, last_block]
    pending_dropcap = ""
    for b in items:
        is_head = b["size"] > body * 1.25
        if is_head and len(b["text"]) == 1:  # 首字放大
            pending_dropcap = b["text"]
            continue
        kind = "head" if is_head else "body"
        text = pending_dropcap + b["text"]
        pending_dropcap = ""
        prev = paras[-1] if paras else None
        if prev and prev[0] == b["page"] and prev[1] == kind and prev[3]["col"] == b["col"]:
            gap = b["y"] - prev[3]["y1"]
            line_h = prev[3]["y1"] - prev[3]["y"]
            if 0 <= gap < max(line_h, b["size"]) * 0.9:
                prev[2] += text
                prev[3] = b
                continue
        paras.append([b["page"], kind, text, b])
    # 第二輪：同頁的內文段落若前一段沒有以句末標點結束，視為同一段被排版切開；連續標題也併成一行
    merged = []
    for p in paras:
        prev = merged[-1] if merged else None
        if prev and prev[0] == p[0] and prev[1] == p[1] and (p[1] == "head" or not prev[2].endswith(TERMINAL)):
            prev[2] += p[2]
            continue
        merged.append(p)
    paras = merged
    out, current = [], None
    for page, kind, text, _ in paras:
        if page != current:
            current = page
            out.append(f"<!-- p.{current} -->")
        out.append(("## " + text) if kind == "head" else text)
    return "\n\n".join(out).strip() + "\n"


def main(src_dir, out_dir):
    src, out = Path(src_dir), Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    report = []
    for pdf in sorted(src.glob("*.pdf")):
        prefix = pdf.name.split(" ")[0].split("_")[0]
        if prefix not in ARTICLES:
            continue
        num, start, chapter = ARTICLES[prefix]
        items, body, images, n_pages = extract(pdf, start)
        md = to_markdown(items, body)
        (out / f"a{num:02d}.md").write_text(md, encoding="utf-8")
        report.append({
            "id": num, "chapter": chapter, "sourceFile": pdf.name,
            "printPageStart": start, "printPageEnd": start + n_pages * 2 - 1,
            "chars": len(re.sub(r"\s", "", md)), "images": images,
        })
    (out / "_extract-report.json").write_text(
        json.dumps(sorted(report, key=lambda r: r["id"]), ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"extracted {len(report)} articles")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
