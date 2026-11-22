"""從單篇完稿 PDF 批次輸出全書 184 頁印刷版單頁 WebP，供原文頁右側「紙本對照」使用。

每個 PDF 頁是一個跨頁：左半為偶數印刷頁、右半為奇數印刷頁（同 scripts/review/pdf_page.py）。
輸出：public/pages/aNN/pXXX.webp（例如 public/pages/a03/p020.webp）

用法：
  .venv-tools/Scripts/python.exe scripts/extract/export_pages.py "<單篇完稿PDF資料夾>" [--width 900] [--quality 76]
"""
import argparse
import io
import json
import sys
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_fulltext import ARTICLES  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]


def find_pdf(src_dir: Path, prefix: str) -> Path:
    for p in src_dir.iterdir():
        if p.suffix.lower() == ".pdf" and (p.name.startswith(prefix + " ") or p.name.startswith(prefix + "_")):
            return p
    raise FileNotFoundError(f"找不到前綴 {prefix} 的 PDF：{src_dir}")


def main():
    parser = argparse.ArgumentParser(description="批次轉檔單篇完稿 PDF 為單頁 WebP")
    parser.add_argument("src", help="單篇完稿 PDF 資料夾路徑")
    parser.add_argument("--width", type=int, default=900, help="目標單頁寬度 px（預設 900）")
    parser.add_argument("--quality", type=int, default=76, help="WebP 品質（預設 76）")
    args = parser.parse_args()

    src_dir = Path(args.src)
    if not src_dir.is_dir():
        raise SystemExit(f"找不到資料夾：{src_dir}")

    articles_meta = json.loads((ROOT / "content" / "articles.json").read_text("utf-8"))["articles"]
    ranges = {a["id"]: tuple(a["pages"]) for a in articles_meta}

    out_root = ROOT / "public" / "pages"
    total_pages = 0
    total_bytes = 0

    for prefix, (num, start, _ch) in sorted(ARTICLES.items(), key=lambda kv: kv[1][0]):
        aid = f"a{num:02d}"
        p_start, p_end = ranges[aid]
        if p_start != start:
            print(f"[WARN] {aid}: articles.json start={p_start} vs ARTICLES start={start}")
        pdf_path = find_pdf(src_dir, prefix)
        doc = fitz.open(pdf_path)
        out_dir = out_root / aid
        out_dir.mkdir(parents=True, exist_ok=True)

        art_pages = 0
        art_bytes = 0
        for pno, page in enumerate(doc):
            half = page.rect.width / 2
            scale = args.width / half
            mat = fitz.Matrix(scale, scale)
            for side in (0, 1):
                printed = start + pno * 2 + side
                if printed < p_start or printed > p_end:
                    continue
                clip = fitz.Rect(half * side, 0, half * (side + 1), page.rect.height)
                pix = page.get_pixmap(clip=clip, matrix=mat, alpha=False)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                out_file = out_dir / f"p{printed:03d}.webp"
                buf = io.BytesIO()
                img.save(buf, format="WEBP", quality=args.quality, method=6)
                data = buf.getvalue()
                out_file.write_bytes(data)
                art_pages += 1
                art_bytes += len(data)
        doc.close()
        total_pages += art_pages
        total_bytes += art_bytes
        print(f"{aid}: {art_pages:2d}p (p.{p_start}-{p_end})  {art_bytes / 1024:6.1f} KB")

    print(f"\nDONE: {total_pages} pages, {total_bytes / (1024 * 1024):.2f} MB (avg {total_bytes / max(total_pages, 1) / 1024:.1f} KB/page)")


if __name__ == "__main__":
    main()
