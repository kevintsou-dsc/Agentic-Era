// 原文頁互動：右側印刷紙本對照（捲動同步、240ms 書頁抽換、收合切換）與全螢幕燈箱（原圖／紙本頁）。
// 所有邏輯採外部模組打包（不寫 is:inline），完全相容嚴格 CSP。

interface LbItem {
  src: string;
  alt: string;
  caption: string;
  label: string;
  page?: number;
}

const preloaded = new Set<string>();
function preload(src: string) {
  if (preloaded.has(src)) return;
  preloaded.add(src);
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

export function initOriginalSync() {
  const layout = document.querySelector<HTMLElement>('.orig-layout');
  if (!layout) return;

  const aid = layout.dataset.aid!;
  const pStart = Number(layout.dataset.pStart);
  const pEnd = Number(layout.dataset.pEnd);
  const totalPages = pEnd - pStart + 1;
  const pageSrc = (p: number) => `/pages/${aid}/p${String(p).padStart(3, '0')}.webp`;

  // DOM 參照：右側印刷對照區
  const pane = layout.querySelector<HTMLElement>('.print-pane');
  const sheet = layout.querySelector<HTMLElement>('[data-print-sheet]');
  const sheetImg = layout.querySelector<HTMLImageElement>('[data-print-img]');
  const labelEl = layout.querySelector<HTMLElement>('[data-print-label]');
  const liveEl = layout.querySelector<HTMLElement>('[data-print-live]');
  const prevBtn = layout.querySelector<HTMLButtonElement>('[data-print-prev]');
  const nextBtn = layout.querySelector<HTMLButtonElement>('[data-print-next]');
  const syncPill = layout.querySelector<HTMLButtonElement>('[data-print-resync]');
  const dotsWrap = layout.querySelector<HTMLElement>('[data-print-dots]');
  const barFill = layout.querySelector<HTMLElement>('[data-print-bar]');
  const collapseBtn = layout.querySelector<HTMLButtonElement>('[data-print-collapse]');
  const restoreBtn = document.querySelector<HTMLButtonElement>('[data-print-restore]');

  // DOM 參照：左側頁界
  const pgEls = Array.from(layout.querySelectorAll<HTMLElement>('.pg[data-page]'));
  const desktopMq = window.matchMedia('(min-width: 1100px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentScrollPage = pStart;
  let shownPage = pStart;
  let manualLock = false;
  let lockedAtScrollPage = pStart;

  function isDesktopPaneVisible() {
    return desktopMq.matches && !layout!.classList.contains('is-print-hidden') && !!pane;
  }

  function preloadNeighbors(p: number) {
    if (!isDesktopPaneVisible()) return;
    if (p + 1 <= pEnd) preload(pageSrc(p + 1));
    if (p - 1 >= pStart) preload(pageSrc(p - 1));
  }

  function updateSyncPill() {
    if (!syncPill) return;
    const diverged = manualLock && shownPage !== currentScrollPage;
    syncPill.hidden = !diverged;
    if (diverged) syncPill.textContent = `↺ 回到目前段落 p.${currentScrollPage}`;
  }

  function setPrintPage(target: number, opts?: { animate?: boolean; pulse?: boolean; announce?: boolean }) {
    const p = Math.max(pStart, Math.min(pEnd, target));
    const dir = p > shownPage ? 'next' : p < shownPage ? 'prev' : '';
    const changed = p !== shownPage;
    shownPage = p;

    if (sheet && sheetImg) {
      sheet.dataset.side = p % 2 === 0 ? 'even' : 'odd';
      sheet.setAttribute('aria-label', `放大檢視紙本第 ${p} 頁`);
      if (changed) {
        const nextUrl = pageSrc(p);
        sheetImg.src = nextUrl;
        sheetImg.alt = `紙本印刷版第 ${p} 頁`;
        if (opts?.animate !== false && dir && !reducedMotion.matches) {
          sheet.classList.remove('is-next', 'is-prev');
          void sheet.offsetWidth;
          sheet.classList.add(dir === 'next' ? 'is-next' : 'is-prev');
        }
      }
      if (opts?.pulse && !reducedMotion.matches) {
        sheet.classList.remove('is-pulse');
        void sheet.offsetWidth;
        sheet.classList.add('is-pulse');
      }
    }

    if (labelEl) labelEl.textContent = `紙本 p.${p} / p.${pStart}–${pEnd}`;
    if (liveEl && opts?.announce) liveEl.textContent = `目前顯示紙本第 ${p} 頁`;
    if (prevBtn) prevBtn.disabled = p <= pStart;
    if (nextBtn) nextBtn.disabled = p >= pEnd;

    if (dotsWrap) {
      const idx = p - pStart;
      dotsWrap.querySelectorAll<HTMLElement>('[data-dot]').forEach((d, i) => {
        d.classList.toggle('is-active', i === idx);
        d.setAttribute('aria-current', i === idx ? 'true' : 'false');
      });
    }
    if (barFill) {
      const ratio = totalPages > 1 ? (p - pStart) / (totalPages - 1) : 1;
      barFill.style.transform = `scaleX(${Math.max(0.06, ratio)})`;
    }

    updateSyncPill();
    preloadNeighbors(p);
  }

  function computeScrollPage(): number {
    if (!pgEls.length) return pStart;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24;
    if (atBottom) return Number(pgEls[pgEls.length - 1].dataset.page);
    const threshold = window.innerHeight * 0.32;
    let active = Number(pgEls[0].dataset.page);
    for (const el of pgEls) {
      if (el.getBoundingClientRect().top <= threshold) {
        active = Number(el.dataset.page);
      } else {
        break;
      }
    }
    return active;
  }

  function syncFromScroll() {
    const p = computeScrollPage();
    if (p !== currentScrollPage) {
      currentScrollPage = p;
      pgEls.forEach((el) => el.classList.toggle('is-current', Number(el.dataset.page) === p));
      if (manualLock && p !== lockedAtScrollPage) {
        manualLock = false;
      }
      if (!manualLock) {
        setPrintPage(p, { animate: true });
      } else {
        updateSyncPill();
      }
    }
  }

  let raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      syncFromScroll();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // 初始化頁碼（支援 #pXX 錨點進入）
  const hashMatch = location.hash.match(/^#p(\d+)$/);
  const initPage = hashMatch ? Number(hashMatch[1]) : computeScrollPage();
  currentScrollPage = Math.max(pStart, Math.min(pEnd, initPage));
  pgEls.forEach((el) => el.classList.toggle('is-current', Number(el.dataset.page) === currentScrollPage));
  setPrintPage(currentScrollPage, { animate: false });

  // 桌機右側控制鈕
  prevBtn?.addEventListener('click', () => {
    manualLock = true;
    lockedAtScrollPage = currentScrollPage;
    setPrintPage(shownPage - 1, { animate: true, announce: true });
  });
  nextBtn?.addEventListener('click', () => {
    manualLock = true;
    lockedAtScrollPage = currentScrollPage;
    setPrintPage(shownPage + 1, { animate: true, announce: true });
  });
  syncPill?.addEventListener('click', () => {
    manualLock = false;
    setPrintPage(currentScrollPage, { animate: true, announce: true });
  });
  dotsWrap?.addEventListener('click', (e) => {
    const dot = (e.target as HTMLElement).closest<HTMLElement>('[data-dot]');
    if (!dot) return;
    manualLock = true;
    lockedAtScrollPage = currentScrollPage;
    setPrintPage(Number(dot.dataset.dot), { animate: true, announce: true });
  });

  // 收合／展開紙本對照（Focus Mode）
  collapseBtn?.addEventListener('click', () => {
    layout.classList.add('is-print-hidden');
    if (restoreBtn) restoreBtn.hidden = false;
  });
  restoreBtn?.addEventListener('click', () => {
    layout.classList.remove('is-print-hidden');
    restoreBtn.hidden = true;
    preloadNeighbors(shownPage);
  });

  // ===== 全螢幕燈箱（同時支援印刷紙本頁與左側原文配圖） =====
  const lb = document.getElementById('orig-lightbox') as HTMLDialogElement | null;
  const lbImg = lb?.querySelector<HTMLImageElement>('[data-lb-img]');
  const lbTitle = lb?.querySelector<HTMLElement>('[data-lb-title]');
  const lbCap = lb?.querySelector<HTMLElement>('[data-lb-cap]');
  const lbPrev = lb?.querySelector<HTMLButtonElement>('[data-lb-prev]');
  const lbNext = lb?.querySelector<HTMLButtonElement>('[data-lb-next]');
  const lbZoom = lb?.querySelector<HTMLButtonElement>('[data-lb-zoom]');
  const lbStage = lb?.querySelector<HTMLElement>('[data-lb-stage]');
  const lbClose = lb?.querySelector<HTMLButtonElement>('[data-lb-close]');

  let lbItems: LbItem[] = [];
  let lbIndex = 0;
  let lbOpener: HTMLElement | null = null;

  function renderLightbox() {
    if (!lb || !lbImg || !lbItems.length) return;
    const item = lbItems[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    if (lbTitle) lbTitle.textContent = item.label;
    if (lbCap) {
      lbCap.textContent = item.caption;
      lbCap.hidden = !item.caption;
    }
    const multi = lbItems.length > 1;
    if (lbPrev) {
      lbPrev.hidden = !multi;
      lbPrev.disabled = lbIndex <= 0;
    }
    if (lbNext) {
      lbNext.hidden = !multi;
      lbNext.disabled = lbIndex >= lbItems.length - 1;
    }
    lbStage?.classList.remove('is-zoomed');
    if (lbZoom) lbZoom.textContent = '放大檢視';
    // 預載相鄰燈箱圖
    if (lbIndex + 1 < lbItems.length) preload(lbItems[lbIndex + 1].src);
    if (lbIndex - 1 >= 0) preload(lbItems[lbIndex - 1].src);
  }

  function openPrintLightbox(page: number, opener?: HTMLElement | null) {
    if (!lb) return;
    lbOpener = opener ?? (document.activeElement as HTMLElement | null);
    lbItems = [];
    for (let p = pStart; p <= pEnd; p++) {
      lbItems.push({
        src: pageSrc(p),
        alt: `紙本印刷版第 ${p} 頁`,
        caption: '',
        label: `紙本 p.${p} / p.${pStart}–${pEnd}`,
        page: p,
      });
    }
    lbIndex = Math.max(0, Math.min(lbItems.length - 1, page - pStart));
    renderLightbox();
    if (!lb.open) lb.showModal();
  }

  function openFigureLightbox(figEl: HTMLElement, clickedIdx: number, opener?: HTMLElement | null) {
    if (!lb) return;
    lbOpener = opener ?? (document.activeElement as HTMLElement | null);
    const imgs = Array.from(figEl.querySelectorAll<HTMLImageElement>('img'));
    const nextEl = figEl.nextElementSibling;
    const caption = nextEl?.classList.contains('cap') ? (nextEl.textContent ?? '').trim() : '';
    lbItems = imgs.map((im, idx) => ({
      src: im.currentSrc || im.src,
      alt: im.alt,
      caption,
      label: imgs.length > 1 ? `原刊配圖（${idx + 1} / ${imgs.length}）` : '原刊配圖',
    }));
    lbIndex = Math.max(0, Math.min(lbItems.length - 1, clickedIdx));
    renderLightbox();
    if (!lb.open) lb.showModal();
  }

  lbPrev?.addEventListener('click', () => {
    if (lbIndex > 0) {
      lbIndex--;
      renderLightbox();
    }
  });
  lbNext?.addEventListener('click', () => {
    if (lbIndex < lbItems.length - 1) {
      lbIndex++;
      renderLightbox();
    }
  });
  lbZoom?.addEventListener('click', () => {
    if (!lbStage) return;
    const zoomed = lbStage.classList.toggle('is-zoomed');
    lbZoom.textContent = zoomed ? '還原大小' : '放大檢視';
  });
  lbImg?.addEventListener('click', () => lbZoom?.click());
  lbClose?.addEventListener('click', () => lb?.close());
  lb?.addEventListener('click', (e) => {
    if (e.target === lb) lb.close();
  });
  lb?.addEventListener('close', () => lbOpener?.focus());

  // 鍵盤左右鍵切換（燈箱開啟時切燈箱，未開時桌機切右側紙本）
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (lb?.open) {
      if (e.key === 'ArrowLeft' && lbIndex > 0) { e.preventDefault(); lbIndex--; renderLightbox(); }
      else if (e.key === 'ArrowRight' && lbIndex < lbItems.length - 1) { e.preventDefault(); lbIndex++; renderLightbox(); }
      return;
    }
    if (!isDesktopPaneVisible()) return;
    if (e.key === 'ArrowLeft' && shownPage > pStart) {
      manualLock = true;
      lockedAtScrollPage = currentScrollPage;
      setPrintPage(shownPage - 1, { animate: true, announce: true });
    } else if (e.key === 'ArrowRight' && shownPage < pEnd) {
      manualLock = true;
      lockedAtScrollPage = currentScrollPage;
      setPrintPage(shownPage + 1, { animate: true, announce: true });
    }
  });

  // 事件委派：點擊印刷頁放大、點擊向量圖表對照鈕、點擊手機/頁首看紙本、點擊原圖放大
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const zoomTrigger = target.closest<HTMLElement>('[data-print-zoom], [data-print-sheet]');
    if (zoomTrigger) {
      openPrintLightbox(shownPage, zoomTrigger);
      return;
    }

    const openPrintBtn = target.closest<HTMLElement>('[data-open-print]');
    if (openPrintBtn) {
      const p = Number(openPrintBtn.dataset.openPrint) || currentScrollPage;
      openPrintLightbox(p, openPrintBtn);
      return;
    }

    const jumpBtn = target.closest<HTMLElement>('[data-jump-page]');
    if (jumpBtn) {
      const p = Number(jumpBtn.dataset.jumpPage);
      if (!p) return;
      if (isDesktopPaneVisible()) {
        manualLock = true;
        lockedAtScrollPage = currentScrollPage;
        setPrintPage(p, { animate: true, pulse: true, announce: true });
      } else {
        openPrintLightbox(p, jumpBtn);
      }
      return;
    }

    const figImgBtn = target.closest<HTMLElement>('[data-fig-zoom]');
    if (figImgBtn) {
      const figEl = figImgBtn.closest<HTMLElement>('.orig-fig');
      if (figEl) {
        openFigureLightbox(figEl, Number(figImgBtn.dataset.figZoom) || 0, figImgBtn);
      }
    }
  });
}
