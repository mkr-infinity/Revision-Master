/* ============================================================
   Revision Master — Website Script
   Theme toggle, GitHub stars, slider, scroll animations
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────── */
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'rm-website-theme';

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  applyTheme(getPreferred());

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── Nav scroll state ──────────────────────────────────── */
  const nav = document.getElementById('site-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 20);
    lastScroll = y;
  }, { passive: true });

  /* ── Mobile nav toggle ─────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (hamburger && mobileMenu) {
    const closeMenu = () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.classList.remove('closing');
      mobileMenu.setAttribute('aria-hidden', 'true');
    };

    hamburger.addEventListener('click', () => {
      const open = hamburger.getAttribute('aria-expanded') === 'true';
      if (open) {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('closing');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => mobileMenu.classList.remove('closing'), 220);
      } else {
        mobileMenu.classList.remove('closing');
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ── GitHub Stars ──────────────────────────────────────── */
  const REPO = 'mkr-infinity/Revision-Master';
  const STARS_KEY = 'rm-gh-stars';
  const STARS_TS_KEY = 'rm-gh-stars-ts';
  const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

  function displayStars(count) {
    const el = document.getElementById('stars-count');
    if (!el) return;
    if (count === null) { el.textContent = 'Star'; return; }
    el.textContent = count >= 1000
      ? (count / 1000).toFixed(1) + 'k'
      : String(count);
  }

  async function fetchStars() {
    // Check cache first
    const cached = localStorage.getItem(STARS_KEY);
    const ts = parseInt(localStorage.getItem(STARS_TS_KEY) || '0', 10);
    if (cached && Date.now() - ts < CACHE_TTL) {
      displayStars(parseInt(cached, 10));
      return;
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (!res.ok) throw new Error('GitHub API ' + res.status);
      const data = await res.json();
      const stars = data.stargazers_count;
      localStorage.setItem(STARS_KEY, String(stars));
      localStorage.setItem(STARS_TS_KEY, String(Date.now()));
      displayStars(stars);
    } catch {
      if (cached) displayStars(parseInt(cached, 10));
      else displayStars(null);
    }
  }

  fetchStars();

  /* ── Screenshots Slider ────────────────────────────────── */
  const track = document.getElementById('screenshots-track');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (track && dotsContainer) {
    const items = Array.from(track.querySelectorAll('.screenshot-item'));
    let current = 0;
    let autoTimer = null;
    let isDragging = false;
    let dragStart = 0;
    let dragOffset = 0;

    // Create dots
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Screenshot ${i + 1}`);
      dot.setAttribute('aria-selected', String(i === 0));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function getItemWidth() {
      const item = items[0];
      if (!item) return 284;
      const style = window.getComputedStyle(track);
      const gap = parseInt(style.gap || '24', 10);
      return item.offsetWidth + gap;
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, items.length - 1));
      // Center the active item
      const itemW = getItemWidth();
      const trackWidth = track.parentElement.offsetWidth;
      const offset = current * itemW - (trackWidth / 2 - items[0].offsetWidth / 2);
      track.style.transform = `translateX(${-Math.max(0, offset)}px)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', String(i === current));
      });
    }

    function goNext() { goTo((current + 1) % items.length); }
    function goPrev() { goTo((current - 1 + items.length) % items.length); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(goNext, 4000);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goPrev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goNext(); startAuto(); });

    // Touch/mouse swipe
    function onStart(clientX) {
      isDragging = true;
      dragStart = clientX;
      dragOffset = 0;
      stopAuto();
    }
    function onMove(clientX) {
      if (!isDragging) return;
      dragOffset = clientX - dragStart;
    }
    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      if (dragOffset < -50) goNext();
      else if (dragOffset > 50) goPrev();
      startAuto();
    }

    track.addEventListener('mousedown', e => onStart(e.clientX));
    window.addEventListener('mousemove', e => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);
    track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', onEnd);

    // Keyboard
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { stopAuto(); goPrev(); startAuto(); }
      if (e.key === 'ArrowRight') { stopAuto(); goNext(); startAuto(); }
    });

    goTo(0);
    startAuto();

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);

    window.addEventListener('resize', () => goTo(current));
  }

  /* ── Scroll Reveal ─────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            // Stagger items in the same container
            const siblings = Array.from(
              entry.target.parentElement.querySelectorAll('[data-reveal]')
            );
            const delay = siblings.indexOf(entry.target) * 80;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  } else {
    // Fallback: reveal all immediately
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
  }

  /* ── Smooth anchor scroll with nav offset ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(html).getPropertyValue('--nav-h') || '72', 10);
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Download button version detection ─────────────────── */
  async function updateDownloadLink() {
    try {
      const res = await fetch('https://api.github.com/repos/' + REPO + '/releases/latest', {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (!res.ok) return;
      const data = await res.json();
      const btn = document.getElementById('download-btn');
      if (!btn) return;
      const apk = (data.assets || [])
        .filter(a => typeof a.name === 'string' && a.name.toLowerCase().endsWith('.apk'))
        .sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')))[0];
      btn.href = apk?.browser_download_url || data.html_url || 'https://github.com/' + REPO + '/releases/latest';
    } catch {
      const btn = document.getElementById('download-btn');
      if (btn) btn.href = 'https://github.com/' + REPO + '/releases/latest';
    }
  }

  updateDownloadLink();

})();
