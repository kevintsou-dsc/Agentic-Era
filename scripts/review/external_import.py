"""外部 LLM 審稿：匯入外部模型改好的泡泡（external_export.mjs 的回收端）。

讀 content/review/external/<批次>/returns/<aNN>.json 或 .md（.md 會抓第一個 ```json 區塊）。
每筆都要檢查：
  - old 和匯出時一字不差，而且在故事檔中恰好出現一次（匯出後若已改過會擋下）。
  - new 不超過 140 字。
  - 沒有他／她、半形單引號、反斜線。
  - 中文旁沒有半形標點，中文與英數之間有空格。
  - 沒有術語表 level=error 的詞。
  - 全篇增加字數不超過匯出時算好的剩餘空間（以修改前盲讀版本主文的 25% 為上限）。
預設只檢查、寫報告 import-report.md 與忠實度覆核輸入 content/review/compression/faith/<批次>.input.json，不改故事檔。加 --apply 才寫入故事檔，並寫：
  - content/review/notes/<短名>.json：修改紀錄，id 為 external-<批次>-Mxx。
--allow-over：允許超過篇幅上限（報告仍會標出）。匯出時用了 --no-cap 的批次自動允許。
--faith：讀 content/review/compression/faith/<批次>*.json，忠實度判 overclaim 的改用覆核者的 fix 句（報告標「忠實度修正」）。
--max-len N：每則上限，預設 140；要和 scripts/verify/lint-stories.mjs 的 MAX_BUBBLE 一致。
用法：python -I -X utf8 scripts/review/external_import.py <批次> [--apply] [--allow-over] [--faith] [--max-len N] [aNN…]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CMP = ROOT / "content" / "review" / "compression"
CJK = "㐀-鿿"
HALF = re.compile(f"[{CJK}][,;:?!()]|[,;:?!(][{CJK}]")
NOSPACE = re.compile(f"[{CJK}][A-Za-z0-9]|[A-Za-z0-9%][{CJK}]")
PRONOUN = re.compile(r"(?<!其)(?<!吉)他(?!人|國|處|方|者|鄉)|她")
GLOSSARY = [t for t in json.loads((ROOT / "content" / "glossary.json").read_text(encoding="utf-8"))["terms"] if t.get("level") == "error"]


def clen(s):
    """與 compression.mjs 的 len 相同：不算空白與標點。"""
    return len(re.sub(r"[\s，。、；：！？「」（）《》…—\-|]", "", s))


def load_return(p):
    t = p.read_text(encoding="utf-8-sig")
    m = re.search(r"```(?:json)?\s*\n(.*?)\n```", t, re.S)
    body = m.group(1) if m else t
    body = re.sub(r",\s*([}\]])", r"\1", body)  # 外部模型常多一個尾逗號
    return json.loads(body)


def style_problems(new, max_len=140):
    probs = []
    bare = re.sub(r"「[^」]*」|《[^》]*》|〈[^〉]*〉", "「」", new.replace("**", ""))
    if len(new) > max_len:
        probs.append(f"{len(new)} 字，超過 {max_len}")
    if "'" in new or "\\" in new:
        probs.append("含半形單引號或反斜線")
    if PRONOUN.search(new):
        probs.append("用了他／她")
    if m := HALF.search(bare):
        probs.append(f"中文旁用了半形標點「{m.group(0)}」")
    if m := NOSPACE.search(bare):
        probs.append(f"中文與英數之間沒空格「{m.group(0)}」")
    for t in GLOSSARY:
        for bad in t["avoid"]:
            if bad in bare:
                probs.append(f"術語「{bad}」→「{t['use']}」")
    return probs


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        print(__doc__)
        sys.exit(1)
    batch, apply, allow_over = args[0], "--apply" in args, "--allow-over" in args
    max_len = int(args[args.index("--max-len") + 1]) if "--max-len" in args else 140
    only = [a for a in args[1:] if not a.startswith("--") and a != str(max_len)]
    fixes = {}
    if "--faith" in args:
        for f in sorted((CMP / "faith").glob(f"{batch}-*.json")):
            if f.name.endswith(".input.json"):
                continue
            for it in json.loads(f.read_text(encoding="utf-8"))["items"]:
                if it.get("verdict") == "overclaim" and it.get("fix"):
                    fixes[(it["article"], it["id"])] = it["fix"]
    base = ROOT / "content" / "review" / "external" / batch
    manifest = json.loads((base / "manifest.json").read_text(encoding="utf-8"))
    allow_over = allow_over or manifest.get("cap") is False
    returns = {}
    for p in sorted((base / "returns").glob("a*.*")):
        if p.suffix in (".json", ".md"):
            returns[p.stem[:3]] = p
    report = [f"# 外部審稿匯入報告：{batch}", "", f"模式：{'套用' if apply else '只檢查（加 --apply 才寫入）'}", ""]
    faith, total_bad, total_ok = [], 0, 0
    for aid, meta in manifest["articles"].items():
        if only and aid not in only:
            continue
        slug = meta["slug"]
        if aid not in returns:
            report += [f"## 〈{meta['title']}〉{aid}", "", "還沒有回收檔。", ""]
            continue
        try:
            data = load_return(returns[aid])
        except Exception as e:  # noqa: BLE001 — 回報格式錯誤給人看
            report += [f"## 〈{meta['title']}〉{aid}", "", f"✗ 回收檔無法解析：{e}", ""]
            total_bad += 1
            continue
        ts_f = ROOT / "src" / "data" / "stories" / f"{aid}.ts"
        ts = ts_f.read_text(encoding="utf-8")
        units = {u["id"]: u for u in json.loads((CMP / f"{slug}.current.units.json").read_text(encoding="utf-8"))["units"]}
        good, rows, grow = [], [], 0
        seen = set()
        for e in data.get("edits", []):
            mid, act = e.get("id", "?"), e.get("action", "")
            old, new = e.get("old", ""), (e.get("new") or "").strip()
            seen.add(mid)
            faith_fixed = (aid, mid) in fixes
            if faith_fixed:
                new = fixes[(aid, mid)]
            if act == "keep":
                rows.append(f"- {mid}　不改：{e.get('reason', '')}")
                continue
            probs = []
            if act != "rewrite":
                probs.append(f"action 應為 rewrite 或 keep，收到「{act}」")
            want = meta["bubbles"].get(mid, {}).get("text") or units.get(mid, {}).get("text")
            if want is None:
                probs.append("編號不在這篇")
            elif old != want:
                probs.append("old 和匯出時的句子不同（外部模型可能抄錯）")
                old = want
            if want is not None and ts.count(old) != 1:
                probs.append(f"原句在故事檔出現 {ts.count(old)} 次（匯出後可能已改過）")
            if not new or new == old:
                probs.append("new 是空的或和原句相同")
            probs += style_problems(new, max_len)
            d = clen(new) - clen(old)
            line = f"- {mid}　{e.get('symptoms', '')}　p.{e.get('page', '?')}　{d:+d} 字　{len(new)} 字{'　忠實度修正' if faith_fixed else ''}"
            if probs:
                total_bad += 1
                rows += [f"{line}　✗ {'；'.join(probs)}", f"  - 原：{old}", f"  - 新：{new}"]
                continue
            grow += d
            total_ok += 1
            good.append((mid, old, new, e))
            faith.append({"slug": slug, "article": aid, "id": mid, "before": old, "after": new,
                          "source": units.get(mid, {}).get("source", [])})
            rows += [f"{line}　✓ {e.get('reason', '')}", f"  - 原：{old}", f"  - 新：{new}"]
        missing = [m for m in meta["bubbles"] if m not in seen]
        over = grow > meta["headroom"]
        head = f"## 〈{meta['title']}〉{aid}"
        summary = f"可套用 {len(good)} 則；增加 {grow:+d} 字，剩餘空間 {meta['headroom']} 字{'　✗ 超過篇幅上限' if over else ''}"
        report += [head, "", summary] + ([f"漏回的編號：{'、'.join(missing)}"] if missing else []) + [""] + rows + [""]
        if over and not allow_over:
            total_bad += 1
            if apply:
                report.append("超過篇幅上限，這篇沒有套用（確認要放寬再加 --allow-over）。\n")
            continue
        if apply and good:
            notes_f = ROOT / "content" / "review" / "notes" / f"{slug}.json"
            notes = json.loads(notes_f.read_text(encoding="utf-8")) if notes_f.exists() else []
            for mid, old, new, e in good:
                ts = ts.replace(old, new)
                nid = f"external-{batch}-{mid}"
                notes = [n for n in notes if n.get("id") != nid]
                notes.append({"id": nid, "path": units.get(mid, {}).get("path"), "before": old, "after": new,
                              "reason": f"外部模型審稿（{e.get('symptoms', '')}）：{e.get('reason', '')}" + ("；忠實度覆核判過度推論，改用覆核修正句" if (aid, mid) in fixes else ""),
                              "growth": round(len(new) / len(old) - 1, 2)})
            ts_f.write_text(ts, encoding="utf-8")
            notes_f.write_text(json.dumps(notes, ensure_ascii=False, indent=1), encoding="utf-8")
    if faith:  # 檢查模式也寫，套用前就能先做忠實度覆核
        (CMP / "faith").mkdir(exist_ok=True)
        (CMP / "faith" / f"{batch}.input.json").write_text(json.dumps(faith, ensure_ascii=False, indent=1), encoding="utf-8")
    (base / "import-report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"{batch}：可套用 {total_ok} 則、問題 {total_bad} 項 → content/review/external/{batch}/import-report.md")
    if apply:
        print(f"已寫入 {len(faith)} 則；接著跑 npm run story:check，並做忠實度覆核（faith/{batch}.input.json）")
    sys.exit(1 if total_bad else 0)


if __name__ == "__main__":
    main()
