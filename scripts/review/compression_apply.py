"""全站過度濃縮：把改寫代理人的 edits JSON 套用到故事檔，寫入修改紀錄 content/review/notes/<短名>.json。

讀 content/review/compression/edits/<短名>.json：
  {"slug","id","edits":[{"id","verdict":"fix|keep-hard|keep-concept","symptoms","old","new","reason"}]}
只套用 verdict == "fix"；old 必須在故事檔中恰好出現一次；new 不得含單引號、他／她，且不超過 140 字。
同時檢查全篇主文增幅不超過 25%（以 judge/<短名>.json 的 main_chars 為基準）。
用法：python -I -X utf8 scripts/review/compression_apply.py [--dry] <短名…>
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1].parent
CMP = ROOT / "content" / "review" / "compression"


def clen(s):
    """與 compression.mjs 的 len 相同：不算空白與標點，main_chars／growth_cap 用的是這個算法。"""
    return len(re.sub(r"[\s，。、；：！？「」（）《》…—\-|]", "", s))


def main(dry, slugs):
    bad = 0
    for slug in slugs:
        e = json.loads((CMP / "edits" / f"{slug}.json").read_text(encoding="utf-8"))
        judge = json.loads((CMP / "judge" / f"{slug}.json").read_text(encoding="utf-8"))
        paths = {u["id"]: u["path"] for u in json.loads((CMP / f"{slug}.before.units.json").read_text(encoding="utf-8"))["units"]}
        f = ROOT / "src" / "data" / "stories" / f"{e['id']}.ts"
        t = f.read_text(encoding="utf-8")
        notes_f = ROOT / "content" / "review" / "notes" / f"{slug}.json"
        notes = json.loads(notes_f.read_text(encoding="utf-8")) if notes_f.exists() else []
        added, fixed = 0, 0
        for x in e["edits"]:
            if x.get("verdict") != "fix":
                continue
            mid, old, new = x["id"], x["old"], x["new"]
            problems = []
            if t.count(old) != 1:
                problems.append(f"原句出現 {t.count(old)} 次")
            if "'" in new or "\\" in new:
                problems.append("新句含單引號或反斜線")
            if "他" in new.replace("其他", "").replace("他人", "") or "她" in new:
                problems.append("新句含他／她")
            if len(new) > 140 and mid != "ONE":
                problems.append(f"新句 {len(new)} 字")
            if problems:
                bad += 1
                print(f"  ✗ {slug} {mid}：{'、'.join(problems)}")
                continue
            t = t.replace(old, new)
            added += clen(new) - clen(old)
            fixed += 1
            notes = [n for n in notes if n.get("id") != f"compression-{mid}"]
            notes.append({"id": f"compression-{mid}", "path": paths.get(mid), "before": old, "after": new,
                          "reason": f"過度濃縮（{x.get('symptoms', '')}）：{x.get('reason', '')}",
                          "growth": round(len(new) / len(old) - 1, 2)})
        cap = judge["growth_cap"]
        flag = "  ✗ 超過 25%" if added > cap else ""
        if added > cap:
            bad += 1
        print(f"{slug:24} 改 {fixed:3} 則  主文 +{added} 字（上限 {cap}，{added / judge['main_chars']:+.0%}）{flag}")
        if not dry:
            f.write_text(t, encoding="utf-8")
            notes_f.parent.mkdir(parents=True, exist_ok=True)
            notes_f.write_text(json.dumps(notes, ensure_ascii=False, indent=1), encoding="utf-8")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    main("--dry" in sys.argv, args)
