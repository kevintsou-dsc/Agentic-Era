"""全文校稿第 3 輪之二：主導者依覆核員回報的範圍外問題補的修改（已對照印刷頁圖片）。
產生提案並附加到 content/review/fulltext-proofread.json，再由 apply_proofread.py 套用。"""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
LOG = ROOT / "content" / "review" / "fulltext-proofread.json"
txt = lambda a: (ROOT / "content" / "fulltext" / f"{a}.md").read_text(encoding="utf-8")
P = []
def add(pid, aid, page, rule, old, new, evidence):
    P.append(dict(pid=pid, aid=aid, page=page, rule=rule, type="structure", old=old, new=new, evidence=evidence,
                  verdict="accept", verifier="lead（第二輪，覆核員回報、主導者對照頁面圖片）"))
# 短語錯頁（R7 例外）
add("Y-01", "a16", 147, "R7", "從企業文化與組織配套角度出發，\n\n<!-- p.147 -->\n\n",
    "從企業文化與\n\n<!-- p.147 -->\n\n組織配套角度出發，\n\n", "p.147 首行「組織配套角度出發，電通顧問以全員線上問卷方」")
add("Y-02", "a21", 186, "R7", "市場對 AI 製作人與 AI 提示詞工程師的需求也持續增加，\n\n<!-- p.186 -->\n\n",
    "市場對\n\n<!-- p.186 -->\n\nAI 製作人與 AI 提示詞工程師的需求也持續增加，\n\n", "p.186 首行「AI 製作人與 AI 提示詞工程師的需求也持續增加，」；p.185 末行止於「市場對」")
# 圖說頁碼倒退（R5）：移回同一印刷頁、句子之外
t = txt("a04")
m = re.search(r"\n\n<!-- p\.34 -->\n\n(> 圖2：[^\n]+)\n\n<!-- p\.35 -->", t)
cap = m.group(1)
add("Y-03", "a04", 34, "R5", m.group(0), "", "圖2 圖說在 p.34；原本放在 p.35 內文之後，頁碼標記倒退")
add("Y-04", "a04", 34, "R5", "動態顧客旅程。\n\n同時，我們也將協助 B2B", f"動態顧客旅程。\n\n{cap}\n\n同時，我們也將協助 B2B", "同上，移到 p.34 的段落之間（與 Y-03 成對）")
t = txt("a08")
m = re.search(r"\n\n<!-- p\.61 -->\n\n(> 圖1：[^\n]+)\n\n(> 圖2：[^\n]+)\n\n<!-- p\.62 -->", t)
add("Y-05", "a08", 61, "R5", m.group(0), "", "圖1、圖2 圖說在 p.61；原本放在 p.62 內文之後，頁碼標記倒退")
add("Y-06", "a08", 61, "R5", "\n\n## 情懷比流量更長久", f"\n\n{m.group(1)}\n\n{m.group(2)}\n\n## 情懷比流量更長久", "同上，移到 p.61 段落之間（與 Y-05 成對）")
m = re.search(r"\n\n<!-- p\.64 -->\n\n(> 圖5：[^\n]+)\n\n<!-- p\.65 -->", t)
add("Y-07", "a08", 64, "R5", m.group(0), "", "圖5 圖說在 p.64；原本放在 p.65 內文之後")
i = t.index(m.group(0)); j = t.rindex("<!-- p.65 -->", 0, i)
add("Y-08", "a08", 64, "R5", "\n\n" + t[j:j + 13], f"\n\n{m.group(1)}\n\n<!-- p.65 -->", "同上，移到 p.64 結尾（與 Y-07 成對）")
# 編號清單（R4）
for k, h in enumerate(["讓品牌進入 AI 代理的決策語境", "重新投資真實的人性洞察", "建立全旅程內容與體驗策略", "把社群與文化視為成長資產", "讓策略成為持續驅動成長的營運機制"], 1):
    add(f"Y-1{k - 1}", "a05", 40 if k < 4 else 41, "R4", f"## {h}\n", f"## {k}. {h}\n", f"p.40–41 五個小標前有編號 {k}")
for k, h in enumerate(["鋪在對的地方", "內容要「具體」", "讓對的賣點「反覆", "用在地、自然的語言", "管理的是「語意」"], 1):
    add(f"Y-2{k - 1}", "a09", 70, "R4", f"\n\n{h}", f"\n\n{k}. {h}", f"p.70 五大關鍵舉措前有編號 {k}")
# 漏收的大標與框標題（R6）
add("Y-30", "a12", 97, "R6", "<!-- p.97 -->\n\n25 歲的 Lisa", "<!-- p.97 -->\n\n## WHY do we need People Model？\n\n25 歲的 Lisa", "p.97 頁首大標")
add("Y-31", "a12", 104, "R6", "\n\n消費洞察\n\n", "\n\n## 策略、研發、行銷：模擬能先回答什麼\n\n消費洞察\n\n", "p.104 底部三欄框標題")
add("Y-32", "a12", 105, "R6", "\n\nPeople Model 能派上用場的場景", "\n\n## WHAT People Model can do？\n\nPeople Model 能派上用場的場景", "p.105 大標")
add("Y-33", "a12", 109, "R6", "\n\n市場研究的難處集中在三件事", "\n\n## HOW do we create People Model？\n\n市場研究的難處集中在三件事", "p.109 大標")
add("Y-34", "a12", 112, "R6", "\n\n## 準確度與可信度", "\n\n## ASK More About People Model\n\n## 準確度與可信度", "p.112 大標")
d = json.loads(LOG.read_text(encoding="utf-8"))
d["proposals"] = [p for p in d["proposals"] if not p["pid"].startswith("Y-")] + P
d["rounds"]["lead_pass2"] = len(P)
LOG.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(P), "筆")
