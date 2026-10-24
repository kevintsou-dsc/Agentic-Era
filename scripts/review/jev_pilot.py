"""Jev 初評的有效性試驗（先驗證、再決定要不要套用全站）。

做法：
  1. 原句：4 篇已寫好故事的每段主文與圖表細節（假設正確，用來量「誤判率」）
  2. 突變句：對每段原句注入 5 種典型錯誤（用來量「抓錯率」）
       M1 改數字　M2 誇大／過度概括　M3 換名字　M4 捏造因果　M5 半句（看圖才完整）
  3. 故事層級：原故事 vs 打亂段落順序（連貫性）vs 只剩一半段落（完整性）
  4. 同樣的資料也跑一次「規則比對」基準線：主文中的數字與英文專有名詞必須出現在原文
每個單位各送一次請求（同一請求只放一個單位，避免位置效應）。

執行（需要 jev-test 專案的 venv 與 TYPESAFE_API_KEY；金鑰不會被印出或寫入任何檔案）：
  cd ../jev-test && .venv/Scripts/python <本檔> <輸出 json>
"""
import json
import random
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(Path.cwd() / "scripts" / "common"))  # jev-test 的 jev_client
from units import article_summaries, load_all  # noqa: E402

random.seed(20261025)
MODEL = "jev-latest"

# ---------- 突變 ----------
NAMES = {"CeraVe": "Olay", "日清": "統一", "Gogoro": "Kymco", "金曲獎": "金馬獎", "甄嬛傳": "如懿傳",
         "吳宗霖": "王大明", "何華軒": "林志明", "徐莉媛": "陳美玲", "ORANGE RANGE": "GLAY", "Gloria Mark": "Daniel Kahneman",
         "Podcast": "直播", "芬達": "可口可樂", "麥當勞": "肯德基", "Gen Z": "嬰兒潮世代", "dentsu": "WPP", "SOV": "ROI",
         "外送平台": "銀行", "捷運": "高鐵", "二次元": "古典音樂", "棒球": "高爾夫"}
HEDGES = [("可能", "必然"), ("也許", "必定"), ("往往", "總是"), ("常常", "每次都"), ("不一定", "一定"), ("不必", "必須"), ("有機會", "保證")]


def m_number(t):
    nums = list(re.finditer(r"\d+(?:\.\d+)?", t))
    if not nums:
        return None
    m = nums[0]
    v = m.group()
    new = str(round(float(v) * 1.6, 2)).rstrip("0").rstrip(".") if "." in v else str(int(v) * 2 + 3)
    return t[:m.start()] + new + t[m.end():]


def m_overclaim(t):
    for a, b in HEDGES:
        if a in t:
            return t.replace(a, b, 1)
    i = t.find("，")
    return (t[:i + 1] + "而且這適用於所有品牌與所有市場，" + t[i + 1:]) if i > 0 else "所有品牌都證實：" + t


def m_name(t):
    for a, b in NAMES.items():
        if a in t:
            return t.replace(a, b, 1)
    return None


def m_cause(t):
    return t.rstrip("。！？") + "，並因此讓品牌營收在一年內成長三倍。"


def m_half(t):
    cut = max(8, int(len(t) * 0.45))
    return t[:cut].rstrip("，、；：") + "："


MUTATIONS = {"M1_number": m_number, "M2_overclaim": m_overclaim, "M3_name": m_name, "M4_cause": m_cause, "M5_half": m_half}

# ---------- 規則基準線 ----------
TOKEN = re.compile(r"\d+(?:[.,]\d+)?|[A-Za-z][A-Za-z+&.'-]{1,}")


def rule_flag(summary, source):
    src = re.sub(r"\s", "", source).replace(",", "")
    missing = [tok for tok in TOKEN.findall(summary) if tok.replace(",", "") not in src and tok not in ("p",)]
    return bool(missing), missing


# ---------- Jev ----------
def questions():
    from typesafe_sdk import Noul, Score
    return {
        "faithful": Noul(instructions=(
            "Is every factual claim in `summary` (every number, name, brand, place, and cause-effect statement) "
            "directly supported by `source`? Answer false if `summary` adds, alters, or exaggerates anything that `source` does not state.")),
        "overclaim": Noul(instructions="Does `summary` state something more strongly, more certainly, or more generally than `source` does?"),
        "complete": Noul(instructions=(
            "Is `summary` a complete statement that a reader can fully understand on its own, "
            "without needing to see a chart, a list, or the next paragraph?")),
        "fluency": Score(instructions="How fluent and natural is `summary` as Traditional Chinese prose?", criteria=[
            "Awkward or hard to read", "Understandable but clumsy", "Fluent", "Polished and natural"]),
    }


def story_questions():
    from typesafe_sdk import Score
    return {
        "coverage": Score(instructions=(
            "`story` is a short retelling of the article summarized in `article_summary`. How well does `story` convey the "
            "article's main argument, its key reasons or evidence, and its recommended actions?"), criteria=[
            "Misses the main argument", "Main argument only", "Main argument and some reasons or actions", "Argument, reasons, and actions all covered"]),
        "coherence": Score(instructions=(
            "Read `story` paragraph by paragraph. How well does each paragraph follow logically from the previous one, "
            "so the whole reads as one continuous narrative?"), criteria=[
            "Disconnected fragments", "Some links, frequent jumps", "Mostly flows", "Flows as one continuous narrative"]),
    }


def ask(client, state, qs, tries=3):
    for k in range(tries):
        try:
            r = client.system_one(state=state, model=MODEL, questions=qs)
            out = {}
            for key, a in r.answers.items():
                if getattr(a, "noul", None) is not None:
                    out[key] = round(float(a.noul), 4)
                else:
                    out[key] = {"score": a.score, "conf": round(float(a.confidence), 3)}
            return out, r.usage.input_tokens, r.usage.output_tokens
        except Exception as e:  # 網路或配額錯誤：退避重試
            if k == tries - 1:
                return {"error": f"{type(e).__name__}: {e}"}, 0, 0
            time.sleep(1.5 * (k + 1))


def main(out_path):
    from jev_client import get_client
    client = get_client()
    stories = load_all()
    summaries = article_summaries()

    items = []
    for s in stories:
        for u in s["units"]:
            items.append({"story": s["id"], "kind": u["kind"], "variant": "original", "summary": u["text"], "source": u["source"]})
            for name, fn in MUTATIONS.items():
                mt = fn(u["text"])
                if mt and mt != u["text"]:
                    items.append({"story": s["id"], "kind": u["kind"], "variant": name, "summary": mt, "source": u["source"]})

    qs = questions()
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=8) as ex:
        results = list(ex.map(lambda it: ask(client, {"source": it["source"], "summary": it["summary"]}, qs), items))
    tokens_in = sum(r[1] for r in results)
    for it, (ans, _, _) in zip(items, results):
        it["jev"] = ans
        it["rule_flag"], it["rule_missing"] = rule_flag(it["summary"], it["source"])

    # 故事層級
    story_items = []
    for s in stories:
        mains = [u["text"] for u in s["units"] if u["kind"] == "main"]
        shuffled = mains[:]
        random.shuffle(shuffled)
        for variant, beats in (("original", mains), ("shuffled", shuffled), ("half", mains[: len(mains) // 2])):
            story_items.append({"story": s["id"], "variant": variant,
                                "state": {"article_summary": summaries.get(s["id"], ""), "story": s["oneLiner"] + "\n\n" + "\n\n".join(beats)}})
    sq = story_questions()
    with ThreadPoolExecutor(max_workers=4) as ex:
        sres = list(ex.map(lambda it: ask(client, it["state"], sq), story_items))
    tokens_in += sum(r[1] for r in sres)
    for it, (ans, _, _) in zip(story_items, sres):
        it["jev"] = ans
        del it["state"]

    n_questions = len(items) * len(qs) + len(story_items) * len(sq)
    report = {
        "model": MODEL, "elapsed_sec": round(time.time() - t0, 1),
        "units": len(items), "story_items": len(story_items), "questions": n_questions, "input_tokens": tokens_in,
        # 成本估算：每題約 $0.00003（jev-research-notes）；輸入 token 以 $0.04／百萬估
        "est_cost_usd": round(n_questions * 0.00003 + tokens_in * 0.04 / 1e6, 4),
        "items": items, "stories": story_items,
    }
    Path(out_path).write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"done: {len(items)} units + {len(story_items)} story items, {n_questions} questions, "
          f"{tokens_in} input tokens, ~${report['est_cost_usd']}, {report['elapsed_sec']}s")


if __name__ == "__main__":
    main(sys.argv[1])
