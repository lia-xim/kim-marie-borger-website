const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktopPerf = matchMedia('(min-width: 901px)');
const canAnimate = () => !reduceMotion.matches;
const useDesktopPerf = () => desktopPerf.matches;
if(useDesktopPerf()) document.documentElement.classList.add('perf-scroll');

const observeNearViewport = (target, { onEnter, onExit, rootMargin = '240px 0px' }) => {
  if(!target || TINA_EDIT) return () => {};
  if(!('IntersectionObserver' in window)){
    onEnter();
    return () => onExit && onExit();
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) onEnter();
      else if(onExit) onExit();
    });
  }, { rootMargin, threshold: 0 });
  io.observe(target);
  return () => io.disconnect();
};

/* ---------- deferred images: keep non-critical media off the initial path ---------- */
const loadDeferredImage = (img) => {
  if(!img || img.dataset.deferLoaded === 'true') return;
  const src = img.dataset.src;
  if(!src) return;
  img.dataset.deferLoaded = 'true';
  const markLoaded = () => img.classList.add('is-loaded');
  img.addEventListener('load', markLoaded, { once:true });
  if(img.dataset.sizes) img.setAttribute('sizes', img.dataset.sizes);
  if(img.dataset.srcset) img.setAttribute('srcset', img.dataset.srcset);
  img.src = src;
  if(img.complete && img.naturalWidth > 1) markLoaded();
};

const initDeferredImages = (root, eager=false) => {
  if(!root.querySelectorAll) return;
  const imgs = [...root.querySelectorAll('img[data-src]')].filter(img => img.dataset.deferLoaded !== 'true');
  if(!imgs.length) return;
  if(eager || !('IntersectionObserver' in window)){
    imgs.forEach(loadDeferredImage);
    return;
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){
      loadDeferredImage(e.target);
      io.unobserve(e.target);
    }
  }), { rootMargin:'240px 0px', threshold:0.01 });
  imgs.forEach(img => io.observe(img));
};

/* ---------- Tina edit mode: page renders inside the admin iframe and islands
   re-render on every keystroke. Scroll-driven entrance effects would leave
   re-rendered content invisible (no .in class) — so in edit mode everything is
   forced visible and the scroll effects are skipped. ---------- */
const TINA_EDIT = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
if (TINA_EDIT) {
  document.documentElement.classList.add('tina-edit');
  const force = (root) => {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    root.querySelectorAll('.timeline').forEach(tl => {
      tl.style.setProperty('--tl', 1);
      tl.querySelectorAll('li').forEach(li => li.classList.add('passed'));
    });
    root.querySelectorAll('.notation').forEach(svg => svg.classList.add('drawn'));
    initDeferredImages(root, true);
  };
  force(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType === 1) { if (n.matches && n.matches('.reveal')) n.classList.add('in'); force(n); }
  }))).observe(document.body, { childList: true, subtree: true });
}
if(!TINA_EDIT) initDeferredImages(document);
if(!TINA_EDIT && useDesktopPerf()){
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  document.querySelectorAll('.notation').forEach(svg => svg.classList.add('drawn'));
  document.querySelectorAll('.timeline').forEach(tl => {
    tl.style.setProperty('--tl', 1);
    tl.querySelectorAll('li').forEach(li => li.classList.add('passed'));
  });
}

/* ---------- year ---------- */
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- nav scroll state + mobile menu ---------- */
const nav = document.getElementById('nav');
const navSolid = nav.classList.contains('solid');
let navScrolled = false;
let navTicking = false;
const updateNav = () => {
  navTicking = false;
  if(navSolid) return;
  const next = window.scrollY > 40;
  if(next !== navScrolled){
    navScrolled = next;
    nav.classList.toggle('scrolled', next);
  }
};
updateNav();
window.addEventListener('scroll', () => {
  if(!navTicking){
    navTicking = true;
    requestAnimationFrame(updateNav);
  }
}, {passive:true});

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mmGroup = document.getElementById('mmGroup');
const mmToggle = mmGroup ? mmGroup.querySelector('.mm-toggle') : null;
const mmSub = document.getElementById('mmSub');
const setMobileSubmenu = (open) => {
  if(!mmGroup || !mmToggle || !mmSub) return;
  mmGroup.classList.toggle('open', open);
  mmToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  mmSub.setAttribute('aria-hidden', open ? 'false' : 'true');
  if(open) mmSub.removeAttribute('inert');
  else mmSub.setAttribute('inert', '');
};
const setMobileMenu = (open) => {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  if(mobileMenu){
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if(open) mobileMenu.removeAttribute('inert');
    else mobileMenu.setAttribute('inert', '');
  }
  if(!open) setMobileSubmenu(false);
  document.body.style.overflow = open ? 'hidden' : '';
};
setMobileMenu(false);
burger.addEventListener('click', () => setMobileMenu(!nav.classList.contains('open')));
document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMobileMenu(false)));

/* ---------- active nav link by route (MPA) ---------- */
(function(){
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-drop a').forEach(a => {
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('mailto:')) return;
    const norm = href.replace(/\/$/, '') || '/';
    if(norm === path){
      a.classList.add('active');
      const drop = a.closest('.nav-drop');
      if(drop){
        const parent = drop.closest('.nav-item');
        const parentLink = parent && parent.querySelector('a');
        if(parentLink) parentLink.classList.add('active');
      }
    }
  });
})();

/* ---------- mobile menu: Leistungen accordion ---------- */
if(mmToggle){
  mmToggle.addEventListener('click', () => setMobileSubmenu(!mmGroup.classList.contains('open')));
}

/* ---------- horizontal strips (collage, stations): drag-to-scroll for mouse/pen ---------- */
document.querySelectorAll('.collage, .way').forEach(el => {
  let down=false, startX=0, startL=0, moved=false;
  el.addEventListener('pointerdown', e => {
    if(e.pointerType === 'touch') return;
    if(el.scrollWidth <= el.clientWidth) return;
    down=true; moved=false; startX=e.clientX; startL=el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', e => {
    if(!down) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 4) moved=true;
    el.scrollLeft = startL - dx;
  });
  const up = () => { down=false; };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('click', e => { if(moved){ e.preventDefault(); e.stopPropagation(); moved=false; } }, true);
});

/* ---------- active nav link via section observer (home one-pager anchors) ---------- */
const navMap = {};
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if(href && href.startsWith('#')) navMap[href.slice(1)] = a;
});
const sectionObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ const a=navMap[e.target.id]; if(a){ document.querySelectorAll('.nav-links a').forEach(x=>x.classList.remove('active')); a.classList.add('active'); } } });
},{ rootMargin:'-45% 0px -50% 0px' });
['home','leistungen','portfolio','ueber','kontakt'].forEach(id=>{ const el=document.getElementById(id); if(el) sectionObs.observe(el); });

/* ---------- bow line: scroll progress as a drawn string ---------- */
(function(){
  if(useDesktopPerf()) return;
  const line = document.createElement('div');
  line.className = 'bowline'; line.setAttribute('aria-hidden','true');
  const fill = document.createElement('i');
  line.appendChild(fill); document.body.appendChild(line);
  let ticking = false;
  let last = -1;
  const upd = () => {
    ticking = false;
    const h = document.documentElement;
    const max = h.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
    const rounded = Math.round(progress * 1000) / 1000;
    if(rounded !== last){
      last = rounded;
      fill.style.transform = `scaleX(${rounded})`;
    }
  };
  addEventListener('scroll', () => { if(!ticking){ requestAnimationFrame(upd); ticking = true; } }, {passive:true});
  addEventListener('resize', upd); upd();
})();

/* ---------- reveal on scroll ---------- */
if(!TINA_EDIT && !useDesktopPerf()){
  const revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revealObs.unobserve(e.target); } });
  },{ threshold:.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));
}

/* ---------- notation line draw on scroll ---------- */
(function(){
  if(TINA_EDIT) return;
  const svg = document.querySelector('.notation'); if(!svg) return;
  const path = svg.querySelector('.melody');
  const len = path.getTotalLength();
  svg.style.setProperty('--len', len);
  path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
  const reduce = !canAnimate() || useDesktopPerf();
  if(reduce){ path.style.strokeDashoffset = 0; svg.classList.add('drawn'); return; }
  let active = false;
  let ticking = false;
  const draw = () => {
    ticking = false;
    if(!active) return;
    const r = svg.getBoundingClientRect();
    const vh = innerHeight;
    let p = (vh - r.top) / (vh*0.7 + r.height);
    p = Math.max(0, Math.min(1, p));
    path.style.strokeDashoffset = len * (1 - p);
    if(p > .9) svg.classList.add('drawn'); else svg.classList.remove('drawn');
  };
  const schedule = () => { if(!ticking){ ticking = true; requestAnimationFrame(draw); } };
  const start = () => {
    if(active) return;
    active = true;
    addEventListener('scroll', schedule, {passive:true});
    addEventListener('resize', schedule);
    schedule();
  };
  const stop = () => {
    active = false;
    removeEventListener('scroll', schedule);
    removeEventListener('resize', schedule);
  };
  observeNearViewport(svg, { onEnter: start, onExit: stop, rootMargin: '180px 0px' });
})();

/* ---------- static media: parallax was costly on older desktop GPUs ---------- */
(function(){
  if(TINA_EDIT) return;
  document.querySelectorAll('[data-parallax]').forEach(el => { el.style.transform = ''; });
})();

/* ---------- staged image reveal: images load in with a stagger ---------- */
(function(){
  if(TINA_EDIT) return;
  if(!canAnimate() || useDesktopPerf()) return;
  const imgs = [...document.querySelectorAll(
    '.gal-card img, .polaroid img, .tframe img, .figure .frame img, .arch-in img, .video-frame > img'
  )];
  if(!imgs.length) return;
  const counts = new Map();
  imgs.forEach(img => {
    const group = img.closest('.gal, .collage, .twin') || img.parentElement;
    const i = counts.get(group) || 0;
    counts.set(group, i + 1);
    img.style.setProperty('--ird', (Math.min(i, 11) * 90) + 'ms');
    img.classList.add('ir');
  });
  const show = img => {
    const reveal = () => img.classList.add('ir-in');
    if(img.dataset.src && img.dataset.deferLoaded !== 'true'){
      img.addEventListener('load', reveal, { once:true });
      loadDeferredImage(img);
      return;
    }
    if(img.complete && img.naturalWidth) reveal();
    else img.addEventListener('load', reveal, { once:true });
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){ show(e.target); io.unobserve(e.target); }
  }), { rootMargin:'0px 0px -6% 0px', threshold:.05 });
  imgs.forEach(img => io.observe(img));
})();

/* ---------- magnetic buttons: intentionally disabled for steadier desktop performance ---------- */
(function(){
  return;
})();

/* ---------- wedding timeline: line draws while scrolling ---------- */
(function(){
  const tl = document.querySelector('.timeline'); if(!tl) return;
  if(TINA_EDIT || useDesktopPerf()){
    tl.style.setProperty('--tl', 1);
    tl.querySelectorAll('li').forEach(li => li.classList.add('passed'));
    return;
  }
  const items = [...tl.querySelectorAll('li')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting) e.target.classList.add('passed');
  }), { rootMargin:'-35% 0px -45% 0px' });
  items.forEach(li => io.observe(li));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    tl.style.setProperty('--tl', 1);
    items.forEach(li => li.classList.add('passed'));
    return;
  }
  let active = false;
  let ticking = false;
  const upd = () => {
    ticking = false;
    if(!active) return;
    const r = tl.getBoundingClientRect();
    let p = (innerHeight * 0.65 - r.top) / r.height;
    tl.style.setProperty('--tl', Math.max(0, Math.min(1, p)).toFixed(3));
  };
  const schedule = () => { if(!ticking){ requestAnimationFrame(upd); ticking = true; } };
  const start = () => {
    if(active) return;
    active = true;
    addEventListener('scroll', schedule, {passive:true});
    addEventListener('resize', schedule);
    schedule();
  };
  const stop = () => {
    active = false;
    removeEventListener('scroll', schedule);
    removeEventListener('resize', schedule);
  };
  observeNearViewport(tl, { onEnter: start, onExit: stop, rootMargin: '220px 0px' });
})();

/* ---------- birthday moods: tab switcher (visible on phones) ---------- */
(function(){
  const moods = [...document.querySelectorAll('.moods .mood')];
  if(!moods.length) return;
  const wrap = document.querySelector('.moods');
  const tabs = document.createElement('div');
  tabs.className = 'mood-tabs';
  moods.forEach((m, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mood-tab' + (i === 0 ? ' active' : '');
    const h = m.querySelector('h3');
    b.textContent = h ? h.textContent : 'Stimmung ' + (i + 1);
    b.addEventListener('click', () => {
      moods.forEach(x => x.classList.remove('active'));
      [...tabs.children].forEach(x => x.classList.remove('active'));
      m.classList.add('active');
      b.classList.add('active');
    });
    tabs.appendChild(b);
  });
  moods[0].classList.add('active');
  wrap.parentElement.insertBefore(tabs, wrap);
})();

/* ---------- polaroid lightbox ---------- */
(function(){
  const pols = [...document.querySelectorAll('.collage .polaroid')];
  if(!pols.length) return;
  const CHEV_L = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
  const CHEV_R = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  const CROSS  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Bildvorschau');
  lb.innerHTML = '<button class="lb-btn lb-close" aria-label="Schließen">'+CROSS+'</button>'
    + '<button class="lb-btn lb-prev" aria-label="Vorheriges Bild">'+CHEV_L+'</button>'
    + '<button class="lb-btn lb-next" aria-label="Nächstes Bild">'+CHEV_R+'</button>'
    + '<figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  const img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
  const items = pols.map(p => {
    const image = p.querySelector('img');
    return {
      src: image.dataset.src || image.currentSrc || image.getAttribute('src'),
      alt: image.alt || '',
      cap: [p.querySelector('.pl-tag')?.textContent, p.querySelector('.pl-label')?.textContent].filter(Boolean).join(' — ')
    };
  });
  let cur = 0, lastFocus = null;
  const showAt = i => {
    cur = (i + items.length) % items.length;
    img.src = items[cur].src; img.alt = items[cur].alt; cap.textContent = items[cur].cap;
  };
  const open = i => {
    lastFocus = document.activeElement;
    showAt(i); lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  };
  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  };
  pols.forEach((p, i) => {
    p.setAttribute('tabindex','0');
    p.setAttribute('role','button');
    p.setAttribute('aria-label','Bild vergrößern: ' + (items[i].cap || items[i].alt));
    p.addEventListener('click', () => open(i));
    p.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(i); } });
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => showAt(cur - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => showAt(cur + 1));
  lb.addEventListener('click', e => { if(e.target === lb) close(); });
  addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') showAt(cur - 1);
    if(e.key === 'ArrowRight') showAt(cur + 1);
  });
})();

/* ---------- form ---------- */
const anfrageForm = document.getElementById('anfrageForm');
if(anfrageForm){
  anfrageForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const f=e.target; if(!f.checkValidity()){ f.reportValidity(); return; }
    const btn = f.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    const ok = document.getElementById('formOk');
    const successText = ok ? ok.dataset.success || ok.textContent : '';
    if(ok){ ok.style.display='none'; ok.classList.remove('is-error'); ok.textContent = successText; }
    btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Wird gesendet ...';
    try {
      const payload = Object.fromEntries(new FormData(f).entries());
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let result = {};
      try { result = await res.json(); } catch(parseErr) {}
      if(!res.ok) {
        const err = new Error(result && result.error ? result.error : String(res.status));
        err.status = res.status;
        throw err;
      }
      if(ok){ ok.textContent = successText; ok.style.display='block'; }
      btn.removeAttribute('aria-busy');
      btn.textContent='Gesendet';
    } catch(err) {
      btn.disabled = false; btn.removeAttribute('aria-busy'); btn.innerHTML = orig;
      const mail = document.querySelector('.contact-aside a.cv');
      if(ok){
        ok.classList.add('is-error');
        ok.style.display='block';
        if(err && err.message === 'validation') {
          ok.textContent = 'Bitte prüfe Name und E-Mail-Adresse. Danach kannst du die Anfrage erneut senden.';
        } else {
          ok.textContent = 'Das Senden hat leider nicht geklappt — schreib mir bitte direkt per E-Mail' + (mail ? ': ' + mail.textContent : '.');
        }
      }
    }
  });
}

/* ---------- video facade ---------- */
document.querySelectorAll('.video-frame').forEach(frame=>{
  const open=()=>{
    const id=frame.dataset.yt;
    if(id){ frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media" allowfullscreen></iframe>'; }
    else{ const cap=frame.querySelector('.vcap'); if(cap) cap.innerHTML='<b>Video folgt</b>YouTube-ID eintragen, dann lädt das Video hier.'; frame.style.cursor='default'; }
  };
  frame.addEventListener('click', open);
  frame.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
});

/* ---------- audio player: echte Aufnahmen (per CMS gepflegt) mit
   WebAudio-Analyser für die EQ-Bars; Tracks ohne Datei fallen auf die
   synthetische Klangskizze zurück ---------- */
(function(){
  const DEMO = [
    { t:'Méditation',        c:'Jules Massenet · aus „Thaïs“',    tag:'Trauung',  dur:'5:10', root:293.66 },
    { t:'Air',               c:'J. S. Bach · aus der Orchestersuite Nr. 3', tag:'Einzug', dur:'4:40', root:261.63 },
    { t:'Cellosuite Nr. 1',  c:'J. S. Bach · Prélude (Arr. Viola)',tag:'Empfang', dur:'2:30', root:196.00 },
    { t:'Salut d’Amour',     c:'Edward Elgar',                     tag:'Festakt', dur:'3:05', root:329.63 },
    { t:'Ave Maria',         c:'Franz Schubert',                   tag:'Abschied',dur:'5:30', root:220.00 },
  ];
  const playlist=document.getElementById('playlist');
  if(!playlist) return;
  const eq=document.getElementById('eq');
  const playBtn=document.getElementById('playBtn');
  const playIcon=document.getElementById('playIcon');
  const npKick=document.getElementById('npKick'), npTitle=document.getElementById('npTitle'), npComposer=document.getElementById('npComposer');
  const elapsedEl=document.getElementById('elapsed');
  const eqLabel=document.getElementById('eqLabel');
  const player=document.getElementById('player');
  const BARS=48;
  for(let i=0;i<BARS;i++){ const b=document.createElement('span'); b.className='bar'; eq.appendChild(b); }
  const bars=[...eq.children];

  // Playlist: vom Server gerendert (CMS-Tracks) — sonst Demo aufbauen.
  let buttons=[...playlist.querySelectorAll('.track')];
  if(!buttons.length){
    DEMO.forEach((tr,i)=>{
      const btn=document.createElement('button'); btn.className='track'+(i===0?' active':''); btn.type='button';
      btn.dataset.title=tr.t; btn.dataset.composer=tr.c; btn.dataset.dur=tr.dur; btn.dataset.root=tr.root;
      btn.innerHTML='<span class="ti">'+String(i+1).padStart(2,'0')+'</span>'+
        '<span><span class="tn">'+tr.t+'</span><span class="tc" style="display:block">'+tr.c+'</span></span>'+
        '<span class="tg">'+tr.tag+'</span><span class="td">'+tr.dur+'</span>';
      playlist.appendChild(btn);
    });
    buttons=[...playlist.children];
  }
  const tracks=buttons.map(b=>({
    t: b.dataset.title || '', c: b.dataset.composer || '',
    src: b.dataset.src || '', root: parseFloat(b.dataset.root || '261.63'),
    durEl: b.querySelector('.td')
  }));
  buttons.forEach((b,i)=>b.addEventListener('click',()=>select(i,true)));

  let ctx, analyser, data, synthGain, mediaGain, audioEl=null, nodes=[];
  let current=0, playing=false, raf, startedAt=0, mode='synth';

  function ensure(){
    if(ctx) return;
    const audioWindow = /** @type {Window & { webkitAudioContext?: typeof AudioContext }} */ (window);
    const AC=window.AudioContext||audioWindow.webkitAudioContext; if(!AC) return;
    ctx=new AC();
    analyser=ctx.createAnalyser(); analyser.fftSize=128; data=new Uint8Array(analyser.frequencyBinCount);
    synthGain=ctx.createGain(); synthGain.gain.value=0; synthGain.connect(analyser);
    mediaGain=ctx.createGain(); mediaGain.gain.value=1; mediaGain.connect(analyser);
    analyser.connect(ctx.destination);
  }
  function ensureAudioEl(){
    if(audioEl) return;
    audioEl=new Audio(); audioEl.preload='metadata';
    audioEl.addEventListener('ended',()=>{ if(current<tracks.length-1){ select(current+1,true); } else { pause(); } });
    audioEl.addEventListener('loadedmetadata',()=>{
      const tr=tracks[current];
      if(tr && tr.durEl && !tr.durEl.textContent.trim() && isFinite(audioEl.duration)){
        const s=Math.round(audioEl.duration);
        tr.durEl.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
      }
    });
    const srcNode=ctx.createMediaElementSource(audioEl);
    srcNode.connect(mediaGain);
  }
  function stopNodes(){ nodes.forEach(n=>{ try{n.stop();}catch(e){} try{n.disconnect();}catch(e){} }); nodes=[]; }
  function startVoice(root){
    const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1300; lp.Q.value=.6; lp.connect(synthGain);
    const freqs=[root, root*1.5, root*2]; const gains=[.6,.32,.16];
    const lfo=ctx.createOscillator(); lfo.frequency.value=5.2; const lfoG=ctx.createGain(); lfoG.gain.value=4; lfo.connect(lfoG); lfo.start(); nodes.push(lfo);
    freqs.forEach((f,k)=>{
      const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=f; lfoG.connect(o.detune);
      const g=ctx.createGain(); g.gain.value=gains[k]; o.connect(g); g.connect(lp); o.start(); nodes.push(o);
    });
    synthGain.gain.cancelScheduledValues(ctx.currentTime);
    synthGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    synthGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime+0.9);
  }
  function animate(){
    if(!playing) return;
    if(playing && analyser){
      analyser.getByteFrequencyData(data);
      for(let i=0;i<BARS;i++){ const v=data[i%data.length]/255; const h=6+v*94; bars[i].style.height=h+'%'; }
      const s=Math.floor(mode==='media' && audioEl ? audioEl.currentTime : ctx.currentTime-startedAt);
      elapsedEl.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
    }
    raf=requestAnimationFrame(animate);
  }
  function setMeta(i){
    const tr=tracks[i]; npTitle.textContent=tr.t; npComposer.textContent=tr.c;
    buttons.forEach((el,k)=>el.classList.toggle('active',k===i));
    if(eqLabel) eqLabel.textContent=tr.src?'Aufnahme':'Klangskizze';
  }
  function play(i){
    ensure(); if(!ctx){ return; }
    if(ctx.state==='suspended') ctx.resume();
    stopNodes();
    if(audioEl && !audioEl.paused) audioEl.pause();
    current=i;
    const tr=tracks[i];
    if(tr.src){
      mode='media'; ensureAudioEl();
      const abs=new URL(tr.src, location.href).href;
      if(audioEl.src!==abs){ audioEl.src=tr.src; }
      audioEl.play().catch(()=>{ npKick.textContent='Wiedergabe nicht möglich'; });
      npKick.textContent='Aufnahme läuft';
    } else {
      mode='synth'; startVoice(tr.root); startedAt=ctx.currentTime;
      npKick.textContent='Klangskizze läuft';
    }
    playing=true; player.classList.add('playing'); playIcon.innerHTML='<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
    setMeta(i);
    cancelAnimationFrame(raf); animate();
  }
  function pause(){
    playing=false; player.classList.remove('playing');
    cancelAnimationFrame(raf);
    playIcon.innerHTML='<path d="M8 5v14l11-7z"/>';
    if(mode==='media' && audioEl){ audioEl.pause(); }
    else if(ctx){ synthGain.gain.cancelScheduledValues(ctx.currentTime); synthGain.gain.setValueAtTime(synthGain.gain.value, ctx.currentTime); synthGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.4); setTimeout(stopNodes,420); }
    bars.forEach(b=>b.style.height='6%'); npKick.textContent='Pausiert';
  }
  function select(i,autoplay){ current=i; if(playing){ play(i); } else { setMeta(i); npKick.textContent='Jetzt ausgewählt'; if(autoplay) play(i); } }
  playBtn.addEventListener('click',()=>{ if(playing) pause(); else play(current); });
})();
