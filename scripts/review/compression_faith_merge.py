"""全站過度濃縮：把忠實度覆核判為 overclaim 的修正句寫回 edits/<短名>.json（new 換成 fix，記下 faith 欄位）。

讀 content/review/compression/faith/<批名>.json 與 <批名>.input.json。
用法：python -I -X utf8 scripts/review/compression_faith_merge.py <批名…>
"""
import json
import sys
from pathlib import Path

CMP = Path(__file__).resolve().parents[2] / "content" / "review" / "compression"

for batch in sys.argv[1:]:
    res = json.loads((CMP / "faith" / f"{batch}.json").read_text(encoding="utf-8"))["items"]
    inp = json.loads((CMP / "faith" / f"{batch}.input.json").read_text(encoding="utf-8"))
    slug_of = {(i["article"], i["id"]): i["slug"] for i in inp}
    missing = [k for k in slug_of if k not in {(r["article"], r["id"]) for r in res}]
    counts = {}
    for r in res:
        counts[r["verdict"]] = counts.get(r["verdict"], 0) + 1
        slug = slug_of.get((r["article"], r["id"]))
        if not slug:
            print(f"  ? {batch} {r['article']} {r['id']} 不在輸入")
            continue
        p = CMP / "edits" / f"{slug}.json"
        e = json.loads(p.read_text(encoding="utf-8"))
        for x in e["edits"]:
            if x["id"] == r["id"] and x["verdict"] == "fix":
                x["faith"] = r["verdict"]
                if r["verdict"] == "overclaim" and r.get("fix"):
                    x["new_before_faith"] = x.get("new_before_faith", x["new"])
                    x["new"] = r["fix"]
                    x["reason"] += f"；忠實度覆核修正：{r.get('evidence', '')}"
                    print(f"  {batch} {slug} {r['id']} overclaim → 改用修正句")
        p.write_text(json.dumps(e, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{batch}: {counts}{'  漏判 ' + str(missing) if missing else ''}")
