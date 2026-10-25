/* ICE Card — shared behaviour: theme, storage, sound, navigation,
 * page transitions, scroll reveal, language, toasts, confetti.
 * No network calls. No user data leaves the page.
 */
(function (global) {
  'use strict';

  var PREFIX = 'ice.';
  var mem = Object.create(null);
  var lsOK = true;

  try {
    var probe = '__ice_probe__';
    global.localStorage.setItem(probe, '1');
    global.localStorage.removeItem(probe);
  } catch (err) {
    lsOK = false;
  }

  function parse(raw, fallback) {
    if (raw == null) return fallback;
    try { return JSON.parse(raw); } catch (e) { return raw; }
  }

  var Store = {
    available: lsOK,
    get: function (key, fallback) {
      if (lsOK) {
        try {
          var raw = global.localStorage.getItem(PREFIX + key);
          if (raw != null) return parse(raw, fallback);
        } catch (e) { /* fall through to memory */ }
      }
      return key in mem ? mem[key] : (fallback === undefined ? null : fallback);
    },
    set: function (key, value) {
      mem[key] = value;
      if (lsOK) {
        try { global.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* quota or private mode */ }
      }
      return value;
    },
    remove: function (key) {
      delete mem[key];
      if (lsOK) {
        try { global.localStorage.removeItem(PREFIX + key); } catch (e) { /* ignore */ }
      }
    },
    clearAll: function () {
      Object.keys(mem).forEach(function (k) { delete mem[k]; });
      if (lsOK) {
        try {
          var doomed = [];
          for (var i = 0; i < global.localStorage.length; i++) {
            var k = global.localStorage.key(i);
            if (k && k.indexOf(PREFIX) === 0) doomed.push(k);
          }
          doomed.forEach(function (k) { global.localStorage.removeItem(k); });
        } catch (e) { /* ignore */ }
      }
    }
  };

  /* ---------------- Sound (Web Audio, no files) ---------------- */
  var Sound = {
    ctx: null,
    muted: !!Store.get('muted', false),
    unlocked: false,
    ensure: function () {
      if (!this.ctx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return null;
        try { this.ctx = new AC(); } catch (e) { return null; }
      }
      if (this.ctx.state === 'suspended') {
        try { this.ctx.resume(); } catch (e) { /* ignore */ }
      }
      return this.ctx;
    },
    tone: function (freq, when, dur, type, peak) {
      var ctx = this.ctx;
      if (!ctx) return;
      var t0 = ctx.currentTime + when;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(peak || 0.05, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    },
    play: function (kind) {
      if (this.muted) return;
      if (!this.ensure()) return;
      this.unlocked = true;
      if (kind === 'click') {
        this.tone(560, 0, 0.06, 'triangle', 0.035);
      } else if (kind === 'step') {
        this.tone(659.25, 0, 0.14, 'sine', 0.045);
        this.tone(987.77, 0.09, 0.2, 'sine', 0.035);
      } else if (kind === 'success') {
        this.tone(523.25, 0, 0.18, 'sine', 0.05);
        this.tone(659.25, 0.1, 0.18, 'sine', 0.045);
        this.tone(783.99, 0.2, 0.34, 'sine', 0.05);
      } else if (kind === 'soft') {
        this.tone(392, 0, 0.1, 'sine', 0.028);
      }
    },
    setMuted: function (muted) {
      this.muted = !!muted;
      Store.set('muted', this.muted);
      syncSoundButtons();
      return this.muted;
    },
    toggle: function () {
      var next = this.setMuted(!this.muted);
      if (!next) { this.play('click'); }
      return next;
    }
  };

  /* ---------------- Theme ---------------- */
  function currentTheme() {
    return document.documentElement.getAttribute('data-ui-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-ui-theme', next);
    if (persist !== false) Store.set('theme', next);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0a1524' : '#f7f3ea');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', t('a11y.theme'));
    });
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    Sound.play('click');
  }

  /* ---------------- Language ---------------- */
  function applyStrings(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var n = el.getAttribute('data-i18n-n');
      if (key) el.textContent = t(key, n != null ? { n: n } : undefined);
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key);
    });
  }

  function setLang(code, opts) {
    var chosen = global.ICE_I18N.set(code);
    var dir = global.ICE_I18N.dir();
    document.documentElement.setAttribute('lang', chosen);
    document.documentElement.setAttribute('dir', dir);
    if (!opts || opts.persist !== false) Store.set('lang', chosen);
    applyStrings(document);
    document.querySelectorAll('[data-lang-select]').forEach(function (sel) { sel.value = chosen; });
    document.dispatchEvent(new CustomEvent('ice:lang', { detail: { lang: chosen, dir: dir } }));
    return chosen;
  }

  /* ---------------- Toasts ---------------- */
  var toastEl = null;
  var toastTimer = null;
  function toast(message) {
    if (!message) return;
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span></span>';
      document.body.appendChild(toastEl);
    }
    toastEl.querySelector('span').textContent = message;
    toastEl.setAttribute('data-show', 'true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.setAttribute('data-show', 'false'); }, 3400);
  }

  /* ---------------- Confetti ---------------- */
  function confetti() {
    if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('confetti');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
    }
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = global.innerWidth;
    var h = global.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var colors = ['#c62828', '#0b6e68', '#e8b23a', '#0e1b2e', '#f7f3ea'];
    var parts = [];
    var count = Math.min(140, Math.round(w / 9));
    for (var i = 0; i < count; i++) {
      parts.push({
        x: w / 2 + (Math.random() - 0.5) * 140,
        y: h * 0.36 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 9,
        vy: -Math.random() * 9 - 2,
        g: 0.22 + Math.random() * 0.12,
        w: 5 + Math.random() * 7,
        h: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[(Math.random() * colors.length) | 0],
        life: 1
      });
    }
    var start = performance.now();
    var duration = 1700;
    function frame(now) {
      var elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vy += p.g;
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life = Math.max(0, 1 - elapsed / duration);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
        canvas.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Navigation ---------------- */
  var menuBtn = null;
  var nav = null;

  function closeMenu() {
    if (!menuBtn || !nav) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    if (!menuBtn || !nav) return;
    nav.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function initNav() {
    menuBtn = document.getElementById('menuBtn');
    nav = document.getElementById('siteNav');
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (nav.classList.contains('is-open')) closeMenu(); else openMenu();
        Sound.play('soft');
      });
      document.addEventListener('click', function (e) {
        if (!nav.classList.contains('is-open')) return;
        if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
        closeMenu();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          closeMenu();
          menuBtn.focus();
        }
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMenu();
      });
      global.addEventListener('resize', function () {
        if (global.innerWidth > 859) closeMenu();
      });
    }
    // Mark the current page.
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      var target = (a.getAttribute('href') || '').split('/').pop();
      if (target === here) a.setAttribute('aria-current', 'page');
    });
  }

  function initTransitions() {
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (/^(https?:|mailto:|tel:)/i.test(href)) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      var samePage = url.pathname === location.pathname;
      if (samePage && url.hash) return;
      if (reduced) return;
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(function () { location.href = a.href; }, 330);
    });
    global.addEventListener('pageshow', function () {
      document.body.classList.remove('page-leaving');
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    if (!('IntersectionObserver' in global)) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Clear all data ---------------- */
  function clearAll(confirmed) {
    if (!confirmed) {
      if (!global.confirm(t('form.clearConfirm'))) return false;
    }
    Store.clearAll();
    document.dispatchEvent(new CustomEvent('ice:cleared'));
    toast(t('toast.cleared'));
    return true;
  }

  /* ---------------- Wiring ---------------- */
  function syncSoundButtons() {
    document.querySelectorAll('[data-sound-toggle]').forEach(function (btn) {
      btn.setAttribute('data-muted', Sound.muted ? 'true' : 'false');
      btn.setAttribute('aria-pressed', Sound.muted ? 'true' : 'false');
      btn.setAttribute('aria-label', t('a11y.sound'));
    });
  }

  function initHeaderButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('[data-sound-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var muted = Sound.toggle();
        btn.setAttribute('data-muted', muted ? 'true' : 'false');
        syncSoundButtons();
      });
    });
    syncSoundButtons();
    document.querySelectorAll('[data-clear-all]').forEach(function (btn) {
      btn.addEventListener('click', function () { clearAll(false); });
    });
  }

  function initLangSelects() {
    var selects = document.querySelectorAll('[data-lang-select]');
    if (!selects.length) return;
    selects.forEach(function (sel) {
      sel.innerHTML = '';
      global.ICE_LANGS.forEach(function (lang) {
        var opt = document.createElement('option');
        opt.value = lang.code;
        opt.textContent = lang.label;
        sel.appendChild(opt);
      });
      sel.value = global.ICE_I18N.get();
      sel.addEventListener('change', function () {
        setLang(sel.value);
        Sound.play('soft');
      });
    });
  }

  function initAudioUnlock() {
    var unlock = function () {
      Sound.ensure();
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock, { once: false });
    document.addEventListener('keydown', unlock, { once: false });
  }

  function boot() {
    var theme = Store.get('theme', null);
    if (theme !== 'dark' && theme !== 'light') {
      theme = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(theme, false);

    var lang = Store.get('lang', null);
    setLang(lang || 'en', { persist: false });

    initNav();
    initTransitions();
    initReveal();
    initHeaderButtons();
    initLangSelects();
    initAudioUnlock();

    // Re-render anything language dependent once fonts are ready.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        document.dispatchEvent(new CustomEvent('ice:fonts'));
      });
    }

    document.addEventListener('ice:lang', function () {
      syncSoundButtons();
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', currentTheme() === 'dark' ? '#0a1524' : '#f7f3ea');
    });
  }

  global.ICE = {
    Store: Store,
    Sound: Sound,
    toast: toast,
    confetti: confetti,
    applyStrings: applyStrings,
    setLang: setLang,
    toggleTheme: toggleTheme,
    clearAll: clearAll,
    playClick: function () { Sound.play('click'); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
