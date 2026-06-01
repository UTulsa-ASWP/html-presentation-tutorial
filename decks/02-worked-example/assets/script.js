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
  slideElements.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot';
    dot.dataset.idx = i;
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);
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
