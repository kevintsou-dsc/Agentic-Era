/* v4 舞台：renderFrame(t) 為純函式，同一個 t 一定得到同一個畫面（決定性渲染）。 */
const D = window.__DATA__;
const W = 1920, H = 1080;
const A = D.assetBase;            // 素材路徑前綴
const M = D.manifest;
const BEATS = D.timeline.beats;
const TOTAL = D.timeline.total;
const root = document.getElementById('root');

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, p) => a + (b - a) * p;
const ease = (p) => (p = clamp(p), p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const eout = (p) => 1 - Math.pow(1 - clamp(p), 3);
const prog = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
const el = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (parent || root).appendChild(e); return e; };
const img = (src, parent, cls) => { const i = el('img', cls || '', null, parent); i.src = A + src; return i; };
const pad2 = (n) => String(n).padStart(2, '0');
const op = (e, o) => { e.style.opacity = o; };

/* 相機：把正規化座標 (cx, cy) 推到畫面中心並放大 s，邊緣不露底 */
function camTf(cx, cy, s) {
  let tx = W / 2 - cx * W * s, ty = H / 2 - cy * H * s;
  tx = clamp(tx, W - W * s, 0); ty = clamp(ty, H - H * s, 0);
  return `translate(${tx}px, ${ty}px) scale(${s})`;
}
const center = (b) => b ? [b.x + b.w / 2, b.y + b.h / 2] : [.5, .5];

/* 逐格序列：相鄰兩張交叉淡化，消除跳格感 */
function seq(list, f) {
  const n = list.length; f = clamp(f, 0, n - 1);
  const i = Math.floor(f), r = clamp((f - i - 0.72) / 0.28);
  list.forEach((im, k) => { im.style.opacity = k === i ? 1 : (k === i + 1 ? r : 0); });
}

/* 混合版：真實網站逐幀錄下的動態（capture_live.py），一個 <img> 依時間換 src。
   換 src 後由 window.settle() 等待解碼，render.py 截圖前會呼叫，確保決定性。 */
const LIVE = M.live || {};
const PENDING = new Set();
function live(name, parent) {
  const im = el('img', '', null, parent); im.style.opacity = 1;
  const n = LIVE[name] ? LIVE[name].n : 0; let cur = -1;
  return {
    im, n,
    show(sec) {
      const k = Math.round(clamp(sec * 30, 0, n - 1));
      if (k !== cur) { cur = k; im.src = `${A}live/${name}/${String(k).padStart(5, '0')}.jpg`; PENDING.add(im); }
    },
  };
}
window.settle = async () => { const a = [...PENDING]; PENDING.clear(); await Promise.all(a.map((i) => i.decode().catch(() => {}))); };

const ARROW = `<svg viewBox="0 0 44 44"><path d="M6 3 L6 36 L15 27 L21 41 L27 38 L21 25 L34 25 Z" fill="#26221e" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>`;

/* ───────── 各場景 ───────── */
const SCENES = {};

SCENES.hook = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('hook', cam);
  return (lt, d) => {
    lv.show(Math.max(0, lt));
    cam.style.transform = camTf(.5, .45, lerp(1.0, 1.06, lt / d));
  };
};

SCENES.book = (g) => {
  el('div', 'paperbg', null, g);
  const c = el('div', 'center', null, g);
  el('div', 'eyebrow', '電通《決策智慧 2026》', c);
  const q = el('div', 'h1', '品牌離 AI 越近，會離人越遠嗎？', c); q.style.marginTop = '26px';
  const st = el('div', 'stats', null, c);
  const mk = (n, u, l) => { const s = el('div', 'stat', null, st); const nn = el('div', '', `<span class="num">${n}</span><span class="unit">${u}</span>`, s); el('div', 'lbl', l, s); return [s, nn]; };
  const s1 = mk('22', '篇', '觀點'), s2 = mk('14.3', '萬字', '全書'), s3 = mk('5+', '小時', '從頭讀完');
  s3[1].classList.add('strike');
  const ln = BEATS_BY.n02.lines;
  return (lt, d) => {
    const t2 = ln[1].start - BEATS_BY.n02.start;
    [s1, s2, s3].forEach(([s], k) => { const p = eout(prog(lt, t2 + k * 0.9, t2 + k * 0.9 + 0.5)); op(s, p); s.style.transform = `translateY(${(1 - p) * 30}px)`; });
    op(q, eout(prog(lt, 0, 0.6)));
  };
};

SCENES.scroll = (g) => {
  el('div', 'paperbg', null, g);
  const b = el('div', 'browser', null, g);
  const bar = el('div', 'bar', null, b);
  ['', '', ''].forEach(() => el('span', 'dot', null, bar));
  el('div', 'url', '🔒 agentic-era.kevin-tsou.workers.dev', bar);
  const vp = el('div', 'vp', null, b);
  const lv = live('scroll', vp);
  const hint = el('div', 'scrollhint', '只要往下滑 ↓', g);
  const l2 = BEATS_BY.n03.lines[1].start - BEATS_BY.n03.start;
  return (lt, d) => {
    const p = eout(prog(lt, 0, 0.9));
    b.style.transform = `scale(${lerp(.86, 1, p)})`; op(b, p);
    lv.show(lt);
    op(hint, eout(prog(lt, l2 + 1.2, l2 + 1.6)));
  };
};

SCENES.facemap = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('facemap', cam);
  const lit = live('facelit', cam);
  const st = M.fm_stage, cx = st.x + st.w * 0.42, cy = st.y + st.h * 0.48;
  const l3 = BEATS_BY.n04.lines[2].start - BEATS_BY.n04.start;
  return (lt, d) => {
    const x = eout(prog(lt, l3 - 0.5, l3 - 0.1));
    lv.show(lt); lit.show(Math.max(0, lt - (l3 - 0.5)));
    op(lv.im, 1 - x); op(lit.im, x);
    const z = ease(prog(lt, 0.4, l3));
    cam.style.transform = camTf(lerp(.5, cx, z), lerp(.5, cy, z), lerp(1, 1.15, z));
  };
};

SCENES.threads = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('threads', cam);
  const [cx, cy] = center(LIVE.threads.box);
  return (lt, d) => {
    lv.show(lt);
    const z = ease(prog(lt, 1.3, d * 0.8));
    cam.style.transform = camTf(lerp(.5, cx, z), lerp(.5, cy, z), lerp(1.0, 1.2, z));
  };
};

SCENES.sov_intro = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('sov_intro', cam);
  const [ax, ay] = center(LIVE.sov_intro.box);
  const b = BEATS_BY.n06a, l2 = b.lines[1].start - b.start, l3 = b.lines[2].start - b.start;
  return (lt, d) => {
    lv.show(lt);
    const z = ease(prog(lt, l3 - 0.2, l3 + 1.0));
    cam.style.transform = camTf(lerp(.5, ax, z), lerp(.5, ay, z), lerp(1.0, 1.2, z));
  };
};

SCENES.sov_alloc = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('sov_alloc', cam);
  const [ax, ay] = center(LIVE.sov_alloc.box);
  return (lt, d) => { lv.show(lt); cam.style.transform = camTf(ax, ay, 1.2); };
};

SCENES.charts = (g) => {
  el('div', 'paperbg', null, g);
  const b = BEATS_BY.n07, L2 = b.lines[1].start - b.start;
  const starts = [0, L2 / 2, L2, L2 + 1.8, L2 + 3.6];   // 與 capture_live.chart_durations 一致
  const cards = M.live_charts.map((name, i) => {
    const c = LIVE[name];
    const k = Math.min(700 / c.h, 1560 / c.w);
    const cd = el('div', 'card', null, g); cd.style.overflow = 'visible';
    cd.style.width = `${c.w * k}px`; cd.style.height = `${c.h * k}px`;
    cd.style.left = `${(W - c.w * k) / 2}px`; cd.style.top = `${(H - c.h * k) / 2 - 10}px`;
    const lv = live(name, cd);
    const tg = el('div', 'tag', `〈${c.title}〉`, cd); tg.style.left = '0'; tg.style.top = '-62px'; tg.style.fontSize = '26px';
    return { cd, lv, a: starts[i] };
  });
  return (lt, d) => {
    cards.forEach(({ cd, lv, a }, i) => {
      const e = i === cards.length - 1 ? d + 1 : cards[i + 1].a;
      const p = prog(lt, a - 0.05, a + 0.25), q = prog(lt, e - 0.2, e + 0.05);
      const o = eout(p) * (1 - q);
      op(cd, o); cd.style.visibility = o > 0 ? 'visible' : 'hidden';
      cd.style.transform = `translateX(${(1 - eout(p)) * 100 - q * 100}px)`;
      if (o > 0) lv.show(lt - a);
    });
  };
};

SCENES.reader = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('reader', cam);
  const R = LIVE.reader;
  const cur = el('div', 'cursor', ARROW, g), ring = el('div', 'ring', null, g);
  const [bx, by] = center(R.btn), [mx, my] = center(R.mark);
  const click = R.click;
  return (lt, d) => {
    lv.show(lt);
    const x = eout(prog(lt, click + 0.1, click + 0.7));
    const sB = 1.5, zz = ease(prog(lt, click + 0.5, d));
    cam.style.transform = x < 1 ? camTf(lerp(bx, .5, x), lerp(by, .5, x), lerp(sB, 1, x)) : camTf(mx, my, lerp(1, 1.35, zz));
    // 游標移向頁碼（座標換算到放大後畫面）
    let tx = W / 2 - bx * W * sB, ty = H / 2 - by * H * sB;
    tx = clamp(tx, W - W * sB, 0); ty = clamp(ty, H - H * sB, 0);
    const px = tx + bx * W * sB, py = ty + by * H * sB;
    const mv = ease(prog(lt, 0.3, click));
    cur.style.transform = `translate(${lerp(px + 380, px + 6, mv)}px, ${lerp(py + 240, py + 4, mv)}px)`;
    op(cur, (1 - x) * eout(prog(lt, 0.1, 0.4)));
    const rp = prog(lt, click, click + 0.6);
    ring.style.left = `${px}px`; ring.style.top = `${py}px`;
    ring.style.transform = `scale(${lerp(.3, 1.3, rp)})`; op(ring, rp > 0 && rp < 1 ? 1 - rp : 0);
  };
};

SCENES.reader_count = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('reader', cam);
  const off = BEATS_BY.n08a.end - BEATS_BY.n08a.start;
  const dim = el('div', 'dim', null, g);
  const c = el('div', 'center', null, g);
  const n = el('div', '', '', c);
  const cap = el('div', 'h2', '條引文，每一條都對得回紙本 ✓', c); cap.style.color = '#fff'; cap.style.marginTop = '20px';
  const [mx, my] = center(LIVE.reader.mark);
  const target = parseInt(String(D.facts.quotes || '1539').replace(/,/g, ''), 10);
  return (lt, d) => {
    lv.show(lt + off);
    cam.style.transform = camTf(mx, my, 1.35);
    const p = eout(prog(lt, 0, 0.5)); dim.style.background = `rgba(28,24,21,${0.72 * p})`;
    const v = Math.round(target * eout(prog(lt, 0.2, 1.6)));
    n.innerHTML = `<span class="num" style="color:#fff;font-size:180px">${v.toLocaleString('en-US')}</span>`;
    op(c, p);
  };
};

SCENES.snack = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('snack', cam);
  return (lt, d) => { lv.show(lt); cam.style.transform = camTf(.5, .5, lerp(1.0, 1.1, lt / d)); };
};

SCENES.share = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('share', cam);
  const [cx, cy] = center(LIVE.share.card);
  return (lt, d) => {
    lv.show(lt);
    cam.style.transform = camTf(.5, lerp(.5, cy, ease(prog(lt, 0, 1))), lerp(1.0, 1.15, ease(prog(lt, 0, 1.2))));
  };
};

SCENES.turn = (g) => {
  el('div', 'paperbg', null, g);
  const c = el('div', 'center', null, g);
  const a = el('div', 'h2', '做這個網站，最大的風險不是技術', c);
  const b = el('div', 'display', '是 AI 會<span style="color:var(--red)">一本正經地寫錯</span>', c); b.style.marginTop = '24px';
  const l2 = BEATS_BY.n11.lines[1].start - BEATS_BY.n11.start;
  return (lt) => { op(a, eout(prog(lt, 0.3, 0.8))); op(b, eout(prog(lt, l2 - 0.1, l2 + 0.4))); b.style.transform = `scale(${lerp(.94, 1, eout(prog(lt, l2 - 0.1, l2 + 0.6)))})`; };
};

SCENES.error = (g) => {
  el('div', 'paperbg', null, g);
  const L = el('div', 'split', '<div class="lbl">AI 寫的出處</div><div class="pg bad">p.117</div>', g); L.style.left = '160px';
  const R = el('div', 'split', '<div class="lbl">原刊實際頁碼</div><div class="pg good">p.119</div>', g); R.style.right = '160px';
  const bad = L.querySelector('.pg');
  const fail = (D.facts.terminal_fail || [])[1] || '頁碼錯誤：宣告 p.117，實際在 p.119';
  const v = el('div', 'verdict', `✗ ${fail}`, g);
  // 第二個例子：語氣被改強（審稿模型抓到，見 docs/review-pipeline.md）
  const L2 = el('div', 'split', '<div class="lbl">原文</div><div class="pg good" style="font-size:96px">反而<u style="text-decoration-thickness:8px;text-underline-offset:14px">可能</u>變少</div>', g); L2.style.left = '160px';
  const R2 = el('div', 'split', '<div class="lbl">AI 改寫</div><div class="pg bad" style="font-size:96px">反而<span style="color:var(--ink2);opacity:.35">＿＿</span>變少</div>', g); R2.style.right = '160px';
  const v2 = el('div', 'verdict', '✗ 審稿模型：少了「可能」，語氣被改強', g);
  const ls = BEATS_BY.n12.lines.map((x) => x.start - BEATS_BY.n12.start);
  return (lt, d) => {
    const out = 1 - eout(prog(lt, ls[2] - 0.35, ls[2] - 0.05));
    op(L, eout(prog(lt, 0.1, 0.5)) * out);
    op(R, eout(prog(lt, ls[1] - 0.1, ls[1] + 0.3)) * out);
    bad.style.setProperty('--w', `${eout(prog(lt, ls[1] + 0.3, ls[1] + 0.8)) * 108}%`);
    op(v, eout(prog(lt, ls[1] + 0.9, ls[1] + 1.2)) * out);
    op(L2, eout(prog(lt, ls[2], ls[2] + 0.4)));
    op(R2, eout(prog(lt, ls[3] - 0.1, ls[3] + 0.3)));
    op(v2, eout(prog(lt, ls[3] + 1.0, ls[3] + 1.4)));
  };
};

SCENES.gate = (g) => {
  el('div', 'paperbg', null, g);
  const t = el('div', 'term', null, g);
  t.innerHTML = '<div class="tbar"><i></i><i></i><i></i><b>npm run build（每次發布自動執行）</b></div>';
  const pre = el('pre', '', null, t);
  const fails = (D.facts.terminal_fail || ['✗ 引文比對失敗 1/1539']).slice(0, 1);
  const passes = D.facts.terminal_pass || [];
  const lines = [['dimt', '$ npm run build'], ...fails.map((x) => ['bad', x + '　→ 建置中止，不准上線']), ['dimt', '# 改回 p.119 後重跑'], ...passes.map((x) => ['good', x])];
  const els = lines.map(([c, s]) => { const e = el('span', `ln ${c}`, s, pre); return e; });
  const lns = BEATS_BY.n13.lines.map((x) => x.start - BEATS_BY.n13.start);
  return (lt, d) => {
    op(t, eout(prog(lt, 0, 0.4)));
    op(els[0], eout(prog(lt, 0.2, 0.4)));
    op(els[1], eout(prog(lt, 0.7, 0.9)));
    const k0 = 2, n = els.length - k0;
    for (let k = 0; k < n; k++) { const a = lns[1] + 0.2 + k * ((lns[2] - lns[1]) / (n + 0.5)); op(els[k0 + k], eout(prog(lt, a, a + 0.25))); }
  };
};

SCENES.judge = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('judge', cam);
  const [jx, jy] = center(LIVE.judge.judge);
  return (lt, d) => {
    lv.show(lt);
    cam.style.transform = camTf(jx, jy + 0.06, lerp(1.1, 1.3, ease(prog(lt, 0, d * 0.8))));
  };
};

SCENES.deploy = (g) => {
  el('div', 'paperbg', null, g);
  const P = el('div', 'pillars', null, g);
  const pages = D.facts.pages || '47';
  const items = [
    ['', pages, '頁全靜態', '沒有資料庫、沒有後台'],
    ['red', '0', '個外部請求', '不連第三方、不追蹤'],
    ['', '🔒', '每段程式鎖指紋', '被改過就不執行（SHA-256 CSP）'],
  ].map(([c, b, t, s]) => el('div', 'pillar', `<div class="big ${c}">${b}</div><div class="t">${t}</div><div class="s">${s}</div>`, P));
  const l2 = BEATS_BY.n15.lines[1].start - BEATS_BY.n15.start;
  const at = [0.9, 2.6, l2];
  return (lt) => { items.forEach((it, k) => { const p = eout(prog(lt, at[k], at[k] + 0.45)); op(it, p); it.style.transform = `translateY(${(1 - p) * 40}px)`; }); };
};

SCENES.finale = (g) => {
  const cam = el('div', 'cam', null, g);
  const lv = live('finale', cam);
  const veil = el('div', 'dim', null, g);
  const q = el('div', 'quote', '只要 AI 做的是幫品牌更懂人，<br>品牌與人的距離，才會是真實的靠近。<small>— 邵懿文〈Agentic 時代，品牌與人的真實距離〉紙本 p.17</small>', g);
  const [cx, cy] = center(M.fm_stage);
  const l2 = BEATS_BY.n16.lines[1].start - BEATS_BY.n16.start;
  return (lt, d) => {
    lv.show(lt);
    cam.style.transform = camTf(.5, .5, lerp(1.0, 1.08, lt / d));
    veil.style.background = `rgba(241,233,219,${0.82 * eout(prog(lt, l2 - 0.2, l2 + 0.6))})`;
    op(q, eout(prog(lt, l2 + 0.2, l2 + 0.8)));
  };
};

SCENES.outro = (g) => {
  el('div', 'paperbg', null, g);
  const o = el('div', 'outro', null, g);
  const l = el('div', 'l', null, o);
  el('div', 'eyebrow', 'DENTSU DECISION WISDOM 2026', l);
  el('div', 'brand', '決策智慧 2026', l);
  el('div', 'tl', '往下滑，就讀得懂。', l);
  el('div', 'url', 'agentic-era.kevin-tsou.workers.dev', l);
  const r = el('div', '', null, o);
  el('div', 'qr', D.qr, r);
  el('div', 'cap', '掃描 QR，直接開始讀', r).style.textAlign = 'center';
  return (lt) => { const p = eout(prog(lt, 0, 0.8)); op(o, p); o.style.transform = `translateY(${(1 - p) * 30}px)`; };
};

/* ───────── 組裝 ───────── */
const BEATS_BY = Object.fromEntries(BEATS.map((b) => [b.id, b]));
const R = BEATS.map((b) => {
  const g = el('div', 'grp'); g.dataset.id = b.id;
  return { b, g, render: SCENES[b.scene](g) };
});
const sub = document.getElementById('sub');
const progEl = document.getElementById('prog');
const PROG = { n04: '1', n05: '1', n06a: '2', n06b: '2', n07: '2', n08a: '3', n08b: '3', n09: '3', n10: '3', n11: 'b', n12: 'b', n13: 'b', n15: 'b' };
const LINES = BEATS.flatMap((b) => b.lines);
const XF = 0.25;  // 場景交叉淡化秒數

window.renderFrame = (t) => {
  let idx = BEATS.findIndex((b, i) => t < (BEATS[i + 1] ? BEATS[i + 1].start : Infinity));
  if (idx < 0) idx = BEATS.length - 1;
  R.forEach((r) => { r.g.style.visibility = 'hidden'; r.g.style.opacity = 0; r.g.style.zIndex = 0; });
  const cur = R[idx];
  const end = BEATS[idx + 1] ? BEATS[idx + 1].start : TOTAL;
  cur.g.style.visibility = 'visible'; cur.g.style.opacity = 1;
  cur.render(t - cur.b.start, end - cur.b.start);
  if (idx > 0 && t - cur.b.start < XF) {      // 前一場景淡出疊在下層
    const pv = R[idx - 1], p = (t - cur.b.start) / XF;
    pv.g.style.visibility = 'visible'; pv.g.style.opacity = 1; pv.g.style.zIndex = 0; cur.g.style.zIndex = 1;
    cur.g.style.opacity = ease(p);
    pv.render(cur.b.start - pv.b.start, cur.b.start - pv.b.start);
  }
  // 字幕
  let s = '';
  for (let i = 0; i < LINES.length; i++) {
    const L = LINES[i], nx = LINES[i + 1];
    const until = nx ? Math.min(nx.start - 0.05, L.end + 0.9) : L.end + 0.9;
    if (t >= L.start - 0.08 && t < until) { s = L.sub; break; }
  }
  sub.textContent = s; sub.style.opacity = s ? 1 : 0;
  // 進度列
  const k = PROG[BEATS[idx].id];
  progEl.style.opacity = k ? 1 : 0;
  progEl.querySelectorAll('span').forEach((sp) => {
    const kk = sp.dataset.k;
    sp.className = kk === k ? (k === 'b' ? 'back' : 'on') : '';
    sp.style.display = (k === 'b') === (kk === 'b') ? '' : 'none';
  });
  // 片頭淡入、轉折黑場
  document.getElementById('fadein').style.opacity = 1 - eout(prog(t, 0, 0.8));
  const tn = BEATS_BY.n11.start;
  document.getElementById('flash').style.opacity = t >= tn - 0.15 && t < tn + 0.5 ? 1 - prog(t, tn + 0.15, tn + 0.5) : 0;
};

window.stageReady = (async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
  return true;
})();
