"""掃描全文中的數據句，產出數據盤點初稿：content/data/figures-raw.json 與 docs/content-study/figures-raw.md。

只抓「帶單位的數字」所在的句子（%、倍、萬、億、秒、人次、位、份、則、篇、小時、天、元…），
年份與頁碼不算。產出是給人審閱的候選清單，不是最終數據。

用法：python -I scripts/extract/scan_figures.py <fulltext 資料夾> <json 輸出> <md 輸出>
"""
import json
import re
import sys
from pathlib import Path

UNIT = r"(?:%|％|個百分點|倍|萬|億|兆|秒|分鐘|小時|天|週|個月|人次|位|名|份|則|篇|次|家|國|個|項|元|美元|台幣|點)"
FIGURE = re.compile(rf"(?<![\d.])\d[\d,]*(?:\.\d+)?\s*{UNIT}|\d+\s*/\s*\d+|0\.\d+")
YEAR_ONLY = re.compile(r"^(19|20)\d{2}\s*年?$")
SENTENCE = re.compile(r"[^。！？；\n]*[。！？；]?")


def scan(md):
    page, hits = None, []
    for line in md.splitlines():
        m = re.match(r"<!-- p\.(\d+) -->", line)
        if m:
            page = int(m.group(1))
            continue
        for sent in SENTENCE.findall(line):
            sent = sent.strip()
            figs = [f.strip() for f in FIGURE.findall(sent) if not YEAR_ONLY.match(f.strip())]
            if figs and len(sent) >= 8:
                hits.append({"page": page, "figures": figs, "sentence": sent})
    return hits


def main(src, out_json, out_md):
    result = {}
    for md_path in sorted(Path(src).glob("a*.md")):
        result[md_path.stem] = scan(md_path.read_text(encoding="utf-8"))
    Path(out_json).parent.mkdir(parents=True, exist_ok=True)
    Path(out_json).write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    lines = ["# 數據句盤點（自動掃描初稿）", "",
             "> 由 scripts/extract/scan_figures.py 產生。只列含「帶單位數字」的句子，需人工判讀哪些是核心數據。", ""]
    for aid, hits in result.items():
        lines.append(f"## {aid}（{len(hits)} 句）")
        lines.append("")
        lines.extend(f"- p.{h['page']}｜**{'、'.join(h['figures'])}**｜{h['sentence']}" for h in hits)
        lines.append("")
    Path(out_md).parent.mkdir(parents=True, exist_ok=True)
    Path(out_md).write_text("\n".join(lines), encoding="utf-8")
    print(f"{sum(len(h) for h in result.values())} figure sentences in {len(result)} articles")


if __name__ == "__main__":
    main(*sys.argv[1:4])
