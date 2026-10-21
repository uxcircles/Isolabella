(() => {
  const doc = document.documentElement;
  doc.classList.replace('no-js', 'js');

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const mobile = window.matchMedia('(max-width: 960px)');

  /* ---------- Header: hairline once scrolled, and where the mobile sheet starts ---------- */
  const header = $('[data-header]');
  const mobileBar = $('[data-mobile-bar]');
  const setHeaderVars = () => doc.style.setProperty('--nav-top', `${header.getBoundingClientRect().bottom}px`);
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    // phone booking bar appears once the hero's own buttons have scrolled away
    if (mobileBar) mobileBar.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.6);
    setHeaderVars();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHeaderVars);
  onScroll();

  /* ---------- Mobile nav ---------- */
  const burger = $('[data-burger]');
  const nav = $('[data-nav]');
  const setNav = (open) => {
    setHeaderVars();
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  mobile.addEventListener('change', () => setNav(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); burger.focus(); }
  });

  /* ---------- Opening hours: today's row and "open now", on London time ---------- */
  const hours = $('[data-hours]');
  if (hours) {
    const rows = $$('tr[data-day]', hours).map((tr) => ({
      tr,
      day: Number(tr.dataset.day),
      open: tr.dataset.open,
      close: tr.dataset.close,
    }));
    const mins = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const london = () => {
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      }).formatToParts(new Date()).map((p) => [p.type, p.value]));
      return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday), now: Number(parts.hour) * 60 + Number(parts.minute) };
    };

    const update = () => {
      const { day, now } = london();
      rows.forEach((r) => r.tr.classList.toggle('is-today', r.day === day));
      const today = rows.find((r) => r.day === day);
      let text; let state = '';
      if (today && now < mins(today.open)) {
        text = `Opens today at ${today.open}`;
        if (mins(today.open) - now <= 60) state = 'is-soon';
      } else if (today && now < mins(today.close)) {
        const left = mins(today.close) - now;
        text = left <= 30 ? `Closing soon <small>· ${today.close}</small>` : `Open now <small>· until ${today.close}</small>`;
        state = left <= 30 ? 'is-soon' : 'is-open';
      } else {
        // find the next day with hours
        for (let i = 1; i <= 7; i++) {
          const next = rows.find((r) => r.day === (day + i) % 7);
          if (next) { text = `Closed <small>· opens ${i === 1 ? 'tomorrow' : DAYS[next.day]} at ${next.open}</small>`; break; }
        }
      }
      $$('[data-status]').forEach((el) => {
        el.innerHTML = text;
        el.classList.remove('is-open', 'is-soon');
        if (state) el.classList.add(state);
      });
    };
    update();
    setInterval(update, 60 * 1000);
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = $('[data-lightbox]');
  if (lightbox) {
    const shots = $$('[data-gallery] button');
    const img = $('[data-lb-img]', lightbox);
    const cap = $('[data-lb-cap]', lightbox);
    let current = 0;

    const show = (i) => {
      current = (i + shots.length) % shots.length;
      const thumb = $('img', shots[current]);
      img.src = shots[current].dataset.full;
      img.alt = thumb.alt;
      cap.textContent = `${thumb.alt} · ${current + 1} / ${shots.length}`;
    };

    shots.forEach((b, i) => b.addEventListener('click', () => {
      show(i);
      lightbox.showModal();
      document.body.classList.add('is-locked');
    }));
    lightbox.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      shots[current].focus();
    });
    $('[data-lb-close]', lightbox).addEventListener('click', () => lightbox.close());
    $('[data-lb-prev]', lightbox).addEventListener('click', () => show(current - 1));
    $('[data-lb-next]', lightbox).addEventListener('click', () => show(current + 1));
    // click on the dimmed backdrop closes
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Menu: scrollspy index ---------- */
  const sections = $$('.menu-section');
  const indexLinks = $$('[data-menu-index] a');
  if (sections.length && indexLinks.length) {
    let activeId = null;
    const setActive = (id) => {
      if (id === activeId) return;
      activeId = id;
      indexLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${id}`));
      // keep the active chip in view on the mobile strip
      const a = indexLinks.find((l) => l.hash === `#${id}`);
      if (a && mobile.matches) {
        const strip = a.closest('.index-scroll');
        strip.scrollTo({ left: a.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    // the active section is the last one whose top has passed a third of the way down the screen
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.33;
      const visible = sections.filter((s) => !s.hidden);
      const current = visible.filter((s) => s.getBoundingClientRect().top <= line).pop() || visible[0];
      if (current) setActive(current.id);
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Menu: find a dish ---------- */
  const search = $('[data-menu-search]');
  if (search) {
    const empty = $('[data-no-results]');
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '');
    const items = $$('.item').map((el) => ({ el, text: norm(el.textContent) }));
    const parts = $$('.menu-part');

    search.addEventListener('input', () => {
      const q = norm(search.value.trim());
      items.forEach(({ el, text }) => { el.hidden = q !== '' && !text.includes(q); });
      let shown = 0;
      sections.forEach((s) => {
        const any = $$('.item:not([hidden])', s).length > 0;
        s.hidden = !any;
        if (any) shown++;
      });
      parts.forEach((p) => { p.hidden = $$('.menu-section:not([hidden])', p).length === 0; });
      empty.hidden = shown > 0;
    });
  }

  /* ---------- Map (MapLibre, loaded on demand) ---------- */
  const mapEl = $('[data-map]');
  if (mapEl) {
    const lib = mapEl.dataset.lib;
    const addScript = (src) => new Promise((resolve, reject) => {
      const js = document.createElement('script');
      js.src = src;
      js.onload = resolve;
      js.onerror = reject;
      document.head.append(js);
    });
    const start = () => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${lib}maplibre-gl.css`;
      document.head.append(css);
      return addScript(`${lib}maplibre-gl.js`)
        .then(() => addScript(mapEl.dataset.src))
        .then(() => { window.isolabellaMap(mapEl); mapEl.classList.add('is-ready'); })
        // no WebGL or blocked scripts: keep the address panel and its Directions button
        .catch(() => mapEl.classList.add('is-failed'));
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((en) => en.isIntersecting)) { io.disconnect(); start(); }
      }, { rootMargin: '400px 0px' });
      io.observe(mapEl);
    } else {
      start();
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Footer year ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
