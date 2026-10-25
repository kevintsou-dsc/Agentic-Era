"""盤點並抽出每篇文章的圖：案例照片／截圖（點陣圖）、圖說與資料來源、QR code 連結、註解網址。

輸出：
  content/figures/aNN.json   每篇的圖清單（圖號、紙本頁、圖說、資料來源、圖檔、附近的 QR 連結）與註解網址
  public/fig/aNN/*.webp      案例照片（依 PDF 內嵌原始解析度輸出，最長邊 1600px、品質 86）
  <preview_dir>/aNN-pNN.png  （選用）每個跨頁的縮圖，供人工比對向量圖表

用法：.venv-tools/Scripts/python scripts/extract/extract_figures.py <單篇完稿PDF資料夾> [preview_dir]
需要 pymupdf、opencv-python-headless、pillow（裝在 .venv-tools，不進 repo）。
"""
import io
import json
import re
import sys
from pathlib import Path

import cv2
import numpy as np
import pymupdf as fitz
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_fulltext import ARTICLES  # 檔名前綴 → (編號, 起始頁, 章)

ROOT = Path(__file__).resolve().parents[2]
CAPTION = re.compile(r"^(圖\s*\d*\s*[:：]|表\s*\d*\s*[:：])")
SOURCE = re.compile(r"(資料來源|圖片來源)\s*[:：｜|]?\s*(.+)")
URL = re.compile(r"https?://[^\s，。）)」]+")


def printed_page(start, pno, x, half):
    return start + pno * 2 + (1 if x >= half else 0)


def decode_qr(gray):
    """OpenCV 5 的標準偵測器讀不到這批 QR，Aruco 版可以；兩個都試，取有結果的。"""
    found = []
    for det in (cv2.QRCodeDetectorAruco(), cv2.QRCodeDetector()):
        try:
            ok, texts, pts, _ = det.detectAndDecodeMulti(gray)
        except cv2.error:
            continue
        if ok:
            for t, p in zip(texts, pts):
                if t and all(t != f[0] for f in found):
                    found.append((t, p.mean(axis=0)))
        if found:
            break
    return found


def render_gray(page, zoom, clip=None):
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=clip)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3].copy()
    return cv2.cvtColor(img, cv2.COLOR_RGB2GRAY), pix


def text_blocks(page):
    out = []
    for b in page.get_text("blocks"):
        t = re.sub(r"\s+", " ", b[4]).strip()
        if t:
            out.append({"bbox": fitz.Rect(b[:4]), "text": t})
    return out


def extract(pdf, num, start, out_img_dir, preview_dir):
    doc = fitz.open(pdf)
    aid = f"a{num:02d}"
    figures, qrs = [], []
    for pno, page in enumerate(doc):
        W, H = page.rect.width, page.rect.height
        half = W / 2
        blocks = text_blocks(page)
        captions = [b for b in blocks if CAPTION.match(b["text"])]

        # QR：先逐一解碼小的方形點陣圖（QR 本身就是 30–60pt 的方形圖片），再整頁掃一次補漏
        for info in page.get_image_info():
            r = fitz.Rect(info["bbox"])
            if 25 < r.width < 70 and 0.8 < r.width / max(r.height, 1) < 1.25:
                gray, _ = render_gray(page, 8, clip=r + (-4, -4, 4, 4))
                for url, _c in decode_qr(gray):
                    qrs.append({"page": printed_page(start, pno, (r.x0 + r.x1) / 2, half), "url": url,
                                "x": round((r.x0 + r.x1) / 2), "y": round((r.y0 + r.y1) / 2)})
        gray, pix = render_gray(page, 4)
        for url, center in decode_qr(gray):
            if any(q["url"] == url for q in qrs):
                continue
            x, y = center[0] / 4, center[1] / 4
            qrs.append({"page": printed_page(start, pno, x, half), "url": url, "x": round(x), "y": round(y)})
        if preview_dir:
            Image.fromarray(gray).resize((pix.width // 6, pix.height // 6)).save(Path(preview_dir) / f"{aid}-s{pno + 1}.png")

        # 點陣圖：排除整頁底紋（> 60% 半頁面積）與小圖示（< 2% 半頁面積）
        seen = []
        for info in page.get_image_info(xrefs=True):
            r = fitz.Rect(info["bbox"]) & page.rect
            area = r.width * r.height
            if area > 0.6 * half * H or area < 0.02 * half * H:
                continue
            if any((r & s).get_area() > 0.8 * area for s in seen):
                continue
            seen.append(r)
            cx = (r.x0 + r.x1) / 2
            pg = printed_page(start, pno, cx, half)
            # 最近的圖說：圖片下方 0–90pt 或上方 0–40pt、水平有重疊
            cap = None
            for c in captions:
                cb = c["bbox"]
                horiz = min(r.x1, cb.x1) - max(r.x0, cb.x0) > 0
                if horiz and (-40 < cb.y0 - r.y1 < 90 or -40 < r.y0 - cb.y1 < 40):
                    cap = c
                    break
            caption, source = "", ""
            if cap:
                t = cap["text"]
                m = SOURCE.search(t)
                caption = (t[: m.start()] if m else t).strip()
                source = m.group(2).strip() if m else ""
            # 圖片周圍的 QR（QR 通常印在圖片下方的圖說旁）
            near = [q["url"] for q in qrs if q["page"] == pg and r.x0 - 80 < q["x"] < r.x1 + 80 and r.y0 - 60 < q["y"] < r.y1 + 110]
            # 依內嵌圖片的原始像素決定放大倍率（舊版固定 2.5 倍≈180dpi，會把高解析圖縮小一半）。
            # 仍以「裁切渲染」輸出，才能保留 InDesign 的裁切框與遮罩；倍率夾在 2.5–6 倍之間。
            full = fitz.Rect(info["bbox"])
            native = info.get("width", 0) / max(full.width, 1)
            zoom = max(2.5, min(native, 6))
            clip = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=r)
            im = Image.open(io.BytesIO(clip.tobytes("png"))).convert("RGB")
            im.thumbnail((1600, 1600), Image.LANCZOS)
            name = f"p{pg}-{len([f for f in figures if f['page'] == pg]) + 1}.webp"
            out_img_dir.mkdir(parents=True, exist_ok=True)
            im.save(out_img_dir / name, "WEBP", quality=86, method=6)
            figures.append({"page": pg, "image": f"/fig/{aid}/{name}", "w": im.width, "h": im.height,
                            "caption": caption, "source": source, "qr": near,
                            "bbox": [round(v) for v in (r.x0, r.y0, r.x1, r.y1)]})

        # 沒有對到點陣圖的圖說＝向量圖表或表格
        used = {f["caption"] for f in figures}
        for c in captions:
            t = c["text"]
            m = SOURCE.search(t)
            caption = (t[: m.start()] if m else t).strip()
            if caption and caption not in used:
                cx = (c["bbox"].x0 + c["bbox"].x1) / 2
                figures.append({"page": printed_page(start, pno, cx, half), "image": None, "kind": "vector",
                                "caption": caption, "source": m.group(2).strip() if m else "", "qr": []})

    # 註解網址以 PDF 抽取版為準（IDML 版的註解已去掉「註解N」編號）
    md = (ROOT / "content" / "fulltext-pdf" / f"{aid}.md").read_text(encoding="utf-8")
    notes = [{"n": int(n), "url": u} for n, u in re.findall(r"註解\s*(\d+)\s*[^h註]*?(https?://[^\s註]+)", md)]
    return {"id": aid, "figures": sorted(figures, key=lambda f: f["page"]), "qr": qrs, "notes": notes}


def main(src_dir, preview_dir=None):
    if preview_dir:
        Path(preview_dir).mkdir(parents=True, exist_ok=True)
    out = ROOT / "content" / "figures"
    out.mkdir(parents=True, exist_ok=True)
    for pdf in sorted(Path(src_dir).glob("*.pdf")):
        prefix = pdf.name.split(" ")[0].split("_")[0]
        if prefix not in ARTICLES:
            continue
        num, start, _ = ARTICLES[prefix]
        res = extract(pdf, num, start, ROOT / "public" / "fig" / f"a{num:02d}", preview_dir)
        (out / f"{res['id']}.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
        photos = sum(1 for f in res["figures"] if f.get("image"))
        vec = sum(1 for f in res["figures"] if not f.get("image"))
        print(f"{res['id']}: {photos} 張圖片、{vec} 個向量圖表／表格、{len(res['qr'])} 個 QR、{len(res['notes'])} 個註解網址")


if __name__ == "__main__":
    main(*sys.argv[1:3])
