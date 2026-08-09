/* TKA Coding Team — shared interactions + motion */

const REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- mobile nav toggle ---------- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }
})();

/* ---------- scroll reveal (with stagger) ---------- */
(function () {
  const els = document.querySelectorAll('.fi');
  if (!els.length) return;
  // stagger siblings within the same parent
  const seen = new Map();
  els.forEach(el => {
    const p = el.parentElement;
    const i = seen.get(p) || 0;
    seen.set(p, i + 1);
    el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
  });
  if (!('IntersectionObserver' in window) || REDUCE) {
    els.forEach(e => e.classList.add('v'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ---------- animated bars ---------- */
(function () {
  const bars = document.querySelectorAll('.bar-fill[data-w]');
  if (!bars.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.getAttribute('data-w');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();

/* ---------- 3D tilt on cards ---------- */
(function () {
  if (REDUCE) return;
  const sel = '.card, .board-card, .mcard, .info-tile, .do-item, .hstat, .qcard';
  document.querySelectorAll(sel).forEach((el) => {
    el.classList.add('tilt');
    const MAX = 7;
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) translateY(-6px) scale(1.02)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    el.addEventListener('pointercancel', () => { el.style.transform = ''; });
  });
})();

/* ---------- hero parallax orbs ---------- */
(function () {
  if (REDUCE) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    hero.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--px', 0);
    hero.style.setProperty('--py', 0);
  });
})();

/* ---------- carousel (used only where present) ---------- */
(function () {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.carousel-track');
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const dotsWrap = root.querySelector('.carousel-dots');
    if (!track || !slides.length) return;
    let index = 0, timer = null;
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', () => { go(i); reset(); });
      dotsWrap && dotsWrap.appendChild(b);
    });
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function reset() { if (timer) clearInterval(timer); timer = setInterval(next, 5500); }
    root.querySelector('.carousel-btn.next')?.addEventListener('click', () => { next(); reset(); });
    root.querySelector('.carousel-btn.prev')?.addEventListener('click', () => { prev(); reset(); });
    root.addEventListener('mouseenter', () => timer && clearInterval(timer));
    root.addEventListener('mouseleave', reset);
    reset();
  });
})();

/* ---------- active nav link ---------- */
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();
