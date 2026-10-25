/* ICE Card — create page controller.
 * Reads the form, keeps a single data object, renders the live preview,
 * runs the privacy check and handles saving / sharing / printing.
 */
(function () {
  'use strict';

  var root = document.getElementById('cardForm');
  if (!root) return;

  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  };
  var T = function (key, vars) { return window.t(key, vars); };
  var CARD = window.ICE_CARD;
  var Store = window.ICE.Store;
  var Sound = window.ICE.Sound;

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */
  function blankData() {
    return {
      version: 1,
      name: '',
      avatar: { type: 'none', value: '' },
      spokenLanguage: '',
      contacts: [
        { name: '', relationship: '', phone: '', primary: true },
        { name: '', relationship: '', phone: '', primary: false },
        { name: '', relationship: '', phone: '', primary: false }
      ],
      bloodType: '',
      allergies: '',
      medications: '',
      conditions: '',
      organDonor: '',
      doctor: '',
      banks: [{ name: '', phone: '' }, { name: '', phone: '' }],
      notes: '',
      qr: true
    };
  }

  function normalise(raw) {
    var d = blankData();
    if (!raw || typeof raw !== 'object') return d;
    ['name', 'spokenLanguage', 'bloodType', 'allergies', 'medications', 'conditions',
      'organDonor', 'doctor', 'notes'].forEach(function (k) {
      if (typeof raw[k] === 'string') d[k] = raw[k];
    });
    if (raw.avatar && typeof raw.avatar === 'object') {
      var type = raw.avatar.type;
      if ((type === 'emoji' || type === 'photo') && typeof raw.avatar.value === 'string') {
        d.avatar = { type: type, value: raw.avatar.value };
      }
    }
    if (Array.isArray(raw.contacts)) {
      for (var i = 0; i < 3; i++) {
        var c = raw.contacts[i];
        if (c && typeof c === 'object') {
          d.contacts[i] = {
            name: typeof c.name === 'string' ? c.name : '',
            relationship: typeof c.relationship === 'string' ? c.relationship : '',
            phone: typeof c.phone === 'string' ? c.phone : '',
            primary: !!c.primary
          };
        }
      }
    }
    if (Array.isArray(raw.banks)) {
      for (var b = 0; b < 2; b++) {
        var bank = raw.banks[b];
        if (bank && typeof bank === 'object') {
          d.banks[b] = {
            name: typeof bank.name === 'string' ? bank.name : '',
            phone: typeof bank.phone === 'string' ? bank.phone : ''
          };
        }
      }
    }
    if (typeof raw.qr === 'boolean') d.qr = raw.qr;
    if (!d.contacts.some(function (c) { return c.primary; })) d.contacts[0].primary = true;
    return d;
  }

  var prefs = Store.get('prefs', {}) || {};
  var state = {
    data: blankData(),
    remember: !!Store.get('remember', false),
    theme: CARD.THEMES[prefs.theme] ? prefs.theme : 'daylight',
    layout: ['lock', 'wallet', 'print'].indexOf(prefs.layout) >= 0 ? prefs.layout : 'lock',
    side: prefs.side === 'back' ? 'back' : 'front',
    showGuide: prefs.showGuide !== false
  };
  var avatarImg = null;
  var lastDone = [false, false, false, false, false];
  var saveTimer = null;
  var printDirty = true;

  /* ------------------------------------------------------------------ *
   * Elements
   * ------------------------------------------------------------------ */
  var canvas = $('previewCanvas');
  var printCanvas = $('printCanvas');
  var stage = $('canvasHolder');
  var guideLayer = $('guideLayer');
  var pulse = $('callPulse');
  var fitMsg = $('fitMsg');
  var progressBar = $('progressBar');
  var progressText = $('progressText');
  var privacyBox = $('privacyCheck');
  var result = $('resultBox');
  var resultImg = $('resultImg');
  var resultDownload = $('resultDownload');
  var resultShare = $('resultShare');
  var currentBlobUrl = null;
  var currentBlob = null;

  /* ------------------------------------------------------------------ *
   * Form <-> data
   * ------------------------------------------------------------------ */
  function readForm() {
    var d = state.data;
    d.name = $('cardName').value;
    d.spokenLanguage = $('spokenLanguage').value;
    for (var i = 0; i < 3; i++) {
      d.contacts[i].name = $('c' + (i + 1) + 'Name').value;
      d.contacts[i].relationship = $('c' + (i + 1) + 'Rel').value;
      d.contacts[i].phone = $('c' + (i + 1) + 'Phone').value;
    }
    var checked = document.querySelector('input[name="callFirst"]:checked');
    var primaryIdx = checked ? Number(checked.value) : 0;
    d.contacts.forEach(function (c, idx) { c.primary = idx === primaryIdx; });

    d.bloodType = $('bloodType').value;
    d.allergies = $('allergies').value;
    d.medications = $('medications').value;
    d.conditions = $('conditions').value;
    d.organDonor = $('organDonor').value;
    d.doctor = $('doctor').value;

    for (var b = 0; b < 2; b++) {
      d.banks[b].name = $('bank' + (b + 1) + 'Label').value;
      d.banks[b].phone = $('bank' + (b + 1) + 'Phone').value;
    }
    d.notes = $('notes').value;
    d.qr = $('qrToggle').checked;
  }

  function writeForm() {
    var d = state.data;
    $('cardName').value = d.name || '';
    $('spokenLanguage').value = d.spokenLanguage || '';
    for (var i = 0; i < 3; i++) {
      $('c' + (i + 1) + 'Name').value = d.contacts[i].name || '';
      $('c' + (i + 1) + 'Rel').value = d.contacts[i].relationship || '';
      $('c' + (i + 1) + 'Phone').value = d.contacts[i].phone || '';
    }
    var primaryIdx = 0;
    d.contacts.forEach(function (c, idx) { if (c.primary) primaryIdx = idx; });
    var radio = document.querySelector('input[name="callFirst"][value="' + primaryIdx + '"]');
    if (radio) radio.checked = true;

    $('bloodType').value = d.bloodType || '';
    $('allergies').value = d.allergies || '';
    $('medications').value = d.medications || '';
    $('conditions').value = d.conditions || '';
    $('organDonor').value = d.organDonor || '';
    $('doctor').value = d.doctor || '';

    for (var b = 0; b < 2; b++) {
      $('bank' + (b + 1) + 'Label').value = d.banks[b].name || '';
      $('bank' + (b + 1) + 'Phone').value = d.banks[b].phone || '';
    }
    $('notes').value = d.notes || '';
    $('qrToggle').checked = d.qr !== false;
    $('rememberDevice').checked = state.remember;
    syncAvatarUI();
  }

  /* ------------------------------------------------------------------ *
   * Persistence (only when the user asks for it)
   * ------------------------------------------------------------------ */
  function saveDraft() {
    if (!state.remember) return;
    Store.set('draft', state.data);
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 420);
  }

  function savePrefs() {
    Store.set('prefs', {
      theme: state.theme, layout: state.layout, side: state.side, showGuide: state.showGuide
    });
  }

  /* ------------------------------------------------------------------ *
   * Progress
   * ------------------------------------------------------------------ */
  function filledContacts() {
    return state.data.contacts.filter(function (c) {
      return (c.name && c.name.trim()) || (c.phone && c.phone.trim());
    }).length;
  }

  function stepDone() {
    var d = state.data;
    return [
      !!(d.name.trim() || d.spokenLanguage.trim() || d.avatar.type !== 'none'),
      filledContacts() > 0,
      !!(d.bloodType || d.allergies.trim() || d.medications.trim() || d.conditions.trim() || d.organDonor || d.doctor.trim()),
      d.banks.some(function (b) { return b.name.trim() || b.phone.trim(); }),
      !!d.notes.trim()
    ];
  }

  function updateProgress() {
    var done = stepDone();
    var count = done.filter(Boolean).length;
    var pct = Math.round(count / 5 * 100);
    progressBar.style.width = pct + '%';
    progressBar.parentNode.setAttribute('aria-valuenow', String(pct));
    progressText.textContent = pct + '%';
    $$('.step').forEach(function (el, idx) {
      el.setAttribute('data-complete', done[idx] ? 'true' : 'false');
    });
    for (var i = 0; i < done.length; i++) {
      if (ready && done[i] && !lastDone[i]) Sound.play('step');
    }
    lastDone = done;
  }

  /* ------------------------------------------------------------------ *
   * Phone validation — loose on purpose
   * ------------------------------------------------------------------ */
  function phoneLooksValid(value) {
    var v = value.trim();
    if (!v) return true;
    if (!/^[+()\d][\d\s().\u2013-]*$/.test(v)) return false;
    var digits = v.replace(/\D/g, '');
    return digits.length >= 5;
  }

  function checkPhones() {
    for (var i = 0; i < 3; i++) {
      var input = $('c' + (i + 1) + 'Phone');
      var err = $('c' + (i + 1) + 'PhoneErr');
      var bad = !phoneLooksValid(input.value);
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (err) err.textContent = bad ? T('form.validatePhone') : '';
    }
  }

  /* ------------------------------------------------------------------ *
   * Privacy check
   * ------------------------------------------------------------------ */
  var RULES = [
    {
      key: 'address',
      msg: 'form.privacyAddress',
      re: /(\b(street|st\.|road|rd\.|avenue|ave\.|lane|drive|close|house|flat|apartment|apt\.|suite|floor|block|sector|colony|nagar|mohalla|gali|postal|zip|pin\s?code|address|po\s?box)\b)/i
    },
    {
      key: 'dob',
      msg: 'form.privacyDob',
      re: /(\b\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}\b)|(\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b)|(\bborn\s+(on|in)\b)/i
    },
    {
      key: 'id',
      msg: 'form.privacyId',
      re: /(\b\d{5}-?\d{7}-?\d\b)|(\b\d{3}-\d{2}-\d{4}\b)|(\b[A-Z]{1,2}\d{6,8}\b)/i
    },
    {
      key: 'card',
      msg: 'form.privacyCard',
      re: /^(?=(?:\D*\d){13,19}\D*$)(?!\+)[\d][\d \-]*$/
    }
  ];

  function scanValue(text) {
    var hits = [];
    var value = String(text || '');
    if (!value.trim()) return hits;
    RULES.forEach(function (rule) {
      if (rule.key === 'card') {
        // Card pattern only for long digit groups without a leading +.
        if (rule.re.test(value.trim())) hits.push(rule);
        return;
      }
      if (rule.re.test(value)) hits.push(rule);
    });
    return hits;
  }

  function updatePrivacy() {
    var d = state.data;
    var fields = [
      { id: 'notes', name: T('form.notesLabel'), value: d.notes },
      { id: 'allergies', name: T('form.allergiesLabel'), value: d.allergies },
      { id: 'medications', name: T('form.medsLabel'), value: d.medications },
      { id: 'conditions', name: T('form.conditionsLabel'), value: d.conditions },
      { id: 'doctor', name: T('form.doctorLabel'), value: d.doctor },
      { id: 'c2Rel', name: T('form.contactN', { n: 2 }), value: d.contacts[1].relationship },
      { id: 'c3Rel', name: T('form.contactN', { n: 3 }), value: d.contacts[2].relationship }
    ];

    var warnings = [];
    fields.forEach(function (f) {
      scanValue(f.value).forEach(function (rule) {
        warnings.push({ msg: T(rule.msg), field: f.id, fieldName: f.name });
      });
    });

    privacyBox.innerHTML = '';
    if (!warnings.length) {
      privacyBox.innerHTML = '<h3>' + shieldIcon() + '<span>' + esc(T('form.privacyTitle')) + '</span></h3>' +
        '<p class="privacy-ok">' + checkIcon() + '<span>' + esc(T('form.privacyOk')) + '</span></p>';
      return;
    }

    var h = document.createElement('h3');
    h.innerHTML = alertIcon() + '<span>' + esc(T('form.privacyTitle')) + '</span>';
    privacyBox.appendChild(h);

    var intro = document.createElement('p');
    intro.className = 'small muted';
    intro.textContent = T('form.privacyIntro');
    privacyBox.appendChild(intro);

    var ul = document.createElement('ul');
    ul.className = 'privacy-list';
    warnings.forEach(function (w) {
      var li = document.createElement('li');
      li.className = 'privacy-item';
      li.innerHTML = alertIcon() + '<p><strong>' + esc(w.fieldName) + ':</strong> ' + esc(w.msg) + '</p>';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'privacy-fix';
      btn.textContent = T('form.privacyFix');
      btn.addEventListener('click', function () {
        var target = $(w.field);
        if (!target) return;
        var step = target.closest('.step');
        if (step) step.setAttribute('data-open', 'true');
        target.focus();
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    privacyBox.appendChild(ul);
  }

  /* ------------------------------------------------------------------ *
   * Preview
   * ------------------------------------------------------------------ */
  var renderQueued = false;

  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;
    window.requestAnimationFrame(function () {
      renderQueued = false;
      renderPreview();
    });
  }

  function renderPreview() {
    if (!canvas) return;
    var rtl = CARD.isRTLData(state.data);
    var meta = CARD.render(canvas, {
      layout: state.layout,
      side: state.side,
      theme: state.theme,
      data: state.data,
      avatarImg: avatarImg,
      showQr: state.data.qr,
      qrPayload: CARD.qrPayload(state.data),
      rtl: rtl
    });

    updateFit(meta);
    positionPulse(meta.primary);
    updateGuide();
    canvas.setAttribute('aria-label', CARD.altText(state.data));
    printDirty = true;

    if (state.layout === 'print') {
      clearTimeout(renderPreview.printTimer);
      renderPreview.printTimer = setTimeout(paintPrintCanvas, 500);
    }
  }

  function updateFit(meta) {
    if (!fitMsg) return;
    var icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
    var state_ = 'ok';
    var msg = T('form.fitOk');

    if (meta.overflow) {
      state_ = 'warn';
      msg = T('form.fitOverflow');
      icon = alertIcon();
    } else if (meta.dropped && meta.dropped.length) {
      var names = meta.dropped.filter(function (k) { return k !== 'footer' && k !== 'identity'; }).map(function (k) {
        return T(DROP_LABEL[k] || 'form.fitMeasure');
      });
      if (names.length) {
        state_ = 'warn';
        msg = T('form.fitDropped', { list: names.join(', ') });
        icon = alertIcon();
      }
    } else if (meta.scale < 0.999) {
      msg = T('form.fitShrunk');
    }

    fitMsg.setAttribute('data-state', state_);
    fitMsg.innerHTML = icon + '<span>' + esc(msg) + '</span>';
  }

  var DROP_LABEL = {
    identity: 'form.nameLabel',
    primary: 'card.callFirst',
    contacts: 'card.alsoCall',
    vitals: 'card.blood',
    details: 'card.conditions',
    bank: 'card.bank',
    notes: 'card.notes',
    qr: 'form.qrLabel',
    footer: 'card.notRecord'
  };

  function positionPulse(rect) {
    if (!pulse) return;
    var phys = CARD.PHYS[state.layout];
    if (!rect || state.layout === 'print') {
      pulse.hidden = true;
      return;
    }
    pulse.hidden = false;
    pulse.style.left = (rect.x / phys.w * 100) + '%';
    pulse.style.top = (rect.y / phys.h * 100) + '%';
    pulse.style.width = (rect.w / phys.w * 100) + '%';
    pulse.style.height = (rect.h / phys.h * 100) + '%';
  }

  function updateGuide() {
    if (!guideLayer) return;
    var show = state.layout === 'lock' && state.showGuide;
    guideLayer.hidden = !show;
  }

  /* ------------------------------------------------------------------ *
   * Avatar
   * ------------------------------------------------------------------ */
  function syncAvatarUI() {
    var av = state.data.avatar;
    var preview = $('avatarPreview');
    if (preview) {
      if (av.type === 'emoji' && av.value) {
        preview.innerHTML = '<span aria-hidden="true">' + esc(av.value) + '</span>';
      } else if (av.type === 'photo' && av.value) {
        preview.innerHTML = '<img alt="" src="' + av.value + '">';
      } else {
        preview.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5"/></svg>';
      }
    }
    $$('[data-emoji]').forEach(function (btn) {
      var on = av.type === 'emoji' && av.value === btn.getAttribute('data-emoji');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function loadAvatarImage(url) {
    if (!url) { avatarImg = null; return; }
    var img = new Image();
    img.onload = function () {
      avatarImg = img;
      scheduleRender();
    };
    img.onerror = function () { avatarImg = null; };
    img.src = url;
  }

  function handlePhoto(file) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      window.ICE.toast(T('toast.photoBig'));
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        try {
          var out = document.createElement('canvas');
          out.width = 512;
          out.height = 512;
          var cx = out.getContext('2d');
          var side = Math.min(img.naturalWidth, img.naturalHeight);
          cx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 512, 512);
          var url = out.toDataURL('image/jpeg', 0.86);
          state.data.avatar = { type: 'photo', value: url };
          loadAvatarImage(url);
          syncAvatarUI();
          onChange(false);
        } catch (err) {
          window.ICE.toast(T('toast.photoFail'));
        }
      };
      img.onerror = function () { window.ICE.toast(T('toast.photoFail')); };
      img.src = reader.result;
    };
    reader.onerror = function () { window.ICE.toast(T('toast.photoFail')); };
    reader.readAsDataURL(file);
  }

  /* ------------------------------------------------------------------ *
   * Change pipeline
   * ------------------------------------------------------------------ */
  function onChange(playSound) {
    readForm();
    updateProgress();
    updatePrivacy();
    checkPhones();
    scheduleRender();
    scheduleSave();
    if (playSound) Sound.play('click');
  }

  /* ------------------------------------------------------------------ *
   * Escape helper + icons
   * ------------------------------------------------------------------ */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function alertIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4 2.6 20h18.8L12 4z"/><path d="M12 9.6v4.4M12 17h.01"/></svg>';
  }

  function checkIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
  }

  function shieldIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.2 19 6v5.6c0 4.4-3 7.6-7 9.2-4-1.6-7-4.8-7-9.2V6l7-2.8z"/><path d="M8.7 12.1l2.3 2.3 4.4-4.6"/></svg>';
  }

  /* ------------------------------------------------------------------ *
   * Export
   * ------------------------------------------------------------------ */
  function activeCanvas() {
    if (state.layout === 'print') {
      paintPrintCanvas();
      return printCanvas;
    }
    return canvas;
  }

  function paintPrintCanvas() {
    if (!printCanvas) return;
    CARD.render(printCanvas, {
      layout: 'print',
      theme: state.theme,
      data: state.data,
      avatarImg: avatarImg,
      showQr: state.data.qr,
      qrPayload: CARD.qrPayload(state.data),
      rtl: CARD.isRTLData(state.data)
    });
    printDirty = false;
  }

  function canvasBlob(cv) {
    return new Promise(function (resolve, reject) {
      if (!cv) { reject(new Error('no canvas')); return; }
      if (cv.toBlob) {
        cv.toBlob(function (blob) {
          if (blob) resolve(blob);
          else reject(new Error('empty blob'));
        }, 'image/png');
        return;
      }
      try {
        var data = cv.toDataURL('image/png');
        var bin = atob(data.split(',')[1]);
        var arr = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        resolve(new Blob([arr], { type: 'image/png' }));
      } catch (err) {
        reject(err);
      }
    });
  }

  function fileName() {
    if (state.layout === 'lock') return 'ice-card-lock-screen.png';
    if (state.layout === 'wallet') return 'ice-card-wallet-' + state.side + '.png';
    return 'ice-card-a4-print-sheet.png';
  }

  function downloadBlob(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 2000);
  }

  function canShareBlob(blob) {
    try {
      return !!(navigator.canShare && window.File &&
        navigator.canShare({ files: [new File([blob], 'card.png', { type: 'image/png' })] }));
    } catch (err) {
      return false;
    }
  }

  function showResult(blob) {
    currentBlob = blob;
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = URL.createObjectURL(blob);
    resultImg.src = currentBlobUrl;
    resultImg.alt = CARD.altText(state.data);
    resultDownload.href = currentBlobUrl;
    resultDownload.download = fileName();
    if (resultShare) {
      var shareable = canShareBlob(blob);
      resultShare.hidden = !shareable;
    }
    result.setAttribute('data-show', 'true');
    setDrawer(true);
    window.ICE.confetti();
    Sound.play('success');
    setTimeout(function () {
      result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 80);
  }

  function saveImage() {
    window.ICE.toast(T('form.exportPreparing'));
    var cv = activeCanvas();
    canvasBlob(cv).then(function (blob) {
      showResult(blob);
      downloadBlob(blob);
      window.ICE.toast(T('toast.saved'));
    }).catch(function () {
      window.ICE.toast(T('form.exportFail'));
    });
  }

  function shareCurrent() {
    if (!currentBlob) return;
    if (!canShareBlob(currentBlob)) {
      downloadBlob(currentBlob);
      window.ICE.toast(T('form.exportNoShare'));
      return;
    }
    var file = new File([currentBlob], fileName(), { type: 'image/png' });
    navigator.share({
      files: [file],
      title: T('form.exportSavedTitle'),
      text: T('card.notRecord')
    }).catch(function () { /* cancelled */ });
  }

  function copyImage() {
    var cv = activeCanvas();
    if (!navigator.clipboard || !navigator.clipboard.write || !window.ClipboardItem) {
      window.ICE.toast(T('form.exportCopyFail'));
      return;
    }
    try {
      // Passing the promise keeps the user gesture alive in Safari.
      var item = new ClipboardItem({ 'image/png': canvasBlob(cv) });
      navigator.clipboard.write([item]).then(function () {
        window.ICE.toast(T('toast.copied'));
        Sound.play('success');
      }).catch(function () {
        window.ICE.toast(T('form.exportCopyFail'));
      });
    } catch (err) {
      window.ICE.toast(T('form.exportCopyFail'));
    }
  }

  function printSheet() {
    paintPrintCanvas();
    window.ICE.toast(T('toast.printing'));
    setTimeout(function () {
      try { window.print(); } catch (err) { /* ignore */ }
    }, 120);
  }

  /* ------------------------------------------------------------------ *
   * UI: steps, themes, layout, drawer
   * ------------------------------------------------------------------ */
  var drawer = document.querySelector('.preview-col');
  var handle = $('drawerHandle');
  var scrim = $('previewScrim');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute('data-open', open ? 'true' : 'false');
    if (scrim) scrim.setAttribute('data-show', open ? 'true' : 'false');
    if (handle) handle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setThemeUI() {
    $$('[data-theme-opt]').forEach(function (btn) {
      var on = btn.getAttribute('data-theme-opt') === state.theme;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function setLayoutUI() {
    $$('[data-layout]').forEach(function (btn) {
      btn.setAttribute('aria-selected', btn.getAttribute('data-layout') === state.layout ? 'true' : 'false');
    });
    var sideControls = $('sideControls');
    var guideRow = $('guideRow');
    if (sideControls) sideControls.hidden = state.layout !== 'wallet';
    if (guideRow) guideRow.hidden = state.layout !== 'lock';
    $$('[data-side]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-side') === state.side ? 'true' : 'false');
    });
  }

  function flipTo(side) {
    if (state.side === side) return;
    state.side = side;
    setLayoutUI();
    savePrefs();
    if (stage) {
      stage.classList.remove('is-flipping');
      // Force a reflow so the animation can run again.
      void stage.offsetWidth;
      stage.classList.add('is-flipping');
    }
    renderPreview();
    Sound.play('click');
  }

  /* ------------------------------------------------------------------ *
   * Wiring
   * ------------------------------------------------------------------ */
  function wire() {
    // Enter in a text input should never reload the page.
    root.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstEmpty = root.querySelector('.step[data-open="true"] .input');
      if (firstEmpty) firstEmpty.focus();
    });

    root.addEventListener('input', function (e) {
      if (e.target.type === 'file' || e.target.id === 'rememberDevice') return;
      onChange(false);
    });
    root.addEventListener('change', function (e) {
      if (e.target.type === 'file' || e.target.id === 'rememberDevice') return;
      onChange(false);
    });

    $$('.step-toggle').forEach(function (btn) {
      var step = btn.closest('.step');
      var open = step.getAttribute('data-open') === 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.addEventListener('click', function () {
        var isOpen = step.getAttribute('data-open') === 'true';
        step.setAttribute('data-open', isOpen ? 'false' : 'true');
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        Sound.play('click');
      });
    });

    $$('[data-theme-opt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.theme = btn.getAttribute('data-theme-opt');
        setThemeUI();
        savePrefs();
        renderPreview();
        Sound.play('click');
      });
    });

    $$('[data-layout]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-layout');
        if (!next || next === state.layout) return;
        state.layout = next;
        setLayoutUI();
        savePrefs();
        renderPreview();
        Sound.play('click');
      });
    });

    $$('[data-side]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        flipTo(btn.getAttribute('data-side'));
      });
    });

    var guideToggle = $('guideToggle');
    if (guideToggle) {
      guideToggle.addEventListener('change', function () {
        state.showGuide = guideToggle.checked;
        updateGuide();
        savePrefs();
      });
    }

    var qrToggle = $('qrToggle');
    if (qrToggle) {
      qrToggle.addEventListener('change', function () {
        state.data.qr = qrToggle.checked;
        scheduleRender();
        scheduleSave();
        Sound.play('click');
      });
    }

    $$('[data-emoji]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-emoji');
        var isOn = state.data.avatar.type === 'emoji' && state.data.avatar.value === val;
        state.data.avatar = isOn ? { type: 'none', value: '' } : { type: 'emoji', value: val };
        avatarImg = null;
        syncAvatarUI();
        onChange(false);
        Sound.play('click');
      });
    });

    var avatarClear = $('avatarClear');
    if (avatarClear) {
      avatarClear.addEventListener('click', function () {
        state.data.avatar = { type: 'none', value: '' };
        avatarImg = null;
        syncAvatarUI();
        onChange(false);
        Sound.play('click');
      });
    }

    var avatarPhoto = $('avatarPhoto');
    if (avatarPhoto) {
      avatarPhoto.addEventListener('change', function (e) {
        handlePhoto(e.target.files && e.target.files[0]);
        e.target.value = '';
      });
    }

    var remember = $('rememberDevice');
    if (remember) {
      remember.addEventListener('change', function () {
        state.remember = remember.checked;
        Store.set('remember', state.remember);
        if (state.remember) {
          saveDraft();
        } else {
          Store.remove('draft');
          window.ICE.toast(T('toast.rememberOff'));
        }
        Sound.play('click');
      });
    }

    var saveBtn = $('saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveImage);

    var copyBtn = $('copyBtn');
    if (copyBtn) copyBtn.addEventListener('click', copyImage);

    var printBtn = $('printBtn');
    if (printBtn) printBtn.addEventListener('click', printSheet);

    if (resultShare) resultShare.addEventListener('click', shareCurrent);

    if (handle) {
      handle.addEventListener('click', function () {
        var open = drawer.getAttribute('data-open') === 'true';
        setDrawer(!open);
        Sound.play('soft');
      });
    }
    if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.getAttribute('data-open') === 'true') {
        setDrawer(false);
      }
    });

    window.addEventListener('beforeprint', paintPrintCanvas);
    document.addEventListener('ice:fonts', function () { renderPreview(); });
    document.addEventListener('ice:lang', function () {
      updatePrivacy();
      checkPhones();
      renderPreview();
      if (result.getAttribute('data-show') === 'true') {
        resultImg.alt = CARD.altText(state.data);
      }
    });

    document.addEventListener('ice:cleared', function () {
      state.data = blankData();
      state.remember = false;
      avatarImg = null;
      ready = false;
      writeForm();
      updateProgress();
      updatePrivacy();
      checkPhones();
      renderPreview();
      result.setAttribute('data-show', 'false');
      lastDone = [false, false, false, false, false];
      ready = true;
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  var ready = false;

  function init() {
    var savedPrefs = Store.get('prefs', null);
    if (savedPrefs && typeof savedPrefs === 'object') {
      if (CARD.THEMES[savedPrefs.theme]) state.theme = savedPrefs.theme;
      if (['lock', 'wallet', 'print'].indexOf(savedPrefs.layout) >= 0) state.layout = savedPrefs.layout;
      if (savedPrefs.side === 'back') state.side = 'back';
      if (typeof savedPrefs.showGuide === 'boolean') state.showGuide = savedPrefs.showGuide;
    }

    var stored = Store.get('remember', false) ? Store.get('draft', null) : null;
    if (stored) state.data = normalise(stored);
    if (state.data.avatar.type === 'photo' && state.data.avatar.value) {
      loadAvatarImage(state.data.avatar.value);
    }

    writeForm();
    if ($('guideToggle')) $('guideToggle').checked = state.showGuide !== false;
    setThemeUI();
    setLayoutUI();
    updateProgress();
    updatePrivacy();
    checkPhones();

    wire();
    renderPreview();

    ready = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ICE_CREATE = {
    state: state,
    readForm: readForm,
    writeForm: writeForm,
    onChange: onChange,
    renderPreview: renderPreview,
    updatePrivacy: updatePrivacy,
    paintPrintCanvas: paintPrintCanvas
  };
})();

