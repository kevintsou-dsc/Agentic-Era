"""襯線顯示字子集（docs/design-review/p1-02-ruling.md D1、L1、L6）。npm run fonts 執行。

來源：Noto Serif TC 可變字重 2.02（SIL OFL 1.1，© Adobe），取自 Windows 11 內建的 NotoSerifTC-VF.ttf，以 SHA-256 鎖定。
換成 notofonts 官方釋出檔時，改 SRC 與 SHA256 即可。原始 TTF 不進 repo。
產出（都進 repo，Cloudflare 建置不需要 Python 或中文字型）：
  public/fonts/serif-900.woff2  標題、陳述句（display 字集）
  public/fonts/serif-700.woff2  原文引言、帶走的問題（text 字集）
  content/fonts/serif-covered.json  兩檔實際涵蓋的字，給 scripts/verify/check-fonts.mjs 比對
需要：pip install -r scripts/fonts/requirements.txt；字集由 node scripts/fonts/display-chars.mjs 產生。
"""
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(os.environ.get("SERIF_SRC", "C:/Windows/Fonts/NotoSerifTC-VF.ttf"))
SHA256 = "c8b7df78de02c2c35875de707d1d336762fd4db8864a66e249940879fb6859d8"
LIMIT_KB = 280  # 每檔上限；裁定原訂 220，但引言字集擴大到含延伸區塊（S5）後 700 檔已 214 KB，放寬到 280 並記錄於 p1-02
FAMILY = "DW Serif Display"  # 改名，避免與讀者本機安裝的 Noto Serif TC 混用


def main():
    # Windows 主控台預設 cp950，印不出 ✓／✗
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    if not SRC.exists():
        sys.exit(f"✗ 找不到來源字型 {SRC}（可用環境變數 SERIF_SRC 指定同版本檔案）")
    digest = hashlib.sha256(SRC.read_bytes()).hexdigest()
    if digest != SHA256:
        sys.exit(f"✗ 來源字型雜湊不符：{digest}（預期 {SHA256}）。換版本請一併更新 SHA256 並重新檢視授權")

    chars = json.loads(subprocess.run(["node", str(ROOT / "scripts/fonts/display-chars.mjs")],
                                      capture_output=True, check=True, cwd=ROOT).stdout.decode("utf-8"))
    out_dir = ROOT / "public/fonts"
    out_dir.mkdir(parents=True, exist_ok=True)
    covered = {}
    for weight, key in ((900, "display"), (700, "text")):
        font = instancer.instantiateVariableFont(TTFont(SRC), {"wght": weight})
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]  # 保留版權（0）與 OFL 授權（13、14）
        opts.name_legacy = True
        opts.name_languages = ["*"]
        sub = subset.Subsetter(opts)
        sub.populate(text=chars[key])
        sub.subset(font)
        name = font["name"]
        for rec in name.names:
            if rec.nameID in (1, 16):
                rec.string = FAMILY
            elif rec.nameID in (4,):
                rec.string = f"{FAMILY} {weight}"
            elif rec.nameID == 6:
                rec.string = f"DWSerifDisplay-{weight}"
        path = out_dir / f"serif-{weight}.woff2"
        font.flavor = "woff2"
        font.save(path)
        kb = path.stat().st_size // 1024
        cmap = font.getBestCmap()
        covered[key] = "".join(sorted(c for c in chars[key] if ord(c) in cmap or c.isspace()))
        missing = "".join(c for c in chars[key] if ord(c) not in cmap and not c.isspace())
        if missing:
            covered[f"{key}_unavailable"] = missing  # 來源字型本身沒有的字：瀏覽器會用無襯線補，涵蓋檢查不再提示
        print(f"✓ serif-{weight}.woff2 {kb} KB，{len(chars[key])} 字" + (f"（來源字型沒有：{missing}）" if missing else ""))
        if kb > LIMIT_KB:
            sys.exit(f"✗ serif-{weight}.woff2 超過 {LIMIT_KB} KB")
    (ROOT / "content/fonts").mkdir(parents=True, exist_ok=True)
    (ROOT / "content/fonts/serif-covered.json").write_text(json.dumps(covered, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
