// 知識補給包（components/SnackPack.astro）。成就卡定義在 lib/achievements.ts，由已讀紀錄推算。
// readmap.ts 記下已讀後發出 dw:read（帶讀完前後的已讀清單）：有新卡解鎖時不自動彈出，
// 改在頂列收藏鈕亮紅點、文末按鈕改成「拆開新的知識補給包」，讀者點了才打開（不打斷讀完後往下一篇的節奏）。
// 包裝依這次解鎖的卡而定（scripts/packs.ts）：第一篇＝糖果紙、篇數＝鋁箔袋、讀完一章＝摺紙信封、讀完一條主線＝扭蛋；
// 一次解鎖多種時取最稀有的。補給包飄在空中：拖曳旋轉；手機用陀螺儀跟著晃動轉（iOS 第一次觸碰時請求授權）。
// 把拉條往右拉打開。右上角、首頁底部與全書地圖上的按鈕打開收藏。
import { absUrl, downloadCanvas, drawAchievementCard, shareCanvas } from './share';
import { buildPack, type Light, type PackKind } from './packs';

interface Card { id: string; kind: 'count' | 'chapter' | 'thread'; name: string; line: string; hint: string; color: string; n?: number; slugs?: string[] }
const KIND = { count: '篇數', chapter: '章節', thread: '主線' } as const;
const KEY = 'dw-read';
const TEAR_AT = 0.7;
// 每種包裝的動詞、標籤與提示
const PACK: Record<PackKind, { verb: string; tag: string; hint: string; ms: number }> = {
  candy: { verb: '扭', tag: '第一篇讀完｜糖果補給', hint: '把「扭」往右拉，扭開糖果紙', ms: 1700 },
  foil: { verb: '撕', tag: '篇數補給｜鋁箔袋', hint: '把「撕」往右拉，撕開封口', ms: 1500 },
  envelope: { verb: '拆', tag: '章節補給｜摺紙信封', hint: '把「拆」往右拉，拆開封蠟', ms: 2000 },
  capsule: { verb: '轉', tag: '主線補給｜扭蛋', hint: '把「轉」往右拉，轉開上蓋', ms: 1700 },
};

export function readList(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [];
  } catch { return []; }
}

export function initSnack() {
  const dlg = document.getElementById('snack') as HTMLDialogElement | null;
  if (!dlg) return;
  const cards: Card[] = JSON.parse(dlg.dataset.cards!);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => dlg.querySelector<T>(s)!;
  const stages = Array.from(dlg.querySelectorAll<HTMLElement>('[data-stage]'));
  const show = (name: string) => stages.forEach((s) => { s.hidden = s.dataset.stage !== name; });
  const scene = $('[data-scene]');
  const host = $('[data-pk]');
  let light: Light | null = null;
  let kind: PackKind = 'foil';
  const knob = $<HTMLButtonElement>('[data-tear]');
  const fill = $('[data-tear-fill]');
  const deck = $('[data-deck]');
  const msg = $('[data-snack-msg]');

  const unlocked = (read: string[]) => {
    const set = new Set(read);
    return cards.filter((c) => (c.kind === 'count' ? set.size >= c.n! : c.slugs!.every((s) => set.has(s))));
  };

  const cardEl = (c: Card, locked = false) => {
    const el = document.createElement('div');
    el.className = `acard c-${c.color}${locked ? ' locked' : ''}`;
    const no = String(cards.indexOf(c) + 1).padStart(2, '0');
    const top = document.createElement('span'); top.className = 'ac-top';
    top.append(Object.assign(document.createElement('span'), { textContent: `No.${no}／${cards.length}` }), Object.assign(document.createElement('span'), { textContent: '知識補給包' }));
    const kind = Object.assign(document.createElement('span'), { className: 'ac-kind', textContent: KIND[c.kind] });
    const name = Object.assign(document.createElement('b'), { className: 'ac-name', textContent: locked ? '？' : c.name });
    const line = Object.assign(document.createElement('p'), { className: 'ac-line', textContent: locked ? c.hint : c.line });
    const foot = Object.assign(document.createElement('span'), { className: 'ac-foot', textContent: 'DECISION WISDOM 2026' });
    el.append(top, kind, name, line, foot);
    if (!locked) {
      el.append(Object.assign(document.createElement('i'), { className: 'ac-shine' }));
      // 卡片跟著指標微微傾斜，光澤跟著移動
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ty', `${(x - 0.5) * 18}deg`);
        el.style.setProperty('--tx', `${(0.5 - y) * 14}deg`);
        el.style.setProperty('--gx', `${x * 100}%`);
        el.style.setProperty('--gy', `${y * 100}%`);
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('--tx'); el.style.removeProperty('--ty'); });
    }
    return el;
  };

  // ── 卡片 ──
  let got: Card[] = [];
  let pos = 0;
  let fromUnlock = false;
  const renderDeck = () => {
    deck.replaceChildren(cardEl(got[pos]));
    $('[data-deck-pos]').textContent = `${pos + 1}／${got.length}`;
    $('[data-deck-nav]').hidden = got.length < 2;
    msg.textContent = '';
  };
  $('[data-prev]').addEventListener('click', () => { pos = (pos - 1 + got.length) % got.length; renderDeck(); });
  $('[data-next]').addEventListener('click', () => { pos = (pos + 1) % got.length; renderDeck(); });

  // ── 收藏 ──
  const openAlbum = () => {
    const owned = unlocked(readList());
    const have = new Set(owned.map((c) => c.id));
    $('[data-album]').replaceChildren(...cards.map((c) => {
      const li = document.createElement('li');
      const locked = !have.has(c.id);
      const el = cardEl(c, locked);
      if (!locked) {
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `檢視並分享成就卡：${c.name}`);
        const inspect = () => {
          fromUnlock = false;
          got = owned;
          pos = Math.max(0, owned.findIndex((x) => x.id === c.id));
          $('[data-got]').textContent = `已收藏的成就卡（${owned.length}／${cards.length}）`;
          show('cards');
          renderDeck();
          $('[data-snack-share]').focus();
        };
        el.addEventListener('click', inspect);
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inspect(); }
        });
      }
      li.append(el);
      return li;
    }));
    $('[data-album-count]').textContent = `${have.size}／${cards.length}`;
    show('album');
  };
  $('[data-album-open]').addEventListener('click', openAlbum);

  // ── 3D 包：旋轉 ──
  let rx = 0, ry = 0, tx = 0, ty = 0; // 目前角度與目標角度
  let dragging = false, px = 0, py = 0, baseX = 0, baseY = 0;
  let tilt: { x: number; y: number } | null = null; // 陀螺儀
  let lastInput = 0;
  let raf = 0;
  const loop = (t: number) => {
    const idle = performance.now() - lastInput > 1800;
    if (!dragging) {
      if (tilt) { tx = tilt.x; ty = tilt.y; }
      else if (idle && !reduce) { tx = Math.sin(t / 1600) * 8; ty = Math.sin(t / 2300) * 22; }
    }
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    host.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    light?.(rx, ry); // 曲面每一條依角度算明暗
    raf = requestAnimationFrame(loop);
  };
  const startLoop = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };

  let askedMotion = false;
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    tilt = { x: Math.max(-35, Math.min(35, (e.beta - 45) * 0.8)), y: Math.max(-60, Math.min(60, e.gamma * 1.5)) };
  };
  const askMotion = async () => {
    if (askedMotion) return;
    askedMotion = true;
    const D = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
    try { if (D?.requestPermission && (await D.requestPermission()) !== 'granted') return; } catch { return; }
    window.addEventListener('deviceorientation', onTilt);
  };
  if (!('ontouchstart' in window)) askedMotion = true; // 桌機不需要陀螺儀
  else if (!(window.DeviceOrientationEvent as unknown as { requestPermission?: unknown })?.requestPermission) { askedMotion = true; window.addEventListener('deviceorientation', onTilt); }

  scene.addEventListener('pointerdown', (e) => {
    void askMotion();
    dragging = true; px = e.clientX; py = e.clientY; baseX = tx; baseY = ty; tilt = null;
    scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    lastInput = performance.now();
    ty = baseY + (e.clientX - px) * 0.6;
    tx = Math.max(-50, Math.min(50, baseX - (e.clientY - py) * 0.4));
  });
  const stopDrag = () => { dragging = false; lastInput = performance.now(); };
  scene.addEventListener('pointerup', stopDrag);
  scene.addEventListener('pointercancel', stopDrag);

  // ── 撕開 ──
  let tearing = false, kx0 = 0, moved = false;
  const setTear = (p: number) => {
    // p＝0（開包、重置）不用量寬度：剛插入整組 3D 面片時去讀 clientWidth，會逼整頁長文章當場重排一次
    const max = p ? knob.parentElement!.clientWidth - knob.offsetWidth : 0;
    knob.style.setProperty('--kx', `${p * max}px`);
    fill.style.width = `${p * 100}%`;
    // 拉的時候封口、封蠟、上蓋先跟著動一點
    host.style.setProperty('--pull', p > 0 && p < 1 ? p.toFixed(3) : '0');
  };
  const rip = () => {
    if (dlg.classList.contains('is-ripped')) return;
    setTear(1);
    host.style.setProperty('--pull', '0');
    dlg.classList.add('is-ripped');
    setTimeout(() => {
      cancelAnimationFrame(raf);
      show('cards');
      renderDeck();
      const nextBtn = !$('[data-deck-nav]').hidden ? dlg.querySelector<HTMLElement>('[data-next]') : null;
      (nextBtn ?? $('[data-snack-share]')).focus();
    }, reduce ? 0 : PACK[kind].ms);
  };
  knob.addEventListener('pointerdown', (e) => { e.stopPropagation(); void askMotion(); tearing = true; moved = false; kx0 = e.clientX; knob.setPointerCapture(e.pointerId); });
  knob.addEventListener('pointermove', (e) => {
    if (!tearing) return;
    const max = knob.parentElement!.clientWidth - knob.offsetWidth;
    const p = Math.max(0, Math.min(1, (e.clientX - kx0) / max));
    if (p > 0.03) moved = true;
    setTear(p);
    if (p >= TEAR_AT) { tearing = false; rip(); }
  });
  const endTear = () => { if (!tearing) return; tearing = false; if (!dlg.classList.contains('is-ripped')) setTear(0); };
  knob.addEventListener('pointerup', endTear);
  knob.addEventListener('pointercancel', endTear);
  knob.addEventListener('click', () => { if (!moved) rip(); moved = false; });

  // ── 開關 ──
  const packKind = (cs: Card[]): PackKind =>
    cs.some((c) => c.kind === 'thread') ? 'capsule' : cs.some((c) => c.kind === 'chapter') ? 'envelope' : cs.some((c) => c.id === 'n1') ? 'candy' : 'foil';
  let opener: HTMLElement | null = null;
  const openPack = (cs: Card[]) => {
    fromUnlock = true;
    got = cs; pos = 0;
    dlg.classList.remove('is-ripped');
    kind = packKind(cs);
    const lead = cs.find((c) => (kind === 'capsule' ? c.kind === 'thread' : kind === 'envelope' ? c.kind === 'chapter' : true))!;
    light = buildPack(host, kind, cs.map((c) => ({ name: c.name, color: c.color, no: `${String(cards.indexOf(c) + 1).padStart(2, '0')}／${cards.length}` })), lead.color);
    knob.textContent = PACK[kind].verb;
    $('[data-pk-kind]').textContent = PACK[kind].tag;
    $('[data-pk-hint]').textContent = `轉轉看；${PACK[kind].hint}`;
    setTear(0);
    $('[data-got]').textContent = cs.length > 1 ? `一次解鎖 ${cs.length} 張成就卡！` : '解鎖一張成就卡！';
    show('pack');
    opener = document.activeElement as HTMLElement | null;
    tilt = null; rx = ry = tx = ty = 0; lastInput = 0;
    dlg.showModal();
    startLoop();
    knob.focus();
  };
  let pendingPack: Card[] | null = null;
  let packWaiting = false;
  const setHasPack = (on: boolean) => {
    packWaiting = on;
    updateBtn();
  };
  const openAlbumDialog = () => {
    if (pendingPack?.length) {
      const next = pendingPack;
      pendingPack = null;
      setHasPack(false);
      openPack(next);
      return;
    }
    opener = document.activeElement as HTMLElement | null;
    openAlbum();
    dlg.showModal();
  };
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || (e.target as HTMLElement).closest('[data-snack-close]')) dlg.close();
  });
  dlg.addEventListener('close', () => {
    cancelAnimationFrame(raf);
    // 若還沒撕開就先關掉，保留未拆紅點在右上角收藏鈕，方便讀者稍後再拆
    if (!dlg.classList.contains('is-ripped') && !$('[data-stage="pack"]').hidden && got.length) {
      pendingPack = got;
      setHasPack(true);
    } else {
      setHasPack(false);
    }
    opener?.focus();
  });

  const currentStory = () => {
    const shareRoot = document.querySelector<HTMLElement>('[data-share]');
    if (!shareRoot?.dataset.path || !shareRoot.dataset.title) return null;
    const shortTitle = shareRoot.dataset.title.split('：')[0].trim();
    return { title: shortTitle, path: shareRoot.dataset.path };
  };
  const cardSharePayload = (c: Card) => {
    const no = `No.${String(cards.indexOf(c) + 1).padStart(2, '0')}／${cards.length}`;
    const readN = new Set(readList().filter((s) => valid.has(s))).size;
    const progress = `已讀 ${readN}／${total} 篇`;
    const pk = packKind([c]);
    const story = fromUnlock ? currentStory() : null;
    const url = story ? absUrl(story.path) : c.kind === 'chapter' ? absUrl(`/#fm-${c.color}`) : absUrl('/');
    const text = story
      ? `剛讀完《決策智慧 2026》〈${story.title}〉，解鎖成就卡「${c.name}」：${c.line}`
      : `在《決策智慧 2026》解鎖成就卡「${c.name}」（${readN}／${total} 篇）：${c.line}`;
    const spec = {
      no,
      kindLabel: KIND[c.kind],
      packTag: PACK[pk].tag,
      name: c.name,
      line: c.line,
      color: c.color,
      articleTitle: story?.title,
      progress,
      url,
    };
    return { spec, text, url, file: `decision-wisdom-card-${c.id}.png` };
  };

  $('[data-snack-share]').addEventListener('click', async () => {
    const c = got[pos];
    if (!c) return;
    msg.textContent = '製作卡片中…';
    const { spec, text, url, file } = cardSharePayload(c);
    const canvas = await drawAchievementCard(spec);
    msg.textContent = canvas ? await shareCanvas(canvas, file, `成就卡「${c.name}」｜決策智慧 2026`, text, url) : '這個瀏覽器不能產生圖片。';
  });
  $('[data-snack-dl]').addEventListener('click', async () => {
    const c = got[pos];
    if (!c) return;
    msg.textContent = '製作卡片中…';
    const { spec, file } = cardSharePayload(c);
    const canvas = await drawAchievementCard(spec);
    msg.textContent = canvas && (await downloadCanvas(canvas, file)) ? '已下載成就卡。' : '這個瀏覽器不能產生圖片。';
  });

  // ── 和全書地圖、已讀紀錄連動 ──
  // 入口：右上角（data-snack-album="top"）、首頁底部（"home"）、全書地圖（無值）
  const btns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-snack-album]'));
  const valid = new Set(cards.flatMap((c) => (c.kind === 'chapter' ? c.slugs! : [])));
  const total = Math.max(...cards.filter((c) => c.kind === 'count').map((c) => c.n!));
  const home = document.querySelector<HTMLElement>('[data-progress-home]');
  const updateBtn = () => {
    const list = readList();
    const readN = new Set(list.filter((s) => valid.has(s))).size;
    const n = unlocked(list).length;
    btns.forEach((b) => {
      const kind = b.dataset.snackAlbum;
      if (kind === 'top') {
        b.hidden = readN === 0;
        // 只有圖示；數字放在提示與讀屏文字
        b.classList.toggle('has-pack', packWaiting);
        const label = packWaiting ? `有一包新的知識補給包，點開拆開｜已讀 ${readN}／${total} 篇`
          : `已讀 ${readN}／${total} 篇｜成就卡 ${n}／${cards.length}，打開收藏`;
        b.title = label;
        b.setAttribute('aria-label', label);
      } else if (kind === 'home') {
        b.textContent = n ? `打開成就卡收藏（${n}／${cards.length}）` : '先看看有哪些成就卡';
      } else {
        b.hidden = n === 0 && !packWaiting;
        b.classList.toggle('has-pack', packWaiting);
        b.textContent = packWaiting ? '拆開新的知識補給包' : `成就卡 ${n}／${cards.length}`;
      }
    });
    if (home) {
      const line = home.querySelector<HTMLElement>('[data-ph-line]');
      const bar = home.querySelector<HTMLElement>('[data-ph-bar]');
      const sub = home.querySelector<HTMLElement>('[data-ph-sub]');
      if (line) line.textContent = readN === 0 ? '讀完第一篇，就能打開第一份知識補給包。'
        : readN >= total ? `${total} 篇全部讀完了。` : `你讀了 ${readN} 篇，還有 ${total - readN} 篇。`;
      if (bar) bar.style.width = `${(readN / total) * 100}%`;
      if (sub) sub.textContent = `已收集 ${n}／${cards.length} 張成就卡。已讀紀錄只存在這台裝置的瀏覽器裡。`;
    }
  };
  updateBtn();
  btns.forEach((b) => b.addEventListener('click', openAlbumDialog));
  document.addEventListener('dw:read', (e) => {
    const { before, after } = (e as CustomEvent<{ before: string[]; after: string[] }>).detail;
    const had = new Set(unlocked(before).map((c) => c.id));
    const fresh = unlocked(after).filter((c) => !had.has(c.id));
    updateBtn();
    if (!fresh.length) return;
    // 不自動彈出：併入待拆的補給包，交給頂列紅點與文末按鈕
    const seen = new Set((pendingPack ?? []).map((c) => c.id));
    pendingPack = [...(pendingPack ?? []), ...fresh.filter((c) => !seen.has(c.id))];
    setHasPack(true);
  });

  // 預先載入補給包裡會用到的字（中文字型依字分段下載）：第一次開包時不用當場等字、排字，
  // 中階手機上開包那一下的卡頓約少一半。只在閒置時做，失敗就算了
  const warm = () => {
    const css = getComputedStyle(document.documentElement);
    const text = `${dlg.textContent ?? ''}${cards.map((c) => c.name + c.line + c.hint).join('')}扭撕拆知識補給包成分表內含張保存期限開封後請立即閱讀決No.0123456789／`;
    for (const v of ['--font-sans', '--font-serif', '--font-mono']) {
      const fam = css.getPropertyValue(v).trim();
      if (fam) for (const w of ['400', '700', '900']) document.fonts.load(`${w} 16px ${fam}`, text).catch(() => {});
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 4000 });
  else setTimeout(warm, 2500);
}
