/* ============================================================
   AZIZ MHAMDI — PORTFOLIO INTERACTIONS
   ============================================================ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- preloader ---------- */
  const loader = $('#loader');
  const bar = $('#loaderBar');
  const count = $('#loaderCount');
  const finish = () => {
    loader.classList.add('done');
    document.body.classList.remove('loading');
    document.body.classList.add('is-ready');
    setTimeout(() => $$('.hero [data-split]').forEach(el => el.classList.add('is-in')), 250);
  };

  if (reduce) {
    finish();
  } else {
    let n = 0;
    const tick = () => {
      n += Math.max(1, Math.round((100 - n) * 0.08));
      if (n > 100) n = 100;
      bar.style.transform = `scaleX(${n / 100})`;
      count.textContent = String(n).padStart(3, '0');
      if (n < 100) setTimeout(tick, 28);
      else setTimeout(finish, 350);
    };
    tick();
  }

  /* ---------- custom cursor ---------- */
  if (fine && !reduce) {
    const ring = $('#cursor');
    const dot = $('#cursorDot');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
    $$('.project').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('view'));
      el.addEventListener('mouseleave', () => ring.classList.remove('view'));
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- header + progress on scroll ---------- */
  const header = $('#header');
  const progress = $('#progress');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('scrolled', y > 40);
    header.classList.toggle('hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    litWords();
    parallax();
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    $('#mobileMenu').setAttribute('aria-hidden', String(!open));
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    $('#mobileMenu').setAttribute('aria-hidden', 'true');
  }));

  /* ---------- active nav ---------- */
  const navLinks = $$('.nav a');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => navObs.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal], [data-split]:not(.hero [data-split])').forEach(el => revealObs.observe(el));

  /* ---------- about statement: word lighting ---------- */
  const statement = $('#statement');
  let words = [];
  if (statement) {
    const walk = node => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else {
              const s = document.createElement('span');
              s.className = 'w';
              s.textContent = part;
              frag.appendChild(s);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(statement);
    words = $$('.w', statement);
  }
  function litWords() {
    if (!words.length) return;
    const r = statement.getBoundingClientRect();
    const start = innerHeight * 0.85;
    const end = innerHeight * 0.3;
    const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
    const lit = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', reduce || i < lit));
  }

  /* ---------- hero parallax ---------- */
  const arch = $('.arch img');
  const heroTitle = $('.hero-title');
  function parallax() {
    if (reduce) return;
    const y = scrollY;
    if (y > innerHeight * 1.2) return;
    if (arch) arch.style.translate = `0 ${y * -0.08}px`;
    if (heroTitle) heroTitle.style.translate = `0 ${y * 0.18}px`;
  }

  /* ---------- project hover preview ---------- */
  const preview = $('#preview');
  const previewInner = $('#previewInner');
  if (preview && fine) {
    let px = 0, py = 0, cx = 0, cy = 0, active = false;
    const projects = $$('.project');
    projects.forEach((p, i) => {
      p.addEventListener('mouseenter', () => {
        active = true;
        preview.classList.add('show');
        previewInner.style.transform = `translateY(${-i * 100}%)`;
      });
      p.addEventListener('mouseleave', () => {
        active = false;
        preview.classList.remove('show');
      });
    });
    addEventListener('mousemove', e => { px = e.clientX; py = e.clientY; });
    const follow = () => {
      cx += (px - cx) * 0.12; cy += (py - cy) * 0.12;
      if (active || preview.classList.contains('show')) {
        preview.style.left = cx + 'px';
        preview.style.top = cy + 'px';
      }
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ---------- skills filter ---------- */
  const tabs = $('#tabs');
  if (tabs) {
    tabs.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      $$('button', tabs).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.filter;
      $$('.skill').forEach(c => c.classList.toggle('dim', f !== 'all' && c.dataset.cat !== f));
    });
  }

  /* ---------- skill card spotlight + tilt ---------- */
  if (fine && !reduce) {
    $$('.skill').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        if (!card.classList.contains('dim')) {
          const rx = ((y / r.height) - 0.5) * -6;
          const ry = ((x / r.width) - 0.5) * 6;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- counters ---------- */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.count;
      const dur = reduce ? 0 : 1600;
      const t0 = performance.now();
      const step = t => {
        const p = dur ? Math.min(1, (t - t0) / dur) : 1;
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => counterObs.observe(el));

  /* ---------- year ---------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  onScroll();
})();
