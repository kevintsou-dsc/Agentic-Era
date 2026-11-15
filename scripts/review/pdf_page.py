"""從單篇完稿 PDF 取出某一個印刷頁，給校稿與抽查用（印刷版是正本）。

每個 PDF 頁是一個跨頁：左半是偶數印刷頁、右半是奇數印刷頁（見 extract/extract_fulltext.py）。
用法：
  python -I -X utf8 scripts/review/pdf_page.py <素材資料夾> aNN <印刷頁>            印出該頁原始文字（依區塊、由上到下）
  python -I -X utf8 scripts/review/pdf_page.py <素材資料夾> aNN <印刷頁> --png 輸出.png  另存該頁圖片（2 倍解析度）
<素材資料夾>＝放「單篇完稿PDF」的資料夾。素材不進 repo，所以由參數傳入。
"""
import sys
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "extract"))
from extract_fulltext import ARTICLES  # noqa: E402


def locate(src, aid):
    num = int(aid[1:])
    for prefix, (n, start, _) in ARTICLES.items():
        if n == num:
            pdf = next(p for p in Path(src).iterdir() if p.suffix == ".pdf" and (p.name.startswith(prefix + " ") or p.name.startswith(prefix + "_")))
            return pdf, start
    raise SystemExit(f"找不到 {aid}")


def main(src, aid, printed, png=None):
    pdf, start = locate(src, aid)
    off = printed - start
    if off < 0:
        raise SystemExit(f"{aid} 從 p.{start} 開始")
    doc = fitz.open(pdf)
    pno, side = divmod(off, 2)
    if pno >= len(doc):
        raise SystemExit(f"{aid} 只有 {len(doc) * 2} 頁")
    page = doc[pno]
    half = page.rect.width / 2
    clip = fitz.Rect(half * side, 0, half * (side + 1), page.rect.height)
    if png:
        page.get_pixmap(clip=clip, matrix=fitz.Matrix(2, 2)).save(png)
        print(f"已存 {png}")
    blocks = [b for b in page.get_text("blocks", clip=clip) if b[4].strip()]
    for b in sorted(blocks, key=lambda b: (round(b[0] / 60), b[1])):
        print(b[4].strip().replace("\n", ""))
        print("---")


if __name__ == "__main__":
    a = sys.argv[1:]
    png = a[a.index("--png") + 1] if "--png" in a else None
    main(a[0], a[1], int(a[2]), png)
