"""分析 jev_pilot.py 的結果：每種突變的抓錯率、原句的誤判率、門檻掃描，以及與規則基準線的比較。"""
import json
import statistics as st
import sys
from collections import defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
r = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
items = [i for i in r["items"] if "error" not in i["jev"]]
errors = len(r["items"]) - len(items)
by = defaultdict(list)
for i in items:
    by[i["variant"]].append(i)
orig = by["original"]


def flag(i, th_f, th_o):
    j = i["jev"]
    return j["faithful"] < th_f or j["overclaim"] > th_o


print(f"模型 {r['model']}｜{r['units']} 單位、{r['questions']} 題、{r['input_tokens']} 輸入 token、估計 ${r['est_cost_usd']}、{r['elapsed_sec']} 秒｜API 錯誤 {errors}")
print("\n各變體的 Jev 分數中位數（faithful 越高越忠實；overclaim 越高越誇大；complete 越高越完整）")
for v, xs in by.items():
    med = lambda k: st.median(x["jev"][k] for x in xs)
    flu = st.mean(x["jev"]["fluency"]["score"] for x in xs)
    print(f"  {v:13s} n={len(xs):3d}  faithful={med('faithful'):.2f}  overclaim={med('overclaim'):.2f}  complete={med('complete'):.2f}  fluency={flu:.2f}")

print("\n門檻掃描（忠實度：faithful < Tf 或 overclaim > To 即標記）")
best = None
for tf in (0.3, 0.4, 0.5, 0.6, 0.7):
    for to in (0.5, 0.6, 0.7, 0.8, 1.01):
        fp = sum(flag(i, tf, to) for i in orig) / len(orig)
        rec = {v: sum(flag(i, tf, to) for i in xs) / len(xs) for v, xs in by.items() if v in ("M1_number", "M2_overclaim", "M3_name", "M4_cause")}
        mean_rec = st.mean(rec.values())
        if fp <= 0.15 and (best is None or mean_rec > best[2]):
            best = (tf, to, mean_rec, fp, rec)
        print(f"  Tf={tf:.1f} To={to:.2f}  誤判 {fp:5.1%}  " + "  ".join(f"{k[:2]} {v:5.1%}" for k, v in rec.items()))
if best:
    tf, to, mr, fp, rec = best
    print(f"\n→ 誤判 ≤15% 下最佳：Tf={tf} To={to}｜平均抓錯率 {mr:.1%}｜誤判 {fp:.1%}｜" + "、".join(f"{k} {v:.0%}" for k, v in rec.items()))

print("\n完整性（M5 半句）：complete < Tc 即標記")
for tc in (0.3, 0.4, 0.5, 0.6, 0.7):
    fp = sum(i["jev"]["complete"] < tc for i in orig) / len(orig)
    rc = sum(i["jev"]["complete"] < tc for i in by["M5_half"]) / max(1, len(by["M5_half"]))
    print(f"  Tc={tc:.1f}  原句誤判 {fp:5.1%}  半句抓到 {rc:5.1%}")

print("\n規則基準線（數字與英文專有名詞必須出現在原文）")
fp = sum(i["rule_flag"] for i in orig) / len(orig)
print(f"  原句誤判 {fp:.1%}｜" + "  ".join(f"{v} {sum(i['rule_flag'] for i in xs)/len(xs):.0%}" for v, xs in by.items() if v != "original"))
print("  原句被規則標記的例子：")
for i in [i for i in orig if i["rule_flag"]][:6]:
    print(f"    [{i['story']}] 缺 {i['rule_missing']}｜{i['summary'][:40]}…")

print("\n原句中 Jev 標記為不忠實（faithful < 0.5）的例子（可能是真問題，也可能是誤判，需人工看）：")
for i in sorted(orig, key=lambda x: x["jev"]["faithful"])[:8]:
    print(f"  [{i['story']} {i['kind']}] faithful={i['jev']['faithful']:.2f} overclaim={i['jev']['overclaim']:.2f}｜{i['summary'][:60]}")

print("\n故事層級（coverage／coherence 分數 0–3）")
for s in r["stories"]:
    j = s["jev"]
    if "error" in j:
        print("  ", s["story"], s["variant"], j["error"])
        continue
    print(f"  {s['story']} {s['variant']:9s} coverage={j['coverage']['score']}({j['coverage']['conf']})  coherence={j['coherence']['score']}({j['coherence']['conf']})")
