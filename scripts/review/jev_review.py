"""Jev 初評（正式流程，門檻由 jev_pilot.py 的試驗決定，見 docs/review-pipeline.md）。

對每篇故事：
  單位層級：每段主文與圖表細節 × 原文上下文 → faithful / overclaim / complete / fluency
  故事層級：一句話主張＋全部主文 × 文章摘要 → coverage / coherence
  策展補充（--curator）：圖表說明框、延伸區塊說明、較長的卡片 desc × 同一幕主文依據的原文
    → contradict（與原文矛盾）／attribute（把原文沒說的結論算到作者頭上）／general（屬一般公認知識）
    門檻尚未經突變試驗校準，標記只當提示（見 docs/text-review-plan.md）。
輸出 content/review/<label>.json 與 docs/review/<label>.md（依風險排序的待修清單）。

執行：先 node scripts/review/reader-text.mjs，再
  cd ../jev-test && .venv/Scripts/python <本檔> <label> [--curator] [aNN ...]
"""
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(Path.cwd() / "scripts" / "common"))
from jev_pilot import ask, questions, story_questions  # noqa: E402
from units import article_summaries, curator_units, load_all  # noqa: E402

# 門檻（2026-10-25 試驗：誤判 16.7%，其中多數是真的「出處不足」；抓錯率 M1 100%、M2 97%、M3 89%、M4 100%）
T_FAITHFUL = 0.30   # faithful 低於此值 → 主張超出所引原文
T_OVERCLAIM = 0.80  # overclaim 高於此值 → 語氣或範圍比原文強
T_COMPLETE = 0.30   # complete 低於此值 → 可能是半句（僅提示；硬規則由 lint 負責）
T_COVERAGE = 2.5    # 故事層級：0–3
T_COHERENCE = 2.2
# 策展補充（暫定，待校準）
T_CONTRADICT = 0.50
T_ATTRIBUTE = 0.70
T_GENERAL = 0.30


def curator_questions():
    from typesafe_sdk import Noul, Score
    return {
        "contradict": Noul(instructions=(
            "`summary` is an explanatory note written by an editor next to a passage of the article quoted in `source`. "
            "Does `summary` contradict, distort, or misstate anything in `source`?")),
        "attribute": Noul(instructions=(
            "Does `summary` present a conclusion, recommendation, number, or example as if it came from the article's author, "
            "when `source` does not contain it?")),
        "general": Noul(instructions=(
            "Is `summary` a neutral explanation or widely accepted general knowledge (for example, defining a term or describing "
            "a common practice), rather than a specific new factual claim such as a statistic, study, date, or company result that "
            "would need its own citation?")),
        "fluency": Score(instructions="How fluent and natural is `summary` as Traditional Chinese prose?", criteria=[
            "Awkward or hard to read", "Understandable but clumsy", "Fluent", "Polished and natural"]),
    }


def reasons(j):
    out = []
    if "contradict" in j:
        if j["contradict"] > T_CONTRADICT:
            out.append(f"可能與原文矛盾（contradict {j['contradict']:.2f}）")
        if j["attribute"] > T_ATTRIBUTE:
            out.append(f"可能把原文沒說的算到作者頭上（attribute {j['attribute']:.2f}）")
        if j["general"] < T_GENERAL:
            out.append(f"像是需要出處的具體說法（general {j['general']:.2f}）")
        return out
    if j["faithful"] < T_FAITHFUL:
        out.append(f"出處不足或不忠實（faithful {j['faithful']:.2f}）")
    if j["overclaim"] > T_OVERCLAIM:
        out.append(f"可能誇大（overclaim {j['overclaim']:.2f}）")
    if j["complete"] < T_COMPLETE:
        out.append(f"可能不完整（complete {j['complete']:.2f}）")
    return out


def main(label, only, with_curator=False):
    from jev_client import get_client
    client = get_client()
    stories = [s for s in load_all() if not only or s["id"] in only]
    summaries = article_summaries()
    units = [dict(u, story=s["id"]) for s in stories for u in s["units"]]
    if with_curator:
        units += curator_units(only)
    qs, sq, cq = questions(), story_questions(), curator_questions()
    with ThreadPoolExecutor(max_workers=8) as ex:
        ures = list(ex.map(lambda u: ask(client, {"source": u["source"], "summary": u["text"]},
                                         cq if u["kind"] in ("curator", "card") else qs), units))
    sstates = [{"article_summary": summaries.get(s["id"], ""),
                "story": s["oneLiner"] + "\n\n" + "\n\n".join(u["text"] for u in s["units"] if u["kind"] == "main")} for s in stories]
    with ThreadPoolExecutor(max_workers=4) as ex:
        sres = list(ex.map(lambda st: ask(client, st, sq), sstates))

    report = {"label": label, "thresholds": {"faithful": T_FAITHFUL, "overclaim": T_OVERCLAIM, "complete": T_COMPLETE,
                                             "coverage": T_COVERAGE, "coherence": T_COHERENCE}, "stories": []}
    md = [f"# Jev 初評報告：{label}", "", "> 由 scripts/review/jev_review.py 產生。⚠ 為需要修改或人工確認的項目，依風險排序。", ""]
    for s, (sj, _, _) in zip(stories, sres):
        rows = []
        for u, (j, _, _) in zip(units, ures):
            if u["story"] != s["id"] or "error" in j:
                continue
            rows.append({"kind": u["kind"], "text": u["text"], "jev": j, "reasons": reasons(j), "pages": [x["page"] for x in u["src"]]})
        flagged = sorted([r for r in rows if r["reasons"]], key=lambda r: r["jev"].get("faithful", 1 - r["jev"].get("contradict", 0)))
        story_flags = []
        if "error" not in sj:
            if sj["coverage"]["score"] < T_COVERAGE:
                story_flags.append(f"涵蓋不足（coverage {sj['coverage']['score']}）")
            if sj["coherence"]["score"] < T_COHERENCE:
                story_flags.append(f"連貫性不足（coherence {sj['coherence']['score']}）")
        passed = not flagged and not story_flags
        report["stories"].append({"id": s["id"], "units": len(rows), "flagged": len(flagged), "story": sj, "story_flags": story_flags,
                                  "passed": passed, "rows": rows})
        md.append(f"## {s['id']}｜{'✓ 通過' if passed else '⚠ 需修改'}｜{len(rows)} 段中 {len(flagged)} 段標記｜"
                  f"coverage {sj.get('coverage', {}).get('score', '?')}、coherence {sj.get('coherence', {}).get('score', '?')}")
        md.append("")
        for f in story_flags:
            md.append(f"- ⚠ 故事層級：{f}")
        for r in flagged:
            md.append(f"- ⚠ [{r['kind']}｜p.{','.join(map(str, r['pages']))}] {'；'.join(r['reasons'])}  \n  「{r['text']}」")
        md.append("")
    (ROOT / "content" / "review").mkdir(parents=True, exist_ok=True)
    (ROOT / "docs" / "review").mkdir(parents=True, exist_ok=True)
    (ROOT / "content" / "review" / f"{label}.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    (ROOT / "docs" / "review" / f"{label}.md").write_text("\n".join(md), encoding="utf-8")
    for s in report["stories"]:
        print(f"{s['id']}: {'PASS' if s['passed'] else 'FLAG'}  {s['flagged']}/{s['units']} units  {s['story_flags']}")


if __name__ == "__main__":
    args = sys.argv[2:]
    main(sys.argv[1], {a for a in args if not a.startswith("--")}, "--curator" in args)
