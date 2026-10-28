(function(){
  const TIERS = [
    { key: 'normal', name: 'Normal', desc: 'Classic tells', multiplier: 1.0 },
    { key: 'intermediate', name: 'Intermediate', desc: 'Subtle clues', multiplier: 1.2 },
    { key: 'pro', name: 'Pro', desc: 'Deceptive polish', multiplier: 1.4 },
    { key: 'dangerous', name: 'Dangerous', desc: 'Highly convincing', multiplier: 1.6 },
    { key: 'barely', name: 'Barely Spotable', desc: 'Almost indistinguishable', multiplier: 2.0 }
  ];

  const BANK = [
    { id:'n1', type:'email', tier:'normal', verdict:'phish', url:'mail-client.local/inbox', body:'<div style="display:flex;flex-direction:column;gap:18px;color:#d4d4d4;font-size:0.98rem;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"><div style="display:flex;gap:12px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f59e0b,#b45309);font-weight:600;">AP</div><div style="display:flex;flex-direction:column;gap:2px;"><span style="color:#f5f5f5;">Accounts Payable</span><span style="color:#737373;font-size:0.9rem;">ap-notices@vendor-invoice-portal.net</span></div></div><span style="color:#737373;font-size:0.9rem;">09:17</span></div><div style="display:flex;flex-direction:column;gap:10px;"><h2 style="font-size:clamp(1.4rem,4vw,2rem);letter-spacing:-0.02em;font-weight:600;color:#f5f5f5;">Revised invoice attached for approval</h2><p>Hi Detective,</p><p>We spotted a small VAT correction on PO-8841. Please review the attached updated invoice and approve payment today so we can release funds before cutoff.</p><p>Attachment: <span style="color:#a3a3a3;">PO-8841-Revised.pdf.exe</span></p><p style="color:#737373;">Regards,<br>Martin Ellis<br>Northline Vendors</p></div></div>', explanation:'The sender domain is unrelated to the stated vendor. The attachment is a double extension (.pdf.exe). Urgency is a pressure tactic.', clues:['Unrelated sending domain','Double file extension','Urgency pressure'] },
    { id:'n2', type:'page', tier:'normal', verdict:'safe', url:'https://login.microsoftonline.com/common/oauth2/v2.0/authorize', body:'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;color:#1f2937;min-height:420px;"><div style="display:flex;gap:4px;"><span style="width:18px;height:18px;background:#f25022;"></span><span style="width:18px;height:18px;background:#7fba00;"></span><span style="width:18px;height:18px;background:#00a4ef;"></span><span style="width:18px;height:18px;background:#ffb900;"></span></div><div style="display:flex;flex-direction:column;gap:6px;"><h2 style="font-size:1.6rem;font-weight:600;">Sign in</h2><p style="color:#4b5563;">to continue to Microsoft 365</p></div><div style="width:min(320px,100%);display:flex;flex-direction:column;gap:14px;text-align:left;"><div style="border:1px solid #d1d5db;border-radius:2px;padding:10px 12px;color:#6b7280;">Email, phone, or Skype</div><div style="border:1px solid #d1d5db;border-radius:2px;padding:10px 12px;color:#6b7280;">Password</div><button style="align-self:flex-end;background:#0067b8;color:#fff;border:none;padding:8px 24px;font-size:0.95rem;">Sign in</button></div></div>', explanation:'Correct microsoftonline.com domain, standard OAuth flow.', clues:['Official Microsoft domain','Expected credential fields'] },
    { id:'n3', type:'email', tier:'normal', verdict:'phish', url:'mail-client.local/inbox', body:'<div style="display:flex;flex-direction:column;gap:18px;color:#d4d4d4;font-size:0.98rem;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"><div style="display:flex;gap:12px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#3b82f6,#1d4ed8);font-weight:600;">IT</div><div style="display:flex;flex-direction:column;gap:2px;"><span style="color:#f5f5f5;">IT Security</span><span style="color:#737373;font-size:0.9rem;">security-alert@workspace-secure-help.com</span></div></div><span style="color:#737373;font-size:0.9rem;">07:42</span></div><div style="display:flex;flex-direction:column;gap:10px;"><h2 style="font-size:clamp(1.4rem,4vw,2rem);letter-spacing:-0.02em;font-weight:600;color:#f5f5f5;">Password expires in 15 minutes</h2><p>Detective, we detected unusual sign-in attempts.</p><p>Verify your password now to prevent lockout.</p><p style="color:#a3a3a3;">https://workspace-auth-check.com/reset</p></div></div>', explanation:'15-minute countdown is panic. Wrong domain.', clues:['Artificial deadline','Unrelated domain','Lockout threat'] },
    { id:'n4', type:'page', tier:'normal', verdict:'safe', url:'https://accounts.google.com/signin/v2/identifier', body:'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;color:#202124;min-height:420px;"><div style="font-size:1.8rem;"><span style="color:#4285f4;">G</span><span style="color:#ea4335;">o</span><span style="color:#fbbc05;">o</span><span style="color:#4285f4;">g</span><span style="color:#34a853;">l</span><span style="color:#ea4335;">e</span></div><div style="display:flex;flex-direction:column;gap:6px;"><h2 style="font-size:1.6rem;font-weight:400;">Sign in</h2><p>to continue to Gmail</p></div><div style="width:min(340px,100%);display:flex;flex-direction:column;gap:14px;text-align:left;"><div style="border:1px solid #dadce0;border-radius:4px;padding:12px 14px;color:#5f6368;">Email or phone</div><div style="align-self:flex-end;background:#1a73e8;color:#fff;padding:9px 26px;border-radius:4px;">Next</div></div></div>', explanation:'Official Google domain.', clues:['accounts.google.com','Standard flow'] },
    { id:'n5', type:'email', tier:'normal', verdict:'phish', url:'mail-client.local/inbox', body:'<div style="display:flex;flex-direction:column;gap:18px;color:#d4d4d4;font-size:0.98rem;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"><div style="display:flex;gap:12px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f97316,#ea580c);font-weight:600;">DL</div><div style="display:flex;flex-direction:column;gap:2px;"><span style="color:#f5f5f5;">Delivery Notice</span><span style="color:#737373;font-size:0.9rem;">parcel-update@tracking-reschedule.org</span></div></div><span style="color:#737373;font-size:0.9rem;">Yesterday</span></div><div style="display:flex;flex-direction:column;gap:10px;"><h2 style="font-size:clamp(1.4rem,4vw,2rem);letter-spacing:-0.02em;font-weight:600;color:#f5f5f5;">Delivery attempt failed</h2><p>Detective, we couldn\'t deliver your parcel.</p><p>Pay €1.49 redelivery fee within 2 hours.</p><p style="color:#a3a3a3;">reschedule.tracking-reschedule.org/fee</p></div></div>', explanation:'Small payment to carrier is suspicious.', clues:['Payment request','Non-carrier domain'] },
    
    { id:'i1', type:'email', tier:'intermediate', verdict:'phish', url:'mail-client.local/inbox', body:'<div style="display:flex;flex-direction:column;gap:18px;color:#d4d4d4;font-size:0.98rem;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"><div style="display:flex;gap:12px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6366f1,#4f46e5);font-weight:600;">MS</div><div style="display:flex;flex-direction:column;gap:2px;"><span style="color:#f5f5f5;">Microsoft 365</span><span style="color:#737373;font-size:0.9rem;">no-reply@micros0ft-notifications.com</span></div></div><span style="color:#737373;font-size:0.9rem;">10:24</span></div><div style="display:flex;flex-direction:column;gap:10px;"><h2 style="font-size:clamp(1.4rem,4vw,2rem);letter-spacing:-0.02em;font-weight:600;color:#f5f5f5;">Your subscription will expire soon</h2><p>Detective, your Microsoft 365 subscription expires in 2 days.</p><p>Renew now: micros0ft-notifications.com/renew</p></div></div>', explanation:'Zero instead of o in Microsoft domain.', clues:['Lookalike domain','0 vs o'] },
    { id:'i2', type:'page', tier:'intermediate', verdict:'phish', url:'https://login-microsoftonline-secure.com/common/oauth2/authorize', body:'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;color:#1f2937;min-height:420px;"><div style="display:flex;gap:4px;"><span style="width:18px;height:18px;background:#f25022;"></span><span style="width:18px;height:18px;background:#7fba00;"></span><span style="width:18px;height:18px;background:#00a4ef;"></span><span style="width:18px;height:18px;background:#ffb900;"></span></div><div style="display:flex;flex-direction:column;gap:6px;"><h2 style="font-size:1.6rem;font-weight:600;">Sign in</h2><p style="color:#4b5563;">to continue to Microsoft 365</p></div><div style="width:min(320px,100%);display:flex;flex-direction:column;gap:14px;text-align:left;"><div style="border:1px solid #d1d5db;border-radius:2px;padding:10px 12px;color:#6b7280;">Email, phone, or Skype</div><div style="border:1px solid #d1d5db;border-radius:2px;padding:10px 12px;color:#6b7280;">Password</div><button style="align-self:flex-end;background:#0067b8;color:#fff;border:none;padding:8px 24px;">Sign in</button></div></div>', explanation:'Extra words in domain.', clues:['login-microsoftonline-secure.com not official'] },
    
    { id:'p1', type:'email', tier:'pro', verdict:'phish', url:'mail-client.local/inbox', body:'<div style="display:flex;flex-direction:column;gap:18px;color:#d4d4d4;font-size:0.98rem;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"><div style="display:flex;gap:12px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f43f5e,#e11d48);font-weight:600;">AD</div><div style="display:flex;flex-direction:column;gap:2px;"><span style="color:#f5f5f5;">Adobe</span><span style="color:#737373;font-size:0.9rem;">noreply@adobe-id-notification.com</span></div></div><span style="color:#737373;font-size:0.9rem;">09:43</span></div><div style="display:flex;flex-direction:column;gap:10px;"><h2 style="font-size:clamp(1.4rem,4vw,2rem);letter-spacing:-0.02em;font-weight:600;color:#f5f5f5;">Your Adobe ID was used to sign in</h2><p>Detective, sign-in from new device detected.</p><p>If this wasn\'t you, secure your account.</p><p style="color:#a3a3a3;">https://adobe-secure-access.com/verify</p></div></div>', explanation:'Lookalike Adobe domain.', clues:['adobe-id-notification.com not adobe.com'] },
    { id:'p2', type:'page', tier:'pro', verdict:'phish', url:'https://secure-login-amazon.com/ap/signin', body:'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;color:#1f2937;min-height:420px;background:#f7f7f7;"><div style="font-size:2rem;font-weight:700;">amazon</div><div style="width:min(340px,100%);background:#fff;border:1px solid #d5d9d9;border-radius:4px;padding:clamp(20px,4vw,28px);display:flex;flex-direction:column;gap:16px;text-align:left;"><div style="display:flex;flex-direction:column;gap:4px;"><h2 style="font-size:1.6rem;font-weight:400;">Sign in</h2></div><div style="display:flex;flex-direction:column;gap:8px;"><label style="font-weight:700;font-size:0.9rem;">Email or mobile phone number</label><div style="border:1px solid #a6a6a6;border-radius:3px;padding:8px 10px;color:#6b7280;"></div></div><div style="display:flex;flex-direction:column;gap:8px;"><label style="font-weight:700;font-size:0.9rem;">Password</label><div style="border:1px solid #a6a6a6;border-radius:3px;padding:8px 10px;color:#6b7280;"></div></div><button style="background:linear-gradient(to bottom,#f7dfa5,#f0c14b);border:1px solid #a88734;padding:8px 16px;border-radius:3px;">Sign in</button></div></div>', explanation:'secure-login-amazon.com not amazon.com.', clues:['Extra words in domain'] },
    
    { id:'d1', type:'page', tier:'dangerous', verdict:'phish', url:'https://docusign-envelopes.com/Signing/Start.aspx', body:'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;color:#1f2937;min-height:420px;background:#f8f9fa;"><div style="font-size:1.8rem;font-weight:700;color:#4d4d4d;">DOCUSIGN</div><div style="width:min(480px,100%);background:#fff;border:1px solid #d8d8d8;border-radius:4px;padding:clamp(24px,4vw,40px);display:flex;flex-direction:column;gap:20px;"><div style="display:flex;flex-direction:column;gap:6px;"><h2 style="font-size:1.4rem;font-weight:600;">Review and sign document</h2><p style="color:#6b6b6b;">Contract_Amendment.pdf</p></div><p style="color:#4d4d4d;">Please review and click to sign.</p><button style="align-self:flex-start;background:#1a73e8;color:#fff;border:none;padding:10px 24px;">Start Signing</button></div></div>', explanation:'Not official docusign.com domain.', clues:['docusign-envelopes.com not docusign.com'] },
    { id:'d2', type:'email', tier:'dangerous', verdict:'phish', url:'mail-client.local/inbox', body:'<div style="display:flex;flex-direction:column;gap:18px;color:#d4d4d4;font-size:0.98rem;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"><div style="display:flex;gap:12px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ef4444,#dc2626);font-weight:600;">RB</div><div style="display:flex;flex-direction:column;gap:2px;"><span style="color:#f5f5f5;">Royal Bank Alerts</span><span style="color:#737373;font-size:0.9rem;">alerts@rb-secure-update.org</span></div></div><span style="color:#737373;font-size:0.9rem;">00:14</span></div><div style="display:flex;flex-direction:column;gap:10px;"><h2 style="font-size:clamp(1.4rem,4vw,2rem);letter-spacing:-0.02em;font-weight:600;color:#f5f5f5;">Suspicious transfer blocked</h2><p>Detective, we blocked a $842.16 transfer.</p><p>Verify identity within 30 minutes: rb-identity-check.org/verify</p></div></div>', explanation:'Bank never uses random domains.', clues:['Non-bank domain','Urgency'] },
    
    { id:'b1', type:'email', tier:'barely', verdict:'phish', url:'mail-client.local/inbox', body:'<div style="display:flex;flex-direction:column;gap:18px;color:#d4d4d4;font-size:0.98rem;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"><div style="display:flex;gap:12px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#64748b,#475569);font-weight:600;">SP</div><div style="display:flex;flex-direction:column;gap:2px;"><span style="color:#f5f5f5;">Support</span><span style="color:#737373;font-size:0.9rem;">noreply@paypal.com</span></div></div><span style="color:#737373;font-size:0.9rem;">16:32</span></div><div style="display:flex;flex-direction:column;gap:10px;"><h2 style="font-size:clamp(1.4rem,4vw,2rem);letter-spacing:-0.02em;font-weight:600;color:#f5f5f5;">Receipt for your payment</h2><p>Hi Detective,</p><p>You sent a payment of $299.99 to merchant-support@vendor.net</p><p>Transaction ID: 9XK842BGH9021</p><p>If you didn\'t make this payment, dispute this transaction.</p></div></div>', explanation:'Sender looks legit but payment details suspicious.', clues:['Check transaction details carefully'] },
    { id:'b2', type:'page', tier:'barely', verdict:'safe', url:'https://www.paypal.com/signin', body:'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;color:#2c2e2f;min-height:420px;background:#f5f7fa;"><div style="font-size:2rem;font-weight:700;color:#0070ba;">PayPal</div><div style="width:min(400px,100%);background:#fff;border-radius:8px;padding:clamp(24px,4vw,40px);display:flex;flex-direction:column;gap:20px;"><div style="display:flex;flex-direction:column;gap:6px;text-align:center;"><h2 style="font-size:1.6rem;font-weight:400;">Log In</h2></div><div style="display:flex;flex-direction:column;gap:16px;"><div style="border:1px solid #9da3a6;border-radius:4px;padding:12px 14px;color:#6c7378;">Email or mobile number</div><button style="background:#0070ba;color:#fff;border:none;border-radius:25px;padding:12px;font-size:1rem;font-weight:700;">Next</button></div></div></div>', explanation:'Official PayPal domain.', clues:['paypal.com'] }
  ];

  const state = { deck: [], index: 0, score: 0, streak: 0, best: 0, started: 0, name: 'Detective', answers: [], tier: 'normal', multiplier: 1.0, audioCtx: null, hints: 2, hintUsed: false };

  const home = document.getElementById('homeScreen');
  const game = document.getElementById('gameScreen');
  const results = document.getElementById('resultsScreen');
  const startBtn = document.getElementById('startBtn');
  const nameInput = document.getElementById('playerName');
  const quitBtn = document.getElementById('quitBtn');
  const logoHomeBtnEl = document.getElementById('logoHome');
  const actions = document.getElementById('actions');
  const actionBtns = document.querySelectorAll('.action-btn');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');
  const againBtn = document.getElementById('againBtn');
  const homeBtn = document.getElementById('homeBtn');
  const reviewBtn = document.getElementById('reviewBtn');
  const backFromReview = document.getElementById('backFromReview');
  const reviewList = document.getElementById('reviewList');
  const reviewScreen = document.getElementById('reviewScreen');
  const tierGrid = document.getElementById('tierGrid');
  const themeToggle = document.getElementById('themeToggle');
  const hintBtn = document.getElementById('hintBtn');
  const hintsLeftEl = document.getElementById('hintsLeft');
  const shareBtn = document.getElementById('shareBtn');
  const particlesCanvas = document.getElementById('particles');
  const scoreEl = document.getElementById('score');
  const streakEl = document.getElementById('streak');
  const caseCounter = document.getElementById('caseCounter');
  const progressFill = document.getElementById('progressFill');
  const caseType = document.getElementById('caseType');
  const tierIndicator = document.getElementById('tierIndicator');
  const multiplierEl = document.getElementById('multiplier');
  const artifact = document.getElementById('artifact');
  const artifactUrl = document.getElementById('artifactUrl');
  const stamp = document.getElementById('stamp');
  const stampText = document.getElementById('stampText');
  const feedbackKicker = document.getElementById('feedbackKicker');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackPoints = document.getElementById('feedbackPoints');
  const feedbackText = document.getElementById('feedbackText');
  const clueList = document.getElementById('clueList');
  const homeLeaderboard = document.getElementById('homeLeaderboard');
  const resultsLeaderboard = document.getElementById('resultsLeaderboard');
  const finalScore = document.getElementById('finalScore');
  const finalCorrect = document.getElementById('finalCorrect');
  const finalAccuracy = document.getElementById('finalAccuracy');
  const finalStreak = document.getElementById('finalStreak');
  const finalTier = document.getElementById('finalTier');
  const finalMessage = document.getElementById('finalMessage');

  function initAudio(){
    try {
      if(!state.audioCtx){ const AC = window.AudioContext||window.webkitAudioContext; if(AC) state.audioCtx = new AC(); }
      if(state.audioCtx && state.audioCtx.state==='suspended') state.audioCtx.resume();
    }catch(e){}
  }
  function playTone(f,d,t='sine'){ try{ initAudio(); if(!state.audioCtx)return; const ctx=state.audioCtx,o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g);g.connect(ctx.destination);o.frequency.value=f;o.type=t;g.gain.setValueAtTime(0.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.06,ctx.currentTime+0.01);g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+d);o.start(ctx.currentTime);o.stop(ctx.currentTime+d);}catch(e){} }
  function playClick(){ playTone(660,0.08,'square'); }
  function playCorrect(){ playTone(880,0.12,'triangle'); setTimeout(function(){playTone(1318,0.14,'sine');},70); setTimeout(function(){playTone(1568,0.16,'triangle');},140); }
  function playWrong(){ playTone(196,0.18,'sawtooth'); setTimeout(function(){playTone(146.83,0.22,'square');},90); setTimeout(function(){playTone(110,0.26,'sawtooth');},160); }

  function shuffle(a){ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=b[i];b[i]=b[j];b[j]=t; } return b; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  function loadLB(){ try{ return JSON.parse(localStorage.getItem('pd-lb-v3')||'[]'); }catch(e){ return []; } }
  function saveLB(list){ try{ localStorage.setItem('pd-lb-v3', JSON.stringify(list.slice(0,15))); }catch(e){} }
  function initTheme(){
    try {
      var t = localStorage.getItem('pd-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
      if(themeToggle) themeToggle.textContent = t === 'dark' ? '🌙' : '☀️';
    } catch(e){}
  }
  if(themeToggle){
    themeToggle.onclick = function(){
      playClick();
      var cur = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
      try { localStorage.setItem('pd-theme', next); } catch(e){}
    };
  }

  function initParticles(){
    if(!particlesCanvas) return;
    var ctx = particlesCanvas.getContext('2d');
    var particles = [];
    function resize(){
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for(var i=0;i<40;i++){
      particles.push({x:Math.random()*particlesCanvas.width, y:Math.random()*particlesCanvas.height, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, r:Math.random()*1.5+0.5});
    }
    function draw(){
      ctx.clearRect(0,0,particlesCanvas.width,particlesCanvas.height);
      ctx.fillStyle = 'rgba(34,197,94,0.3)';
      for(var i=0;i<particles.length;i++){
        var p=particles[i];
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>particlesCanvas.width) p.vx*=-1;
        if(p.y<0||p.y>particlesCanvas.height) p.vy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  if(hintBtn){
    hintBtn.onclick = function(){
      if(feedback && feedback.classList.contains('show')) return;
      if(state.hints <= 0) return;
      playClick();
      var c = state.deck[state.index];
      if(!c || !c.clues || !c.clues.length) return;
      state.hints--;
      if(hintsLeftEl) hintsLeftEl.textContent = state.hints;
      alert('HINT: ' + c.clues[0]);
      if(state.hints <= 0){
        hintBtn.disabled = true;
        hintBtn.style.opacity = '0.5';
      }
    };
  }

  if(shareBtn){
    shareBtn.onclick = function(){
      playClick();
      var scoreText = (document.getElementById('finalScore')?document.getElementById('finalScore').textContent:'0');
      var accText = (document.getElementById('finalAccuracy')?document.getElementById('finalAccuracy').textContent:'0%');
      var text = 'I scored ' + scoreText + ' points with ' + accText + ' accuracy in Phishing Detective! Test your skills too.';
      if(navigator.share){
        navigator.share({title:'Phishing Detective', text:text, url: window.location.href}).catch(function(){});
      }else if(navigator.clipboard){
        navigator.clipboard.writeText(text + ' ' + window.location.href).then(function(){ alert('Results copied to clipboard!'); });
      }else{
        alert(text);
      }
    };
  }

  if(reviewBtn){
    reviewBtn.onclick = function(){
      playClick();
      if(results) results.classList.remove('active');
      if(reviewScreen){
        reviewScreen.classList.add('active');
        if(reviewList){
          reviewList.innerHTML = '';
          for(var i=0;i<state.deck.length;i++){
            var c = state.deck[i];
            var ans = state.answers[i];
            var div = document.createElement('article');
            div.className = 'panel';
            div.innerHTML = '<header class="panel-header"><div class="panel-title-group"><span class="panel-title">Case ' + (i+1) + ' - ' + (c.type==='email'?'Email':c.type==='page'?'Web Page':'Investigation') + '</span><span class="panel-subtitle">Your answer: ' + (ans?ans.choice:'-').toUpperCase() + ' | Correct: ' + (c.verdict||'-').toUpperCase() + '</span></div></header><div class="panel-body" style="gap:0.75rem;"><div style="padding:1rem;background:var(--surface-2);border-radius:0.5rem;overflow:auto;max-height:200px;">' + c.body + '</div><p style="color:var(--text-secondary);"><strong>Explanation:</strong> ' + (c.explanation||'') + '</p><div class="clue-list">' + (c.clues?c.clues.map(function(cl){return '<div class="clue-item"><span class="clue-bullet">—</span><span>'+escapeHtml(cl)+'</span></div>';}).join(''):'') + '</div></div>';
            reviewList.appendChild(div);
          }
        }
        window.scrollTo({top:0, behavior:'smooth'});
      }
    };
  }

  if(backFromReview){
    backFromReview.onclick = function(){
      playClick();
      if(reviewScreen) reviewScreen.classList.remove('active');
      if(results) results.classList.add('active');
      window.scrollTo({top:0, behavior:'smooth'});
    };
  }

  function renderHomeLB(){
    var lb=document.getElementById('homeLeaderboard');
    if(!lb) return;
    var data=loadLB().slice(0,5);
    lb.innerHTML='';
    if(!data.length){ lb.innerHTML='<div class="empty">No runs yet</div>'; return; }
    for(var i=0;i<data.length;i++){
      var e=data[i];
      var item=document.createElement('div');
      item.className='leaderboard-item';
      item.innerHTML='<span class="leaderboard-rank">'+(i+1)+'</span><div class="leaderboard-name"><strong>'+escapeHtml(e.name)+'</strong><span>'+(e.acc||0)+'% · '+(e.tier||'Normal')+'</span></div><span class="leaderboard-score">'+e.score+'</span>';
      lb.appendChild(item);
    }
  }
  function renderResLB(cur){
    var lb=document.getElementById('resultsLeaderboard');
    if(!lb) return;
    var data=loadLB();
    lb.innerHTML='';
    if(!data.length){ lb.innerHTML='<div class="empty">Empty</div>'; return; }
    for(var i=0;i<Math.min(10,data.length);i++){
      var e=data[i];
      var item=document.createElement('div');
      item.className='leaderboard-item'+(cur&&e.id===cur.id?' me':'');
      item.innerHTML='<span class="leaderboard-rank">'+(i+1)+'</span><div class="leaderboard-name"><strong>'+escapeHtml(e.name)+'</strong><span>'+(e.correct||0)+'/'+(e.total||12)+' · '+(e.acc||0)+'%</span></div><span class="leaderboard-score">'+e.score+'</span>';
      lb.appendChild(item);
    }
  }

  function renderTiers(){
    if(!tierGrid) return;
    tierGrid.innerHTML='';
    for(let i=0;i<TIERS.length;i++){
      const tier=TIERS[i];
      const btn=document.createElement('button');
      btn.className='tier-btn'+(tier.key===state.tier?' active':'');
      btn.innerHTML='<span class="tier-name">'+tier.name+'</span><span class="tier-desc">'+tier.desc+' • x'+tier.multiplier.toFixed(1)+'</span>';
      btn.onclick=function(){
        playClick();
        state.tier=tier.key; state.multiplier=tier.multiplier;
        var btns=document.querySelectorAll('.tier-btn');
        for(var k=0;k<btns.length;k++) btns[k].classList.remove('active');
        btn.classList.add('active');
      };
      tierGrid.appendChild(btn);
    }
    var tt=TIERS.find(function(x){return x.key===state.tier;})||TIERS[0];
    state.multiplier=tt.multiplier;
  }

  if(startBtn) startBtn.onclick=function(){
    playClick(); initAudio();
    state.name=(nameInput&&nameInput.value?nameInput.value.trim():'Detective').slice(0,16)||'Detective';
    state.hints=2; state.hintUsed=false;
    if(hintsLeftEl) hintsLeftEl.textContent='2';
    if(hintBtn){ hintBtn.disabled=false; hintBtn.style.opacity='1'; }
    var pool=BANK.filter(function(c){return c.tier===state.tier;});
    if(pool.length<4) pool=BANK.slice();
    var selected=shuffle(pool).slice(0,6);
    state.deck=selected; state.index=0; state.score=0; state.streak=0; state.best=0; state.answers=[]; state.started=Date.now();
    if(home) home.classList.remove('active');
    if(results) results.classList.remove('active');
    if(game) game.classList.add('active');
    if(multiplierEl) multiplierEl.textContent='x'+state.multiplier.toFixed(1);
    var t2=TIERS.find(function(x){return x.key===state.tier;});
    if(tierIndicator) tierIndicator.textContent=(t2?t2.name:'Normal').toUpperCase();
    loadCase();
    renderHomeLB();
  };

  if(logoHomeBtnEl) logoHomeBtnEl.onclick=function(e){e.preventDefault();playClick(); if(game)game.classList.remove('active'); if(results)results.classList.remove('active'); if(reviewScreen) reviewScreen.classList.remove('active'); if(home)home.classList.add('active'); renderHomeLB();};
  if(quitBtn) quitBtn.onclick=function(){playClick(); if(game)game.classList.remove('active'); if(results)results.classList.remove('active'); if(reviewScreen) reviewScreen.classList.remove('active'); if(home)home.classList.add('active'); renderHomeLB();};
  if(againBtn) againBtn.onclick=function(){playClick(); if(startBtn)startBtn.click();};
  if(homeBtn) homeBtn.onclick=function(){playClick(); if(game)game.classList.remove('active'); if(results)results.classList.remove('active'); if(home)home.classList.add('active'); renderHomeLB();};

  if(actionBtns){
    for(var ai=0;ai<actionBtns.length;ai++){
      (function(btn){
        btn.onclick=function(){
          if(feedback&&feedback.classList.contains('show')) return;
          playClick();
          var action=btn.getAttribute('data-action');
          var c=state.deck[state.index];
          if(!c)return;
          var verdict=action==='safe'?'safe':'phish';
          var correct=verdict===c.verdict;
          if(correct){
            playCorrect(); state.streak++; if(state.streak>state.best)state.best=state.streak;
            var base=90+Math.min(state.streak,6)*15;
            var pts=Math.round(base*state.multiplier);
            state.score+=pts;
            if(feedbackKicker)feedbackKicker.textContent='Correct';
            if(feedbackTitle)feedbackTitle.textContent=c.verdict==='phish'?'Caught it':'Looks clean';
            if(feedbackPoints)feedbackPoints.textContent='+'+pts;
            if(feedback)feedback.classList.add('correct');
          }else{
            playWrong(); state.streak=0;
            if(feedbackKicker)feedbackKicker.textContent='Miss';
            if(feedbackTitle)feedbackTitle.textContent=c.verdict==='phish'?'That was phishing':'Actually legitimate';
            if(feedbackPoints)feedbackPoints.textContent='+0';
            if(feedback)feedback.classList.add('wrong');
          }
          if(feedback){ feedback.classList.remove('correct','wrong'); if(correct)feedback.classList.add('correct'); else feedback.classList.add('wrong'); }
          state.answers.push({id:c.id,correct:correct,choice:verdict,verdict:c.verdict});
          if(scoreEl)scoreEl.textContent=state.score;
          if(streakEl)streakEl.textContent=state.streak;
          if(stampText)stampText.textContent=c.verdict==='phish'?'PHISHING':'SAFE';
          if(stamp)stamp.className='stamp '+(c.verdict==='phish'?'phish':'safe')+' show';
          if(feedbackText)feedbackText.textContent=c.explanation||'';
          if(clueList){ clueList.innerHTML=''; if(c.clues){ for(var ci=0;ci<c.clues.length;ci++){ var cl=c.clues[ci]; var item=document.createElement('div'); item.className='clue-item'; item.innerHTML='<span class="clue-bullet">—</span><span>'+escapeHtml(cl)+'</span>'; clueList.appendChild(item); } } }
          if(actions)actions.style.display='none';
          if(feedback)feedback.classList.add('show');
          setTimeout(function(){ if(feedback)feedback.scrollIntoView({behavior:'smooth',block:'nearest'}); },120);
        };
      })(actionBtns[ai]);
    }
  }

  if(nextBtn) nextBtn.onclick=function(){
    playClick();
    if(stamp)stamp.classList.remove('show');
    if(feedback)feedback.classList.remove('show');
    if(actions)actions.style.display='grid';
    state.index++;
    if(state.index>=state.deck.length){ finish(); return; }
    loadCase();
    window.scrollTo({top:0,behavior:'smooth'});
  };

  function loadCase(){
    var c=state.deck[state.index];
    if(!c)return;
    if(caseType)caseType.textContent=c.type==='email'?'Email':c.type==='page'?'Web page':'Investigation';
    if(caseCounter)caseCounter.textContent=(state.index+1)+' / '+state.deck.length;
    if(progressFill)progressFill.style.width=((state.index+1)/state.deck.length*100)+'%';
    if(artifactUrl)artifactUrl.textContent=c.url;
    if(artifact)artifact.innerHTML=c.body;
    if(actions)actions.style.display='grid';
  }

  function finish(){
    if(game)game.classList.remove('active');
    if(results)results.classList.add('active');
    var correct=0;
    for(var i=0;i<state.answers.length;i++){ if(state.answers[i].correct) correct++; }
    var total=state.deck.length||1;
    var acc=Math.round((correct/total)*100);
    var tierInfo=TIERS.find(function(x){return x.key===state.tier;});
    if(finalScore)finalScore.textContent=String(state.score).padStart(4,'0');
    if(finalCorrect)finalCorrect.textContent=correct+'/'+total;
    if(finalAccuracy)finalAccuracy.textContent=acc+'%';
    if(finalStreak)finalStreak.textContent=state.best;
    if(finalTier)finalTier.textContent=tierInfo?tierInfo.name:'Normal';
    if(finalMessage){
      if(acc>=90)finalMessage.textContent='Tight reads. Hard to fool.';
      else if(acc>=75)finalMessage.textContent='Sharp instincts. A few tells still slip by.';
      else if(acc>=60)finalMessage.textContent='Solid base. Train your eye on the small details.';
      else finalMessage.textContent='Every miss teaches something. Run it again.';
    }
    var entry={id:Date.now()+'-'+Math.random().toString(36).slice(2,6), name:state.name, score:state.score, correct:correct, total:total, acc:acc, tier:tierInfo?tierInfo.name:'Normal'};
    var lb=loadLB();
    lb.push(entry);
    lb.sort(function(a,b){ return b.score-a.score; });
    saveLB(lb);
    renderResLB(entry);
    renderHomeLB();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  renderTiers();
  renderHomeLB();
  initTheme();
  initParticles();
  document.addEventListener('click',initAudio,{once:true});
  document.addEventListener('keydown',initAudio,{once:true});
})();
