/* ============================================================
   MOMENTUM — app.js  (意志力に頼らない目標達成OS)
   vanilla JS / オフラインPWA / localStorage
   ============================================================ */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const uid = () => 'm' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DAY = 86400000;
  const pad2 = (n) => String(n).padStart(2, '0');
  const dStr = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const todayStr = () => dStr(new Date());
  const parse = (s) => { const d = new Date(s + 'T00:00:00'); return isNaN(d) ? null : d; };
  const addDays = (s, n) => { const d = parse(s) || new Date(); d.setDate(d.getDate() + n); return dStr(d); };
  const fmtMD = (s) => { const d = parse(s); return d ? `${d.getMonth() + 1}/${d.getDate()}` : ''; };
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / DAY);

  /* ---------- line icon system (Lucide風・絵文字の代替) ---------- */
  const ICONS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    lineChart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    settings: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    trendingDown: '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
    trendingUp: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
    trendingRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    shuffle: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    hexagon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    sparkles: '<path d="M12 3 9.9 8.8 4 11l5.9 2.2L12 19l2.1-5.8L20 11l-5.9-2.2z"/><path d="M19 3v4"/><path d="M21 5h-4"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
    star: '<path d="M12 2 9.2 8.6 2 9.2l5.5 4.7L5.8 21 12 17.3 18.2 21l-1.7-7.1L22 9.2l-7.2-.6z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkSquare: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    dumbbell: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22"/><path d="M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 2.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0z"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.3 22.3 0 0 1-4 2z"/><path d="M9 12H4s.5-3 2-4c1.6-1.1 5 0 5 0"/><path d="M12 15v5s3-.5 4-2c1.1-1.6 0-5 0-5"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 8 5-5 5 5"/><path d="M12 3v12"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
    sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };
  function ic(name, size = 20, opt = {}) {
    const p = ICONS[name];
    if (!p) return '';
    const stroke = opt.grad ? 'url(#orbgrad)' : 'currentColor';
    return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${opt.sw || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }
  function moodFace(n, size = 24) {
    const mouth = { 1: '<path d="M8 16s1.5-2 4-2 4 2 4 2"/>', 2: '<path d="M8 15.5s1.5-1 4-1 4 1 4 1"/>', 3: '<path d="M8 15h8"/>', 4: '<path d="M8 14s1.5 1 4 1 4-1 4-1"/>', 5: '<path d="M8 14s1.5 2 4 2 4-2 4-2"/>' }[n] || '<path d="M8 15h8"/>';
    return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9h.01"/><path d="M15 9h.01"/>${mouth}</svg>`;
  }
  function hydrateIcons(root) {
    $$('[data-ic]', root || document).forEach((e) => {
      if (e.dataset.icDone) return;
      e.innerHTML = ic(e.dataset.ic, +e.dataset.icSize || 20, { grad: e.hasAttribute('data-ic-grad') });
      e.dataset.icDone = '1';
    });
  }

  /* ---------- inject shared SVG gradients ---------- */
  (function injectDefs() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `<defs>
      <linearGradient id="orbgrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8b5cf6"/><stop offset="0.5" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/>
      </linearGradient>
      <linearGradient id="orbgrad-hot" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f472b6"/><stop offset="1" stop-color="#fbbf24"/>
      </linearGradient>
    </defs>`;
    document.body.appendChild(svg);
  })();

  /* ---------- starfield ---------- */
  function startStarfield() {
    const cv = $('#starfield');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let stars = [], w = 0, h = 0, raf = null;
    function resize() {
      w = cv.width = innerWidth; h = cv.height = innerHeight;
      const n = Math.min(150, Math.round((w * h) / 14000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3, a: Math.random(),
        s: Math.random() * 0.6 + 0.1, tw: Math.random() * 0.04 + 0.005,
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        st.a += st.tw; const al = 0.4 + Math.abs(Math.sin(st.a)) * 0.6;
        st.y += st.s; if (st.y > h) { st.y = 0; st.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7);
        ctx.fillStyle = `rgba(200,210,255,${al})`; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    // 多重起動防止：既存のループ/リスナを止めてから開始
    if (window._sfStop) window._sfStop();
    if (window._sfResize) removeEventListener('resize', window._sfResize);
    window._sfResize = resize;
    resize(); addEventListener('resize', resize);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !document.body.classList.contains('reduce-motion')) tick();
    window._sfStop = () => { if (raf) { cancelAnimationFrame(raf); raf = null; } };
  }

  /* ---------- state ---------- */
  const KEY = 'mm_state_v1';
  const LIFE_AREAS = [
    { key: 'health', label: '健康' }, { key: 'work', label: '仕事' },
    { key: 'money', label: 'お金' }, { key: 'growth', label: '成長' },
    { key: 'relations', label: '人間関係' }, { key: 'fun', label: '趣味' },
    { key: 'family', label: '家族' }, { key: 'mind', label: '心' },
  ];
  function defaultState() {
    return {
      v: 1, onboarded: false, plan: 'free',
      vision: { northStar: '', identity: '', why: '' },
      goals: [], actions: [], logs: [],
      life: LIFE_AREAS.map((a) => ({ ...a, score: 5 })),
      settings: { name: '', reduceMotion: false },
    };
  }
  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      return Object.assign(defaultState(), s);
    } catch (e) { return defaultState(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  /* ---------- horizons ---------- */
  const HORIZONS = {
    week: { label: '今週', days: 7, color: '#22d3ee' },
    month: { label: '今月', days: 30, color: '#34d399' },
    quarter: { label: '四半期', days: 90, color: '#6366f1' },
    half: { label: '半年', days: 182, color: '#8b5cf6' },
    year: { label: '今年', days: 365, color: '#f472b6' },
  };
  const HORIZON_ORDER = ['week', 'month', 'quarter', 'half', 'year'];
  function goalDeadline(g) {
    if (g.deadline) return g.deadline;
    const base = (g.createdAt || todayStr()).slice(0, 10);
    return addDays(base, (HORIZONS[g.horizon] || HORIZONS.month).days);
  }
  function goalStart(g) { return (g.startDate || g.createdAt || todayStr()).slice(0, 10); }

  /* ---------- progress ---------- */
  function goalProgress(g) {
    if (g.progressMode === 'manual') return clamp(g.manual || 0, 0, 100);
    const ms = g.milestones || [];
    if (ms.length) return Math.round((100 * ms.filter((m) => m.done).length) / ms.length);
    return 0;
  }

  /* ---------- momentum engine ---------- */
  function activityOn(date) {
    let a = 0;
    for (const ac of S.actions) {
      if (ac.archived) continue;
      if (ac.kind === 'habit' && ac.history && ac.history[date]) a += 1;
      if (ac.kind === 'todo' && ac.done && ac.completedAt && ac.completedAt.slice(0, 10) === date) a += 1;
    }
    for (const g of S.goals) for (const m of (g.milestones || [])) {
      if (m.done && m.doneAt && m.doneAt.slice(0, 10) === date) a += 1.5;
    }
    if (S.logs.some((l) => l.date === date)) a += 0.5;
    return a;
  }
  function momentumAsOf(endDate) {
    const N = 21, decay = 0.9;
    let wsum = 0, asum = 0;
    for (let i = 0; i < N; i++) {
      const d = addDays(endDate, -i), w = Math.pow(decay, i);
      const hit = clamp(activityOn(d) / 1.5, 0, 1);
      wsum += w; asum += hit * w;
    }
    return Math.round((asum / wsum) * 100);
  }
  function levelOf(score) {
    if (score >= 80) return { label: '超加速', color: '#fbbf24', icon: 'rocket' };
    if (score >= 60) return { label: '巡航', color: '#34d399', icon: 'trendingUp' };
    if (score >= 40) return { label: '加速', color: '#22d3ee', icon: 'zap' };
    if (score >= 20) return { label: '始動', color: '#8b5cf6', icon: 'sprout' };
    return { label: '静止', color: '#6f7298', icon: 'moon' };
  }
  function streakInfo() {
    const t = todayStr();
    let count = 0, atRisk = false, i = 0;
    if (activityOn(t) <= 0) { atRisk = true; i = 1; }
    for (; i < 400; i++) { if (activityOn(addDays(t, -i)) > 0) count++; else break; }
    return { count, atRisk };
  }
  function velocity() {
    const t = todayStr();
    let recent = 0, prev = 0;
    for (let i = 0; i < 7; i++) recent += clamp(activityOn(addDays(t, -i)), 0, 2);
    for (let i = 7; i < 14; i++) prev += clamp(activityOn(addDays(t, -i)), 0, 2);
    const diff = recent - prev;
    if (diff > 1) return { dir: 'up', label: '加速中', icon: 'trendingUp', color: 'var(--green)' };
    if (diff < -1) return { dir: 'down', label: '減速中', icon: 'trendingDown', color: 'var(--red)' };
    return { dir: 'flat', label: '巡航', icon: 'trendingRight', color: 'var(--cyan)' };
  }
  function momentumHistory(n) {
    const t = todayStr(), out = [];
    for (let i = n - 1; i >= 0; i--) out.push({ date: addDays(t, -i), v: momentumAsOf(addDays(t, -i)) });
    return out;
  }

  /* ---------- orb svg ---------- */
  function orbSVG(score, size, hot) {
    const r = 42, c = 2 * Math.PI * r;
    const off = c * (1 - score / 100);
    const grad = hot ? 'orbgrad-hot' : 'orbgrad';
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="transform:rotate(-90deg)">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="9"/>
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="url(#${grad})" stroke-width="9" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
        style="filter:drop-shadow(0 0 4px rgba(139,92,246,.8));transition:stroke-dashoffset 1s var(--ease)"/>
    </svg>`;
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  let currentView = 'home';
  function show(screen) {
    ['landing', 'onboarding', 'app'].forEach((id) => { const e = $('#' + id); if (e) e.hidden = (id !== screen); });
    if (screen !== 'landing') window.scrollTo(0, 0);
  }
  function goApp(view) {
    show('app');
    setView(view || currentView || 'home');
    updateMomentumChip();
  }
  function setView(view) {
    currentView = view;
    $$('.view').forEach((v) => (v.hidden = (v.id !== 'view-' + view)));
    $$('.nav-item, .tab-item').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
    const titles = { home: 'ホーム', roadmap: 'ロードマップ', goals: '目標', today: '今日の一歩', stats: '軌跡', settings: '設定' };
    $('#view-title').textContent = titles[view] || '';
    renderView(view);
    const sc = $('.app-scroll'); if (sc) sc.scrollTop = 0;
  }
  function renderView(view) {
    ({ home: renderHome, roadmap: renderRoadmap, goals: renderGoals, today: renderToday, stats: renderStats, settings: renderSettings }[view] || (() => {}))();
  }
  function refresh() { save(); renderView(currentView); updateMomentumChip(); updateSideMomentum(); }

  function updateMomentumChip() {
    const score = momentumAsOf(todayStr()), lv = levelOf(score);
    const chip = $('#momentum-chip');
    if (chip) chip.innerHTML = `<span class="mc-orb">${orbSVG(score, 30)}</span><span>${score} <small style="color:${lv.color};display:inline-flex;align-items:center;gap:3px;vertical-align:middle">${ic(lv.icon, 12)}${lv.label}</small></span>`;
  }
  function updateSideMomentum() {
    const score = momentumAsOf(todayStr()), lv = levelOf(score), st = streakInfo();
    const e = $('#side-momentum');
    if (e) e.innerHTML = `<div style="font-size:.72rem;color:var(--text-mute);letter-spacing:.12em">勢い</div>
      <div style="font-size:2rem;font-weight:800;background:var(--grad-aurora);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">${score}</div>
      <div style="font-size:.82rem;color:${lv.color};font-weight:700;display:flex;align-items:center;gap:5px;justify-content:center">${ic(lv.icon, 14)} ${lv.label}</div>
      <div style="font-size:.8rem;color:var(--amber);margin-top:6px;display:flex;align-items:center;gap:5px;justify-content:center">${ic('flame', 12)} ${st.count}日連続</div>`;
  }

  /* ============================================================
     ONBOARDING
     ============================================================ */
  const VISION_PRESETS = ['理想の自分で生きる', '健康で活力ある毎日', '経済的に自由になる', '夢の仕事に就く', '大切な人を幸せにする', '世界に何かを残す'];
  const GOAL_PRESETS = {
    week: ['本を1冊読む', '3回運動する', 'タスクを片付ける'],
    month: ['資格の勉強を始める', '副業で初収入', '体重-2kg'],
    quarter: ['スキルを習得する', 'ポートフォリオ完成', '習慣を定着させる'],
    half: ['転職活動を成功させる', '事業を立ち上げる', '大きな試験に合格'],
    year: ['年収を上げる', '理想の体になる', '夢のプロジェクトを形に'],
  };
  let onb = {};
  function startOnboarding() {
    onb = { step: 0, vision: { northStar: '', identity: '', why: '' }, goal: { title: '', horizon: 'quarter' }, actions: [] };
    show('onboarding');
    renderOnb();
  }
  const ONB_STEPS = 5;
  function setOnbProgress() { $('#onb-progress').style.width = ((onb.step) / (ONB_STEPS - 1)) * 100 + '%'; }
  function renderOnb() {
    setOnbProgress();
    const body = $('#onb-body');
    const steps = [stepWelcome, stepVision, stepGoal, stepActions, stepDone];
    body.innerHTML = '';
    body.appendChild(steps[onb.step]());
  }
  function onbNav(back, next, nextLabel, nextDisabled) {
    const f = document.createElement('div'); f.className = 'onb-foot';
    f.innerHTML = `${back ? `<button class="btn btn-ghost" data-onb="back">戻る</button>` : `<span></span>`}
      <button class="btn btn-primary" data-onb="next" ${nextDisabled ? 'disabled style="opacity:.5"' : ''}>${nextLabel || '次へ →'}</button>`;
    return f;
  }
  function stepWelcome() {
    const d = document.createElement('div'); d.className = 'onb-step';
    d.innerHTML = `<p class="eyebrow"><span class="dot"></span>ようこそ</p>
      <h2>3分で、止まらない自分の<br><span class="grad-text">最初の一歩</span>を作ろう。</h2>
      <p class="onb-hint">難しい設定はゼロ。質問に答えるだけで、あなただけのロードマップが完成します。</p>
      <div class="onb-field"><label>あなたの名前（ニックネームでOK）</label>
        <input class="fld" id="onb-name" placeholder="例）かい" value="${esc(S.settings.name)}"></div>`;
    d.appendChild(onbNav(false, true, 'はじめる →'));
    return d;
  }
  function stepVision() {
    const d = document.createElement('div'); d.className = 'onb-step';
    d.innerHTML = `<p class="eyebrow"><span class="dot"></span>STEP 1 / DREAM</p>
      <h2>あなたの「北極星」は？</h2>
      <p class="onb-hint">なりたい自分・人生で実現したいこと。完璧じゃなくていい、今の言葉で。</p>
      <div class="preset-grid" id="onb-vpreset">${VISION_PRESETS.map((p) => `<button class="preset-chip" data-v="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      <div class="onb-field"><label>北極星（ビジョン）</label>
        <input class="fld" id="onb-northstar" placeholder="例）自分の力で自由に生きる" value="${esc(onb.vision.northStar)}"></div>
      <div class="onb-field"><label>そのために、どんな自分でありたい？</label>
        <input class="fld" id="onb-identity" placeholder="例）毎日少しずつ前に進む人" value="${esc(onb.vision.identity)}"></div>`;
    d.appendChild(onbNav(true, true));
    return d;
  }
  function stepGoal() {
    const d = document.createElement('div'); d.className = 'onb-step';
    d.innerHTML = `<p class="eyebrow"><span class="dot"></span>STEP 2 / GOAL</p>
      <h2>最初の目標を、ひとつ。</h2>
      <p class="onb-hint">大きな夢に近づく、手の届くゴールを決めよう。期間も選んで。</p>
      <div class="onb-field"><label>期間</label>
        <div class="preset-grid" id="onb-horizon">${HORIZON_ORDER.map((k) => `<button class="preset-chip${onb.goal.horizon === k ? ' sel' : ''}" data-h="${k}">${HORIZONS[k].label}</button>`).join('')}</div></div>
      <div class="preset-grid" id="onb-gpreset"></div>
      <div class="onb-field"><label>目標</label>
        <input class="fld" id="onb-goal" placeholder="例）資格の勉強を始める" value="${esc(onb.goal.title)}"></div>`;
    d.appendChild(onbNav(true, true));
    setTimeout(() => renderGoalPresets(d), 0);
    return d;
  }
  function renderGoalPresets(d) {
    const wrap = $('#onb-gpreset', d); if (!wrap) return;
    wrap.innerHTML = (GOAL_PRESETS[onb.goal.horizon] || []).map((p) => `<button class="preset-chip" data-g="${esc(p)}">${esc(p)}</button>`).join('');
  }
  function stepActions() {
    const d = document.createElement('div'); d.className = 'onb-step';
    const suggested = ['毎日15分やる', '朝にひとつ進める', '週3回取り組む'];
    if (!onb.actions.length) onb.actions = [];
    d.innerHTML = `<p class="eyebrow"><span class="dot"></span>STEP 3 / MOVE</p>
      <h2>今日からの「一歩」を決めよう。</h2>
      <p class="onb-hint">毎日 or 定期的にやる小さな行動。小さいほど続く。</p>
      <div class="preset-grid">${suggested.map((p) => `<button class="preset-chip" data-a="${esc(p)}">＋ ${esc(p)}</button>`).join('')}</div>
      <div class="onb-field"><label>自分で書く</label>
        <div style="display:flex;gap:8px"><input class="fld" id="onb-action" placeholder="例）毎日15分、参考書を読む"><button class="btn btn-ghost" data-onb="addaction">追加</button></div></div>
      <div id="onb-action-list" style="display:flex;flex-direction:column;gap:8px"></div>`;
    d.appendChild(onbNav(true, true, '完成させる'));
    setTimeout(() => renderOnbActions(d), 0);
    return d;
  }
  function renderOnbActions(d) {
    const list = $('#onb-action-list', d); if (!list) return;
    list.innerHTML = onb.actions.map((a, i) => `<div class="item"><span class="check on">${ic('check', 15)}</span><div class="item-body"><div class="item-title">${esc(a)}</div></div><button class="mini-btn" data-rmact="${i}">削除</button></div>`).join('') || `<p style="color:var(--text-mute);font-size:.86rem">最低1つ追加するのがおすすめ。後からいつでも変えられます。</p>`;
  }
  function stepDone() {
    const d = document.createElement('div'); d.className = 'onb-step'; d.style.textAlign = 'center';
    d.innerHTML = `<div style="margin-bottom:14px">${ic('rocket', 56, { grad: true })}</div>
      <h2>準備完了。<br><span class="grad-text">あなたの旅が、いま始まる。</span></h2>
      <p class="onb-hint">最初のロードマップができました。さっそく今日の一歩から動き出そう。</p>
      <div style="margin:24px 0">${orbSVG(8, 120)}</div>
      <button class="btn btn-primary btn-lg btn-block" data-onb="finish">MOMENTUMをはじめる →</button>`;
    return d;
  }
  function commitOnboarding() {
    S.settings.name = ($('#onb-name') && $('#onb-name').value.trim()) || S.settings.name || '';
    S.vision = onb.vision;
    const now = new Date().toISOString();
    let goalId = null;
    if (onb.goal.title.trim()) {
      goalId = uid();
      S.goals.push({
        id: goalId, title: onb.goal.title.trim(), why: onb.vision.northStar || '', horizon: onb.goal.horizon,
        deadline: addDays(todayStr(), (HORIZONS[onb.goal.horizon] || HORIZONS.quarter).days),
        color: (HORIZONS[onb.goal.horizon] || HORIZONS.quarter).color, milestones: [], progressMode: 'milestones',
        createdAt: now,
      });
    }
    onb.actions.forEach((t) => {
      S.actions.push({ id: uid(), title: t, goalId, kind: 'habit', cadence: 'daily', weekdays: [0, 1, 2, 3, 4, 5, 6], history: {}, createdAt: now });
    });
    S.onboarded = true;
    save();
  }

  /* ============================================================
     VIEWS
     ============================================================ */
  function greeting() {
    const h = new Date().getHours();
    const g = h < 5 ? 'こんばんは' : h < 11 ? 'おはよう' : h < 18 ? 'こんにちは' : 'こんばんは';
    return S.settings.name ? `${g}、${S.settings.name}` : g;
  }

  function renderHome() {
    const v = $('#view-home');
    const score = momentumAsOf(todayStr()), lv = levelOf(score), st = streakInfo(), vel = velocity();
    const todays = todaysActions();
    const focus = nextFocus();
    v.innerHTML = `
      <div class="hero-home">
        <div class="home-orb">${orbSVG(score, 150)}
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div style="font-size:2.4rem;font-weight:800;line-height:1">${score}</div>
            <div style="font-size:.8rem;color:${lv.color};font-weight:700;display:flex;align-items:center;gap:4px;justify-content:center">${ic(lv.icon, 13)}${lv.label}</div>
          </div>
        </div>
        <div>
          <div class="home-greeting">${esc(greeting())}</div>
          <div class="home-sub">${st.atRisk && st.count > 0 ? `<b style="color:var(--amber)">${ic('flame', 13)} ${st.count}日連続</b>、今日も続けて記録を伸ばそう。` : st.count > 0 ? `<b style="color:var(--amber)">${ic('flame', 13)} ${st.count}日連続</b>で進んでいます。素晴らしい！` : '今日の一歩から、勢いを生み出そう。'}</div>
          <div class="home-meta">
            <span class="chip chip-cyan">${ic(vel.icon, 13)} ${vel.label}</span>
            <span class="chip">${ic('list', 13)} 今日 ${todays.filter((a) => a.doneToday).length}/${todays.length}</span>
            <span class="chip chip-violet">${ic('target', 13)} 目標 ${S.goals.filter((g) => !g.archived).length}</span>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-h"><h2>${ic('zap', 18)} 今日の一歩</h2><button class="mini-btn" data-view-go="today">すべて見る</button></div>
          ${todays.length ? todays.slice(0, 5).map((a) => actionItemHTML(a)).join('') : emptyHTML(ic('sprout', 34, { grad: true }), '今日のアクションがありません', '「今日」タブから追加しよう')}
        </div>
        <div class="card">
          <div class="card-h"><h2>${ic('flag', 18)} 次のマイルストーン</h2><button class="mini-btn" data-view-go="roadmap">マップ</button></div>
          ${focus ? `
            <div style="font-size:.82rem;color:var(--text-mute)">${esc(focus.goalTitle)}</div>
            <div style="font-size:1.2rem;font-weight:800;margin:6px 0">${esc(focus.title)}</div>
            <div class="item-meta"><span class="im-ic">${ic('calendar', 12)} ${focus.date ? fmtMD(focus.date) + 'まで' : '期限なし'}</span>${focus.daysLeft != null ? `<span style="color:${focus.daysLeft < 0 ? 'var(--red)' : focus.daysLeft <= 3 ? 'var(--amber)' : 'var(--cyan)'}">${focus.daysLeft < 0 ? Math.abs(focus.daysLeft) + '日超過' : 'あと' + focus.daysLeft + '日'}</span>` : ''}</div>
            <div class="bar" style="margin-top:14px"><span style="width:${focus.progress}%"></span></div>
            <div style="text-align:right;font-size:.8rem;color:var(--text-mute);margin-top:6px">目標まで ${focus.progress}%</div>
          ` : emptyHTML(ic('flag', 34, { grad: true }), 'マイルストーン未設定', '目標に中間地点を足すと、道のりが見える')}
        </div>
      </div>

      <div class="card" style="margin-top:18px">
        <div class="card-h"><h2>${ic('lineChart', 18)} 勢いの推移（30日）</h2><span class="sub" style="display:inline-flex;align-items:center;gap:4px">${ic(lv.icon, 13)} ${lv.label}</span></div>
        <svg class="spark-chart" id="home-spark" viewBox="0 0 600 120" preserveAspectRatio="none"></svg>
      </div>`;
    drawSpark($('#home-spark'), momentumHistory(30), 600, 120);
  }

  function actionItemHTML(a) {
    const doneToday = a.kind === 'habit' ? !!(a.history && a.history[todayStr()]) : !!a.done;
    const stk = a.kind === 'habit' ? habitStreak(a) : 0;
    return `<div class="item${doneToday ? ' done' : ''}" data-act-item="${a.id}">
      <button class="check${doneToday ? ' on' : ''}" data-toggle-act="${a.id}">${doneToday ? ic('check', 15) : ''}</button>
      <div class="item-body">
        <div class="item-title">${esc(a.title)}</div>
        <div class="item-meta">${a.kind === 'habit' ? `<span class="im-ic">${ic('repeat', 12)} 習慣</span>` : `<span class="im-ic">${ic('checkSquare', 12)} タスク</span>`}${stk > 0 ? `<span class="item-streak im-ic">${ic('flame', 12)}${stk}</span>` : ''}${a.goalId ? `<span class="im-ic">${ic('target', 12)} ${esc(goalTitleOf(a.goalId))}</span>` : ''}</div>
      </div>
    </div>`;
  }
  function goalTitleOf(id) { const g = S.goals.find((x) => x.id === id); return g ? g.title : ''; }
  function habitStreak(a) {
    let c = 0; const t = todayStr();
    let i = (a.history && a.history[t]) ? 0 : 1;
    for (; i < 400; i++) { if (a.history && a.history[addDays(t, -i)]) c++; else break; }
    return c;
  }
  function todaysActions() {
    const t = todayStr(), dow = new Date().getDay();
    return S.actions.filter((a) => {
      if (a.archived) return false;
      if (a.kind === 'todo') return !a.done || (a.completedAt && a.completedAt.slice(0, 10) === t);
      if (a.cadence === 'daily') return true;
      return (a.weekdays || [0, 1, 2, 3, 4, 5, 6]).includes(dow);
    }).map((a) => ({ ...a, doneToday: a.kind === 'habit' ? !!(a.history && a.history[t]) : !!a.done }));
  }
  function nextFocus() {
    const t = todayStr();
    let best = null;
    for (const g of S.goals) {
      if (g.archived) continue;
      const ms = (g.milestones || []).filter((m) => !m.done);
      const prog = goalProgress(g);
      for (const m of ms) {
        const date = m.date || goalDeadline(g);
        const dl = date ? daysBetween(t, date) : 9999;
        if (!best || dl < best.daysLeft) best = { goalTitle: g.title, title: m.title, date, daysLeft: dl, progress: prog };
      }
      if (!ms.length) {
        const dl = daysBetween(t, goalDeadline(g));
        if (!best || dl < best.daysLeft) best = { goalTitle: g.title, title: g.title + ' を達成', date: goalDeadline(g), daysLeft: dl, progress: prog };
      }
    }
    return best;
  }
  function emptyHTML(emoji, title, sub) {
    return `<div class="empty"><div class="e-emoji">${emoji}</div><div style="font-weight:700;color:var(--text-dim)">${esc(title)}</div><div style="font-size:.85rem;margin-top:4px">${esc(sub)}</div></div>`;
  }

  /* ---------- ROADMAP ---------- */
  let rmZoom = 90;
  function renderRoadmap() {
    const v = $('#view-roadmap');
    const goals = S.goals.filter((g) => !g.archived);
    v.innerHTML = `
      <div class="rm-controls">
        <div class="zoom-group" id="rm-zoom">
          ${[['week', 30, '1ヶ月'], ['q', 90, '3ヶ月'], ['h', 180, '6ヶ月'], ['y', 365, '1年'], ['all', 0, '全体']].map(([k, d, l]) => `<button class="zoom-btn${rmZoom === d ? ' active' : ''}" data-zoom="${d}">${l}</button>`).join('')}
        </div>
        <button class="btn btn-ghost" data-action="add-goal" style="margin-left:auto">＋ 目標を追加</button>
      </div>
      ${goals.length ? `<div class="rm-outer" id="rm-outer"><div class="rm-canvas" id="rm-canvas"></div></div>
        <p style="color:var(--text-mute);font-size:.82rem;margin-top:10px">● ノード＝マイルストーン。タップで達成チェック。バーの長さ＝期間、満たされた色＝進捗。</p>`
        : emptyHTML(ic('route', 34, { grad: true }), 'まだ目標がありません', '目標を追加すると、ここに道のりが描かれます')}`;
    if (goals.length) requestAnimationFrame(() => drawRoadmap(goals));
  }
  function drawRoadmap(goals) {
    const outer = $('#rm-outer'), canvas = $('#rm-canvas');
    if (!outer || !canvas) return;
    const LABEL_W = 118, LANE_H = 66, HEADER_H = 40;
    const t = todayStr();
    // date range
    let dates = [];
    goals.forEach((g) => { dates.push(parse(goalStart(g)), parse(goalDeadline(g))); (g.milestones || []).forEach((m) => m.date && dates.push(parse(m.date))); });
    dates = dates.filter(Boolean);
    const today = parse(t);
    let minD, maxD;
    if (rmZoom === 0) {
      minD = new Date(Math.min(today, ...dates.map((d) => d.getTime())) - 10 * DAY);
      maxD = new Date(Math.max(today, ...dates.map((d) => d.getTime())) + 20 * DAY);
    } else {
      minD = new Date(today.getTime() - 7 * DAY);
      maxD = new Date(minD.getTime() + rmZoom * DAY);
    }
    const totalDays = Math.max(Math.round((maxD - minD) / DAY), 14);
    const viewW = Math.max(outer.clientWidth - LABEL_W, 280);
    const pxPerDay = Math.max(viewW / totalDays, rmZoom === 0 ? 1.5 : 2.4);
    const canvasW = LABEL_W + totalDays * pxPerDay;
    const x = (ds) => { const d = parse(ds); return LABEL_W + Math.max(0, (d - minD) / DAY) * pxPerDay; };
    const todayX = LABEL_W + ((today - minD) / DAY) * pxPerDay;

    // header ticks (months, or weeks if <=30)
    let ticks = '', grid = '';
    if (rmZoom !== 0 && rmZoom <= 30) {
      let wc = new Date(minD); wc.setHours(0, 0, 0, 0);
      wc.setDate(wc.getDate() - ((wc.getDay() + 6) % 7));
      while (wc <= maxD) {
        const px = LABEL_W + ((wc - minD) / DAY) * pxPerDay;
        ticks += `<div class="rm-tick" style="left:${px}px">${wc.getMonth() + 1}/${wc.getDate()}</div>`;
        grid += `<div class="rm-grid-line" style="left:${px}px"></div>`;
        wc.setDate(wc.getDate() + 7);
      }
    } else {
      let mc = new Date(minD.getFullYear(), minD.getMonth(), 1);
      while (mc <= maxD) {
        const px = LABEL_W + ((mc - minD) / DAY) * pxPerDay;
        const major = mc.getMonth() === 0;
        ticks += `<div class="rm-tick${major ? ' major' : ''}" style="left:${px}px">${major ? mc.getFullYear() + '年' : (mc.getMonth() + 1) + '月'}</div>`;
        grid += `<div class="rm-grid-line" style="left:${px}px"></div>`;
        mc.setMonth(mc.getMonth() + 1);
      }
    }

    let lanes = '';
    goals.forEach((g) => {
      const col = g.color || '#8b5cf6';
      const sx = x(goalStart(g)), ex = x(goalDeadline(g));
      const prog = goalProgress(g);
      const barW = Math.max(ex - sx, 26);
      const cy = LANE_H / 2;
      let nodes = '';
      (g.milestones || []).forEach((m) => {
        if (!m.date) return;
        const nx = x(m.date);
        nodes += `<div class="rm-node${m.done ? ' done' : ''}" data-ms="${g.id}:${m.id}" title="${esc(m.title)}（${fmtMD(m.date)}）" style="left:${nx - 8}px;top:${cy - 8}px;color:${col};border-color:${col}"></div>`;
      });
      lanes += `<div class="rm-lane" style="height:${LANE_H}px">
        <div class="rm-lane-label" style="height:${LANE_H}px"><span class="ll-dot" style="background:${col}"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(g.title)}</span></div>
        <div class="rm-bar" data-goal-bar="${g.id}" style="left:${sx}px;top:${cy - 13}px;width:${barW}px;background:${col}1f;border-color:${col}66;color:#fff">
          <span style="position:absolute;inset:0;width:${prog}%;background:${col}3a;border-radius:7px"></span>
          <span style="position:relative;z-index:1">${prog}%</span>
        </div>
        ${nodes}
      </div>`;
    });

    canvas.style.width = canvasW + 'px';
    canvas.innerHTML = `
      <div class="rm-header" style="height:${HEADER_H}px;width:${canvasW}px">${ticks}</div>
      <div style="position:relative;width:${canvasW}px">
        ${grid}
        <div class="rm-today" style="left:${todayX}px"></div>
        ${lanes}
      </div>`;
    // scroll so today is ~1/4 from left
    outer.scrollLeft = Math.max(0, todayX - viewW * 0.28);
  }

  /* ---------- GOALS ---------- */
  function renderGoals() {
    const v = $('#view-goals');
    const goals = S.goals.filter((g) => !g.archived);
    const byH = {};
    goals.forEach((g) => { (byH[g.horizon] = byH[g.horizon] || []).push(g); });
    v.innerHTML = `
      <div class="card" style="background:linear-gradient(150deg,rgba(244,114,182,.12),var(--surface));margin-bottom:18px">
        <div class="card-h"><h2>${ic('star', 18)} 北極星（ビジョン）</h2><button class="mini-btn" data-action="edit-vision">編集</button></div>
        ${S.vision.northStar ? `<div style="font-size:1.4rem;font-weight:800" class="grad-text">${esc(S.vision.northStar)}</div>
          ${S.vision.identity ? `<div style="color:var(--text-dim);margin-top:8px">なりたい自分：${esc(S.vision.identity)}</div>` : ''}`
          : emptyHTML(ic('star', 34, { grad: true }), 'ビジョン未設定', 'すべての行動の理由になる「北極星」を決めよう')}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h2 style="font-size:1.2rem;font-weight:800;display:flex;align-items:center;gap:7px">${ic('target', 18)} 目標 <span style="color:var(--text-mute);font-size:.9rem;font-weight:600">${goals.length}件</span></h2>
        <button class="btn btn-primary" data-action="add-goal">＋ 目標を追加</button>
      </div>
      ${goals.length ? HORIZON_ORDER.filter((k) => byH[k]).map((k) => `
        <div style="margin-bottom:8px;color:${HORIZONS[k].color};font-weight:800;font-size:.9rem;letter-spacing:.05em">${HORIZONS[k].label}</div>
        <div class="stack" style="margin-bottom:22px">${byH[k].map(goalCardHTML).join('')}</div>
      `).join('') : emptyHTML(ic('target', 34, { grad: true }), '目標がありません', '最初の目標を追加して、道のりを描こう')}`;
  }
  function goalCardHTML(g) {
    const prog = goalProgress(g), col = g.color || '#8b5cf6';
    const ms = g.milestones || [];
    const dl = daysBetween(todayStr(), goalDeadline(g));
    return `<div class="card goal-card" style="--gc:${col}">
      <div class="goal-top">
        <div style="min-width:0">
          <div class="goal-title">${esc(g.title)}</div>
          <div class="item-meta" style="margin-top:4px"><span class="im-ic">${ic('calendar', 12)} ${fmtMD(goalDeadline(g))}</span><span style="color:${dl < 0 ? 'var(--red)' : dl <= 7 ? 'var(--amber)' : 'var(--text-mute)'}">${dl < 0 ? Math.abs(dl) + '日超過' : 'あと' + dl + '日'}</span></div>
        </div>
        <div class="goal-pct">${prog}%</div>
      </div>
      <div class="bar" style="margin-top:12px"><span style="width:${prog}%;background:${col}"></span></div>
      <div class="ms-list">
        ${ms.map((m) => `<div class="ms-row${m.done ? ' done' : ''}"><span class="ms-dot${m.done ? ' on' : ''}" data-ms="${g.id}:${m.id}"></span><span class="ms-text">${esc(m.title)}</span><span class="ms-date">${m.date ? fmtMD(m.date) : ''}</span></div>`).join('')}
      </div>
      <div class="item-actions" style="margin-top:14px">
        <button class="mini-btn" data-add-ms="${g.id}">＋ マイルストーン</button>
        <button class="mini-btn" data-edit-goal="${g.id}">編集</button>
        <button class="mini-btn" data-del-goal="${g.id}">削除</button>
      </div>
    </div>`;
  }

  /* ---------- TODAY ---------- */
  function renderToday() {
    const v = $('#view-today');
    const acts = todaysActions();
    const habits = acts.filter((a) => a.kind === 'habit');
    const todos = acts.filter((a) => a.kind === 'todo');
    const t = todayStr();
    const log = S.logs.find((l) => l.date === t);
    const d = new Date();
    v.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><div style="font-size:1.5rem;font-weight:800">${d.getMonth() + 1}月${d.getDate()}日</div><div style="color:var(--text-mute);font-size:.86rem">${['日', '月', '火', '水', '木', '金', '土'][d.getDay()]}曜日</div></div>
        <button class="btn btn-primary" data-action="add-action">＋ アクション</button>
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('repeat', 18)} 今日の習慣</h2><span class="sub">${habits.filter((a) => a.doneToday).length}/${habits.length} 完了</span></div>
        ${habits.length ? habits.map((a) => actionItemHTML(a)).join('') : emptyHTML(ic('sprout', 34, { grad: true }), '習慣がありません', '毎日の小さな一歩を追加しよう')}
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('checkSquare', 18)} タスク</h2></div>
        ${todos.length ? todos.map((a) => actionItemHTML(a)).join('') : emptyHTML(ic('checkSquare', 34, { grad: true }), 'タスクなし', '一度きりのToDoはここに')}
      </div>
      <div class="card">
        <div class="card-h"><h2>${ic('book', 18)} 今日の振り返り</h2></div>
        <div class="onb-field"><label>今の気分は？</label>
          <div class="mood-pick" id="mood-pick">${[1, 2, 3, 4, 5].map((n) => `<button class="mood-btn${log && log.mood === n ? ' sel' : ''}" data-mood="${n}">${moodFace(n, 26)}</button>`).join('')}</div>
        </div>
        <div class="onb-field"><label>ひとこと（今日の学び・できたこと）</label>
          <textarea class="fld" id="reflect-note" placeholder="例）15分だけど集中できた">${esc(log ? log.note : '')}</textarea></div>
        <button class="btn btn-primary" data-action="save-reflect">記録する</button>
      </div>`;
  }

  /* ---------- STATS ---------- */
  function renderStats() {
    const v = $('#view-stats');
    const score = momentumAsOf(todayStr()), lv = levelOf(score), st = streakInfo(), vel = velocity();
    const hist = momentumHistory(30);
    const totalDone = countTotalDone();
    const avgGoal = S.goals.length ? Math.round(S.goals.reduce((s, g) => s + goalProgress(g), 0) / S.goals.length) : 0;
    const daysActive = hist.filter((_, i) => activityOn(addDays(todayStr(), -(29 - i))) > 0).length;
    v.innerHTML = `
      <div class="grid-3" style="margin-bottom:18px">
        <div class="card stat-card"><div class="stat-num" style="background:var(--grad-aurora);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">${score}</div><div class="stat-lbl">勢いスコア ${lv.label}</div></div>
        <div class="card stat-card"><div class="stat-num" style="color:var(--amber);display:flex;align-items:center;justify-content:center;gap:6px">${ic('flame', 26)}${st.count}</div><div class="stat-lbl">連続日数</div></div>
        <div class="card stat-card"><div class="stat-num" style="color:${vel.color};display:flex;align-items:center;justify-content:center">${ic(vel.icon, 34)}</div><div class="stat-lbl">${vel.label}</div></div>
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('lineChart', 18)} 勢いの推移（30日）</h2></div>
        <svg class="spark-chart" id="stats-spark" viewBox="0 0 600 120" preserveAspectRatio="none"></svg>
      </div>
      <div class="grid-3" style="margin-bottom:18px">
        <div class="card stat-card"><div class="stat-num">${totalDone}</div><div class="stat-lbl">これまでの行動回数</div></div>
        <div class="card stat-card"><div class="stat-num">${avgGoal}%</div><div class="stat-lbl">目標 平均進捗</div></div>
        <div class="card stat-card"><div class="stat-num">${daysActive}<small style="font-size:1rem;color:var(--text-mute)">/30</small></div><div class="stat-lbl">活動した日</div></div>
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('award', 18)} 実績バッジ</h2></div>
        <div style="display:flex;flex-wrap:wrap;gap:10px">${badgesHTML()}</div>
      </div>
      <div class="card">
        <div class="card-h"><h2>${ic('hexagon', 18)} 人生バランス</h2><span class="sub">スライダーで調整</span></div>
        <div class="grid-2">
          <div class="radar-wrap"><svg class="radar-svg" id="radar" viewBox="0 0 240 240"></svg></div>
          <div class="radar-controls" id="radar-ctl">${S.life.map((a) => `
            <div class="radar-ctl"><label>${esc(a.label)}</label><input type="range" min="0" max="10" value="${a.score}" data-life="${a.key}"><span class="rv" data-rv="${a.key}">${a.score}</span></div>`).join('')}
          </div>
        </div>
      </div>`;
    drawSpark($('#stats-spark'), hist, 600, 120);
    drawRadar();
  }
  function countTotalDone() {
    let c = 0;
    S.actions.forEach((a) => { if (a.kind === 'habit' && a.history) c += Object.keys(a.history).length; if (a.kind === 'todo' && a.done) c += 1; });
    S.goals.forEach((g) => (g.milestones || []).forEach((m) => m.done && c++));
    return c;
  }
  function badgesHTML() {
    const total = countTotalDone(), st = streakInfo();
    const msDone = S.goals.reduce((s, g) => s + (g.milestones || []).filter((m) => m.done).length, 0);
    const goalsDone = S.goals.filter((g) => goalProgress(g) >= 100).length;
    const badges = [
      { on: total >= 1, e: 'sprout', t: '最初の一歩' },
      { on: st.count >= 3, e: 'flame', t: '3日連続' },
      { on: st.count >= 7, e: 'zap', t: '7日連続' },
      { on: st.count >= 30, e: 'rocket', t: '30日連続' },
      { on: msDone >= 1, e: 'flag', t: '初マイルストーン' },
      { on: total >= 50, e: 'dumbbell', t: '50アクション' },
      { on: goalsDone >= 1, e: 'trophy', t: '目標達成' },
      { on: S.logs.length >= 7, e: 'book', t: '7日記録' },
    ];
    return badges.map((b) => `<div class="chip" style="opacity:${b.on ? 1 : 0.4};flex-direction:column;height:auto;padding:13px 14px;gap:7px;min-width:80px"><div style="color:${b.on ? 'var(--text)' : 'var(--text-mute)'}">${ic(b.e, 26, { grad: b.on })}</div><div style="font-size:.74rem">${b.t}</div></div>`).join('');
  }
  function drawRadar() {
    const svg = $('#radar'); if (!svg) return;
    const cx = 120, cy = 120, R = 92, n = S.life.length;
    const ang = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
    let rings = '';
    for (let r = 1; r <= 4; r++) {
      const pts = S.life.map((_, i) => `${cx + Math.cos(ang(i)) * (R * r / 4)},${cy + Math.sin(ang(i)) * (R * r / 4)}`).join(' ');
      rings += `<polygon class="radar-grid" points="${pts}"/>`;
    }
    let axes = '', labels = '', dots = '';
    const poly = S.life.map((a, i) => {
      const rr = (a.score / 10) * R, px = cx + Math.cos(ang(i)) * rr, py = cy + Math.sin(ang(i)) * rr;
      const ex = cx + Math.cos(ang(i)) * R, ey = cy + Math.sin(ang(i)) * R;
      const lx = cx + Math.cos(ang(i)) * (R + 16), ly = cy + Math.sin(ang(i)) * (R + 16);
      axes += `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}"/>`;
      labels += `<text class="radar-label" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle">${esc(a.label)}</text>`;
      dots += `<circle class="radar-dot" cx="${px}" cy="${py}" r="3"/>`;
      return `${px},${py}`;
    }).join(' ');
    svg.innerHTML = `${rings}${axes}<polygon class="radar-poly" points="${poly}"/>${dots}${labels}`;
  }

  /* ---------- SETTINGS ---------- */
  function renderSettings() {
    const v = $('#view-settings');
    v.innerHTML = `
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('user', 18)} プロフィール</h2></div>
        <div class="onb-field"><label>名前</label><input class="fld" id="set-name" value="${esc(S.settings.name)}" placeholder="ニックネーム"></div>
        <button class="btn btn-ghost" data-action="save-name">保存</button>
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('smartphone', 18)} アプリとして使う</h2></div>
        <p style="color:var(--text-dim);font-size:.9rem;margin-bottom:12px">スマホ・PCのホーム画面に追加すると、アプリのように起動でき、オフラインでも動きます。</p>
        <button class="btn btn-primary" data-action="install">${ic('smartphone', 16)} ホーム画面に追加 / インストール</button>
        <p style="color:var(--text-mute);font-size:.8rem;margin-top:10px">※ iPhoneのSafariは「共有 → ホーム画面に追加」から。</p>
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('sliders', 18)} 表示</h2></div>
        <div class="set-row"><div class="sr-info"><h4>背景アニメを減らす</h4><p>星空・オーロラの動きを止めます</p></div><button class="toggle${S.settings.reduceMotion ? ' on' : ''}" data-action="toggle-motion"></button></div>
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('save', 18)} データ</h2></div>
        <div class="set-row"><div class="sr-info"><h4>バックアップ（書き出し）</h4><p>JSONファイルとして保存</p></div><button class="btn btn-ghost" data-action="export">書き出す</button></div>
        <div class="set-row"><div class="sr-info"><h4>復元（読み込み）</h4><p>JSONから復元</p></div><button class="btn btn-ghost" data-action="import">読み込む</button></div>
        <div class="set-row"><div class="sr-info"><h4 style="color:var(--red)">すべてリセット</h4><p>全データを削除します</p></div><button class="btn btn-danger" data-action="reset">リセット</button></div>
        <input type="file" id="import-file" accept="application/json" hidden>
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="card-h"><h2>${ic('gem', 18)} プラン</h2></div>
        <p style="color:var(--text-dim);font-size:.92rem">現在：<b style="color:var(--cyan)">${S.plan === 'pro' ? 'Pro' : 'Free'}</b>（β）</p>
        <p style="color:var(--text-mute);font-size:.84rem;margin-top:6px">クラウド同期・AIコーチ・通知は近日対応。早期ユーザーには優待を予定しています。</p>
      </div>
      <div style="text-align:center;padding:10px"><button class="mini-btn" data-action="goto-landing">紹介ページ（LP）を見る</button></div>
      <p style="text-align:center;color:var(--text-mute);font-size:.78rem;margin-top:10px">MOMENTUM — 意志力に頼らない目標達成OS</p>`;
  }

  /* ---------- spark chart ---------- */
  function drawSpark(svg, data, W, H) {
    if (!svg || !data.length) return;
    const pad = 8, max = 100;
    const xs = (i) => pad + (i / (data.length - 1)) * (W - pad * 2);
    const ys = (v) => H - pad - (v / max) * (H - pad * 2);
    const line = data.map((d, i) => `${xs(i).toFixed(1)},${ys(d.v).toFixed(1)}`).join(' ');
    const area = `${pad},${H - pad} ${line} ${(W - pad)},${H - pad}`;
    const last = data[data.length - 1];
    svg.innerHTML = `
      <defs><linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.5"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>
      <polygon points="${area}" fill="url(#sparkfill)"/>
      <polyline points="${line}" fill="none" stroke="url(#orbgrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${xs(data.length - 1).toFixed(1)}" cy="${ys(last.v).toFixed(1)}" r="4" fill="#fff" style="filter:drop-shadow(0 0 5px #22d3ee)"/>`;
  }

  /* ============================================================
     MODALS / CRUD
     ============================================================ */
  function openModal(title, bodyHTML, onMount) {
    const root = $('#modal-root');
    root.innerHTML = `<div class="modal-backdrop"><div class="modal"><div class="modal-h"><h3>${esc(title)}</h3><button class="modal-x" data-close-modal>×</button></div>${bodyHTML}</div></div>`;
    const bd = root.querySelector('.modal-backdrop');
    bd.addEventListener('click', (e) => { if (e.target === bd) closeModal(); });
    if (onMount) onMount(root);
  }
  function closeModal() { $('#modal-root').innerHTML = ''; }

  function goalModal(existing) {
    const g = existing || { title: '', horizon: 'quarter', why: '', deadline: '', color: '' };
    openModal(existing ? '目標を編集' : '目標を追加', `
      <div class="onb-field"><label>目標</label><input class="fld" id="gm-title" value="${esc(g.title)}" placeholder="例）資格に合格する"></div>
      <div class="onb-field"><label>期間</label><div class="preset-grid" id="gm-horizon">${HORIZON_ORDER.map((k) => `<button class="preset-chip${g.horizon === k ? ' sel' : ''}" data-gh="${k}">${HORIZONS[k].label}</button>`).join('')}</div></div>
      <div class="onb-field"><label>期限（任意）</label><input class="fld" id="gm-deadline" type="date" value="${g.deadline ? g.deadline.slice(0, 10) : ''}"></div>
      <div class="onb-field"><label>なぜ達成したい？（任意）</label><input class="fld" id="gm-why" value="${esc(g.why || '')}" placeholder="この目標があなたの北極星にどう近づく？"></div>
      <button class="btn btn-primary btn-block" data-save-goal>${existing ? '保存' : '追加する'}</button>
    `, (root) => {
      let horizon = g.horizon;
      root.querySelectorAll('[data-gh]').forEach((b) => b.addEventListener('click', () => { horizon = b.dataset.gh; root.querySelectorAll('[data-gh]').forEach((x) => x.classList.toggle('sel', x === b)); }));
      root.querySelector('[data-save-goal]').addEventListener('click', () => {
        const title = $('#gm-title').value.trim(); if (!title) { $('#gm-title').focus(); return; }
        const deadline = $('#gm-deadline').value || '';
        if (existing) { Object.assign(existing, { title, horizon, why: $('#gm-why').value.trim(), deadline, color: HORIZONS[horizon].color }); }
        else { S.goals.push({ id: uid(), title, horizon, why: $('#gm-why').value.trim(), deadline, color: HORIZONS[horizon].color, milestones: [], progressMode: 'milestones', createdAt: new Date().toISOString() }); }
        closeModal(); toast(existing ? '更新しました' : '目標を追加しました'); refresh();
      });
    });
  }
  function msModal(goalId) {
    openModal('マイルストーンを追加', `
      <p style="color:var(--text-dim);font-size:.88rem;margin-bottom:14px">目標までの「中間地点」。砕くほど、道のりが見える。</p>
      <div class="onb-field"><label>内容</label><input class="fld" id="ms-title" placeholder="例）参考書を1周する"></div>
      <div class="onb-field"><label>いつまで？（任意）</label><input class="fld" id="ms-date" type="date"></div>
      <button class="btn btn-primary btn-block" data-save-ms>追加する</button>
    `, (root) => {
      root.querySelector('[data-save-ms]').addEventListener('click', () => {
        const title = $('#ms-title').value.trim(); if (!title) { $('#ms-title').focus(); return; }
        const g = S.goals.find((x) => x.id === goalId); if (!g) return;
        (g.milestones = g.milestones || []).push({ id: uid(), title, date: $('#ms-date').value || '', done: false });
        g.milestones.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
        closeModal(); toast('マイルストーンを追加しました'); refresh();
      });
    });
  }
  function actionModal() {
    openModal('アクションを追加', `
      <div class="onb-field"><label>種類</label><div class="preset-grid" id="am-kind">
        <button class="preset-chip sel" data-ak="habit">${ic('repeat', 14)} 習慣（くり返す）</button>
        <button class="preset-chip" data-ak="todo">${ic('checkSquare', 14)} タスク（一度だけ）</button></div></div>
      <div class="onb-field"><label>内容</label><input class="fld" id="am-title" placeholder="例）毎日15分、参考書を読む"></div>
      <div class="onb-field" id="am-goal-wrap"><label>関連する目標（任意）</label><select class="fld" id="am-goal"><option value="">なし</option>${S.goals.filter((g) => !g.archived).map((g) => `<option value="${g.id}">${esc(g.title)}</option>`).join('')}</select></div>
      <div class="onb-field" id="am-due-wrap" hidden><label>期限</label><input class="fld" id="am-due" type="date"></div>
      <button class="btn btn-primary btn-block" data-save-action>追加する</button>
    `, (root) => {
      let kind = 'habit';
      root.querySelectorAll('[data-ak]').forEach((b) => b.addEventListener('click', () => {
        kind = b.dataset.ak; root.querySelectorAll('[data-ak]').forEach((x) => x.classList.toggle('sel', x === b));
        $('#am-due-wrap').hidden = (kind !== 'todo');
      }));
      root.querySelector('[data-save-action]').addEventListener('click', () => {
        const title = $('#am-title').value.trim(); if (!title) { $('#am-title').focus(); return; }
        const goalId = $('#am-goal').value || null;
        const a = { id: uid(), title, goalId, kind, createdAt: new Date().toISOString() };
        if (kind === 'habit') { a.cadence = 'daily'; a.weekdays = [0, 1, 2, 3, 4, 5, 6]; a.history = {}; }
        else { a.done = false; a.dueDate = $('#am-due').value || ''; }
        S.actions.push(a); closeModal(); toast('アクションを追加しました'); refresh();
      });
    });
  }
  function visionModal() {
    openModal('北極星を編集', `
      <div class="onb-field"><label>ビジョン（北極星）</label><input class="fld" id="vm-ns" value="${esc(S.vision.northStar)}" placeholder="例）自分の力で自由に生きる"></div>
      <div class="onb-field"><label>なりたい自分</label><input class="fld" id="vm-id" value="${esc(S.vision.identity)}" placeholder="例）毎日前に進む人"></div>
      <div class="onb-field"><label>なぜ？（任意）</label><textarea class="fld" id="vm-why" placeholder="その理由">${esc(S.vision.why)}</textarea></div>
      <button class="btn btn-primary btn-block" data-save-vision>保存</button>
    `, (root) => {
      root.querySelector('[data-save-vision]').addEventListener('click', () => {
        S.vision = { northStar: $('#vm-ns').value.trim(), identity: $('#vm-id').value.trim(), why: $('#vm-why').value.trim() };
        closeModal(); toast('ビジョンを更新しました'); refresh();
      });
    });
  }

  /* ---------- toggle action / milestone ---------- */
  function toggleAction(id) {
    const a = S.actions.find((x) => x.id === id); if (!a) return;
    const t = todayStr(); let became = false;
    if (a.kind === 'habit') { a.history = a.history || {}; if (a.history[t]) delete a.history[t]; else { a.history[t] = true; became = true; } }
    else { a.done = !a.done; if (a.done) { a.completedAt = new Date().toISOString(); became = true; } else delete a.completedAt; }
    if (became) { celebrate(); const stk = a.kind === 'habit' ? habitStreak(a) : 0; toast(stk > 1 ? `${stk}日連続！その調子` : 'ナイス！一歩前進'); }
    refresh();
  }
  function toggleMilestone(goalId, msId) {
    const g = S.goals.find((x) => x.id === goalId); if (!g) return;
    const m = (g.milestones || []).find((x) => x.id === msId); if (!m) return;
    m.done = !m.done; if (m.done) { m.doneAt = new Date().toISOString(); celebrate();
      if (goalProgress(g) >= 100) { bigCelebrate(); toast('目標達成！おめでとう'); } else toast('マイルストーン達成！'); }
    else delete m.doneAt;
    refresh();
  }

  /* ---------- export/import/reset ---------- */
  function exportData() {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `momentum-backup-${todayStr()}.json`; a.click(); URL.revokeObjectURL(url);
    toast('書き出しました');
  }
  function importData() { $('#import-file').click(); }
  function handleImport(file) {
    const r = new FileReader();
    r.onload = () => { try { S = Object.assign(defaultState(), JSON.parse(r.result)); save(); toast('復元しました'); renderView(currentView); updateMomentumChip(); updateSideMomentum(); } catch (e) { toast('読み込みに失敗しました'); } };
    r.readAsText(file);
  }
  function resetData() {
    openModal('本当にリセット？', `<p style="color:var(--text-dim);margin-bottom:20px">すべての目標・記録が削除されます。この操作は取り消せません。</p>
      <button class="btn btn-danger btn-block" data-confirm-reset>すべて削除する</button>`, (root) => {
      root.querySelector('[data-confirm-reset]').addEventListener('click', () => { S = defaultState(); save(); closeModal(); toast('リセットしました'); show('landing'); });
    });
  }

  /* ---------- demo data ---------- */
  function loadDemo() {
    S = defaultState();
    S.settings.name = 'ゲスト';
    S.vision = { northStar: '自分の力で、自由に生きる', identity: '毎日少しずつ前に進む人', why: '時間と場所に縛られず、好きなことで生きたい' };
    const now = new Date().toISOString();
    const g1 = uid(), g2 = uid(), g3 = uid();
    S.goals = [
      { id: g1, title: 'Webスキルを習得する', horizon: 'quarter', why: '自由に働く力をつける', deadline: addDays(todayStr(), 80), color: HORIZONS.quarter.color, progressMode: 'milestones', createdAt: addDays(todayStr(), -25) + 'T00:00:00.000Z',
        milestones: [
          { id: uid(), title: 'HTML/CSSを終える', date: addDays(todayStr(), -5), done: true, doneAt: addDays(todayStr(), -5) + 'T10:00:00.000Z' },
          { id: uid(), title: 'JavaScript基礎', date: addDays(todayStr(), 20), done: false },
          { id: uid(), title: 'ポートフォリオ公開', date: addDays(todayStr(), 70), done: false },
        ] },
      { id: g2, title: '健康な体をつくる', horizon: 'month', why: '活力ある毎日のため', deadline: addDays(todayStr(), 22), color: HORIZONS.month.color, progressMode: 'milestones', createdAt: addDays(todayStr(), -12) + 'T00:00:00.000Z',
        milestones: [{ id: uid(), title: '週3で運動の習慣化', date: addDays(todayStr(), 10), done: false }, { id: uid(), title: '体重 -2kg', date: addDays(todayStr(), 22), done: false }] },
      { id: g3, title: '今年やりたいことリスト達成', horizon: 'year', why: '', deadline: addDays(todayStr(), 250), color: HORIZONS.year.color, progressMode: 'milestones', createdAt: addDays(todayStr(), -30) + 'T00:00:00.000Z',
        milestones: [{ id: uid(), title: '副業で初収入', date: addDays(todayStr(), 120), done: false }] },
    ];
    S.actions = [
      { id: uid(), title: '毎日30分コードを書く', goalId: g1, kind: 'habit', cadence: 'daily', weekdays: [0, 1, 2, 3, 4, 5, 6], history: demoHistory(0.8), createdAt: now },
      { id: uid(), title: '朝のストレッチ', goalId: g2, kind: 'habit', cadence: 'daily', weekdays: [0, 1, 2, 3, 4, 5, 6], history: demoHistory(0.7), createdAt: now },
      { id: uid(), title: '読書 15分', goalId: null, kind: 'habit', cadence: 'daily', weekdays: [0, 1, 2, 3, 4, 5, 6], history: demoHistory(0.6), createdAt: now },
      { id: uid(), title: '教材を買う', goalId: g1, kind: 'todo', done: true, completedAt: addDays(todayStr(), -20) + 'T10:00:00.000Z', createdAt: now },
    ];
    S.logs = [];
    for (let i = 0; i < 12; i++) if (Math.random() > 0.4) S.logs.push({ id: uid(), date: addDays(todayStr(), -i), mood: 3 + Math.floor(Math.random() * 3), note: '', createdAt: now });
    S.life = LIFE_AREAS.map((a, i) => ({ ...a, score: [7, 6, 4, 8, 5, 6, 7, 6][i] }));
    S.onboarded = true; save();
  }
  function demoHistory(rate) {
    const h = {}; const t = todayStr();
    for (let i = 0; i < 24; i++) if (Math.random() < rate) h[addDays(t, -i)] = true;
    return h;
  }

  /* ---------- confetti ---------- */
  function celebrate(big) {
    if (S.settings.reduceMotion) return;
    const cv = $('#confetti'); const ctx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ['#8b5cf6', '#22d3ee', '#fbbf24', '#34d399', '#f472b6'];
    const N = big ? 160 : 70;
    const parts = Array.from({ length: N }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.4,
      vx: (Math.random() - 0.5) * (big ? 18 : 12), vy: -(Math.random() * 14 + 6),
      g: 0.4, s: Math.random() * 7 + 4, c: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 0,
    }));
    let frames = 0;
    (function run() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach((p) => { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.globalAlpha = clamp(1 - frames / 90, 0, 1);
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx.restore(); });
      frames++; if (frames < 90) requestAnimationFrame(run); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  }
  function bigCelebrate() { celebrate(true); }

  /* ---------- toast ---------- */
  let toastT = null;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.hidden = false;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastT); toastT = setTimeout(() => { el.classList.remove('show'); setTimeout(() => (el.hidden = true), 300); }, 2200);
  }

  /* ============================================================
     LP animations
     ============================================================ */
  function animateLP() {
    const target = 72;
    // hero orb
    const fill = $('#hero-orb-fill'); const valEl = $('#hero-orb-value');
    if (fill) { const c = 653; setTimeout(() => { fill.style.strokeDashoffset = c * (1 - target / 100); }, 300); }
    countUp(valEl, target, 1400);
    const stateEl = $('#hero-orb-state'); if (stateEl) { const lv = levelOf(target); stateEl.textContent = lv.label; stateEl.style.color = lv.color; }
    // orb gradient stroke on hero (uses orbgrad)
    if (fill) fill.style.stroke = 'url(#orbgrad)';
    // hook meter
    const mf = $('#hook-meter-fill'); if (mf) setTimeout(() => (mf.style.width = target + '%'), 300);
    countUp($('#hook-meter-val'), target, 1400);
    // hook spark
    const spark = $('#hook-spark');
    if (spark) { const data = [12, 18, 14, 26, 32, 28, 40, 48, 44, 58, 64, 60, 72].map((v, i) => ({ v })); drawSpark(spark, data, 300, 80); }
  }
  function countUp(el, to, dur) {
    if (!el) return; const start = performance.now();
    (function step(now) { const p = clamp((now - start) / dur, 0, 1); el.textContent = Math.round(p * to); if (p < 1) requestAnimationFrame(step); })(start);
  }

  /* ============================================================
     PWA
     ============================================================ */
  let deferredPrompt = null;
  function initPWA() {
    if ('serviceWorker' in navigator) {
      addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; const fab = $('#install-fab'); if (fab && S.onboarded) fab.hidden = false; });
    $('#install-fab').addEventListener('click', doInstall);
  }
  async function doInstall() {
    if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#install-fab').hidden = true; }
    else { toast('お使いのブラウザのメニューから「ホーム画面に追加」を選んでください'); }
  }

  /* ============================================================
     GLOBAL EVENTS
     ============================================================ */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const closest = (sel) => t.closest(sel);

    // smooth scroll
    const sc = closest('[data-scroll]'); if (sc) { e.preventDefault(); const id = sc.getAttribute('href'); const el = id && $(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); return; }

    // actions
    const act = closest('[data-action]');
    if (act) {
      const a = act.dataset.action;
      if (a === 'start') return S.onboarded ? goApp('home') : startOnboarding();
      if (a === 'open-app') return S.onboarded ? goApp('home') : startOnboarding();
      if (a === 'demo') { loadDemo(); goApp('home'); toast('サンプルデータで体験中'); return; }
      if (a === 'goto-landing') return show('landing');
      if (a === 'add-goal') return goalModal(null);
      if (a === 'add-action') return actionModal();
      if (a === 'edit-vision') return visionModal();
      if (a === 'save-reflect') return saveReflect();
      if (a === 'save-name') { S.settings.name = $('#set-name').value.trim(); save(); toast('保存しました'); return; }
      if (a === 'toggle-motion') return toggleMotion();
      if (a === 'export') return exportData();
      if (a === 'import') return importData();
      if (a === 'reset') return resetData();
      if (a === 'install') return doInstall();
    }

    // nav / tab
    const nav = closest('[data-view]'); if (nav) return setView(nav.dataset.view);
    const vlink = closest('[data-view-link]'); if (vlink) return setView(vlink.dataset.viewLink);
    const vgo = closest('[data-view-go]'); if (vgo) return setView(vgo.dataset.viewGo);

    // momentum chip
    if (closest('#momentum-chip')) return setView('stats');

    // modal
    if (closest('[data-close-modal]')) return closeModal();

    // toggles
    const ta = closest('[data-toggle-act]'); if (ta) return toggleAction(ta.dataset.toggleAct);
    const ms = closest('[data-ms]'); if (ms) { const [gid, mid] = ms.dataset.ms.split(':'); return toggleMilestone(gid, mid); }
    const addms = closest('[data-add-ms]'); if (addms) return msModal(addms.dataset.addMs);
    const eg = closest('[data-edit-goal]'); if (eg) return goalModal(S.goals.find((g) => g.id === eg.dataset.editGoal));
    const dg = closest('[data-del-goal]'); if (dg) return delGoal(dg.dataset.delGoal);

    // mood
    const mood = closest('[data-mood]'); if (mood) { $$('#mood-pick .mood-btn').forEach((b) => b.classList.toggle('sel', b === mood)); return; }

    // onboarding controls
    const onbBtn = closest('[data-onb]'); if (onbBtn) return handleOnb(onbBtn.dataset.onb, onbBtn);
    const vpre = closest('[data-v]'); if (vpre) { $('#onb-northstar').value = vpre.dataset.v; return; }
    const hsel = closest('[data-h]'); if (hsel) { onb.goal.horizon = hsel.dataset.h; renderOnb(); return; }
    const gpre = closest('[data-g]'); if (gpre) { $('#onb-goal').value = gpre.dataset.g; return; }
    const apre = closest('[data-a]'); if (apre) { onb.actions.push(apre.dataset.a); renderOnbActions(document); return; }
    const rmact = closest('[data-rmact]'); if (rmact) { onb.actions.splice(+rmact.dataset.rmact, 1); renderOnbActions(document); return; }

    // roadmap zoom
    const z = closest('[data-zoom]'); if (z) { rmZoom = +z.dataset.zoom; renderRoadmap(); return; }
  });

  document.addEventListener('input', (e) => {
    const life = e.target.closest('[data-life]');
    if (life) { const k = life.dataset.life; const a = S.life.find((x) => x.key === k); if (a) { a.score = +life.value; const rv = $(`[data-rv="${k}"]`); if (rv) rv.textContent = life.value; drawRadar(); save(); } }
  });
  // redraw roadmap on resize
  let rzT = null;
  addEventListener('resize', () => { if (currentView === 'roadmap' && !$('#app').hidden) { clearTimeout(rzT); rzT = setTimeout(() => renderRoadmap(), 200); } });

  // import file
  document.addEventListener('change', (e) => { if (e.target.id === 'import-file' && e.target.files[0]) handleImport(e.target.files[0]); });

  function handleOnb(cmd, btn) {
    if (cmd === 'back') { onb.step = Math.max(0, onb.step - 1); return renderOnb(); }
    if (cmd === 'addaction') { const i = $('#onb-action'); if (i && i.value.trim()) { onb.actions.push(i.value.trim()); i.value = ''; renderOnbActions(document); } return; }
    if (cmd === 'finish') { commitOnboarding(); goApp('home'); bigCelebrate(); toast('ようこそMOMENTUMへ！'); return; }
    if (cmd === 'next') {
      if (onb.step === 0) { S.settings.name = ($('#onb-name') && $('#onb-name').value.trim()) || ''; }
      if (onb.step === 1) { onb.vision.northStar = ($('#onb-northstar') || {}).value || ''; onb.vision.identity = ($('#onb-identity') || {}).value || ''; }
      if (onb.step === 2) { onb.goal.title = ($('#onb-goal') || {}).value || ''; }
      onb.step = Math.min(ONB_STEPS - 1, onb.step + 1); renderOnb();
    }
  }
  function saveReflect() {
    const t = todayStr();
    const moodBtn = $('#mood-pick .mood-btn.sel');
    const mood = moodBtn ? +moodBtn.dataset.mood : (S.logs.find((l) => l.date === t) || {}).mood || 3;
    const note = ($('#reflect-note') || {}).value || '';
    let log = S.logs.find((l) => l.date === t);
    if (log) { log.mood = mood; log.note = note; } else S.logs.push({ id: uid(), date: t, mood, note, createdAt: new Date().toISOString() });
    celebrate(); toast('記録しました'); refresh();
  }
  function delGoal(id) {
    openModal('目標を削除？', `<p style="color:var(--text-dim);margin-bottom:20px">この目標と紐づくマイルストーンを削除します。</p><button class="btn btn-danger btn-block" data-confirm-del>削除する</button>`, (root) => {
      root.querySelector('[data-confirm-del]').addEventListener('click', () => { S.goals = S.goals.filter((g) => g.id !== id); closeModal(); toast('削除しました'); refresh(); });
    });
  }
  function toggleMotion() {
    S.settings.reduceMotion = !S.settings.reduceMotion; save();
    document.body.classList.toggle('reduce-motion', S.settings.reduceMotion);
    if (S.settings.reduceMotion && window._sfStop) window._sfStop(); else if (!S.settings.reduceMotion) startStarfield();
    renderSettings();
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    $('#year') && ($('#year').textContent = new Date().getFullYear());
    hydrateIcons();
    if (S.settings.reduceMotion) document.body.classList.add('reduce-motion');
    startStarfield();
    initPWA();
    animateLP();
    const params = new URLSearchParams(location.search);
    if (S.onboarded && (params.get('source') === 'pwa' || params.get('view'))) {
      goApp(params.get('view') || 'home');
      if (S.onboarded && deferredPrompt) $('#install-fab').hidden = false;
    } else {
      show('landing');
      // returning user hint on nav
      if (S.onboarded) { const b = $('.lp-nav-cta .btn-primary'); if (b) b.textContent = 'アプリを開く →'; }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
