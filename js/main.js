// Hyperobox — site interactions (vanilla JS, no dependencies)

(function () {
  'use strict';

  const doc = document.documentElement;
  doc.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollEffects();
    initReveal();
    initCounters();
    initCardGlow();
    initFAQ();
    initCalFallback();
    initHeroCanvas();

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  });

  // Mobile menu + active section highlighting
  function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('open'));
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });

    const links = Array.from(menu.querySelectorAll('.nav-link'));
    const sections = links
      .map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);
    if (!('IntersectionObserver' in window)) return;
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Header background, progress bar, back-to-top
  function initScrollEffects() {
    const header = document.querySelector('.site-header');
    const progress = document.querySelector('.scroll-progress');
    const toTop = document.getElementById('to-top');
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('scrolled', y > 20);
      if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      if (toTop) toTop.classList.toggle('show', y > 600);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  // Fade/slide elements in as they enter the viewport
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) {
      // Stagger siblings slightly
      const siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [];
      const index = Array.prototype.indexOf.call(siblings, el);
      if (index > 0) el.style.transitionDelay = Math.min(index * 80, 400) + 'ms';
      io.observe(el);
    });
  }

  // Count-up animation for stats (final text is already in the HTML for SEO/no-JS)
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });

    function animate(el) {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function frame(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  }

  // Cursor-following border glow on service cards
  function initCardGlow() {
    if (reduceMotion) return;
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Keep only one FAQ open at a time
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) { if (other !== item) other.open = false; });
      });
    });
  }

  // Booking links point at cal.com so they work without JS; once the Cal embed
  // has loaded, open the popup instead of navigating away.
  function initCalFallback() {
    let calReady = false;
    const script = document.querySelector('script[src*="cal.com/embed"]');
    if (script) script.addEventListener('load', function () { calReady = true; });
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[data-cal-link]');
      if (link && calReady) e.preventDefault();
    }, true);
  }

  // Animated particle network behind the hero
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, points = [], running = true, raf = 0;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.round((w * h) / 16000));
      points = Array.from({ length: count }, function () {
        return {
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        };
      });
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const max = 130;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 140) { p.x += mdx / md; p.y += mdy / md; }

        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < max) {
            ctx.strokeStyle = 'rgba(150, 135, 255,' + (1 - d / max) * 0.22 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = i % 3 === 0 ? 'rgba(100, 85, 208, .85)' : 'rgba(179, 168, 255, .8)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (running) raf = requestAnimationFrame(step);
    }

    resize();
    step();

    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
    canvas.parentElement.addEventListener('pointermove', function (e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });

    // Pause when the hero is off-screen or the tab is hidden (saves battery)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        const visible = entries[0].isIntersecting && !document.hidden;
        if (visible && !running) { running = true; raf = requestAnimationFrame(step); }
        if (!visible) { running = false; cancelAnimationFrame(raf); }
      }).observe(canvas);
    }
  }
})();
