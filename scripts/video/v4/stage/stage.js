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

const ARROW = `<svg viewBox="0 0 44 44"><path d="M6 3 L6 36 L15 27 L21 41 L27 38 L21 25 L34 25 Z" fill="#26221e" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>`;

/* ───────── 各場景 ───────── */
const SCENES = {};

SCENES.hook = (g) => {
  const cam = el('div', 'cam', null, g);
  const fr = Array.from({ length: M.hero_n }, (_, i) => img(`hero_${pad2(i)}.jpg`, cam));
  return (lt, d) => {
    seq(fr, lerp(0, 9, ease(prog(lt, 0.6, d))));
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
    s3[1].style.setProperty('--w', `${eout(prog(lt, d - 0.9, d - 0.3)) * 112}%`);
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
  const fr = Array.from({ length: M.hero_n }, (_, i) => img(`hero_${pad2(i)}.jpg`, vp));
  const hint = el('div', 'scrollhint', '只要往下捲 ↓', g);
  const l2 = BEATS_BY.n03.lines[1].start - BEATS_BY.n03.start;
  return (lt, d) => {
    const p = eout(prog(lt, 0, 0.9));
    b.style.transform = `scale(${lerp(.86, 1, p)})`; op(b, p);
    seq(fr, lerp(9, M.hero_n - 1, ease(prog(lt, l2 - 0.3, d))));
    op(hint, eout(prog(lt, l2 + 1.2, l2 + 1.6)));
  };
};

SCENES.facemap = (g) => {
  const cam = el('div', 'cam', null, g);
  const fr = Array.from({ length: M.fm_n }, (_, i) => img(`fm_${pad2(i)}.jpg`, cam));
  const lit = M.light_n.slice(0, 4).map((k) => img(`light_${pad2(k)}.jpg`, cam));
  const st = M.fm_stage, cx = st.x + st.w * 0.42, cy = st.y + st.h * 0.48;
  const l3 = BEATS_BY.n04.lines[2].start - BEATS_BY.n04.start;
  return (lt, d) => {
    const x = eout(prog(lt, l3 - 0.5, l3 - 0.1));
    if (x <= 0) { seq(fr, lerp(0, M.fm_n - 1, ease(prog(lt, 0.2, l3 - 0.6)))); lit.forEach((im) => op(im, 0)); }
    else { fr.forEach((im) => op(im, 0)); fr[0].style.opacity = 1 - x; seq(lit, lerp(0, lit.length - 1, prog(lt, l3, d - 0.4))); lit.forEach((im) => { im.style.opacity *= x; }); }
    const z = ease(prog(lt, 0.4, l3));
    cam.style.transform = x > 0 ? camTf(st.x + st.w * 0.5, st.y + st.h * 0.5, 1.15) : camTf(lerp(.5, cx, z), lerp(.5, cy, z), lerp(1, 1.3, z));
  };
};

SCENES.threads = (g) => {
  const cam = el('div', 'cam', null, g);
  const im = img('threads.jpg', cam); im.style.opacity = 1;
  const [cx, cy] = center(M.threads.box);
  return (lt, d) => { const z = ease(prog(lt, 0, d * 0.7)); cam.style.transform = camTf(lerp(.5, cx, z), lerp(.5, cy, z), lerp(1.05, 1.6, z)); };
};

SCENES.sov_intro = (g) => {
  const cam = el('div', 'cam', null, g);
  const top = img('sov_top.jpg', cam);
  const al = img('alloc_00.jpg', cam);
  const bd = el('div', 'badge', '每一層都做，<br><em>每一層都不夠深</em>', g); bd.style.right = '110px'; bd.style.top = '430px';
  const [ax, ay] = center(M.alloc_box);
  const l2 = BEATS_BY.n06a.lines[1].start - BEATS_BY.n06a.start;
  return (lt, d) => {
    const x = eout(prog(lt, l2 - 0.4, l2 + 0.2));
    op(top, 1 - x); op(al, x);
    cam.style.transform = x < 0.5 ? camTf(.32, .36, lerp(1.25, 1.35, prog(lt, 0, l2))) : camTf(ax, ay, lerp(1.5, 1.6, prog(lt, l2, d)));
    op(bd, eout(prog(lt, l2 + 1.6, l2 + 2.1)));
  };
};

SCENES.sov_alloc = (g) => {
  const cam = el('div', 'cam', null, g);
  const fr = Array.from({ length: M.alloc_n }, (_, i) => img(`alloc_${pad2(i)}.jpg`, cam));
  const [ax, ay] = center(M.alloc_box);
  return (lt, d) => { seq(fr, lerp(1, M.alloc_n - 1, ease(prog(lt, 0.2, d - 1.2)))); cam.style.transform = camTf(ax, ay, 1.6); };
};

SCENES.charts = (g) => {
  el('div', 'paperbg', null, g);
  const cards = M.charts.map((c) => {
    const k = Math.min(840 / c.h, 1560 / c.w);
    const cd = el('div', 'card', null, g);
    cd.style.width = `${c.w * k}px`; cd.style.height = `${c.h * k}px`;
    cd.style.left = `${(W - c.w * k) / 2}px`; cd.style.top = `${(H - c.h * k) / 2 - 50}px`;
    img(`chart_${c.slug}.jpg`, cd).style.opacity = 1;
    const tg = el('div', 'tag', `〈${c.title}〉`, cd); tg.style.right = '18px'; tg.style.bottom = '18px'; tg.style.fontSize = '26px';
    return cd;
  });
  return (lt, d) => {
    const seg = d / cards.length;
    cards.forEach((cd, i) => {
      const a = i * seg, p = prog(lt, a - 0.05, a + 0.3), q = i === cards.length - 1 ? 0 : prog(lt, a + seg - 0.3, a + seg - 0.05);
      op(cd, eout(p) * (1 - q));
      cd.style.transform = `translateX(${(1 - eout(p)) * 120 - q * 120}px) scale(${lerp(.97, 1.01, prog(lt, a, a + seg))})`;
    });
  };
};

SCENES.reader = (g) => {
  const cam = el('div', 'cam', null, g);
  const before = img('reader_before.jpg', cam), open = img('reader_open.jpg', cam);
  const cur = el('div', 'cursor', ARROW, g), ring = el('div', 'ring', null, g);
  const [bx, by] = center(M.reader.btn), [mx, my] = center(M.reader.mark);
  const l2 = BEATS_BY.n08a.lines[1].start - BEATS_BY.n08a.start;
  const click = l2 - 0.5;
  return (lt, d) => {
    const x = eout(prog(lt, click + 0.1, click + 0.6));
    op(before, 1 - x); op(open, x);
    const sBefore = 2.0, zBefore = camTf(bx, by, sBefore);
    const zz = ease(prog(lt, click + 0.6, d));
    cam.style.transform = x < 1 ? zBefore : camTf(mx, my, lerp(1.25, 1.85, zz));
    if (x < 1) cam.style.transform = zBefore;
    // 游標移向頁碼（座標換算到放大後畫面）
    let tx = W / 2 - bx * W * sBefore, ty = H / 2 - by * H * sBefore;
    tx = clamp(tx, W - W * sBefore, 0); ty = clamp(ty, H - H * sBefore, 0);
    const px = tx + bx * W * sBefore, py = ty + by * H * sBefore;
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
  img('reader_open.jpg', cam).style.opacity = 1;
  const dim = el('div', 'dim', null, g);
  const c = el('div', 'center', null, g);
  const n = el('div', '', '', c);
  const cap = el('div', 'h2', '條引文，每一條都對得回紙本 ✓', c); cap.style.color = '#fff'; cap.style.marginTop = '20px';
  const [mx, my] = center(M.reader.mark);
  const target = parseInt(String(D.facts.quotes || '1539').replace(/,/g, ''), 10);
  return (lt, d) => {
    cam.style.transform = camTf(mx, my, 1.85);
    const p = eout(prog(lt, 0, 0.5)); dim.style.background = `rgba(28,24,21,${0.72 * p})`;
    const v = Math.round(target * eout(prog(lt, 0.2, 1.6)));
    n.innerHTML = `<span class="num" style="color:#fff;font-size:180px">${v.toLocaleString('en-US')}</span>`;
    op(c, p);
  };
};

SCENES.snack = (g) => {
  const cam = el('div', 'cam', null, g);
  const fr = Array.from({ length: M.snack_n }, (_, i) => img(`snack_${pad2(i)}.jpg`, cam));
  const card = img('snack_card.jpg', cam);
  return (lt, d) => {
    const cut = d * 0.62;
    seq(fr, lerp(0, M.snack_n - 1, ease(prog(lt, 0, cut))));
    const x = eout(prog(lt, cut, cut + 0.4));
    if (x > 0) fr.forEach((f) => { f.style.opacity *= (1 - x); });
    op(card, x);
    cam.style.transform = camTf(.5, .45, lerp(1.35, 1.5, lt / d));
  };
};

SCENES.share = (g) => {
  const cam = el('div', 'cam', null, g);
  const fr = ['bold', 'paper', 'night'].map((n) => img(`share_${n}.jpg`, cam));
  const [cx, cy] = center(M.share_card);
  return (lt, d) => {
    seq(fr, lerp(0, 2, clamp((lt - 0.4) / (d - 1.2))) * 1);
    const f = clamp((lt - 0.4) / (d - 1.2)) * 2;  // 每張停留後快速淡入下一張
    const i = Math.floor(f), r = clamp((f - i - 0.75) / 0.25);
    fr.forEach((im, k) => { im.style.opacity = k === i ? 1 : (k === i + 1 ? r : 0); });
    cam.style.transform = camTf(lerp(.5, cx - 0.06, ease(prog(lt, 0, 1))), cy, lerp(1.2, 1.45, ease(prog(lt, 0, 1.2))));
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
  const l2 = BEATS_BY.n12.lines[1].start - BEATS_BY.n12.start;
  return (lt, d) => {
    op(L, eout(prog(lt, 0.1, 0.5)));
    op(R, eout(prog(lt, l2 - 0.1, l2 + 0.3)));
    bad.style.setProperty('--w', `${eout(prog(lt, l2 + 0.3, l2 + 0.8)) * 108}%`);
    op(v, eout(prog(lt, l2 + 1.0, l2 + 1.4)));
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
  const bg = el('div', 'badge', '錯一個字，<em>就不准上線</em>', g); bg.style.left = '50%'; bg.style.bottom = '150px'; bg.style.transform = 'translateX(-50%)';
  const lns = BEATS_BY.n13.lines.map((x) => x.start - BEATS_BY.n13.start);
  return (lt, d) => {
    op(t, eout(prog(lt, 0, 0.4)));
    op(els[0], eout(prog(lt, 0.2, 0.4)));
    op(els[1], eout(prog(lt, 0.7, 0.9)));
    const k0 = 2, n = els.length - k0;
    for (let k = 0; k < n; k++) { const a = lns[1] + 0.2 + k * ((lns[2] - lns[1]) / (n + 0.5)); op(els[k0 + k], eout(prog(lt, a, a + 0.25))); }
    op(bg, eout(prog(lt, lns[2] - 0.1, lns[2] + 0.3)));
  };
};

SCENES.judge = (g) => {
  const cam = el('div', 'cam', null, g);
  img('threads.jpg', cam).style.opacity = 1;
  const [jx, jy] = center(M.threads.judge);
  const bd = el('div', 'badge', '書中主線：<em>判斷力不能外包</em>', g); bd.style.left = '120px'; bd.style.top = '150px';
  const l2 = BEATS_BY.n14.lines[1].start - BEATS_BY.n14.start;
  return (lt, d) => {
    const z = ease(prog(lt, 0, d * 0.8));
    cam.style.transform = camTf(lerp(.5, jx, z), lerp(.5, jy, z), lerp(1.2, 2.0, z));
    op(bd, eout(prog(lt, l2 + 0.6, l2 + 1.0)));
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
  const fr = M.light_n.map((k) => img(`light_${pad2(k)}.jpg`, cam));
  const q = el('div', 'quote', '只要 AI 做的是幫品牌更懂人，<br>品牌與人的距離，才會是真實的靠近。<small>— 邵懿文〈Agentic 時代，品牌與人的真實距離〉紙本 p.17</small>', g);
  const [cx, cy] = center(M.fm_stage);
  const l2 = BEATS_BY.n16.lines[1].start - BEATS_BY.n16.start;
  const cnt = el('div', 'badge', '', g); cnt.style.right = '110px'; cnt.style.bottom = '170px';
  return (lt, d) => {
    const f = lerp(0, fr.length - 1, ease(prog(lt, 0, l2 + 0.6)));
    seq(fr, f);
    cnt.innerHTML = `已點亮 <em>${M.light_n[Math.min(fr.length - 1, Math.round(f))]}</em> / 22`; op(cnt, eout(prog(lt, 0.2, 0.6)));
    cam.style.transform = camTf(cx, cy + 0.12, lerp(1.15, 1.3, lt / d));
    op(q, eout(prog(lt, l2 + 0.2, l2 + 0.8)));
  };
};

SCENES.outro = (g) => {
  el('div', 'paperbg', null, g);
  const o = el('div', 'outro', null, g);
  const l = el('div', 'l', null, o);
  el('div', 'eyebrow', 'DENTSU DECISION WISDOM 2026', l);
  el('div', 'brand', '決策智慧 2026', l);
  el('div', 'tl', '往下捲，就讀得懂。', l);
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
const PROG = { n04: '1', n05: '1', n06a: '2', n06b: '2', n07: '2', n08a: '3', n08b: '3', n09: '3', n10: '3', n11: 'b', n12: 'b', n13: 'b', n14: 'b', n15: 'b' };
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
