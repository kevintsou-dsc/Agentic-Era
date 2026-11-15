"""全文校稿第 0 輪：網站全文（InDesign 抽取，content/fulltext）與完稿 PDF 抽取版（content/fulltext-pdf）逐字對齊。

coverage.py 只用探針確認「句子有沒有在」，抓不到句子裡的錯字、漏字、多字。這裡把兩份全文正規化後整篇對齊，
列出每一處差異（hunk），附紙本頁碼與前後文，交給校稿代理人判讀：
  - pdf_only：PDF 有、網站沒有。若出現在圖表文字（content/figtext）就標 fig，多半是圖表標籤，不是漏字。
  - site_only：網站有、PDF 沒有。可能是排版時被刪掉但 InDesign 檔還留著的字，最需要看。
  - replace：兩邊都有但不同。可能是完稿後才改的字，或 PDF 抽取的亂碼。
用法：python -I -X utf8 scripts/review/fulltext_diff.py [aNN ...]
輸出：content/review/fulltext-diff/aNN.json 與 summary.json
"""
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "content" / "review" / "fulltext-diff"
CTX = 18


def norm_char(c):
    n = unicodedata.normalize("NFKC", c)
    return "「" if n in "「『“\"" else "」" if n in "」』”\"" else "-" if n in "—–－―‐-" else n


def flatten(md):
    """去掉標記與空白，回傳（正規化字串, 每個字所在的紙本頁）。"""
    chars, pages, page = [], [], 0
    for line in md.replace("\r\n", "\n").split("\n"):
        m = re.match(r"^<!-- p\.(\d+) -->$", line.strip())
        if m:
            page = int(m.group(1))
            continue
        line = re.sub(r"^(## |> |\| |\[註\] )", "", line.strip())
        for c in line:
            if c.isspace():
                continue
            n = norm_char(c)
            for x in n:
                chars.append(x)
                pages.append(page)
    return "".join(chars), pages


def diff(aid):
    site, site_pg = flatten((ROOT / "content" / "fulltext" / f"{aid}.md").read_text(encoding="utf-8"))
    pdf, pdf_pg = flatten((ROOT / "content" / "fulltext-pdf" / f"{aid}.md").read_text(encoding="utf-8"))
    figp = ROOT / "content" / "figtext" / f"{aid}.md"
    fig = flatten(figp.read_text(encoding="utf-8"))[0] if figp.exists() else ""
    sm = difflib.SequenceMatcher(None, site, pdf, autojunk=False)
    hunks = []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            continue
        s, p = site[i1:i2], pdf[j1:j2]
        kind = {"delete": "site_only", "insert": "pdf_only", "replace": "replace"}[op]
        h = {
            "id": f"{aid}-{len(hunks) + 1:03d}",
            "kind": kind,
            "page": site_pg[i1] if i1 < len(site_pg) else (pdf_pg[j1] if j1 < len(pdf_pg) else 0),
            "site": s,
            "pdf": p,
            "before": site[max(0, i1 - CTX):i1],
            "after": site[i2:i2 + CTX],
        }
        # PDF 多出來的字若整段出現在圖表文字裡，多半是圖表標籤黏進 PDF 內文
        if kind == "pdf_only" and len(p) >= 2 and p in fig:
            h["fig"] = True
        # 圖說、側欄在兩份裡的位置常不同：整段在另一份的別處找得到，就只是搬動，不是漏字或多字
        elif len(s) + len(p) >= 6 and (not s or s in pdf) and (not p or p in site or p in fig):
            h["moved"] = True
        hunks.append(h)
    ratio = sm.ratio()
    real = [h for h in hunks if not h.get("fig") and not h.get("moved")]
    return {
        "id": aid,
        "site_chars": len(site),
        "pdf_chars": len(pdf),
        "ratio": round(ratio, 4),
        "hunks": len(hunks),
        "hunks_to_review": len(real),
        "site_only_chars": sum(len(h["site"]) for h in real if h["kind"] in ("site_only", "replace")),
        "pdf_only_chars": sum(len(h["pdf"]) for h in real if h["kind"] in ("pdf_only", "replace")),
        "items": hunks,
    }


def main(ids):
    OUT.mkdir(parents=True, exist_ok=True)
    summary = []
    for aid in ids:
        r = diff(aid)
        (OUT / f"{aid}.json").write_text(json.dumps(r, ensure_ascii=False, indent=1), encoding="utf-8")
        summary.append({k: v for k, v in r.items() if k != "items"})
        print(f"{aid}: 相似度 {r['ratio']:.3f}｜差異 {r['hunks']}（排除圖表與搬動 {r['hunks_to_review']}）"
              f"｜網站多 {r['site_only_chars']} 字｜PDF 多 {r['pdf_only_chars']} 字")
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1:] or [p.stem for p in sorted((ROOT / "content" / "fulltext").glob("a*.md"))])
