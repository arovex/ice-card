/* ICE Card — canvas renderer.
 * Draws the lock-screen card (1170 × 2532), the wallet card (1011 × 639,
 * front and back) and the A4 print sheet (2480 × 3508 at 300 dpi).
 * Everything is local: no images, fonts or data leave the page.
 */
(function (global) {
  'use strict';

  var t = function (key, vars) { return global.t ? global.t(key, vars) : key; };

  var PHYS = {
    lock: { w: 1170, h: 2532 },
    wallet: { w: 1011, h: 639 },
    print: { w: 2480, h: 3508 }
  };

  var DISPLAY = '"Fraunces", "Noto Sans Arabic", Georgia, "Times New Roman", serif';
  var BODY = '"Inter", "Noto Sans Arabic", system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
  var EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif';

  /* ------------------------------------------------------------------ *
   * Themes — each is designed to pass AA contrast for body-sized text.
   * ------------------------------------------------------------------ */
  var THEMES = {
    daylight: {
      key: 'daylight', label: 'form.themeDaylight', dark: false,
      bg: '#fffdf8', ink: '#0e1b2e', muted: '#46566d',
      accent: '#b3261e', teal: '#0b6b66',
      line: '#ded4c2', chip: '#f4eee2', chipLine: '#e3d9c7',
      panel: '#fdf1f0', panelLine: '#eccfcb', onPanel: '#0e1b2e', onPanelMuted: '#7a3b38',
      glass: 'rgba(255,253,248,0.72)', glassLine: 'rgba(255,255,255,0.92)', glassTint: '#5a3a1e',
      solid: false,
      art: {
        style: 'sun',
        sky: ['#fffaf0', '#ffeeda', '#ffdcc2'],
        glows: [
          { c: '#ffc48d', a: 0.72, x: 0.86, y: 0.09, r: 0.62 },
          { c: '#ffe6a8', a: 0.62, x: 0.06, y: 0.02, r: 0.55 },
          { c: '#ffcfd6', a: 0.42, x: 0.72, y: 0.98, r: 0.60 },
          { c: '#fff6df', a: 0.70, x: 0.22, y: 0.62, r: 0.55 }
        ],
        detail: '#c97a3d',
        stars: 0
      }
    },
    midnight: {
      key: 'midnight', label: 'form.themeMidnight', dark: true,
      bg: '#0b1626', ink: '#f4f8fd', muted: '#a9b8cb',
      accent: '#ff7b72', teal: '#5fd6c8',
      line: '#22374f', chip: '#152740', chipLine: '#29445f',
      panel: '#2a1720', panelLine: '#4c2830', onPanel: '#ffffff', onPanelMuted: '#e7b6b8',
      glass: 'rgba(9,19,34,0.66)', glassLine: 'rgba(148,196,255,0.16)', glassTint: '#02070f',
      solid: false,
      art: {
        style: 'aurora',
        sky: ['#04080f', '#081627', '#0d2036'],
        glows: [
          { c: '#1c6f83', a: 0.62, x: 0.18, y: 0.05, r: 0.70 },
          { c: '#2c3f9e', a: 0.50, x: 0.92, y: 0.16, r: 0.62 },
          { c: '#0e4f5c', a: 0.42, x: 0.10, y: 0.86, r: 0.62 },
          { c: '#3a1f6b', a: 0.34, x: 0.88, y: 0.94, r: 0.55 }
        ],
        ribbons: ['#59e0c5', '#7aa2ff', '#a97bff'],
        detail: '#8fd8ff',
        stars: 110
      }
    },
    calm: {
      key: 'calm', label: 'form.themeCalm', dark: false,
      bg: '#e8f3f0', ink: '#0a2b29', muted: '#3b5b58',
      accent: '#b3261e', teal: '#0b6b66',
      line: '#c3dcd7', chip: '#d6e9e4', chipLine: '#b9d6d0',
      panel: '#fbecea', panelLine: '#e7c9c5', onPanel: '#0a2b29', onPanelMuted: '#6d3a36',
      glass: 'rgba(245,252,249,0.72)', glassLine: 'rgba(255,255,255,0.86)', glassTint: '#164f45',
      solid: false,
      art: {
        style: 'bloom',
        sky: ['#eef8f3', '#dcefe7', '#c9e5dc'],
        glows: [
          { c: '#9fdcc6', a: 0.66, x: 0.88, y: 0.08, r: 0.60 },
          { c: '#ffffff', a: 0.58, x: 0.08, y: 0.18, r: 0.50 },
          { c: '#b9d4ff', a: 0.40, x: 0.30, y: 0.98, r: 0.60 },
          { c: '#cdeee0', a: 0.55, x: 0.92, y: 0.80, r: 0.45 }
        ],
        detail: '#2f7d6b',
        stars: 0
      }
    },
    medical: {
      key: 'medical', label: 'form.themeMedical', dark: false,
      bg: '#ffffff', ink: '#121212', muted: '#454545',
      accent: '#b3121c', teal: '#0b6b66',
      line: '#e2e2e2', chip: '#f6f6f6', chipLine: '#dedede',
      panel: '#b3121c', panelLine: '#b3121c', onPanel: '#ffffff', onPanelMuted: '#ffdede',
      glass: 'rgba(255,255,255,0.86)', glassLine: 'rgba(179,18,28,0.14)', glassTint: '#8c1a20',
      solid: true,
      art: {
        style: 'grid',
        sky: ['#ffffff', '#fff7f6', '#ffebe9'],
        glows: [
          { c: '#ffd2cd', a: 0.62, x: 0.84, y: 0.06, r: 0.58 },
          { c: '#ffe4dc', a: 0.50, x: 0.04, y: 0.30, r: 0.55 },
          { c: '#ffd9d4', a: 0.40, x: 0.72, y: 0.96, r: 0.55 }
        ],
        detail: '#cf2b33',
        stars: 0
      }
    }
  };

  var THEME_KEYS = ['daylight', 'midnight', 'calm', 'medical'];

  /* ------------------------------------------------------------------ *
   * Small helpers
   * ------------------------------------------------------------------ */
  function font(ctx, size, weight, family) {
    ctx.font = (weight || 400) + ' ' + Math.round(size) + 'px ' + (family || BODY);
  }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function tint(hex, alpha) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
  }

  var RTL_RE = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

  function isRTL(text) {
    return RTL_RE.test(String(text || ''));
  }

  function str(v) {
    return (v == null ? '' : String(v)).replace(/\s+/g, ' ').trim();
  }

  function setDir(ctx, text) {
    ctx.direction = isRTL(text) ? 'rtl' : 'ltr';
  }

  /* ------------------------------------------------------------------ *
   * Wallpaper artwork
   * Every theme paints a full-bleed background: a sky gradient, soft
   * colour glows, one theme ornament (sun / aurora ribbons / bloom /
   * grid), optional stars and a whisper of grain. The finished art is
   * cached per theme and size, so a re-render is a single drawImage.
   * ------------------------------------------------------------------ */
  var backdropCache = {};
  var backdropOrder = [];
  var backdropBytes = 0;
  var BACKDROP_BUDGET = 28 * 1024 * 1024;

  function seeded(n) {
    var a = n >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seedFor(th) {
    var s = 7, i;
    for (i = 0; i < th.key.length; i++) s = (s * 31 + th.key.charCodeAt(i)) >>> 0;
    return s;
  }

  function glow(ctx, x, y, r, color, alpha) {
    if (r <= 0 || alpha <= 0) return;
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, tint(color, alpha));
    g.addColorStop(0.52, tint(color, alpha * 0.52));
    g.addColorStop(0.8, tint(color, alpha * 0.16));
    g.addColorStop(1, tint(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function sunArt(ctx, W, H, th, level) {
    var art = th.art;
    var cx = W * 0.83, cy = H * 0.11, R = Math.max(W, H) * 0.185;
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, tint('#fff6d8', 0.95 * level));
    g.addColorStop(0.55, tint('#ffd79a', 0.62 * level));
    g.addColorStop(1, tint('#ffc98f', 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    for (var i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, R * (1.2 + i * 0.24), 0, Math.PI * 2);
      ctx.strokeStyle = tint(art.detail, (0.17 - i * 0.045) * level);
      ctx.lineWidth = Math.max(1.5, W * 0.0016);
      ctx.stroke();
    }

    var hg = ctx.createLinearGradient(0, H * 0.87, 0, H);
    hg.addColorStop(0, tint('#ffb27a', 0));
    hg.addColorStop(1, tint('#ffab6d', 0.26 * level));
    ctx.fillStyle = hg;
    ctx.fillRect(0, H * 0.87, W, H * 0.13);
  }

  function auroraArt(ctx, W, H, th, level) {
    var art = th.art;
    var cols = art.ribbons || ['#7fe0c8', '#8aa8ff', '#b18cff'];
    var widths = [W * 0.17, W * 0.085, W * 0.03];
    var alphas = [0.055, 0.06, 0.05];

    ctx.save();
    ctx.lineCap = 'round';
    for (var i = 0; i < 3; i++) {
      var col = cols[i % cols.length];
      var y0 = H * (0.015 + i * 0.062);
      for (var p = 0; p < widths.length; p++) {
        ctx.beginPath();
        ctx.moveTo(-W * 0.06, y0 + H * 0.06);
        ctx.bezierCurveTo(W * 0.24, y0 - H * 0.025, W * 0.58, y0 + H * 0.115, W * 1.06, y0 + H * 0.02);
        ctx.lineWidth = widths[p];
        ctx.strokeStyle = tint(col, (alphas[p] + i * 0.008) * level);
        ctx.stroke();
      }
    }
    var g = ctx.createLinearGradient(0, 0, 0, H * 0.36);
    g.addColorStop(0, tint('#5fd6c8', 0.12 * level));
    g.addColorStop(1, tint('#5fd6c8', 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H * 0.36);
    ctx.restore();
  }

  function bloomArt(ctx, W, H, th, level) {
    var art = th.art;
    var rand = seeded(seedFor(th) + 13);
    var i;
    for (i = 0; i < 5; i++) {
      var x = rand() * W, y = rand() * H, r = (0.13 + rand() * 0.20) * W;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? tint('#ffffff', 0.16 * level) : tint(art.detail, 0.055 * level);
      ctx.fill();
    }
    var step = Math.max(26, W * 0.048);
    var dot = Math.max(1.2, W * 0.0016);
    ctx.fillStyle = tint(art.detail, 0.10 * level);
    for (var y2 = step * 0.6; y2 < H; y2 += step) {
      for (var x2 = step * 0.6; x2 < W; x2 += step) {
        ctx.beginPath();
        ctx.arc(x2, y2, dot, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function gridArt(ctx, W, H, th, level) {
    var art = th.art;
    var step = Math.max(40, W * 0.058);
    var arm = step * 0.15;
    ctx.save();
    ctx.strokeStyle = tint(art.detail, 0.12 * level);
    ctx.lineWidth = Math.max(1.4, W * 0.0015);
    for (var y = step * 0.55; y < H; y += step) {
      for (var x = step * 0.55; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x - arm, y);
        ctx.lineTo(x + arm, y);
        ctx.moveTo(x, y - arm);
        ctx.lineTo(x, y + arm);
        ctx.stroke();
      }
    }

    // A quiet first-aid badge peeking above the bottom edge.
    var bx = W * 0.5, by = H * 0.985, bh = W * 0.115;
    var bw = bh * 0.34;
    ctx.fillStyle = tint(art.detail, 0.075 * level);
    roundRect(ctx, bx - bw / 2, by - bh / 2, bw, bh, bw * 0.34);
    ctx.fill();
    roundRect(ctx, bx - bh / 2, by - bw / 2, bh, bw, bw * 0.34);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx, by, bh * 0.78, 0, Math.PI * 2);
    ctx.strokeStyle = tint(art.detail, 0.06 * level);
    ctx.lineWidth = Math.max(2, W * 0.0035);
    ctx.stroke();

    var band = Math.max(8, H * 0.0055);
    var g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, tint('#b3121c', 0.9));
    g.addColorStop(0.55, tint('#d0473f', 0.55));
    g.addColorStop(1, tint('#ff9d8f', 0.18));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, band);
    ctx.restore();
  }

  function starArt(ctx, W, H, th, level) {
    var n = Math.round(th.art.stars * level);
    var rand = seeded(seedFor(th) + 91);
    for (var i = 0; i < n; i++) {
      var where = rand();
      var y = where < 0.7 ? rand() * H * 0.29 : (where < 0.9 ? H * (0.88 + rand() * 0.12) : rand() * H);
      var x = rand() * W;
      var r = 0.9 + rand() * 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = tint('#ffffff', (0.16 + rand() * 0.55) * level);
      ctx.fill();
    }
  }

  var grainTile = null;

  function grainPattern(ctx) {
    if (!grainTile) {
      var c = document.createElement('canvas');
      c.width = 140;
      c.height = 140;
      var cx = c.getContext('2d');
      var img = cx.createImageData(140, 140);
      var rand = seeded(4242);
      for (var i = 0; i < img.data.length; i += 4) {
        var v = 128 + Math.round((rand() - 0.5) * 88);
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      cx.putImageData(img, 0, 0);
      grainTile = c;
    }
    return ctx.createPattern(grainTile, 'repeat');
  }

  function paintBackdrop(ctx, W, H, th, level, opts) {
    opts = opts || {};
    var quiet = !!opts.quiet;
    var art = th.art;
    var sky = art.sky;

    ctx.save();
    var g = ctx.createLinearGradient(0, 0, W * 0.4, H);
    g.addColorStop(0, sky[0]);
    g.addColorStop(0.5, sky[1]);
    g.addColorStop(1, sky[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var diag = Math.max(W, H);
    art.glows.forEach(function (gl) {
      glow(ctx, gl.x * W, gl.y * H, gl.r * diag, gl.c, gl.a * level * (quiet ? 0.9 : 1));
    });

    if (art.style === 'aurora') auroraArt(ctx, W, H, th, level);
    else if (art.style === 'sun') sunArt(ctx, W, H, th, level);
    else if (art.style === 'bloom') bloomArt(ctx, W, H, th, level);
    else gridArt(ctx, W, H, th, level);

    if (art.stars && !quiet) starArt(ctx, W, H, th, level);

    if (!quiet && level > 0.7) {
      var p = grainPattern(ctx);
      if (p) {
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = th.dark ? 0.11 : 0.06;
        ctx.fillStyle = p;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  function backdrop(W, H, th, level, opts) {
    opts = opts || {};
    var key = th.key + '|' + W + 'x' + H + '|' + Math.round(level * 100) + (opts.quiet ? '|q' : '');
    if (backdropCache[key]) return backdropCache[key];

    var c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    paintBackdrop(c.getContext('2d'), W, H, th, level, opts);

    backdropCache[key] = c;
    backdropOrder.push(key);
    backdropBytes += W * H * 4;

    // Full-bleed lock art is ~12 MB per theme; keep a small LRU so a phone
    // never holds every theme at once. Repainting costs ~40 ms.
    while (backdropBytes > BACKDROP_BUDGET && backdropOrder.length > 1) {
      var old = backdropOrder.shift();
      var gone = backdropCache[old];
      if (gone) backdropBytes -= gone.width * gone.height * 4;
      delete backdropCache[old];
    }
    return c;
  }

  /* A frosted panel behind the text, so the art stays visible but the
   * information always wins on contrast. */
  function glassPanel(ctx, x, y, w, h, r, th) {
    var i;
    ctx.save();
    for (i = 3; i >= 1; i--) {
      roundRect(ctx, x - i * 4, y - i * 2 + 8, w + i * 8, h + i * 8, r + i * 4);
      ctx.fillStyle = tint(th.glassTint || '#000000', 0.045);
      ctx.fill();
    }
    roundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = th.glass;
    ctx.fill();

    var sheen = ctx.createLinearGradient(0, y, 0, y + h * 0.6);
    sheen.addColorStop(0, 'rgba(255,255,255,' + (th.dark ? 0.10 : 0.45) + ')');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    roundRect(ctx, x, y, w, h, r);
    ctx.fill();

    ctx.strokeStyle = th.glassLine;
    ctx.lineWidth = 2;
    roundRect(ctx, x + 1, y + 1, w - 2, h - 2, Math.max(0, r - 1));
    ctx.stroke();
    ctx.restore();
  }

  /* Wrap into lines, breaking very long words if needed. */
  function wrap(ctx, text, maxW) {
    var value = str(text);
    if (!value) return [];
    var words = value.split(' ');
    var lines = [];
    var line = '';
    var i;
    for (i = 0; i < words.length; i++) {
      var word = words[i];
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width <= maxW) {
        line = test;
        continue;
      }
      if (line) { lines.push(line); line = ''; }
      if (ctx.measureText(word).width <= maxW) {
        line = word;
      } else {
        // Hard-break a single overlong word.
        var chunk = '';
        for (var c = 0; c < word.length; c++) {
          var next = chunk + word.charAt(c);
          if (ctx.measureText(next).width > maxW && chunk) {
            lines.push(chunk);
            chunk = word.charAt(c);
          } else {
            chunk = next;
          }
        }
        line = chunk;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function ellipsize(ctx, text, maxW) {
    var value = str(text);
    if (!value) return '';
    if (ctx.measureText(value).width <= maxW) return value;
    var ell = '\u2026';
    if (ctx.measureText(ell).width > maxW) return '';
    var lo = 0;
    var hi = value.length;
    while (lo < hi) {
      var mid = Math.ceil((lo + hi) / 2);
      if (ctx.measureText(value.slice(0, mid) + ell).width <= maxW) lo = mid; else hi = mid - 1;
    }
    return value.slice(0, lo).replace(/\s+$/, '') + ell;
  }

  function fitLine(ctx, text, maxW, maxSize, minSize, weight, family) {
    var size = maxSize;
    while (size > minSize) {
      font(ctx, size, weight, family);
      if (ctx.measureText(str(text)).width <= maxW) return size;
      size -= 1;
    }
    return minSize;
  }

  /* ------------------------------------------------------------------ *
   * Icons — 24 × 24 stroke paths
   * ------------------------------------------------------------------ */
  var ICONS = {
    phone: 'M6.6 3.4c.8 0 1.5.4 1.9 1.1l1 2c.3.7.2 1.5-.3 2L7.8 9.7a12 12 0 0 0 4.5 4.5l1.2-1.4c.5-.5 1.3-.6 2-.3l2 1c.7.4 1.1 1.1 1.1 1.9v2.2c0 1.1-.9 2-2 2C9.8 19.6 3.4 13.2 3.4 6.4c0-1.1.9-2 2-2h1.2z',
    drop: 'M12 3.2s6.2 6.4 6.2 10.3a6.2 6.2 0 0 1-12.4 0C5.8 9.6 12 3.2 12 3.2z',
    alert: 'M12 4 2.6 20h18.8L12 4zM12 9.6v4.5M12 17.1h.01',
    heart: 'M12 20.2s-7.6-4.7-7.6-9.8A4.25 4.25 0 0 1 12 7.1a4.25 4.25 0 0 1 7.6 3.3c0 5.1-7.6 9.8-7.6 9.8z',
    pill: 'M8.4 15.6 15.6 8.4a4 4 0 0 1 5.7 5.7l-7.2 7.2a4 4 0 0 1-5.7-5.7zM6.2 12.6l5.2 5.2',
    note: 'M6 3.4h8.6L20 8.9v11.7H6zM14.6 3.4v5.5H20M9 13h8M9 16.6h5',
    bank: 'M3.4 9.4 12 4l8.6 5.4M5.2 10.6v7.8M9.6 10.6v7.8M14.4 10.6v7.8M18.8 10.6v7.8M3.2 20.6h17.6',
    shield: 'M12 3.2 19 6v5.6c0 4.4-3 7.6-7 9.2-4-1.6-7-4.8-7-9.2V6l7-2.8zM8.7 12.1l2.3 2.3 4.4-4.6',
    doctor: 'M12 3.6v5M9.6 6.1h4.8M4.8 20.6c0-4 3.2-6.6 7.2-6.6s7.2 2.6 7.2 6.6M12 14a3.4 3.4 0 1 0 0-6.8',
    globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.4 12h17.2M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
    qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z'
  };

  function icon(ctx, name, x, y, size, color, weight) {
    var path = ICONS[name];
    if (!path || !global.Path2D) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = weight || 1.9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D(path));
    ctx.restore();
  }

  /* ------------------------------------------------------------------ *
   * QR code — byte mode, ECC level L, versions 1–10.
   * Self-contained: GF(256) Reed–Solomon, function patterns, masking.
   * ------------------------------------------------------------------ */
  var QR = (function () {
    var EXP = new Uint8Array(512);
    var LOG = new Uint8Array(256);
    (function () {
      var x = 1;
      for (var i = 0; i < 255; i++) {
        EXP[i] = x;
        LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
      }
      for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
    })();

    function mul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

    // [count, totalCodewords, dataCodewords] per block group, ECC level L.
    var BLOCKS = {
      1: [[1, 26, 19]],
      2: [[1, 44, 34]],
      3: [[1, 70, 55]],
      4: [[1, 100, 80]],
      5: [[1, 134, 108]],
      6: [[2, 86, 68]],
      7: [[2, 98, 78]],
      8: [[2, 121, 97]],
      9: [[2, 146, 116]],
      10: [[2, 86, 68], [2, 87, 69]]
    };
    var ALIGN = {
      1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
      7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
    };

    function capacity(version) {
      var total = 0;
      BLOCKS[version].forEach(function (g) { total += g[0] * g[2]; });
      return total;
    }

    function utf8(text) {
      if (global.TextEncoder) return Array.prototype.slice.call(new global.TextEncoder().encode(text));
      var out = [];
      for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c < 0x80) out.push(c);
        else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
        else if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length) {
          var c2 = text.charCodeAt(++i);
          var cp = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
          out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
        } else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      }
      return out;
    }

    function genPoly(degree) {
      var g = [1];
      for (var i = 0; i < degree; i++) {
        var next = new Array(g.length + 1);
        for (var k = 0; k < next.length; k++) next[k] = 0;
        for (var j = 0; j < g.length; j++) {
          next[j] ^= g[j];
          next[j + 1] ^= mul(g[j], EXP[i]);
        }
        g = next;
      }
      return g;
    }

    function rsEncode(data, eccLen) {
      var g = genPoly(eccLen);
      var rem = new Uint8Array(eccLen);
      for (var d = 0; d < data.length; d++) {
        var factor = data[d] ^ rem[0];
        rem.copyWithin(0, 1);
        rem[eccLen - 1] = 0;
        if (factor) {
          for (var i = 0; i < eccLen; i++) rem[i] ^= mul(g[i + 1], factor);
        }
      }
      return rem;
    }

    function bchDigit(v) {
      var n = 0;
      while (v !== 0) { n++; v >>>= 1; }
      return n;
    }

    function bchTypeInfo(data) {
      var d = data << 10;
      while (bchDigit(d) - bchDigit(0x537) >= 0) d ^= 0x537 << (bchDigit(d) - bchDigit(0x537));
      return ((data << 10) | d) ^ 0x5412;
    }

    function bchTypeNumber(data) {
      var d = data << 12;
      while (bchDigit(d) - bchDigit(0x1f25) >= 0) d ^= 0x1f25 << (bchDigit(d) - bchDigit(0x1f25));
      return (data << 12) | d;
    }

    function maskAt(m, row, col) {
      switch (m) {
        case 0: return (row + col) % 2 === 0;
        case 1: return row % 2 === 0;
        case 2: return col % 3 === 0;
        case 3: return (row + col) % 3 === 0;
        case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
        case 5: return ((row * col) % 2) + ((row * col) % 3) === 0;
        case 6: return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
        default: return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
      }
    }

    function penalty(mods, size) {
      var score = 0;
      var x, y, run, i;
      for (y = 0; y < size; y++) {
        run = 1;
        for (x = 1; x < size; x++) {
          if (mods[y * size + x] === mods[y * size + x - 1]) run++;
          else { if (run >= 5) score += 3 + (run - 5); run = 1; }
        }
        if (run >= 5) score += 3 + (run - 5);
      }
      for (x = 0; x < size; x++) {
        run = 1;
        for (y = 1; y < size; y++) {
          if (mods[y * size + x] === mods[(y - 1) * size + x]) run++;
          else { if (run >= 5) score += 3 + (run - 5); run = 1; }
        }
        if (run >= 5) score += 3 + (run - 5);
      }
      for (y = 0; y < size - 1; y++) {
        for (x = 0; x < size - 1; x++) {
          var v = mods[y * size + x];
          if (v === mods[y * size + x + 1] && v === mods[(y + 1) * size + x] && v === mods[(y + 1) * size + x + 1]) score += 3;
        }
      }
      var dark = 0;
      for (i = 0; i < mods.length; i++) dark += mods[i];
      var pct = dark * 100 / (size * size);
      score += Math.floor(Math.abs(pct - 50) / 5) * 10;
      return score;
    }

    function make(text) {
      var bytes = utf8(String(text || ''));
      var version = 0;
      for (var v = 1; v <= 10; v++) {
        var ccBits = v < 10 ? 8 : 16;
        if (4 + ccBits + bytes.length * 8 <= capacity(v) * 8) { version = v; break; }
      }
      if (!version) return null;

      var bits = [];
      function push(val, len) {
        for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      }
      push(4, 4); // byte mode
      push(bytes.length, version < 10 ? 8 : 16);
      for (var b = 0; b < bytes.length; b++) push(bytes[b], 8);
      var cap = capacity(version) * 8;
      var term = Math.min(4, cap - bits.length);
      for (var e = 0; e < term; e++) bits.push(0);
      while (bits.length % 8 !== 0) bits.push(0);
      var pad = [0xec, 0x11];
      var p = 0;
      while (bits.length < cap) { push(pad[p++ % 2], 8); }

      var data = new Uint8Array(bits.length / 8);
      for (var i = 0; i < data.length; i++) {
        var byte = 0;
        for (var k = 0; k < 8; k++) byte = (byte << 1) | bits[i * 8 + k];
        data[i] = byte;
      }

      var groups = [];
      var offset = 0;
      BLOCKS[version].forEach(function (g) {
        for (var n = 0; n < g[0]; n++) {
          groups.push({ data: data.subarray(offset, offset + g[2]), eccLen: g[1] - g[2] });
          offset += g[2];
        }
      });

      var eccs = groups.map(function (g) { return rsEncode(g.data, g.eccLen); });
      var out = [];
      var maxData = Math.max.apply(null, groups.map(function (g) { return g.data.length; }));
      for (var c = 0; c < maxData; c++) {
        for (var gi = 0; gi < groups.length; gi++) {
          if (c < groups[gi].data.length) out.push(groups[gi].data[c]);
        }
      }
      var maxEcc = Math.max.apply(null, eccs.map(function (ecc) { return ecc.length; }));
      for (var c2 = 0; c2 < maxEcc; c2++) {
        for (var g2 = 0; g2 < eccs.length; g2++) {
          if (c2 < eccs[g2].length) out.push(eccs[g2][c2]);
        }
      }

      var size = version * 4 + 17;
      var mods = new Uint8Array(size * size);
      var fn = new Uint8Array(size * size);

      function mark(x, y, dark) {
        if (x < 0 || y < 0 || x >= size || y >= size) return;
        mods[y * size + x] = dark ? 1 : 0;
        fn[y * size + x] = 1;
      }

      function setupFinder(cx, cy) {
        for (var yy = -1; yy <= 7; yy++) {
          for (var xx = -1; xx <= 7; xx++) {
            var inBox = xx >= 0 && xx <= 6 && yy >= 0 && yy <= 6;
            var dark = inBox && (xx === 0 || xx === 6 || yy === 0 || yy === 6 ||
              (xx >= 2 && xx <= 4 && yy >= 2 && yy <= 4));
            mark(cx + xx, cy + yy, dark);
          }
        }
      }
      setupFinder(0, 0);
      setupFinder(size - 7, 0);
      setupFinder(0, size - 7);

      for (var ti = 8; ti < size - 8; ti++) {
        mark(ti, 6, ti % 2 === 0);
        mark(6, ti, ti % 2 === 0);
      }

      var al = ALIGN[version];
      for (var ai = 0; ai < al.length; ai++) {
        for (var aj = 0; aj < al.length; aj++) {
          var ax = al[ai];
          var ay = al[aj];
          if ((ax === 6 && ay === 6) || (ax === 6 && ay === size - 7) || (ax === size - 7 && ay === 6)) continue;
          for (var dy = -2; dy <= 2; dy++) {
            for (var dx = -2; dx <= 2; dx++) {
              var ring = Math.max(Math.abs(dx), Math.abs(dy));
              mark(ax + dx, ay + dy, ring !== 1);
            }
          }
        }
      }

      for (var fy = 0; fy <= 8; fy++) { if (!fn[fy * size + 8]) mark(8, fy, 0); }
      for (var fx = 0; fx <= 8; fx++) { if (!fn[8 * size + fx]) mark(fx, 8, 0); }
      for (var by = size - 7; by < size; by++) { if (!fn[by * size + 8]) mark(8, by, 0); }
      for (var bx = size - 8; bx < size; bx++) { if (!fn[8 * size + bx]) mark(bx, 8, 0); }
      mark(8, size - 8, 1); // dark module

      if (version >= 7) {
        for (var vy = 0; vy < 6; vy++) {
          for (var vx = 0; vx < 3; vx++) {
            if (!fn[vy * size + (size - 11 + vx)]) mark(size - 11 + vx, vy, 0);
            if (!fn[(size - 11 + vy) * size + vx]) mark(vx, size - 11 + vy, 0);
          }
        }
      }

      var bitIndex = 0;
      var totalBits = out.length * 8;
      var dir = -1;
      var row = size - 1;
      for (var col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        for (;;) {
          for (var side = 0; side < 2; side++) {
            var cur = col - side;
            if (!fn[row * size + cur]) {
              var darkBit = 0;
              if (bitIndex < totalBits) {
                darkBit = (out[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1;
              }
              bitIndex++;
              mods[row * size + cur] = darkBit;
            }
          }
          row += dir;
          if (row < 0 || row >= size) { row -= dir; dir = -dir; break; }
        }
      }

      var bestMask = 0;
      var bestScore = Infinity;
      for (var m = 0; m < 8; m++) {
        var trial = new Uint8Array(mods);
        for (var ty = 0; ty < size; ty++) {
          for (var tx = 0; tx < size; tx++) {
            if (!fn[ty * size + tx] && maskAt(m, ty, tx)) trial[ty * size + tx] ^= 1;
          }
        }
        var s = penalty(trial, size);
        if (s < bestScore) { bestScore = s; bestMask = m; }
      }

      for (var my = 0; my < size; my++) {
        for (var mx = 0; mx < size; mx++) {
          if (!fn[my * size + mx] && maskAt(bestMask, my, mx)) mods[my * size + mx] ^= 1;
        }
      }

      var fmt = bchTypeInfo((1 << 3) | bestMask); // level L = 01
      for (var fi = 0; fi < 15; fi++) {
        var bit = (fmt >> fi) & 1;
        if (fi < 6) mods[fi * size + 8] = bit;
        else if (fi < 8) mods[(fi + 1) * size + 8] = bit;
        else mods[(size - 15 + fi) * size + 8] = bit;

        if (fi < 8) mods[8 * size + (size - fi - 1)] = bit;
        else if (fi === 8) mods[8 * size + 7] = bit;
        else mods[8 * size + (15 - fi - 1)] = bit;
      }
      mods[(size - 8) * size + 8] = 1;

      if (version >= 7) {
        var vfmt = bchTypeNumber(version);
        for (var vi = 0; vi < 18; vi++) {
          var vb = (vfmt >> vi) & 1;
          mods[Math.floor(vi / 3) * size + (vi % 3) + size - 11] = vb;
          mods[((vi % 3) + size - 11) * size + Math.floor(vi / 3)] = vb;
        }
      }

      return { size: size, version: version, mods: mods };
    }

    return { make: make, utf8Length: function (s) { return utf8(String(s)).length; } };
  })();

  /* ------------------------------------------------------------------ *
   * Text drawing
   * ------------------------------------------------------------------ */
  function paintText(ctx, value, x, y, o) {
    var v = str(value);
    if (!v) return 0;
    font(ctx, o.size, o.weight, o.family);
    setDir(ctx, v);
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = o.color;
    ctx.fillText(v, x, y);
    return ctx.measureText(v).width;
  }

  function paintLines(ctx, lines, x, y, o) {
    if (!lines.length) return 0;
    var lh = o.lineH || o.size * 1.3;
    font(ctx, o.size, o.weight, o.family);
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = o.color;
    for (var i = 0; i < lines.length; i++) {
      setDir(ctx, lines[i]);
      ctx.fillText(lines[i], x, y + o.size * 0.86 + i * lh);
    }
    return lines.length * lh;
  }

  function drawAvatar(ctx, av, img, cx, cy, r, th) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    if (av.type === 'photo' && img && img.complete && img.naturalWidth) {
      ctx.clip();
      var iw = img.naturalWidth;
      var ih = img.naturalHeight;
      var side = Math.min(iw, ih);
      ctx.drawImage(img, (iw - side) / 2, (ih - side) / 2, side, side, cx - r, cy - r, r * 2, r * 2);
    } else if (av.type === 'emoji' && av.value) {
      ctx.fillStyle = th.chip;
      ctx.fill();
      ctx.strokeStyle = th.chipLine;
      ctx.lineWidth = Math.max(2, r * 0.05);
      ctx.stroke();
      ctx.fillStyle = th.ink;
      ctx.font = Math.round(r * 0.96) + 'px ' + EMOJI;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.direction = 'ltr';
      ctx.fillText(av.value, cx, cy + r * 0.05);
    }
    ctx.restore();
  }

  /* ------------------------------------------------------------------ *
   * Data helpers
   * ------------------------------------------------------------------ */
  function contactsOf(data) {
    var list = (data && data.contacts) || [];
    return list.filter(function (c) {
      return c && (str(c.name) || str(c.phone));
    });
  }

  function primaryContact(data) {
    var list = contactsOf(data);
    var chosen = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].primary) { chosen = list[i]; break; }
    }
    if (!chosen && list.length) chosen = list[0];
    return chosen;
  }

  function otherContacts(data, primary) {
    var p = primary || primaryContact(data);
    return contactsOf(data).filter(function (c) { return c !== p; });
  }

  function banksOf(data) {
    return ((data && data.banks) || []).filter(function (b) {
      return b && (str(b.name) || str(b.phone));
    });
  }

  var SIZES = {
    lock: {
      pad: 84, gap: 26, overline: 28,
      name: 94, nameMin: 54, avatar: 128,
      label: 28, primaryName: 46, primaryPhone: 62,
      contactName: 33, contactPhone: 38,
      value: 34, small: 28, footer: 26, qr: 236
    },
    wallet: {
      pad: 46, gap: 14, overline: 17,
      name: 48, nameMin: 30, avatar: 62,
      label: 19, primaryName: 26, primaryPhone: 36,
      contactName: 23, contactPhone: 26,
      value: 24, small: 18, footer: 15, qr: 146
    }
  };

  function scaleSizes(sz, s) {
    var out = {};
    for (var k in sz) { if (Object.prototype.hasOwnProperty.call(sz, k)) out[k] = sz[k] * s; }
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Blocks
   * ------------------------------------------------------------------ */
  function identityBlock(ctx, data, th, sz, w, rtl, opts) {
    opts = opts || {};
    var av = (data && data.avatar) || { type: 'none', value: '' };
    var hasAvatar = !opts.noAvatar && (av.type === 'photo' || av.type === 'emoji') && av.value;
    var avSize = hasAvatar ? sz.avatar : 0;
    var avGap = hasAvatar ? Math.round(sz.avatar * 0.3) : 0;
    var textW = Math.max(sz.value * 3, w - avSize - avGap);

    var nameRaw = str(data.name);
    var display = nameRaw || t('card.noName');
    var nameSize = sz.name * (opts.nameScale || 1);
    var minSize = sz.nameMin * (opts.nameScale || 1);
    var lines = [];
    for (;;) {
      font(ctx, nameSize, 600, DISPLAY);
      setDir(ctx, display);
      lines = wrap(ctx, display, textW);
      if (lines.length <= 2 || nameSize <= minSize) break;
      nameSize -= 3;
    }
    font(ctx, nameSize, 600, DISPLAY);
    setDir(ctx, display);
    if (lines.length > 2) lines = [lines[0], ellipsize(ctx, lines.slice(1).join(' '), textW)];

    var nameLH = nameSize * 1.08;
    var nameH = lines.length * nameLH;
    var speaks = str(data.spokenLanguage);
    var speaksText = speaks ? t('card.speaks', { lang: speaks }) : '';
    var speaksH = speaksText ? sz.small * 1.5 : 0;
    var overH = opts.overline ? Math.round(sz.overline * 2) : 0;
    var h = overH + Math.max(avSize, nameH + speaksH) + Math.round(sz.gap * 0.6);

    return {
      key: 'identity',
      priority: 1,
      h: h,
      draw: function (ctx2, x, y, ww) {
        var anchor = rtl ? x + ww : x;
        var align = rtl ? 'right' : 'left';
        var top = y + overH;
        if (opts.overline) {
          paintText(ctx2, t('brand.tagline').toUpperCase(), anchor, top + sz.overline * 0.86, {
            size: sz.overline, weight: 700, color: th.accent, align: align
          });
        }
        var blockH = Math.max(avSize, nameH + speaksH);
        var midY = top + blockH / 2;
        if (hasAvatar) {
          var cx = rtl ? x + ww - avSize / 2 : x + avSize / 2;
          drawAvatar(ctx2, av, opts.avatarImg, cx, midY, avSize / 2, th);
        }
        var textAnchor = rtl ? x + ww - avSize - avGap : x + avSize + avGap;
        var textTop = midY - (nameH + speaksH) / 2;
        paintLines(ctx2, lines, textAnchor, textTop + (nameLH - nameSize * 0.86) * 0.5, {
          size: nameSize, weight: 600, color: nameRaw ? th.ink : th.muted,
          family: DISPLAY, align: align, lineH: nameLH
        });
        if (speaksText) {
          paintText(ctx2, speaksText, textAnchor, textTop + nameH + sz.small * 1.05, {
            size: sz.small, weight: 500, color: th.muted, align: align
          });
        }
      }
    };
  }

  function primaryBlock(ctx, data, th, sz, w, rtl) {
    var c = primaryContact(data);
    if (!c) return null;
    var pad = Math.round(sz.value * 0.78);
    var barW = Math.round(sz.value * 0.3);
    var innerW = w - pad * 2 - barW;
    var labelSize = sz.label;
    var nameText = str(c.name);
    var rel = str(c.relationship);
    var phone = str(c.phone);
    if (rel) nameText = nameText ? nameText + ' \u00b7 ' + rel : rel;

    var nameSize = fitLine(ctx, nameText, innerW, sz.primaryName, sz.primaryName * 0.62, 600);
    font(ctx, nameSize, 600, BODY);
    setDir(ctx, nameText);
    var nameLine = ellipsize(ctx, nameText, innerW);
    var nameH = nameSize * 1.3;

    var phoneSize = phone ? fitLine(ctx, phone, innerW, sz.primaryPhone, sz.primaryPhone * 0.5, 700) : 0;
    var phoneH = phone ? phoneSize * 1.24 : 0;

    var h = pad * 2 + labelSize * 1.5 + nameH + (phone ? nameSize * 0.2 : 0) + phoneH;

    var block = {
      key: 'primary',
      priority: 1,
      h: h,
      rect: null,
      draw: function (ctx2, x, y, ww) {
        var r = Math.max(10, sz.value * 0.42);
        roundRect(ctx2, x, y, ww, h, r);
        ctx2.fillStyle = th.panel;
        ctx2.fill();
        ctx2.strokeStyle = th.panelLine;
        ctx2.lineWidth = 2;
        ctx2.stroke();

        var barX = rtl ? x + ww - barW : x;
        roundRect(ctx2, barX, y + pad * 0.7, barW, h - pad * 1.4, barW / 2);
        ctx2.fillStyle = th.accent;
        ctx2.fill();

        var anchor = rtl ? x + ww - pad : x + pad;
        var align = rtl ? 'right' : 'left';
        var iconSize = labelSize * 0.95;
        var labelY = y + pad + labelSize * 0.92;

        var iconX = rtl ? anchor - iconSize : anchor;
        icon(ctx2, 'phone', iconX, labelY - iconSize * 0.82, iconSize, th.onPanelMuted, 2);

        var labelX = rtl ? anchor - iconSize - labelSize * 0.28 : anchor + iconSize + labelSize * 0.28;
        paintText(ctx2, t('card.callFirst').toUpperCase(), labelX, labelY, {
          size: labelSize, weight: 700, color: th.onPanelMuted, align: align
        });

        var nameY = y + pad + labelSize * 1.5;
        paintText(ctx2, nameLine, anchor, nameY + nameSize * 0.86, {
          size: nameSize, weight: 600, color: th.onPanel, align: align
        });

        if (phone) {
          paintText(ctx2, phone, anchor, nameY + nameH + nameSize * 0.2 + phoneSize * 0.9, {
            size: phoneSize, weight: 700, color: th.onPanel, align: align
          });
        }
        block.rect = { x: x, y: y, w: ww, h: h };
      }
    };
    return block;
  }

  function contactsBlock(ctx, data, th, sz, w, rtl, primary) {
    var list = otherContacts(data, primary);
    if (!list.length) return null;
    var labelH = sz.label * 1.7;
    var nameSize = sz.contactName;
    var phoneSize = sz.contactPhone;
    var items = [];

    list.forEach(function (c) {
      var name = str(c.name);
      var rel = str(c.relationship);
      var head = name ? (rel ? name + ' \u00b7 ' + rel : name) : rel;
      font(ctx, nameSize, 500, BODY);
      setDir(ctx, head);
      var headLine = ellipsize(ctx, head, w);
      var phone = str(c.phone);
      font(ctx, phoneSize, 700, BODY);
      setDir(ctx, phone);
      var phoneLine = phone ? ellipsize(ctx, phone, w - phoneSize * 0.95) : '';
      items.push({ head: headLine, phone: phoneLine });
    });

    var itemH = function (it) {
      return (it.head ? nameSize * 1.34 : 0) + (it.phone ? phoneSize * 1.36 : 0);
    };
    var h = labelH;
    items.forEach(function (it, idx) {
      h += itemH(it) + (idx < items.length - 1 ? sz.gap * 0.5 : 0);
    });
    h += Math.round(sz.gap * 0.4);

    return {
      key: 'contacts',
      priority: 2,
      h: h,
      draw: function (ctx2, x, y, ww) {
        var anchor = rtl ? x + ww : x;
        var align = rtl ? 'right' : 'left';
        paintText(ctx2, t('card.alsoCall').toUpperCase(), anchor, y + sz.label * 0.86, {
          size: sz.label, weight: 700, color: th.muted, align: align
        });
        var cursor = y + labelH;
        items.forEach(function (it, idx) {
          if (it.head) {
            paintText(ctx2, it.head, anchor, cursor + nameSize * 0.86, {
              size: nameSize, weight: 500, color: th.muted, align: align
            });
            cursor += nameSize * 1.34;
          }
          if (it.phone) {
            var iconSize = phoneSize * 0.86;
            var iconX = rtl ? anchor - iconSize : anchor;
            icon(ctx2, 'phone', iconX, cursor + phoneSize * 0.02, iconSize, th.teal, 2);
            var phoneX = rtl ? anchor - iconSize - phoneSize * 0.3 : anchor + iconSize + phoneSize * 0.3;
            paintText(ctx2, it.phone, phoneX, cursor + phoneSize * 0.9, {
              size: phoneSize, weight: 700, color: th.ink, align: align
            });
            cursor += phoneSize * 1.36;
          }
          if (idx < items.length - 1) cursor += sz.gap * 0.5;
        });
      }
    };
  }

  function vitalsBlock(ctx, data, th, sz, w, rtl) {
    var blood = str(data.bloodType);
    var allergies = str(data.allergies);
    if (!blood && !allergies) return null;

    var gap = Math.round(sz.gap * 0.6);
    var pad = Math.round(sz.value * 0.62);
    var boxes = [];

    if (blood && allergies) {
      boxes.push({ kind: 'blood', w: Math.round((w - gap) * 0.34) });
      boxes.push({ kind: 'allergy', w: w - gap - Math.round((w - gap) * 0.34) });
    } else if (blood) {
      boxes.push({ kind: 'blood', w: w });
    } else {
      boxes.push({ kind: 'allergy', w: w });
    }

    var labelH = sz.label * 1.55;
    var allergySize = sz.value;
    var allergyLines = [];
    if (allergies) {
      font(ctx, allergySize, 600, BODY);
      setDir(ctx, allergies);
      var allergyW = (boxes.length === 2 ? boxes[1].w : w) - pad * 2;
      allergyLines = wrap(ctx, allergies, allergyW).slice(0, 3);
      if (allergyLines.length === 3) {
        var joined = allergyLines.join(' ');
        if (joined.length < allergies.length) {
          allergyLines[2] = ellipsize(ctx, allergyLines[2] + '\u2026', allergyW);
        }
      }
    }

    var bloodValue = blood ? sz.value * 1.95 : 0;
    var bloodH = pad * 2 + labelH + bloodValue * 1.1;
    var allergyH = pad * 2 + labelH + (allergyLines.length * allergySize * 1.34 || allergySize * 1.1);
    var h = Math.max(bloodH, allergyH) + Math.round(sz.gap * 0.4);

    return {
      key: 'vitals',
      priority: 2,
      h: h,
      draw: function (ctx2, x, y, ww) {
        var boxH = h - Math.round(sz.gap * 0.4);
        var cursor = rtl ? x + ww : x;
        boxes.forEach(function (b) {
          var bx = rtl ? cursor - b.w : cursor;
          roundRect(ctx2, bx, y, b.w, boxH, Math.max(10, sz.value * 0.4));
          ctx2.fillStyle = th.chip;
          ctx2.fill();
          ctx2.strokeStyle = th.chipLine;
          ctx2.lineWidth = 2;
          ctx2.stroke();

          var anchor = rtl ? bx + b.w - pad : bx + pad;
          var align = rtl ? 'right' : 'left';

          if (b.kind === 'blood') {
            var ic = sz.label * 1.05;
            var iconX = rtl ? anchor - ic : anchor;
            icon(ctx2, 'drop', iconX, y + pad + 2, ic, th.accent, 2.1);
            var lx = rtl ? anchor - ic - sz.label * 0.3 : anchor + ic + sz.label * 0.3;
            paintText(ctx2, t('card.blood').toUpperCase(), lx, y + pad + sz.label * 0.9, {
              size: sz.label, weight: 700, color: th.muted, align: align
            });
            paintText(ctx2, blood, anchor, y + pad + labelH + bloodValue * 0.84, {
              size: bloodValue, weight: 700, color: th.ink, align: align
            });
          } else {
            var ic2 = sz.label * 1.05;
            var icon2X = rtl ? anchor - ic2 : anchor;
            icon(ctx2, 'alert', icon2X, y + pad + 2, ic2, th.accent, 2.1);
            var lx2 = rtl ? anchor - ic2 - sz.label * 0.3 : anchor + ic2 + sz.label * 0.3;
            paintText(ctx2, t('card.allergies').toUpperCase(), lx2, y + pad + sz.label * 0.9, {
              size: sz.label, weight: 700, color: th.muted, align: align
            });
            paintLines(ctx2, allergyLines, anchor, y + pad + labelH - allergySize * 0.14, {
              size: allergySize, weight: 600, color: th.ink, align: align,
              lineH: allergySize * 1.34
            });
          }
          cursor = rtl ? bx - gap : bx + b.w + gap;
        });
      }
    };
  }

  function detailsBlock(ctx, data, th, sz, w, rtl) {
    var rows = [];
    var donor = str(data.organDonor);
    if (donor === 'yes' || donor === 'no') {
      rows.push({ chip: true, text: donor === 'yes' ? t('card.donorYes') : t('card.donorNo') });
    }
    if (str(data.conditions)) rows.push({ icon: 'alert', label: t('card.conditions'), value: str(data.conditions) });
    if (str(data.medications)) rows.push({ icon: 'pill', label: t('card.meds'), value: str(data.medications) });
    if (str(data.doctor)) rows.push({ icon: 'doctor', label: t('card.doctor'), value: str(data.doctor) });
    if (!rows.length) return null;

    var iconSize = sz.value * 0.9;
    var txtW = w - iconSize - sz.small * 0.7;
    var labelH = sz.small * 1.42;
    var valueLH = sz.value * 1.3;
    var rowGap = Math.round(sz.gap * 0.55);
    var chipH = sz.value * 1.9;
    var heights = [];

    rows.forEach(function (r) {
      if (r.chip) { heights.push(chipH); return; }
      font(ctx, sz.value, 500, BODY);
      setDir(ctx, r.value);
      r.lines = wrap(ctx, r.value, txtW).slice(0, 2);
      if (r.lines.length === 2) {
        var rest = r.value;
        r.lines[1] = ellipsize(ctx, r.lines.join(' ').slice(r.lines[0].length).trim() || r.lines[1], txtW);
      }
      heights.push(labelH + r.lines.length * valueLH);
    });

    var h = heights.reduce(function (a, b) { return a + b; }, 0) + rowGap * (rows.length - 1) + Math.round(sz.gap * 0.4);
    var chipW = 0;
    if (rows[0] && rows[0].chip) {
      font(ctx, sz.value * 0.9, 600, BODY);
      chipW = Math.min(w, ctx.measureText(rows[0].text).width + iconSize * 1.7 + sz.value * 0.9);
    }

    return {
      key: 'details',
      priority: 3,
      h: h,
      draw: function (ctx2, x, y, ww) {
        var anchor = rtl ? x + ww : x;
        var align = rtl ? 'right' : 'left';
        var cursor = y;
        rows.forEach(function (r, idx) {
          if (r.chip) {
            var cw = Math.min(ww, (function () {
              font(ctx2, sz.value * 0.9, 600, BODY);
              setDir(ctx2, r.text);
              return ctx2.measureText(r.text).width + iconSize * 1.7 + sz.value * 0.9;
            })());
            var cx = rtl ? x + ww - cw : x;
            roundRect(ctx2, cx, cursor, cw, chipH * 0.86, chipH * 0.43);
            ctx2.fillStyle = th.chip;
            ctx2.fill();
            ctx2.strokeStyle = th.chipLine;
            ctx2.lineWidth = 2;
            ctx2.stroke();
            var ci = iconSize * 0.82;
            var iconX = rtl ? cx + cw - sz.value * 0.42 - ci : cx + sz.value * 0.42;
            icon(ctx2, 'heart', iconX, cursor + (chipH * 0.86 - ci) / 2, ci, th.accent, 2);
            var tx = rtl ? iconX - sz.small * 0.35 : iconX + ci + sz.small * 0.35;
            paintText(ctx2, r.text, tx, cursor + chipH * 0.56, {
              size: sz.value * 0.9, weight: 600, color: th.ink, align: align
            });
            cursor += chipH + rowGap;
            return;
          }
          var iconX2 = rtl ? anchor - iconSize : anchor;
          icon(ctx2, r.icon, iconX2, cursor + sz.small * 0.1, iconSize, th.teal, 2);
          var textAnchor = rtl ? anchor - iconSize - sz.small * 0.7 : anchor + iconSize + sz.small * 0.7;
          paintText(ctx2, r.label.toUpperCase(), textAnchor, cursor + sz.small * 0.92, {
            size: sz.small, weight: 700, color: th.muted, align: align
          });
          paintLines(ctx2, r.lines, textAnchor, cursor + labelH - sz.value * 0.18, {
            size: sz.value, weight: 500, color: th.ink, align: align, lineH: valueLH
          });
          cursor += labelH + r.lines.length * valueLH + (idx < rows.length - 1 ? rowGap : 0);
        });
      }
    };
  }

  function bankBlock(ctx, data, th, sz, w, rtl) {
    var entries = banksOf(data);
    if (!entries.length) return null;

    var entryLines = [];
    var entryLH = sz.value * 1.4;
    entries.forEach(function (b) {
      var name = str(b.name);
      var phone = str(b.phone);
      var line = name && phone ? name + ' \u00b7 ' + phone : (name || phone);
      font(ctx, sz.value * 0.96, 600, BODY);
      setDir(ctx, line);
      entryLines.push(ellipsize(ctx, line, w));
    });

    var labelH = sz.label * 1.7;
    var h = labelH + entryLines.length * entryLH + Math.round(sz.gap * 0.3);

    return {
      key: 'bank',
      priority: 4,
      h: h,
      draw: function (ctx2, x, y, ww) {
        var anchor = rtl ? x + ww : x;
        var align = rtl ? 'right' : 'left';
        paintText(ctx2, t('card.bank').toUpperCase(), anchor, y + sz.label * 0.86, {
          size: sz.label, weight: 700, color: th.muted, align: align
        });
        var cursor = y + labelH;
        entryLines.forEach(function (line) {
          paintText(ctx2, line, anchor, cursor + sz.value * 0.82, {
            size: sz.value * 0.96, weight: 600, color: th.ink, align: align
          });
          cursor += entryLH;
        });
      }
    };
  }

  /* The "a bank will never ask for your PIN" line is a safety message, so it
   * lives in its own block that is never dropped, even when the hotline
   * numbers themselves have to go. */
  function pinBlock(ctx, th, sz, w, rtl) {
    var pad = Math.round(sz.value * 0.62);
    var innerW = w - pad * 2 - sz.small * 1.9;
    font(ctx, sz.small, 600, BODY);
    setDir(ctx, t('card.pinRule'));
    var pinLines = wrap(ctx, t('card.pinRule'), innerW).slice(0, 3);
    var pinH = pad * 2 + pinLines.length * sz.small * 1.36;

    return {
      key: 'pin',
      priority: 1,
      h: pinH + Math.round(sz.gap * 0.4),
      draw: function (ctx2, x, y, ww) {
        var align = rtl ? 'right' : 'left';
        roundRect(ctx2, x, y, ww, pinH, Math.max(8, sz.value * 0.34));
        ctx2.fillStyle = th.chip;
        ctx2.fill();
        ctx2.strokeStyle = th.chipLine;
        ctx2.lineWidth = 2;
        ctx2.stroke();
        var iconSize = sz.small * 1.3;
        var iconX = rtl ? x + ww - pad - iconSize : x + pad;
        icon(ctx2, 'shield', iconX, y + pad + sz.small * 0.05, iconSize, th.teal, 2);
        var textAnchor = rtl ? x + ww - pad - iconSize - sz.small * 0.55 : x + pad + iconSize + sz.small * 0.55;
        paintLines(ctx2, pinLines, textAnchor, y + pad - sz.small * 0.2, {
          size: sz.small, weight: 600, color: th.ink, align: align, lineH: sz.small * 1.36
        });
      }
    };
  }

  function notesBlock(ctx, data, th, sz, w, rtl) {
    var value = str(data.notes);
    if (!value) return null;
    var size = sz.value * 0.98;
    font(ctx, size, 500, BODY);
    setDir(ctx, value);
    var lines = wrap(ctx, value, w).slice(0, 3);
    var labelH = sz.label * 1.7;
    var lh = size * 1.34;
    var h = labelH + lines.length * lh + Math.round(sz.gap * 0.4);

    return {
      key: 'notes',
      priority: 5,
      h: h,
      draw: function (ctx2, x, y, ww) {
        var anchor = rtl ? x + ww : x;
        var align = rtl ? 'right' : 'left';
        paintText(ctx2, t('card.notes').toUpperCase(), anchor, y + sz.label * 0.86, {
          size: sz.label, weight: 700, color: th.muted, align: align
        });
        paintLines(ctx2, lines, anchor, y + labelH - size * 0.16, {
          size: size, weight: 500, color: th.ink, align: align, lineH: lh
        });
      }
    };
  }

  var qrCache = { payload: null, qr: null };

  function qrBlock(ctx, data, th, sz, w, rtl, payload) {
    if (!payload) return null;
    if (qrCache.payload !== payload) {
      qrCache.payload = payload;
      qrCache.qr = QR.make(payload);
    }
    var qr = qrCache.qr;
    if (!qr) return null;

    var size = Math.min(sz.qr, w * 0.46);
    var plate = Math.max(8, Math.round(size * 0.055));
    var captionSize = sz.small;
    var captionW = w - size - plate * 2 - sz.gap;
    var caption = t('card.scan');
    font(ctx, captionSize, 600, BODY);
    setDir(ctx, caption);
    var captionLines = wrap(ctx, caption, Math.max(captionSize * 4, captionW)).slice(0, 3);
    var h = Math.max(size + plate * 2, captionLines.length * captionSize * 1.36) + Math.round(sz.gap * 0.4);

    return {
      key: 'qr',
      priority: 6,
      h: h,
      draw: function (ctx2, x, y) {
        var plateX = rtl ? x + w - size - plate * 2 : x;
        roundRect(ctx2, plateX, y, size + plate * 2, size + plate * 2, Math.max(8, size * 0.05));
        ctx2.fillStyle = '#ffffff';
        ctx2.fill();
        ctx2.strokeStyle = th.chipLine;
        ctx2.lineWidth = 2;
        ctx2.stroke();

        var n = qr.size;
        var quiet = 4;
        var total = n + quiet * 2;
        var scale = size / total;
        ctx2.fillStyle = '#000000';
        for (var row = 0; row < n; row++) {
          for (var col = 0; col < n; col++) {
            if (qr.mods[row * n + col]) {
              var px = plateX + plate + (col + quiet) * scale;
              var py = y + plate + (row + quiet) * scale;
              ctx2.fillRect(Math.floor(px), Math.floor(py), Math.ceil(scale), Math.ceil(scale));
            }
          }
        }

        var capAnchor = rtl ? plateX - sz.gap : plateX + size + plate * 2 + sz.gap;
        var align = rtl ? 'right' : 'left';
        var capY = y + (size + plate * 2 - captionLines.length * captionSize * 1.36) / 2;
        paintLines(ctx2, captionLines, capAnchor, capY, {
          size: captionSize, weight: 600, color: th.muted, align: align, lineH: captionSize * 1.36
        });
      }
    };
  }

  function footerBlock(ctx, th, sz, w) {
    var text = t('card.notRecord');
    font(ctx, sz.footer, 500, BODY);
    setDir(ctx, text);
    var h = sz.footer * 1.9;
    return {
      key: 'footer',
      priority: 2,
      h: h,
      draw: function (ctx2, x, y, ww) {
        paintText(ctx2, text, x + ww / 2, y + sz.footer * 1.1, {
          size: sz.footer, weight: 500, color: th.muted, align: 'center'
        });
      }
    };
  }

  function buildSet(ctx, data, th, sz, w, layout, side, opts) {
    var rtl = !!opts.rtl;
    var blocks = [];
    var id = identityBlock(ctx, data, th, sz, w, rtl, {
      overline: layout === 'lock',
      avatarImg: opts.avatarImg,
      noAvatar: opts.noAvatar,
      nameScale: opts.nameScale
    });
    if (id) blocks.push(id);

    function add(block) { if (block) blocks.push(block); }

    if (layout === 'lock') {
      add(primaryBlock(ctx, data, th, sz, w, rtl));
      add(contactsBlock(ctx, data, th, sz, w, rtl));
      add(vitalsBlock(ctx, data, th, sz, w, rtl));
      add(detailsBlock(ctx, data, th, sz, w, rtl));
      if (banksOf(data).length) {
        add(bankBlock(ctx, data, th, sz, w, rtl));
        add(pinBlock(ctx, th, sz, w, rtl));
      }
      add(notesBlock(ctx, data, th, sz, w, rtl));
      if (opts.showQr) add(qrBlock(ctx, data, th, sz, w, rtl, opts.qrPayload));
      if (!opts.fixedFooter) add(footerBlock(ctx, th, sz, w));
    } else if (side === 'front') {
      add(primaryBlock(ctx, data, th, sz, w, rtl));
      add(vitalsBlock(ctx, data, th, sz, w, rtl));
    } else {
      add(contactsBlock(ctx, data, th, sz, w, rtl));
      add(detailsBlock(ctx, data, th, sz, w, rtl));
      if (banksOf(data).length) {
        add(bankBlock(ctx, data, th, sz, w, rtl));
        add(pinBlock(ctx, th, sz, w, rtl));
      }
      add(notesBlock(ctx, data, th, sz, w, rtl));
      if (opts.showQr) add(qrBlock(ctx, data, th, sz, w, rtl, opts.qrPayload));
      add(footerBlock(ctx, th, sz, w));
    }
    return blocks;
  }

  function stackHeight(blocks, gap) {
    if (!blocks.length) return 0;
    return blocks.reduce(function (sum, b) { return sum + b.h; }, 0) + gap * (blocks.length - 1);
  }

  function fitStack(build, maxH, baseGap) {
    var full = build(1);
    var dropOrder = full
      .filter(function (b) { return b.priority >= 3; })
      .slice()
      .sort(function (a, b) { return (b.priority - a.priority) || (b.h - a.h); })
      .map(function (b) { return b.key; });

    var steps = [1, 0.95, 0.9];
    var cache = steps.map(function (s) { return { scale: s, gap: baseGap * s, blocks: build(s) }; });
    var best = null;

    // Prefer dropping as little as possible; shrink only as far as needed.
    for (var d = 0; d <= dropOrder.length; d++) {
      var dropped = dropOrder.slice(0, d);
      for (var s = 0; s < cache.length; s++) {
        var scale = cache[s].scale;
        var gap = cache[s].gap;
        var blocks = cache[s].blocks.filter(function (b) { return dropped.indexOf(b.key) < 0; });
        var total = stackHeight(blocks, gap);
        best = { blocks: blocks, gap: gap, total: total, scale: scale, dropped: dropped.slice(), overflow: false };
        if (total <= maxH + 0.5) return best;
      }
    }

    // Nothing fits: keep the last attempt and let the renderer clip.
    best.overflow = true;
    return best;
  }

  function paintStack(ctx, fit, box) {
    var startY = box.y + Math.max(0, (box.h - fit.total) / 2);
    if (startY < box.y) startY = box.y;
    var y = startY;
    ctx.save();
    if (fit.overflow) {
      ctx.beginPath();
      ctx.rect(box.x - 24, box.y - 24, box.w + 48, box.h + 48);
      ctx.clip();
    }
    fit.blocks.forEach(function (b) {
      b.draw(ctx, box.x, y, box.w);
      y += b.h + fit.gap;
    });
    ctx.restore();
    return startY;
  }

  /* ------------------------------------------------------------------ *
   * Lock screen: 1170 × 2532
   * Top 30% stays empty (clock / notifications), bottom 12% stays empty
   * (flashlight / camera). Everything is drawn between those bands.
   * ------------------------------------------------------------------ */
  function drawLock(ctx, W, H, data, th, opts) {
    var artLevel = opts.artLevel == null ? 1 : opts.artLevel;
    ctx.drawImage(backdrop(W, H, th, artLevel), 0, 0);

    var top = Math.round(H * 0.30);
    var bottom = Math.round(H * 0.12);
    var box = {
      x: 84,
      y: top + 40,
      w: W - 168,
      h: H - top - bottom - 80
    };

    var base = SIZES.lock;
    var rtl = !!opts.rtl;
    // The "not a medical record" line is pinned to the bottom of the content
    // area: it is a safety message, so it should never be dropped by the fitter.
    var footerH = Math.round(base.footer * 1.9) + base.gap;
    var fit = fitStack(function (scale) {
      var sz = scaleSizes(base, scale);
      return buildSet(ctx, data, th, sz, box.w, 'lock', 'front', {
        rtl: rtl, avatarImg: opts.avatarImg, showQr: opts.showQr, qrPayload: opts.qrPayload,
        fixedFooter: true
      });
    }, box.h - footerH, base.gap);

    var area = { x: box.x, y: box.y, w: box.w, h: box.h - footerH };
    var startY = area.y + Math.max(0, (area.h - fit.total) / 2);
    var padX = Math.round(box.w * 0.035);
    var padY = Math.round(padX * 0.92);
    var panelTop = Math.max(area.y - 34, startY - padY);
    var panelH = Math.min(fit.total + padY * 2, box.y + box.h - Math.round(base.footer * 1.9) - 18 - panelTop);
    glassPanel(ctx, box.x - padX, panelTop, box.w + padX * 2, Math.max(120, panelH), Math.round(box.w * 0.05), th);

    paintStack(ctx, fit, area);

    ctx.save();
    font(ctx, base.footer, 500, BODY);
    setDir(ctx, t('card.notRecord'));
    ctx.textAlign = 'center';
    ctx.fillStyle = th.muted;
    ctx.fillText(t('card.notRecord'), W / 2, box.y + box.h - Math.round(base.footer * 0.35));
    ctx.restore();

    var primary = null;
    fit.blocks.forEach(function (b) { if (b.key === 'primary') primary = b.rect; });

    return { primary: primary, overflow: fit.overflow, dropped: fit.dropped, scale: fit.scale };
  }

  /* ------------------------------------------------------------------ *
   * Wallet card: 1011 × 639 (85.6 × 54 mm at 300 dpi)
   * ------------------------------------------------------------------ */
  function drawWallet(ctx, W, H, data, th, side, opts) {
    var artLevel = opts.artLevel == null ? 0.9 : opts.artLevel;
    ctx.drawImage(backdrop(W, H, th, artLevel, { quiet: true }), 0, 0);

    // Calm the artwork: the card is dense, so colour lives in the frame.
    var veil = ctx.createLinearGradient(0, 0, W, H);
    veil.addColorStop(0, tint(th.art.sky[0], th.dark ? 0.24 : 0.26));
    veil.addColorStop(1, tint(th.art.sky[2], th.dark ? 0.14 : 0.18));
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, W, H);

    // Inner panel: a clean surface for the small print, artwork showing
    // as a printed border around it.
    var frame = Math.round(W * 0.028);
    var inner = { x: frame, y: frame, w: W - frame * 2, h: H - frame * 2 };
    roundRect(ctx, inner.x, inner.y, inner.w, inner.h, Math.round(W * 0.028));
    ctx.fillStyle = tint(th.art.sky[0], th.dark ? 0.88 : 0.90);
    ctx.fill();
    ctx.strokeStyle = tint(th.ink, 0.12);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = tint(th.ink, 0.16);
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    var inset = Math.round(W * 0.022);
    var box = {
      x: inner.x + inset,
      y: inner.y + inset,
      w: inner.w - inset * 2,
      h: inner.h - inset * 2
    };
    var base = SIZES.wallet;
    var rtl = !!opts.rtl;

    var fit = fitStack(function (scale) {
      var sz = scaleSizes(base, scale);
      return buildSet(ctx, data, th, sz, box.w, 'wallet', side, {
        rtl: rtl,
        avatarImg: opts.avatarImg,
        showQr: opts.showQr,
        qrPayload: opts.qrPayload,
        noAvatar: side === 'back',
        nameScale: side === 'back' ? 0.6 : 1
      });
    }, box.h, base.gap);

    paintStack(ctx, fit, box);

    var primary = null;
    fit.blocks.forEach(function (b) { if (b.key === 'primary') primary = b.rect; });
    return { primary: primary, overflow: fit.overflow, dropped: fit.dropped, scale: fit.scale };
  }

  function walletBitmap(data, th, side, opts) {
    var c = document.createElement('canvas');
    c.width = PHYS.wallet.w;
    c.height = PHYS.wallet.h;
    var cx = c.getContext('2d');
    drawWallet(cx, c.width, c.height, data, th, side, opts || {});
    return c;
  }

  /* ------------------------------------------------------------------ *
   * A4 print sheet: 2480 × 3508 (210 × 297 mm at 300 dpi)
   * Four front-and-back pairs with cut lines.
   * ------------------------------------------------------------------ */
  function drawPrint(ctx, W, H, data, th, opts) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // A light theme wash across the masthead: designed, but cheap to print.
    var washFrom = th.dark ? tint(th.accent, 0.10) : tint(th.art.sky[2], 0.55);
    var washTo = th.dark ? tint(th.accent, 0) : tint(th.art.sky[2], 0);
    var wash = ctx.createLinearGradient(0, 0, W * 0.9, 340);
    wash.addColorStop(0, washFrom);
    wash.addColorStop(0.6, th.dark ? tint(th.accent, 0.04) : tint(th.art.sky[2], 0.18));
    wash.addColorStop(1, washTo);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, 340);

    // Ornament: soft concentric rings in the top corner.
    var ox = W - 250, oy = 170;
    var ringColor = th.dark ? th.accent : th.art.detail;
    for (var r = 0; r < 3; r++) {
      ctx.beginPath();
      ctx.arc(ox, oy, 62 + r * 34, 0, Math.PI * 2);
      ctx.strokeStyle = tint(ringColor, 0.22 - r * 0.05);
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(ox, oy, 26, 0, Math.PI * 2);
    ctx.fillStyle = tint(th.accent, 0.9);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    ctx.textBaseline = 'alphabetic';

    font(ctx, 62, 600, DISPLAY);
    ctx.fillStyle = '#0e1b2e';
    ctx.fillText(t('card.printTitle'), 120, 196);

    font(ctx, 29, 400, BODY);
    ctx.fillStyle = '#46566d';
    ctx.fillText(t('card.printHint'), 120, 252);

    // Accent rule: a designed edge instead of a plain hairline.
    var rule = ctx.createLinearGradient(120, 0, W - 120, 0);
    rule.addColorStop(0, tint(th.accent, 0.95));
    rule.addColorStop(0.35, tint(th.teal, 0.75));
    rule.addColorStop(0.75, tint(th.art.detail, 0.35));
    rule.addColorStop(1, tint(th.art.detail, 0));
    roundRect(ctx, 120, 292, W - 240, 7, 4);
    ctx.fillStyle = rule;
    ctx.fill();

    var cw = PHYS.wallet.w;
    var ch = PHYS.wallet.h;
    var pairGap = 26;
    var gapX = 118;
    var gapY = 92;
    var startX = 120;
    var startY = 356;
    var pairH = ch * 2 + pairGap;
    var cardOpts = {
      rtl: opts.rtl,
      avatarImg: opts.avatarImg,
      showQr: opts.showQr,
      qrPayload: opts.qrPayload,
      artLevel: 0.4
    };
    var front = walletBitmap(data, th, 'front', cardOpts);
    var back = walletBitmap(data, th, 'back', cardOpts);

    for (var i = 0; i < 4; i++) {
      var col = i % 2;
      var row = Math.floor(i / 2);
      var x = startX + col * (cw + gapX);
      var y = startY + row * (pairH + gapY);

      font(ctx, 26, 600, BODY);
      ctx.fillStyle = '#5b6779';
      ctx.fillText(t('card.printPair', { n: i + 1 }), x, y - 20);

      ctx.save();
      ctx.strokeStyle = '#b3aa99';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.strokeRect(x - 18, y - 18, cw + 36, pairH + 36);
      ctx.restore();

      ctx.drawImage(front, x, y);
      ctx.drawImage(back, x, y + ch + pairGap);

      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
      ctx.strokeRect(x + 0.5, y + ch + pairGap + 0.5, cw - 1, ch - 1);
    }

    font(ctx, 26, 400, BODY);
    ctx.fillStyle = '#6b7789';
    ctx.fillText(t('card.notRecord'), 120, H - 104);

    font(ctx, 24, 400, BODY);
    ctx.fillStyle = '#8a94a3';
    ctx.fillText(t('card.printScale'), 120, H - 66);
  }

  /* ------------------------------------------------------------------ *
   * Public rendering
   * ------------------------------------------------------------------ */
  function render(canvas, opts) {
    opts = opts || {};
    var layout = opts.layout || 'lock';
    var th = THEMES[opts.theme] || THEMES.daylight;
    var phys = PHYS[layout] || PHYS.lock;
    var W = phys.w;
    var H = phys.h;
    var dpr = layout === 'print' ? 1 : Math.min(opts.dpr || global.devicePixelRatio || 1, 2);

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.setAttribute('data-layout', layout);

    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var meta = { primary: null, overflow: false, dropped: [], scale: 1 };
    if (layout === 'wallet') {
      meta = drawWallet(ctx, W, H, opts.data || {}, th, opts.side || 'front', opts);
    } else if (layout === 'print') {
      drawPrint(ctx, W, H, opts.data || {}, th, opts);
    } else {
      meta = drawLock(ctx, W, H, opts.data || {}, th, opts);
    }
    return meta;
  }

  function altText(data) {
    var parts = [];
    var name = str(data.name);
    var anyValue = !!(name || str(data.bloodType) || str(data.allergies) ||
      str(data.medications) || str(data.conditions) || str(data.doctor) ||
      str(data.notes) || primaryContact(data) || otherContacts(data).length ||
      banksOf(data).length);
    if (!anyValue) return t('form.previewEmpty');
    parts.push(name ? 'Emergency card for ' + name + '.' : 'Emergency contact card.');
    var p = primaryContact(data);
    if (p) {
      var pn = str(p.name);
      var line = pn ? t('card.callFirst') + ': ' + pn : t('card.callFirst');
      if (pn && str(p.relationship)) line += ' (' + str(p.relationship) + ')';
      if (str(p.phone)) line += (pn ? ', ' : ': ') + str(p.phone);
      parts.push(line + '.');
    }
    otherContacts(data).forEach(function (c) {
      var cn = str(c.name);
      var l = cn ? t('card.alsoCall') + ': ' + cn : t('card.alsoCall');
      if (cn && str(c.relationship)) l += ' (' + str(c.relationship) + ')';
      if (str(c.phone)) l += (cn ? ', ' : ': ') + str(c.phone);
      parts.push(l + '.');
    });
    if (str(data.bloodType)) parts.push(t('card.blood') + ': ' + str(data.bloodType) + '.');
    if (str(data.allergies)) parts.push(t('card.allergies') + ': ' + str(data.allergies) + '.');
    if (str(data.medications)) parts.push(t('card.meds') + ': ' + str(data.medications) + '.');
    if (str(data.conditions)) parts.push(t('card.conditions') + ': ' + str(data.conditions) + '.');
    if (str(data.organDonor) === 'yes') parts.push(t('card.donorYes') + '.');
    if (str(data.organDonor) === 'no') parts.push(t('card.donorNo') + '.');
    if (str(data.doctor)) parts.push(t('card.doctor') + ': ' + str(data.doctor) + '.');
    banksOf(data).forEach(function (b) {
      parts.push(t('card.bank') + ': ' + str(b.name) + ' ' + str(b.phone) + '.');
    });
    if (str(data.notes)) parts.push(t('card.notes') + ': ' + str(data.notes) + '.');
    if (parts.length > 1) parts.push(t('card.notRecord') + '.');
    return parts.join(' ');
  }

  function qrPayload(data) {
    var lines = ['ICE'];
    if (str(data.name)) lines.push('Name: ' + str(data.name));
    var p = primaryContact(data);
    if (p) {
      var pn = str(p.name);
      var first = pn ? 'Call first: ' + pn : 'Call first';
      if (pn && str(p.relationship)) first += ' (' + str(p.relationship) + ')';
      if (str(p.phone)) first += (pn ? ' ' : ': ') + str(p.phone);
      lines.push(first);
    }
    otherContacts(data).forEach(function (c) {
      var cn = str(c.name);
      var l = cn ? 'Also: ' + cn : 'Also';
      if (str(c.phone)) l += (cn ? ' ' : ': ') + str(c.phone);
      lines.push(l);
    });
    if (str(data.bloodType)) lines.push('Blood: ' + str(data.bloodType));
    if (str(data.allergies)) lines.push('Allergies: ' + str(data.allergies));
    if (str(data.medications)) lines.push('Meds: ' + str(data.medications));
    if (str(data.conditions)) lines.push('Conditions: ' + str(data.conditions));
    if (str(data.organDonor)) lines.push('Organ donor: ' + (str(data.organDonor) === 'yes' ? 'yes' : 'no'));
    if (str(data.doctor)) lines.push('Doctor: ' + str(data.doctor));
    if (str(data.notes)) lines.push('Note: ' + str(data.notes));
    banksOf(data).forEach(function (b) {
      lines.push(('Bank: ' + str(b.name) + ' ' + str(b.phone)).replace(/\s+/g, ' ').trim());
    });

    var limit = 232;
    var kept = [];
    var used = 0;
    for (var i = 0; i < lines.length; i++) {
      var add = QR.utf8Length(lines[i]) + (kept.length ? 1 : 0);
      if (used + add > limit) break;
      kept.push(lines[i]);
      used += add;
    }
    if (!kept.length && lines.length) kept.push(lines[0].slice(0, 40));
    return kept.join('\n');
  }

  function isRTLData(data) {
    var sample = [
      data.name, data.spokenLanguage, data.allergies, data.medications,
      data.conditions, data.doctor, data.notes
    ].join(' ');
    contactsOf(data).forEach(function (c) { sample += ' ' + str(c.name) + ' ' + str(c.relationship); });
    return isRTL(sample);
  }

  global.ICE_CARD = {
    PHYS: PHYS,
    THEMES: THEMES,
    THEME_KEYS: THEME_KEYS,
    render: render,
    altText: altText,
    qrPayload: qrPayload,
    isRTLData: isRTLData,
    makeQR: function (text) { return QR.make(text); }
  };
})(window);
