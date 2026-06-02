/* ============================================================================
   STARTER SCRIPT — presentation navigation engine
   ----------------------------------------------------------------------------
   This is the whole interaction layer for a vanilla scroll-snap deck. It is
   topic-agnostic: it makes NO assumptions about slide content, only about a
   small set of element IDs/classes (the "contract" — see starter/README.md).

   What it gives you:
     - Arrow / PageUp-Down / Space / Home / End keyboard navigation
     - A progress bar, clickable dot indicators, and a "N / total" counter
     - A speaker-notes side panel toggled with the S key (Esc closes it)
     - Input-focus detection so typing in a field/slider doesn't change slides

   To ADD interactivity to a slide (a chart, a button, a toggle), write your own
   functions below the INITIALIZATION block and call them from the
   DOMContentLoaded handler. The navigation code below should not need changes.
   ========================================================================== */

/* ==== PRESENTATION NAVIGATION ============================================== */
let currentSlide = 0;
let slideElements = [];

function initSlides() {
  slideElements = Array.from(document.querySelectorAll('section.slide'));

  const dots = document.getElementById('slideDots');
  dots.innerHTML = '';
  slideElements.forEach((slide, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot';
    dot.dataset.idx = i;
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);

    // Auto-number the per-slide ".slide-number" badge from its position, so
    // inserting or reordering slides never leaves a hardcoded number stale.
    // Slides without the badge (e.g. title / closing slides) are simply skipped.
    const label = slide.querySelector('.slide-number');
    if (label) label.textContent = String(i + 1).padStart(2, '0');
  });

  updateSlideChrome();
}

function goToSlide(n) {
  currentSlide = Math.max(0, Math.min(slideElements.length - 1, n));
  slideElements[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateSlideChrome();
}

function updateSlideChrome() {
  // Pick the slide whose center is nearest the viewport center.
  const viewportCenter = window.scrollY + window.innerHeight / 2;
  let bestIdx = 0;
  let bestDist = Infinity;
  slideElements.forEach((el, i) => {
    const elCenter = el.offsetTop + el.offsetHeight / 2;
    const dist = Math.abs(viewportCenter - elCenter);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  });
  currentSlide = bestIdx;

  document.querySelectorAll('.slide-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });

  document.getElementById('slideCounter').textContent =
    `${currentSlide + 1} / ${slideElements.length}`;

  const pct = slideElements.length > 1
    ? (currentSlide / (slideElements.length - 1)) * 100
    : 0;
  document.getElementById('progressBar').style.width = pct + '%';

  if (document.getElementById('speakerNotesPanel').classList.contains('visible')) {
    populateSpeakerNotes();
  }

  updateSpeakerView();
}

function populateSpeakerNotes() {
  const slide = slideElements[currentSlide];
  const notes = slide.querySelector('.speaker-notes');
  const container = document.getElementById('speakerNotesContent');
  if (notes) {
    container.innerHTML = notes.innerHTML;
  } else {
    container.innerHTML = '<p><em>No speaker notes for this slide.</em></p>';
  }
}

function toggleSpeakerNotes() {
  const panel = document.getElementById('speakerNotesPanel');
  panel.classList.toggle('visible');
  if (panel.classList.contains('visible')) {
    populateSpeakerNotes();
  }
}

/* ==== FULLSCREEN =========================================================== */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    (document.documentElement.requestFullscreen?.() || Promise.resolve()).catch(() => {});
  } else {
    document.exitFullscreen?.();
  }
}

/* ==== SPEAKER VIEW ========================================================== *
 * Opens a second window with the current slide's notes, a preview of the next
 * slide, a running timer, and prev/next controls. Kept in sync by holding a
 * direct JS handle to the window and writing its DOM in memory — this works
 * from file:// (no localStorage / BroadcastChannel, which are unreliable when
 * the origin is null). The speaker window calls back via window.opener.
 * ========================================================================== */
let speakerWin = null;
let speakerTimerStart = null;

function openSpeakerView() {
  // If already open, just focus it.
  if (speakerWin && !speakerWin.closed) {
    speakerWin.focus();
    return;
  }
  speakerWin = window.open('', 'speakerView', 'width=720,height=800');
  if (!speakerWin) return; // popup blocked
  speakerTimerStart = speakerTimerStart || Date.now();

  const doc = speakerWin.document;
  doc.open();
  doc.write([
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Speaker View</title>',
    '<style>',
    '*{box-sizing:border-box;margin:0;padding:0}',
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;',
    'background:#0f1419;color:#fafaf7;padding:24px;min-height:100vh}',
    '.bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}',
    '.counter{font-family:monospace;font-size:1.1rem;color:#d4a017}',
    '.timer{font-family:monospace;font-size:1.6rem;color:#fafaf7}',
    '.btns button{font:inherit;background:#1d3557;color:#fafaf7;border:none;border-radius:6px;',
    'padding:8px 14px;margin-left:8px;cursor:pointer;font-size:0.95rem}',
    '.btns button:hover{background:#2c5282}',
    '.label{font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#b8860b;margin:18px 0 8px}',
    '.notes{font-family:Georgia,serif;font-size:1.25rem;line-height:1.55;background:#fff;color:#1a1a2e;',
    'border-radius:10px;padding:24px 28px;min-height:200px}',
    '.notes h2{font-size:1.4rem;color:#1d3557;margin-bottom:12px}',
    '.notes p{margin-bottom:0.8em}',
    '.next{font-size:1.05rem;line-height:1.4;color:#c9c4b8;background:#1a2230;border-radius:8px;padding:16px 20px}',
    '.next strong{color:#fafaf7}',
    '</style></head><body>',
    '<div class="bar">',
    '<span class="counter" id="svCounter"></span>',
    '<span class="timer" id="svTimer">00:00</span>',
    '<span class="btns"><button id="svPrev">&larr; Prev</button>',
    '<button id="svReset">Reset timer</button>',
    '<button id="svNext">Next &rarr;</button></span>',
    '</div>',
    '<div class="label">Speaker notes (mostly LLM generated)</div>',
    '<div class="notes" id="svNotes"></div>',
    '<div class="label">Next slide</div>',
    '<div class="next" id="svNext2"></div>',
    '</body></html>'
  ].join(''));
  doc.close();

  // Wire controls back to this (presenter) window.
  const w = speakerWin;
  w.document.getElementById('svPrev').onclick = () => goToSlide(currentSlide - 1);
  w.document.getElementById('svNext').onclick = () => goToSlide(currentSlide + 1);
  w.document.getElementById('svReset').onclick = () => { speakerTimerStart = Date.now(); };

  // Let arrow / PageUp-Down / Space / Home / End in the SPEAKER window drive the
  // main deck too, so you can present from either window.
  w.document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight' || ev.key === 'PageDown' || ev.key === 'ArrowDown' || ev.key === ' ') {
      ev.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      goToSlide(currentSlide - 1);
    } else if (ev.key === 'Home') {
      ev.preventDefault();
      goToSlide(0);
    } else if (ev.key === 'End') {
      ev.preventDefault();
      goToSlide(slideElements.length - 1);
    }
  });

  // Drive the timer from the presenter side so it survives even if the speaker
  // window loses focus.
  if (!openSpeakerView._timer) {
    openSpeakerView._timer = setInterval(() => {
      if (!speakerWin || speakerWin.closed) return;
      const el = speakerWin.document.getElementById('svTimer');
      if (!el || !speakerTimerStart) return;
      const s = Math.floor((Date.now() - speakerTimerStart) / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      el.textContent = `${mm}:${ss}`;
    }, 250);
  }

  updateSpeakerView();
}

function updateSpeakerView() {
  if (!speakerWin || speakerWin.closed) return;
  const d = speakerWin.document;
  const counter = d.getElementById('svCounter');
  const notesEl = d.getElementById('svNotes');
  const nextEl = d.getElementById('svNext2');
  if (!counter || !notesEl || !nextEl) return;

  counter.textContent = `Slide ${currentSlide + 1} / ${slideElements.length}`;

  const notes = slideElements[currentSlide]?.querySelector('.speaker-notes');
  notesEl.innerHTML = notes ? notes.innerHTML : '<p><em>No speaker notes for this slide.</em></p>';

  const next = slideElements[currentSlide + 1];
  if (next) {
    const title = next.querySelector('.slide-title, h1');
    nextEl.innerHTML = '<strong>' + (title ? title.textContent.trim() : 'Next slide') + '</strong>';
  } else {
    nextEl.innerHTML = '<em>End of deck</em>';
  }
}

/* ==== KEYBOARD NAVIGATION ================================================== */
document.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  const activeTag = active ? active.tagName : '';
  const isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || active?.isContentEditable;

  // Let arrow keys do their normal thing inside inputs/sliders.
  if (isInput && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                  e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'ArrowDown') {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToSlide(currentSlide - 1);
  } else if (e.key === ' ' && !isInput) {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(slideElements.length - 1);
  } else if ((e.key === 's' || e.key === 'S') && !isInput) {
    e.preventDefault();
    toggleSpeakerNotes();
  } else if ((e.key === 'f' || e.key === 'F') && !isInput) {
    e.preventDefault();
    toggleFullscreen();
  } else if ((e.key === 'p' || e.key === 'P') && !isInput) {
    e.preventDefault();
    openSpeakerView();
  } else if (e.key === 'Escape') {
    const panel = document.getElementById('speakerNotesPanel');
    if (panel.classList.contains('visible')) {
      panel.classList.remove('visible');
    }
  }
});

/* ==== INITIALIZATION ======================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initSlides();

  // Recompute chrome while scrolling (debounced).
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateSlideChrome, 100);
  });

  // --- Add calls to your own slide-interactivity functions here ---
  // e.g. drawMyChart();  setupMyToggle();
});
