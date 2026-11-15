"""全文校稿第 4 輪：以固定亂數種子抽出要隨機抽查的印刷頁，並附上網站全文在該頁的內容。

每篇的頁數不同，先把所有「網站全文有內文的印刷頁」攤平，再不放回地抽 N 頁，同一篇最多抽 2 頁。
用法：python -I -X utf8 scripts/review/spotcheck_sample.py [N=12] [種子=20261108] > 抽樣.json
"""
import json
import random
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def pages(aid):
    md = (ROOT / "content" / "fulltext" / f"{aid}.md").read_text(encoding="utf-8").replace("\r\n", "\n")
    out, cur, buf = {}, None, []
    for line in md.split("\n"):
        m = re.match(r"^<!-- p\.(\d+) -->$", line.strip())
        if m:
            if cur is not None:
                out[cur] = "\n".join(buf).strip()
            cur, buf = int(m.group(1)), []
        else:
            buf.append(line)
    if cur is not None:
        out[cur] = "\n".join(buf).strip()
    return {p: t for p, t in out.items() if len(re.sub(r"\s", "", t)) >= 80}


def main(n, seed):
    pool = [(p.stem, pg, t) for p in sorted((ROOT / "content" / "fulltext").glob("a*.md")) for pg, t in pages(p.stem).items()]
    rng = random.Random(seed)
    rng.shuffle(pool)
    picked, per = [], {}
    for aid, pg, t in pool:
        if per.get(aid, 0) >= 2:
            continue
        per[aid] = per.get(aid, 0) + 1
        picked.append({"aid": aid, "page": pg, "site_text": t, "site_chars": len(re.sub(r"\s", "", t))})
        if len(picked) == n:
            break
    print(json.dumps({"seed": seed, "pool_pages": len(pool), "samples": picked}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    a = sys.argv[1:]
    main(int(a[0]) if a else 12, int(a[1]) if len(a) > 1 else 20261108)
