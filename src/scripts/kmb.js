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
  }), { rootMargin:'480px 0px', threshold:0.01 });
  imgs.forEach(img => io.observe(img));
};

/* ---------- Tina edit mode: page renders inside the admin iframe and islands
   re-render on every keystroke. Scroll-driven entrance effects would leave
   re-rendered content invisible (no .in class) — so in edit mode everything is
   forced visible and the scroll effects are skipped. ---------- */
const TINA_EDIT = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const KMB_ANALYTICS = (() => {
  const params = new URLSearchParams(location.search);
  const localDebug = params.has('analytics-debug');
  const productionHost = /(^|\.)kim-marie-borger\.(de|com)$/.test(location.hostname) || location.hostname === 'kim-marie-borger.vercel.app';
  const enabled = !TINA_EDIT && (productionHost || localDebug);
  const serviceRoots = new Set(['hochzeiten','beerdigungen','geburtstage','taufen','konzerte','firmenfeiern','unterricht']);
  const queue = [];
  const sentOnce = new Set();
  let flushTimer = 0;
  const attributionKey = 'kmb_attribution_v1';
  const touchFields = [
    'path',
    'page_type',
    'page_service',
    'page_slug',
    'referrer',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'has_gclid',
    'has_fbclid',
    'has_msclkid'
  ];
  const attributionFields = [
    ...touchFields.map(field => 'first_' + field),
    ...touchFields.map(field => 'last_' + field),
    'first_seen_at',
    'last_seen_at',
    'last_cta_text',
    'last_cta_area',
    'last_cta_target',
    'last_cta_kind',
    'last_interaction_at',
    'audio_engaged',
    'audio_last_track',
    'audio_last_index'
  ];

  const compact = (value, max = 180) => {
    if(value === undefined || value === null) return undefined;
    if(typeof value === 'boolean' || typeof value === 'number') return value;
    const text = String(value).replace(/\s+/g, ' ').trim();
    return text ? text.slice(0, max) : undefined;
  };
  const clean = (data) => {
    const out = {};
    Object.entries(data || {}).forEach(([key, value]) => {
      const next = Array.isArray(value) ? compact(value.join(',')) : compact(value);
      if(next !== undefined) out[key] = next;
    });
    return out;
  };
  const readStoredAttribution = () => {
    try {
      const raw = window.localStorage && localStorage.getItem(attributionKey);
      return raw ? JSON.parse(raw) || {} : {};
    } catch(e) {
      return {};
    }
  };
  const writeStoredAttribution = (value) => {
    try {
      if(window.localStorage) localStorage.setItem(attributionKey, JSON.stringify(clean(value)));
    } catch(e) {}
  };
  const queryValue = (key) => compact(params.get(key), 180) || '';
  const referrerValue = () => {
    if(!document.referrer) return '';
    try {
      const ref = new URL(document.referrer);
      if(ref.origin === location.origin) return '';
      return compact(ref.hostname + ref.pathname, 240) || '';
    } catch(e) {
      return compact(document.referrer, 240) || '';
    }
  };
  const pagePath = () => location.pathname.replace(/\/$/, '') || '/';
  const pageType = () => {
    const parts = pagePath().split('/').filter(Boolean);
    if(!parts.length) return 'home';
    if(parts[0] === 'portfolio') return 'portfolio';
    if(parts[0] === 'anfragen') return 'inquiry';
    if(parts[0] === 'ratgeber') return parts.length > 1 ? 'guide_article' : 'guide_index';
    if(serviceRoots.has(parts[0])) return parts.length > 1 ? 'local_seo' : 'service';
    return parts[0];
  };
  const pageDetails = () => {
    const parts = pagePath().split('/').filter(Boolean);
    const root = parts[0] || 'home';
    return {
      page_path: pagePath(),
      page_type: pageType(),
      page_service: serviceRoots.has(root) ? root : '',
      page_slug: parts.slice(1).join('/'),
      page_title: document.title
    };
  };
  const currentTouch = () => ({
    path: pagePath(),
    page_type: pageType(),
    page_service: pageDetails().page_service,
    page_slug: pageDetails().page_slug,
    referrer: referrerValue(),
    utm_source: queryValue('utm_source'),
    utm_medium: queryValue('utm_medium'),
    utm_campaign: queryValue('utm_campaign'),
    utm_content: queryValue('utm_content'),
    utm_term: queryValue('utm_term'),
    has_gclid: params.has('gclid'),
    has_fbclid: params.has('fbclid'),
    has_msclkid: params.has('msclkid')
  });
  const assignTouch = (target, prefix, touch) => {
    touchFields.forEach(field => { target[prefix + '_' + field] = touch[field] || ''; });
  };
  const captureAttribution = () => {
    if(TINA_EDIT) return {};
    const stored = readStoredAttribution();
    const touch = currentTouch();
    const now = new Date().toISOString();
    if(!stored.first_path){
      assignTouch(stored, 'first', touch);
      stored.first_seen_at = now;
    }
    assignTouch(stored, 'last', touch);
    stored.last_seen_at = now;
    writeStoredAttribution(stored);
    return stored;
  };
  let attribution = captureAttribution();
  const attributionData = () => {
    const source = attribution || {};
    const out = {};
    attributionFields.forEach(field => {
      if(source[field] !== undefined && source[field] !== '') out['attribution_' + field] = source[field];
    });
    return clean(out);
  };
  const rememberInteraction = (data = {}) => {
    if(TINA_EDIT) return;
    attribution = {
      ...(attribution || {}),
      ...clean(data),
      last_interaction_at: new Date().toISOString()
    };
    writeStoredAttribution(attribution);
  };
  const eventData = (data) => clean({
    ...pageDetails(),
    ...data
  });
  const hasTracker = () => window.umami && typeof window.umami.track === 'function';
  const flush = () => {
    if(!hasTracker()) return;
    while(queue.length){
      const item = queue.shift();
      try { window.umami.track(item.name, item.data); } catch(e) {}
    }
    if(flushTimer){
      clearInterval(flushTimer);
      flushTimer = 0;
    }
  };
  const scheduleFlush = () => {
    if(flushTimer) return;
    flushTimer = window.setInterval(flush, 750);
    window.setTimeout(() => {
      if(flushTimer){
        clearInterval(flushTimer);
        flushTimer = 0;
      }
    }, 10000);
  };
  const track = (name, data = {}) => {
    if(!enabled || !name) return;
    const eventName = String(name).slice(0, 50);
    const dataWithPage = eventData(data);
    if(hasTracker()){
      try { window.umami.track(eventName, dataWithPage); } catch(e) {}
      return;
    }
    queue.push({ name: eventName, data: dataWithPage });
    if(queue.length > 50) queue.shift();
    scheduleFlush();
  };
  const trackOnce = (key, name, data = {}) => {
    if(sentOnce.has(key)) return;
    sentOnce.add(key);
    track(name, data);
  };

  return { attributionData, compact, flush, rememberInteraction, track, trackOnce };
})();
window.kmbTrack = KMB_ANALYTICS.track;
window.addEventListener('kmb:umami-ready', KMB_ANALYTICS.flush);

const textForTracking = (el, max = 90) => KMB_ANALYTICS.compact(el ? (el.innerText || el.textContent || '') : '', max);
const areaForTracking = (el) => {
  if(!el) return 'unknown';
  if(el.closest('.nav-links')) return 'nav_desktop';
  if(el.closest('.mobile-menu')) return 'nav_mobile';
  if(el.closest('.footer')) return 'footer';
  if(el.closest('.contact-card')) return 'contact_card';
  if(el.closest('.player')) return 'audio_player';
  if(el.closest('.video-frame')) return 'video';
  const section = el.closest('section[id]');
  if(section && section.id) return 'section_' + section.id;
  return 'body';
};
const socialPlatformForHost = (host) => {
  const value = String(host || '').toLowerCase();
  if(value.includes('instagram.')) return 'instagram';
  if(value.includes('youtube.') || value.includes('youtu.be')) return 'youtube';
  if(value.includes('facebook.')) return 'facebook';
  if(value.includes('linkedin.')) return 'linkedin';
  if(value.includes('tiktok.')) return 'tiktok';
  if(value.includes('spotify.')) return 'spotify';
  return '';
};
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

/* ---------- analytics: navigation, CTAs, mail links, scroll depth ---------- */
(function(){
  document.addEventListener('click', e => {
    const target = e.target;
    if(!target || !target.closest) return;
    const link = target.closest('a[href]');
    if(!link) return;
    const href = link.getAttribute('href');
    if(!href || href === '#') return;
    const area = areaForTracking(link);
    const text = textForTracking(link);
    const mail = href.startsWith('mailto:');
    let targetPath = href;
    let kind = 'internal';
    try {
      const url = new URL(href, location.href);
      kind = url.protocol === 'mailto:' ? 'email' : (url.origin === location.origin ? 'internal' : 'external');
      targetPath = kind === 'internal'
        ? ((url.pathname.replace(/\/$/, '') || '/') + url.hash)
        : (url.protocol === 'mailto:' ? 'mailto' : url.hostname);
    } catch(e) {}

    if(mail){
      KMB_ANALYTICS.rememberInteraction({
        last_cta_text: text,
        last_cta_area: area,
        last_cta_target: 'mailto',
        last_cta_kind: 'contact_email_click'
      });
      KMB_ANALYTICS.track('contact_email_click', {
        link_area: area,
        link_text: text,
        ...KMB_ANALYTICS.attributionData()
      });
      return;
    }

    const socialPlatform = kind === 'external' ? socialPlatformForHost(targetPath) : '';
    const importantLink = area.startsWith('nav_')
      || area === 'footer'
      || link.classList.contains('btn')
      || link.classList.contains('link-line')
      || link.classList.contains('ig-tile')
      || socialPlatform
      || link.closest('.gal-card,.card,.hero-actions,.cta-band,.service-discovery,.topic-links,.local-links,.ratgeber-links');
    if(!importantLink) return;

    const inquiryTarget = targetPath.startsWith('/anfragen') || targetPath.includes('#kontakt');
    const eventName = inquiryTarget ? 'inquiry_cta_click' : (socialPlatform ? 'social_click' : 'site_link_click');
    KMB_ANALYTICS.rememberInteraction({
      last_cta_text: text,
      last_cta_area: area,
      last_cta_target: targetPath,
      last_cta_kind: eventName
    });
    KMB_ANALYTICS.track(eventName, {
      link_area: area,
      link_text: text,
      link_target: targetPath,
      link_kind: kind,
      social_platform: socialPlatform,
      ...KMB_ANALYTICS.attributionData()
    });
  });

  if(TINA_EDIT) return;
  const marks = [25, 50, 75, 90];
  const sent = new Set();
  let maxSeen = 0;
  let ticking = false;
  const depth = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - innerHeight;
    if(max <= 0) return 100;
    return Math.max(0, Math.min(100, Math.round((h.scrollTop / max) * 100)));
  };
  const updateDepth = () => {
    ticking = false;
    maxSeen = Math.max(maxSeen, depth());
    marks.forEach(mark => {
      if(maxSeen >= mark && !sent.has(mark)){
        sent.add(mark);
        KMB_ANALYTICS.track('page_scroll_depth', {
          depth: mark,
          max_scroll: maxSeen
        });
      }
    });
  };
  const scheduleDepth = () => {
    if(!ticking){
      ticking = true;
      requestAnimationFrame(updateDepth);
    }
  };
  addEventListener('scroll', scheduleDepth, { passive:true });
  addEventListener('resize', scheduleDepth);
  window.setTimeout(() => {
    maxSeen = Math.max(maxSeen, depth());
    KMB_ANALYTICS.trackOnce('engaged_30', 'page_engaged', { seconds: 30, max_scroll: maxSeen });
  }, 30000);
  window.setTimeout(() => {
    maxSeen = Math.max(maxSeen, depth());
    KMB_ANALYTICS.trackOnce('engaged_90', 'page_engaged', { seconds: 90, max_scroll: maxSeen });
  }, 90000);
})();

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
    KMB_ANALYTICS.track('portfolio_image_open', {
      image_index: cur + 1,
      image_label: items[cur].cap || items[cur].alt
    });
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
  const move = (delta, method) => {
    showAt(cur + delta);
    KMB_ANALYTICS.track('portfolio_image_nav', {
      direction: delta < 0 ? 'previous' : 'next',
      method,
      image_index: cur + 1,
      image_label: items[cur].cap || items[cur].alt
    });
  };
  lb.querySelector('.lb-prev').addEventListener('click', () => move(-1, 'button'));
  lb.querySelector('.lb-next').addEventListener('click', () => move(1, 'button'));
  lb.addEventListener('click', e => { if(e.target === lb) close(); });
  addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') move(-1, 'keyboard');
    if(e.key === 'ArrowRight') move(1, 'keyboard');
  });
})();

/* ---------- form ---------- */
const bucketFormText = value => {
  const len = String(value || '').trim().length;
  if(!len) return 'empty';
  if(len <= 80) return 'short';
  if(len <= 240) return 'medium';
  return 'long';
};
const getContactFormMeta = (f) => {
  const occasion = f.querySelector('[name=anlass]');
  return {
    form_context: f.dataset.trackContextKey || '',
    form_variant: f.dataset.trackFormVariant || '',
    source_context: f.dataset.trackSourceContext || '',
    default_occasion: f.dataset.trackDefaultOccasion || '',
    selected_occasion: occasion ? occasion.value : ''
  };
};
const getContactFormCompletion = (f) => {
  const fd = new FormData(f);
  const value = name => String(fd.get(name) || '').trim();
  const fields = ['anlass','datum','ort','wunschmusik','umfang','nachricht'];
  return {
    occasion_selected: Boolean(value('anlass')),
    has_date: Boolean(value('datum')),
    has_place: Boolean(value('ort')),
    has_music: Boolean(value('wunschmusik')),
    has_scope: Boolean(value('umfang')),
    message_bucket: bucketFormText(value('nachricht')),
    optional_fields_count: fields.filter(name => Boolean(value(name))).length
  };
};
const getContactFormTrackingData = (f) => ({
  ...getContactFormMeta(f),
  ...getContactFormCompletion(f),
  ...KMB_ANALYTICS.attributionData()
});
const anfrageForm = document.getElementById('anfrageForm');
if(anfrageForm){
  let formStarted = false;
  let formSubmitted = false;
  let abandonTracked = false;
  const trackFormStart = e => {
    if(formStarted) return;
    formStarted = true;
    KMB_ANALYTICS.track('contact_form_start', {
      ...getContactFormMeta(anfrageForm),
      first_field: e.target && e.target.name ? e.target.name : '',
      ...KMB_ANALYTICS.attributionData()
    });
  };
  const trackFormAbandon = (trigger) => {
    if(abandonTracked || !formStarted || formSubmitted) return;
    abandonTracked = true;
    KMB_ANALYTICS.track('contact_form_abandon', {
      ...getContactFormTrackingData(anfrageForm),
      abandon_trigger: trigger
    });
  };
  if('IntersectionObserver' in window){
    const viewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          KMB_ANALYTICS.trackOnce('contact_form_view', 'contact_form_view', {
            ...getContactFormMeta(anfrageForm),
            ...KMB_ANALYTICS.attributionData()
          });
          viewObserver.disconnect();
        }
      });
    }, { threshold: 0.35 });
    viewObserver.observe(anfrageForm);
  } else {
    KMB_ANALYTICS.trackOnce('contact_form_view', 'contact_form_view', {
      ...getContactFormMeta(anfrageForm),
      ...KMB_ANALYTICS.attributionData()
    });
  }
  window.addEventListener('pagehide', () => trackFormAbandon('pagehide'));
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'hidden') trackFormAbandon('visibility_hidden');
  });
  anfrageForm.addEventListener('input', trackFormStart, true);
  anfrageForm.addEventListener('change', trackFormStart, true);
  anfrageForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const f=e.target;
    if(!f.checkValidity()){
      const invalid = [...f.elements]
        .filter(el => el.willValidate && !el.checkValidity())
        .map(el => el.name || el.id || el.type)
        .filter(Boolean);
      KMB_ANALYTICS.track('contact_form_validation_error', {
        ...getContactFormMeta(f),
        ...getContactFormCompletion(f),
        invalid_count: invalid.length,
        invalid_fields: invalid,
        ...KMB_ANALYTICS.attributionData()
      });
      f.reportValidity();
      return;
    }
    const btn = f.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    const ok = f.querySelector('#formOk,.form-ok');
    const successText = ok ? ok.dataset.success || ok.textContent : '';
    if(ok){ ok.style.display='none'; ok.classList.remove('is-error'); ok.textContent = successText; }
    btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Wird gesendet ...';
    try {
      const attributionPayload = KMB_ANALYTICS.attributionData();
      const payload = {
        ...Object.fromEntries(new FormData(f).entries()),
        ...attributionPayload
      };
      KMB_ANALYTICS.track(payload.website ? 'contact_form_honeypot_submit' : 'contact_form_submit_attempt', {
        ...getContactFormTrackingData(f)
      });
      formSubmitted = true;
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
      KMB_ANALYTICS.track('contact_form_success', {
        ...getContactFormTrackingData(f),
        delivery: result && result.queued ? 'queued' : 'api'
      });
      if(ok){ ok.textContent = successText; ok.style.display='block'; }
      btn.removeAttribute('aria-busy');
      btn.textContent='Gesendet';
    } catch(err) {
      KMB_ANALYTICS.track('contact_form_error', {
        ...getContactFormTrackingData(f),
        error_type: err && err.message === 'validation' ? 'validation' : (err && err.status ? 'http_' + err.status : 'network'),
        status: err && err.status ? err.status : undefined
      });
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
  const id=frame.dataset.yt;
  if(!id) return;
  let opened=false;
  const open=()=>{
    if(opened) return;
    opened=true;
    KMB_ANALYTICS.track('video_play', {
      video_provider: 'youtube_nocookie',
      video_id: id,
      link_area: areaForTracking(frame)
    });
    frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  };
  frame.addEventListener('click', open);
  frame.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
});

/* ---------- audio player: echte Aufnahmen (per CMS gepflegt) mit
   WebAudio-Analyser für die EQ-Bars; Tracks ohne Datei fallen auf die
   synthetische Klangskizze zurück ---------- */
(function(){
  const playlist=document.getElementById('playlist');
  if(!playlist) return;
  const eq=document.getElementById('eq');
  const playBtn=document.getElementById('playBtn');
  const playIcon=document.getElementById('playIcon');
  const npKick=document.getElementById('npKick'), npTitle=document.getElementById('npTitle'), npComposer=document.getElementById('npComposer');
  const elapsedEl=document.getElementById('elapsed');
  const eqLabel=document.getElementById('eqLabel');
  const player=document.getElementById('player');
  const npArt=player ? player.querySelector('.player-art-current') : null;
  const npArtNext=player ? player.querySelector('.player-art-next') : null;
  let artSwap=0;
  const BARS=48;
  for(let i=0;i<BARS;i++){ const b=document.createElement('span'); b.className='bar'; eq.appendChild(b); }
  const bars=[...eq.children];

  // Playlist: vom Server gerendert (CMS-Tracks).
  let buttons=[...playlist.querySelectorAll('.track')];
  if(!buttons.length) return;
  const tracks=buttons.map(b=>({
    t: b.dataset.title || '', c: b.dataset.composer || '',
    index: parseInt(b.dataset.index || '0', 10) || buttons.indexOf(b) + 1,
    src: b.dataset.src || '', root: parseFloat(b.dataset.root || '261.63'),
    art: b.dataset.art || '', artAlt: b.dataset.artAlt || '',
    durEl: b.querySelector('.td')
  }));
  const trackCount=tracks.length;
  const realTrackCount=tracks.filter(t => Boolean(t.src)).length;
  const audioMeta = (i, extra={}) => {
    const tr=tracks[i] || {};
    return {
      track_index: tr.index || i + 1,
      track_title: tr.t,
      composer: tr.c,
      has_audio: Boolean(tr.src),
      track_count: trackCount,
      real_track_count: realTrackCount,
      ...extra
    };
  };
  const rememberAudioInterest = (i, engaged=false) => {
    const tr=tracks[i] || {};
    const data = {
      audio_last_track: tr.t,
      audio_last_index: tr.index || i + 1
    };
    if(engaged) data.audio_engaged = true;
    KMB_ANALYTICS.rememberInteraction(data);
  };
  if(player && 'IntersectionObserver' in window){
    const playerViewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          KMB_ANALYTICS.trackOnce('portfolio_audio_view', 'portfolio_audio_view', {
            track_count: trackCount,
            real_track_count: realTrackCount
          });
          playerViewObserver.disconnect();
        }
      });
    }, { threshold: 0.35 });
    playerViewObserver.observe(player);
  } else {
    KMB_ANALYTICS.trackOnce('portfolio_audio_view', 'portfolio_audio_view', {
      track_count: trackCount,
      real_track_count: realTrackCount
    });
  }
  buttons.forEach((b,i)=>b.addEventListener('click',()=>select(i,true,'playlist')));

  let ctx, analyser, data, synthGain, mediaGain, audioEl=null, nodes=[];
  let current=0, playing=false, raf, startedAt=0, mode='synth', playAttempt=0;
  const progressMarks = [25, 50, 75, 90];
  const progressSent = new Set();

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
    audioEl.addEventListener('ended',()=>{
      KMB_ANALYTICS.track('portfolio_audio_complete', audioMeta(current, { mode: 'media' }));
      if(current<tracks.length-1){ select(current+1,true,'autoplay'); } else { pause('complete'); }
    });
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
      if(mode==='media' && audioEl && isFinite(audioEl.duration) && audioEl.duration > 0){
        const progress=Math.floor((audioEl.currentTime / audioEl.duration) * 100);
        progressMarks.forEach(mark => {
          const key=current + ':' + mark;
          if(progress >= mark && !progressSent.has(key)){
            progressSent.add(key);
            KMB_ANALYTICS.track('portfolio_audio_progress', audioMeta(current, {
              progress: mark,
              elapsed_seconds: Math.round(audioEl.currentTime),
              duration_seconds: Math.round(audioEl.duration),
              mode: 'media'
            }));
          }
        });
      }
    }
    raf=requestAnimationFrame(animate);
  }
  function setMeta(i){
    const tr=tracks[i]; npTitle.textContent=tr.t; npComposer.textContent=tr.c;
    setArt(tr);
    buttons.forEach((el,k)=>el.classList.toggle('active',k===i));
    if(eqLabel) eqLabel.textContent=tr.src?'Aufnahme':'Klangskizze';
  }
  function cleanArt(img){
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
    img.removeAttribute('data-sizes');
    img.removeAttribute('data-defer-image');
  }
  function commitArt(src, alt){
    if(!npArt) return;
    npArt.src=src;
    npArt.alt=alt || '';
    cleanArt(npArt);
  }
  function setArt(tr){
    if(!npArt || !tr.art) return;
    const alt=tr.artAlt || '';
    const current=npArt.getAttribute('src') || '';
    if(current===tr.art){ npArt.alt=alt; return; }
    const token=++artSwap;
    const prefersReduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!npArtNext || prefersReduced){
      commitArt(tr.art, alt);
      return;
    }
    const preload=new Image();
    preload.onload=()=>{
      if(token!==artSwap) return;
      npArtNext.src=tr.art;
      npArtNext.classList.add('is-active');
      window.setTimeout(()=>{
        if(token!==artSwap) return;
        commitArt(tr.art, alt);
        npArtNext.classList.remove('is-active');
        window.setTimeout(()=>{
          if(token===artSwap) npArtNext.removeAttribute('src');
        }, 420);
      }, 360);
    };
    preload.onerror=()=>{ if(token===artSwap) commitArt(tr.art, alt); };
    preload.src=tr.art;
  }
  function setPlaying(){
    playing=true; player.classList.add('playing');
    playBtn.setAttribute('aria-label','Pausieren');
    playIcon.innerHTML='<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
    cancelAnimationFrame(raf); animate();
  }
  function setStopped(kick){
    playing=false; player.classList.remove('playing');
    playBtn.setAttribute('aria-label','Abspielen');
    cancelAnimationFrame(raf);
    playIcon.innerHTML='<path d="M8 5v14l11-7z"/>';
    bars.forEach(b=>b.style.height='6%');
    npKick.textContent=kick;
  }
  function play(i, trigger){
    ensure(); if(!ctx){ return; }
    const playTrigger=trigger || 'button';
    const attempt=++playAttempt;
    if(ctx.state==='suspended') ctx.resume();
    stopNodes();
    if(audioEl && !audioEl.paused) audioEl.pause();
    current=i;
    const tr=tracks[i];
    setMeta(i);
    if(tr.src){
      mode='media'; ensureAudioEl();
      const abs=new URL(tr.src, location.href).href;
      if(audioEl.src!==abs){ audioEl.src=tr.src; }
      audioEl.play()
        .then(()=>{ if(attempt!==playAttempt) return; player.removeAttribute('data-audio-error'); rememberAudioInterest(i, true); KMB_ANALYTICS.track('portfolio_audio_play', audioMeta(i, { trigger: playTrigger, mode: 'media' })); npKick.textContent='Aufnahme läuft'; setPlaying(); })
        .catch((error)=>{
          if(attempt!==playAttempt) return;
          const errorName=error && error.name ? error.name : 'play_failed';
          player.dataset.audioError=errorName;
          KMB_ANALYTICS.track('portfolio_audio_error', audioMeta(i, { trigger: playTrigger, mode: 'media', error_type: 'play_failed', error_name: errorName }));
          setStopped('Wiedergabe nicht möglich');
        });
      return;
    } else {
      mode='synth'; startVoice(tr.root); startedAt=ctx.currentTime;
      npKick.textContent='Klangskizze läuft';
    }
    rememberAudioInterest(i, true);
    KMB_ANALYTICS.track('portfolio_audio_play', audioMeta(i, { trigger: playTrigger, mode: 'synth' }));
    setPlaying();
  }
  function pause(trigger){
    playAttempt++;
    if(playing && trigger !== 'complete'){
      KMB_ANALYTICS.track('portfolio_audio_pause', audioMeta(current, {
        trigger: trigger || 'button',
        mode,
        elapsed_seconds: mode === 'media' && audioEl ? Math.round(audioEl.currentTime) : (ctx ? Math.round(ctx.currentTime - startedAt) : 0)
      }));
    }
    if(mode==='media' && audioEl){ audioEl.pause(); }
    else if(ctx){ synthGain.gain.cancelScheduledValues(ctx.currentTime); synthGain.gain.setValueAtTime(synthGain.gain.value, ctx.currentTime); synthGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.4); setTimeout(stopNodes,420); }
    setStopped('Pausiert');
  }
  function select(i,autoplay,trigger){
    if(trigger === 'playlist'){
      rememberAudioInterest(i, false);
      KMB_ANALYTICS.track('portfolio_audio_track_select', audioMeta(i, {
        trigger,
        autoplay: Boolean(autoplay)
      }));
    }
    current=i;
    if(playing){ play(i, trigger || 'select'); }
    else { setMeta(i); npKick.textContent='Jetzt ausgewählt'; if(autoplay) play(i, trigger || 'select'); }
  }
  playBtn.addEventListener('click',()=>{ if(playing) pause('button'); else play(current,'button'); });
})();
