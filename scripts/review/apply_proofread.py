"""全文校稿第 3 輪：把覆核接受的修改套用到 content/fulltext/aNN.md。

讀 content/review/fulltext-proofread.json 的 proposals，只套用 verdict 為 accept（或 revise，用覆核給的 revised_old／revised_new）的項目。
每一筆的 old 必須在檔案裡恰好出現一次，否則跳過並列出；套用後在該筆記上 applied: true。
用法：python -I -X utf8 scripts/review/apply_proofread.py [--dry]
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LOG = ROOT / "content" / "review" / "fulltext-proofread.json"


def main(dry):
    data = json.loads(LOG.read_text(encoding="utf-8"))
    texts, skipped, done = {}, [], 0
    for p in data["proposals"]:
        v = p.get("verdict")
        if v not in ("accept", "revise") or p.get("applied"):
            continue
        old = p.get("revised_old", p["old"]) if v == "revise" else p["old"]
        new = p.get("revised_new", p["new"]) if v == "revise" else p["new"]
        f = ROOT / "content" / "fulltext" / f"{p['aid']}.md"
        t = texts.setdefault(p["aid"], f.read_text(encoding="utf-8").replace("\r\n", "\n"))
        n = t.count(old)
        if n != 1:
            skipped.append(f"{p['pid']}（{p['aid']}）：原字串出現 {n} 次")
            continue
        texts[p["aid"]] = t.replace(old, new)
        p["applied"] = True
        done += 1
    if not dry:
        for aid, t in texts.items():
            (ROOT / "content" / "fulltext" / f"{aid}.md").write_text(t, encoding="utf-8")
        LOG.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{'（試跑）' if dry else ''}套用 {done} 筆，跳過 {len(skipped)} 筆")
    for s in skipped:
        print("  跳過：", s)


if __name__ == "__main__":
    main("--dry" in sys.argv)
