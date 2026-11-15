"""全文校稿第 3 輪之三：修正頁碼標記倒退（R5）。
抽取時，前一頁的圖說／側欄常被放到下一頁內文之後，形成「p.N … p.N-1 圖說 … p.N」。
做法：把該區塊移回前一頁結尾；若前一頁最後一段跨頁（不是以句末標點結尾），就移到該段之前，避免插在句子中間。
產生提案（Z-xx）附加到 content/review/fulltext-proofread.json，交給 apply_proofread.py 套用。"""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
LOG = ROOT / "content" / "review" / "fulltext-proofread.json"
END = tuple("。！？」』）)…")
P = []
for f in sorted((ROOT / "content" / "fulltext").glob("a*.md")):
    paras = f.read_text(encoding="utf-8").split("\n\n")
    pg = lambda s: int(re.match(r"<!-- p\.(\d+) -->$", s).group(1)) if re.match(r"<!-- p\.(\d+) -->$", s) else None
    i, prev = 0, 0
    while i < len(paras):
        p = pg(paras[i])
        if p is not None and p < prev:
            # 區塊：paras[i]（倒退標記）… 下一個標記 paras[k]（回到 prev）
            k = next(j for j in range(i + 1, len(paras)) if pg(paras[j]) is not None)
            block = paras[i + 1:k]
            m = max(j for j in range(i) if pg(paras[j]) == prev)  # 下一頁開始的標記
            a = m - 1  # 前一頁最後一段
            ins = m if paras[a].rstrip().endswith(END) or pg(paras[a]) is not None or paras[a].startswith("## ") else a
            if pg(paras[k]) == prev:
                old = "\n\n".join(paras[ins:k + 1])
                new_paras = block + paras[ins:i]
                new = "\n\n".join(new_paras)
                P.append(dict(pid=f"Z-{len(P) + 1:02d}", aid=f.stem, page=p, rule="R5", type="structure", old=old, new=new,
                              evidence=f"p.{p} 的圖說／側欄被放在 p.{prev} 內文之後；移回 p.{p}" + ("結尾" if ins == m else "跨頁段落之前"),
                              verdict="accept", verifier="lead（第三輪，規則化處理頁碼倒退）"))
                paras[ins:k + 1] = new_paras
                i = ins + len(new_paras)
                continue
        if p is not None:
            prev = p
        i += 1
d = json.loads(LOG.read_text(encoding="utf-8"))
d["proposals"] = [x for x in d["proposals"] if not x["pid"].startswith("Z-")] + P
d["rounds"]["page_regress_fixes"] = len(P)
LOG.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
for x in P: print(x["pid"], x["aid"], x["evidence"])
