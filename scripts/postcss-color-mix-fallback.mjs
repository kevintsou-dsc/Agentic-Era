// 舊版 Safari（16.2 以前）不支援 color-mix()：說明框底色消失、圖表淡色線條與圈圈不見。
//
// 為什麼不能只在前面多寫一行備用值：值裡只要有 var()，舊瀏覽器在解析時照單全收，
// 到算值時才發現 color-mix 無效，這時屬性直接變成 unset，前面那行備用值早就被蓋掉了。
// 所以改成：每條含 color-mix 的規則後面，補一段
//   @supports not (color: color-mix(in srgb, red, blue)) { 同選擇器 { 備用值 } }
// 新瀏覽器完全不會套用；舊瀏覽器用同樣的選擇器、較後面的位置蓋過去。
//
// 備用值怎麼算（以「看得到、顏色接近」為準，不追求和新瀏覽器完全相同）：
//   1. 兩個顏色都是全站固定色票、比例固定 → 算出精確的 rgba。
//   2. 章節色（--accent／--accent-ink）或固定色票，比例固定 → rgb(var(--x-rgb) / 比例)，
//      用半透明疊在紙色上近似混色；--x-rgb 色版由本外掛從 global.css 色票自動補上。
//   3. 比例會隨捲動變（calc(var(--on) * …)）→ 取靜止狀態（變數當 0）再套 1、2。
//   4. 元件內的區域色（--tone、--red…）→ 比例 ≥ 50% 用前色，否則用後色。
import fs from 'node:fs';
import path from 'node:path';

const SUPPORTS = 'not (color: color-mix(in srgb, red, blue))';

function readTokens(root) {
  const css = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  const block = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
  const hex = {};
  for (const m of block.matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-f]{3,8})\b/gi)) hex[m[1]] = parseHex(m[2]);
  return hex;
}

function parseHex(h) {
  let s = h.slice(1);
  if (s.length <= 4) s = [...s].map((c) => c + c).join('');
  const n = (i) => parseInt(s.slice(i, i + 2), 16);
  return [n(0), n(2), n(4), s.length === 8 ? n(6) / 255 : 1];
}

// 把字串在頂層逗號切開（不切到括號裡）
function splitTop(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

// 找出所有 color-mix(...)（含括號平衡），回傳 [start, end]
function findMixes(v) {
  const res = []; let i = 0;
  while ((i = v.indexOf('color-mix(', i)) !== -1) {
    let depth = 0, j = i + 'color-mix'.length;
    for (; j < v.length; j++) {
      if (v[j] === '(') depth++;
      else if (v[j] === ')') { depth--; if (depth === 0) break; }
    }
    res.push([i, j + 1]); i = j + 1;
  }
  return res;
}

// 比例：把 var(--…) 當 0（靜止狀態），再算 calc 裡的加減乘
function evalPct(expr) {
  if (!expr) return null;
  let e = expr.replace(/var\([^()]*\)/g, '0').replace(/calc/g, '').replace(/%/g, '');
  if (!/^[\d\s.+\-*/()]+$/.test(e)) return null;
  try { const n = Function(`"use strict";return (${e})`)(); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) / 100 : null; } catch { return null; }
}

function splitColorPct(part) {
  // 「var(--x) 40%」「var(--x) calc(var(--on) * 60%)」「transparent」
  const m = part.match(/^(.*?)\s+((?:calc\(.*\))|(?:[\d.]+%))$/);
  return m ? { color: m[1].trim(), pct: m[2] } : { color: part.trim(), pct: null };
}

export default function colorMixFallback({ root = process.cwd() } = {}) {
  const hex = readTokens(root);
  const chan = new Set([...Object.keys(hex), 'accent', 'accent-ink']);

  const resolve = (c) => {
    if (c === 'transparent') return { kind: 'transparent', text: c };
    if (/^#[0-9a-f]{3,8}$/i.test(c)) return { kind: 'static', rgba: parseHex(c), text: c };
    const m = c.match(/^var\(--([a-z0-9-]+)(?:\s*,.*)?\)$/i);
    if (m && hex[m[1]]) return { kind: 'static', rgba: hex[m[1]], text: c, name: m[1] };
    if (m && chan.has(m[1])) return { kind: 'chan', text: c, name: m[1] };
    return { kind: 'unknown', text: c };
  };
  const rgbaText = ([r, g, b, a]) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(3)})`;

  const fallbackMix = (inner) => {
    const parts = splitTop(inner);
    if (parts.length !== 3 || !/^in\s+srgb$/i.test(parts[0])) return null;
    const A = splitColorPct(parts[1]), B = splitColorPct(parts[2]);
    let p = A.pct != null ? evalPct(A.pct) : B.pct != null ? 1 - (evalPct(B.pct) ?? 0.5) : 0.5;
    if (p == null) p = 0;
    const a = resolve(A.color), b = resolve(B.color);
    if (p >= 0.999) return a.text;
    if (p <= 0.001) return b.text;
    if (a.kind === 'static' && (b.kind === 'static' || b.kind === 'transparent')) {
      if (b.kind === 'transparent') return rgbaText([...a.rgba.slice(0, 3), a.rgba[3] * p]);
      return rgbaText(a.rgba.map((v, i) => v * p + b.rgba[i] * (1 - p)));
    }
    if ((a.kind === 'static' || a.kind === 'chan') && a.name) return `rgb(var(--${a.name}-rgb) / ${+p.toFixed(3)})`;
    if (a.kind === 'static') return rgbaText([...a.rgba.slice(0, 3), a.rgba[3] * p]);
    return p >= 0.5 ? a.text : b.text;
  };

  const fallbackValue = (v) => {
    let out = v;
    // 由後往前換，位置才不會跑掉；巢狀的先換內層
    for (let guard = 0; out.includes('color-mix(') && guard < 20; guard++) {
      const ms = findMixes(out);
      const [s, e] = ms[ms.length - 1];
      const fb = fallbackMix(out.slice(s + 'color-mix('.length, e - 1));
      if (fb == null) return null;
      out = out.slice(0, s) + fb + out.slice(e);
    }
    return out;
  };

  return {
    postcssPlugin: 'color-mix-fallback',
    OnceExit(css, { AtRule, Rule, Declaration }) {
      // 1. 色票色版：--paper: #f3eee4 → 補 --paper-rgb: 243 238 228；--accent: var(--people) → --accent-rgb: var(--people-rgb)
      css.walkDecls(/^--[a-z0-9-]+$/i, (d) => {
        const name = d.prop.slice(2);
        if (!chan.has(name) || d.next()?.prop === `--${name}-rgb`) return;
        const v = d.value.trim();
        let ch = null;
        if (/^#[0-9a-f]{3,8}$/i.test(v)) ch = parseHex(v).slice(0, 3).join(' ');
        const m = v.match(/^var\(--([a-z0-9-]+)\)$/i);
        if (m && chan.has(m[1])) ch = `var(--${m[1]}-rgb)`;
        if (ch) d.after(new Declaration({ prop: `--${name}-rgb`, value: ch }));
      });

      // 2. 每條含 color-mix 的規則，後面補 @supports not 備用規則
      css.walkRules((rule) => {
        if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
        if (rule.parent?.type === 'atrule' && rule.parent.params === SUPPORTS) return;
        const nx = rule.next();
        if (nx?.type === 'atrule' && nx.params === SUPPORTS && nx.first?.selector === rule.selector) return;
        const decls = [];
        rule.each((d) => {
          if (d.type !== 'decl' || !d.value.includes('color-mix(')) return;
          const fb = fallbackValue(d.value);
          if (fb != null) decls.push(new Declaration({ prop: d.prop, value: fb, important: d.important }));
        });
        if (!decls.length) return;
        const at = new AtRule({ name: 'supports', params: SUPPORTS });
        const r = new Rule({ selector: rule.selector });
        r.append(decls);
        at.append(r);
        rule.after(at);
      });
    },
  };
}
colorMixFallback.postcss = true;
