"""編註：把 content/review/rewrite/notes/<短名>.json 的編註插進故事檔。

每則編註掛在指定泡泡（id，依 content/review/compression/<短名>.current.units.json 的編號）的 src 陣列之後，
寫成 notes: [{ term: '…', text: '…' }]。已有 notes 的泡泡會整個換掉。
檢查：泡泡文字裡要找得到 term；說明 ≤60 字（作者自創名稱 kind=coined ≤120 字）、以句號結尾、沒有他／她、半形單引號或反斜線。
預設只檢查；加 --apply 才寫入。先跑 node scripts/review/compression.mjs current <短名…> 更新編號。
用法：python -I -X utf8 scripts/review/notes_apply.py [--apply] <短名…>
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CMP = ROOT / "content" / "review" / "compression"
PRONOUN = re.compile(r"(?<!其)(?<!吉)他(?!人|國|處|方|者|鄉)|她")


def src_end(ts, start):
    """從 start（'src: [' 的 '[' 位置）找對應的 ']'，略過單引號字串。"""
    depth, i, in_str = 0, start, False
    while i < len(ts):
        c = ts[i]
        if in_str:
            if c == "\\":
                i += 1
            elif c == "'":
                in_str = False
        elif c == "'":
            in_str = True
        elif c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError("src 陣列沒有結尾")


def main():
    args = sys.argv[1:]
    apply = "--apply" in args
    slugs = [a for a in args if not a.startswith("--")]
    bad = 0
    for slug in slugs:
        data = json.loads((ROOT / "content" / "review" / "rewrite" / "notes" / f"{slug}.json").read_text(encoding="utf-8"))
        aid = data["id"]
        units = {u["id"]: u for u in json.loads((CMP / f"{slug}.current.units.json").read_text(encoding="utf-8"))["units"]}
        ts_f = ROOT / "src" / "data" / "stories" / f"{aid}.ts"
        ts = ts_f.read_text(encoding="utf-8")
        by_id = {}
        for n in data["notes"]:
            u = units.get(n["id"])
            probs = []
            if not u:
                probs.append("編號不存在")
            elif n["term"] not in u["text"] and n.get("where") != "graphic":  # where=graphic：詞只出現在這則泡泡所在幕的圖表
                probs.append("泡泡裡找不到這個詞")
            t = n["text"]
            cap = 120 if n.get("kind") == "coined" else 60  # 作者自創名稱：原文說明＋本站理解，較長
            body = re.sub(r"(作者的說法|原文的說法|本站理解)：|（p\.[\d–、.p ]+）", "", t)  # 標籤與頁碼不算字數
            if len(body) > cap:
                probs.append(f"{len(body)} 字，超過 {cap}")
            if not t.endswith("。"):
                probs.append("沒有以句號結尾")
            if PRONOUN.search(t) or "'" in t or "\\" in t or "'" in n["term"]:
                probs.append("含他／她、半形單引號或反斜線")
            print(f"{slug} {n['id']} {n['term']}：{'✗ ' + '；'.join(probs) if probs else '✓'}")
            if probs:
                bad += 1
                continue
            by_id.setdefault(n["id"], []).append(n)
        if not apply:
            continue
        for mid, notes in by_id.items():
            text = units[mid]["text"]
            key = f"text: '{text}',"
            if ts.count(key) != 1:
                print(f"  ✗ {mid} 在故事檔出現 {ts.count(key)} 次，略過")
                bad += 1
                continue
            p = ts.index(key) + len(key)
            s = ts.index("src: [", p)
            e = src_end(ts, s + len("src: ") )
            after = e + 1
            if ts[after] == ",":
                after += 1
            rest = ts[after:]
            m = re.match(r"\s*\n?(\s*)notes: \[.*?\],", rest, re.S)
            if m:  # 換掉舊的 notes
                rest = rest[m.end():]
            line_start = ts.rfind("\n", 0, ts.index(key)) + 1
            indent = re.match(r"\s*", ts[line_start:]).group(0)
            items = ", ".join(f"{{ term: '{n['term']}', text: '{n['text']}' }}" for n in notes)
            ts = ts[:after] + f"\n{indent}notes: [{items}]," + rest
        ts_f.write_text(ts, encoding="utf-8")
        print(f"{slug}：寫入 {sum(len(v) for v in by_id.values())} 則編註")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
