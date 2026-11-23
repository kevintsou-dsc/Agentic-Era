"""實跑專案驗證腳本，把數字寫進 build/facts.json（字幕數字唯一來源），並保存真實終端輸出供影片使用。"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
BUILD = Path(__file__).resolve().parent.parent / "build"


def node(script):
    r = subprocess.run(["node", script], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return (r.stdout + r.stderr).strip()


def main():
    BUILD.mkdir(parents=True, exist_ok=True)
    q = node("scripts/verify/verify-quotes.mjs")
    m = node("scripts/verify/verify-meta.mjs")
    links = node("scripts/verify/check-links.mjs")
    f = {}
    if (x := re.search(r"(\d+)/(\d+)", q)):
        f["quotes"] = f"{int(x.group(2)):,}"
    if (x := re.search(r"(\d+)/(\d+)", m)):
        f["authors"] = x.group(2)
    if (x := re.search(r"(\d+)/(\d+)（(\d+) 頁）", links)):
        f["links"] = f"{int(x.group(2)):,}"
        f["pages"] = x.group(3)
    f["terminal_pass"] = [ln for ln in (q + "\n" + m + "\n" + links).splitlines() if ln.startswith("✓")]
    fc = Path(__file__).with_name("fail_capture.txt").read_text(encoding="utf-8").splitlines()
    f["terminal_fail"] = [ln for ln in fc if ln and not ln.startswith("#")]
    (BUILD / "facts.json").write_text(json.dumps(f, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(f, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
