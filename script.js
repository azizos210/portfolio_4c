/* ============================================================
   AZIZ MHAMDI — PORTFOLIO INTERACTIONS
   ============================================================ */

(() => {

  /* ---------- mobile menu ---------- */
  const menuBtn   = document.getElementById('menuBtn');
  const menu      = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  if (menuBtn && menu && menuClose) {
    menuBtn.addEventListener('click', () => menu.classList.add('open'));
    menuClose.addEventListener('click', () => menu.classList.remove('open'));

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  /* ---------- smooth scroll + close mobile menu on click ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll('.dnav a');
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && navLinks.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('on'));
          const link = document.querySelector('.dnav a[href="#' + en.target.id + '"]');
          if (link) link.classList.add('on');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(s => obs.observe(s));
  }

  /* ---------- expertise tabs filter ---------- */
  const tabs = document.getElementById('tabs');
  const grid = document.getElementById('skillGrid');

  if (tabs && grid) {
    const cards = grid.querySelectorAll('.sk');

    tabs.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;

      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      cards.forEach(c => {
        const cat = (c.dataset.cat || '').split(/\s+/);
        const show = (filter === 'all') || cat.includes(filter);
        if (show) {
          c.classList.remove('hide');
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        } else {
          c.classList.add('hide');
        }
      });

      /* Ensure the "feat" card is always visible regardless of filter */
      const feat = grid.querySelector('.sk.feat');
      if (feat) {
        feat.classList.remove('hide');
        feat.style.opacity = '1';
        feat.style.transform = 'translateY(0)';
      }
    });
  }

  /* ---------- project rail carousel ---------- */
  const rail = document.getElementById('rail');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsBox = document.getElementById('dots');

  if (rail && prev && next && dotsBox) {
    const cards = Array.from(rail.querySelectorAll('.pc'));

    /* create dots */
    cards.forEach((_, i) => {
      const d = document.createElement('i');
      d.dataset.idx = i;
      d.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(d);
    });

    function currentIndex() {
      const w = cards[0].getBoundingClientRect().width + 16;
      return Math.round(rail.scrollLeft / w);
    }

    function sync() {
      const i = currentIndex();
      dotsBox.querySelectorAll('i').forEach((d, idx) => {
        d.classList.toggle('on', idx === i);
      });
    }

    function goTo(i) {
      const w = cards[0].getBoundingClientRect().width + 16;
      const max = cards.length - 1;
      const target = Math.max(0, Math.min(i, max));
      rail.scrollTo({ left: target * w, behavior: 'smooth' });
    }

    prev.addEventListener('click', () => goTo(currentIndex() - 1));
    next.addEventListener('click', () => goTo(currentIndex() + 1));
    rail.addEventListener('scroll', () => {
      clearTimeout(rail._t);
      rail._t = setTimeout(sync, 60);
    });

    sync();
  }

  /* ---------- simple reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          reveal.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('section, .pc, .sk, .sc, .wc').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .7s ease, transform .7s ease';
      reveal.observe(el);
    });
  }

})();
