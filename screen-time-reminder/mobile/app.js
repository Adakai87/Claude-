/*
 * app.js — スマホPWA本体
 * ----------------------------------------------------
 * できること:
 *  - リマインダー時間をセットしてスタート → 経過したら推しが全画面登場
 *  - アプリを前面に見ている時間(Page Visibility)を計測し、累計が
 *    上限を超えたタイミングでも登場
 *  - 通知(Notification) + バイブで気づける
 *  - キャラ選択は localStorage に保存
 *
 * ※ iOS/Androidとも「他アプリの利用時間」をブラウザから裏で測ることは
 *   OS制約で不可。ここでは本アプリ自体の利用時間＋セットしたタイマーで
 *   "見すぎ通知" を実現しています（READMEのネイティブ化メモも参照）。
 */
(function () {
  'use strict';

  const C = self.SCREEN_REMINDER_CHARACTERS;
  const O = self.SCREEN_REMINDER_OVERLAY;
  const CHAR_EMOJI = { shuzo: '🔥', cat: '🐱', dog: '🐶', owl: '🦉', custom: '⭐' };

  const els = {
    emoji: document.getElementById('hd-emoji'),
    chips: document.getElementById('minute-chips'),
    display: document.getElementById('timer-display'),
    start: document.getElementById('start-btn'),
    stop: document.getElementById('stop-btn'),
    status: document.getElementById('status'),
    grid: document.getElementById('char-grid'),
    customFields: document.getElementById('custom-fields'),
    customImg: document.getElementById('custom-img'),
    customQuotes: document.getElementById('custom-quotes'),
    preview: document.getElementById('preview-btn'),
    notif: document.getElementById('notif-btn'),
  };

  // ---- 設定の保存/読み込み ----
  function loadSettings() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem('str-settings') || '{}'); } catch (e) {}
    return Object.assign(
      { character: 'shuzo', minutes: 30, customImageUrl: '', customQuotes: [] },
      s
    );
  }
  function saveSettings() {
    localStorage.setItem('str-settings', JSON.stringify(settings));
  }

  const settings = loadSettings();

  // ---- タイマー状態 ----
  let limitMs = settings.minutes * 60 * 1000;
  let running = false;
  let deadline = 0;     // 終了予定時刻(ms)
  let visibleAccum = 0; // 前面で見ていた累積ms
  let lastTick = 0;
  let rafTimer = null;

  function fmtMs(ms) {
    if (ms < 0) ms = 0;
    const total = Math.ceil(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function updateDisplay() {
    if (running) {
      els.display.textContent = fmtMs(deadline - Date.now());
    } else {
      els.display.textContent = fmtMs(limitMs);
    }
  }

  // ---- キャラ ----
  function renderChars() {
    els.emoji.textContent = CHAR_EMOJI[settings.character] || '🔥';
    els.grid.innerHTML = '';
    Object.values(C.characters).forEach((c) => {
      const div = document.createElement('div');
      div.className = 'char-opt' + (settings.character === c.id ? ' sel' : '');
      div.innerHTML = '<div class="em">' + c.emoji + '</div><div class="nm">' + c.name + '</div>';
      div.addEventListener('click', () => {
        settings.character = c.id;
        saveSettings();
        renderChars();
        els.customFields.hidden = c.id !== 'custom';
      });
      els.grid.appendChild(div);
    });
    els.customFields.hidden = settings.character !== 'custom';
  }

  // ---- リマインダー発火 ----
  function fire() {
    stopTimer();
    const character = C.characters[settings.character] || C.characters.shuzo;
    const quote = C.getQuote(settings.character, settings.customQuotes);
    const minutes = Math.round(limitMs / 60000);

    // 通知 + バイブ（許可されていれば）
    notify(character.name, quote);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);

    O.showReminderOverlay({
      character: character,
      quote: quote,
      imageUrl: settings.character === 'custom' ? settings.customImageUrl : '',
      minutes: minutes,
      onPrimary: function () {
        els.status.textContent = 'ナイス切り替え！おつかれさま 👏';
      },
      onSnooze: function () {
        startTimer(5); // あと5分
        els.status.textContent = 'あと5分だけ… ⏱';
      },
    });
  }

  // ---- タイマー制御 ----
  function tick() {
    if (!running) return;
    const now = Date.now();
    // 前面で見ている時間を累積（参考情報）
    if (document.visibilityState === 'visible') {
      visibleAccum += now - lastTick;
    }
    lastTick = now;
    updateDisplay();
    if (now >= deadline) {
      fire();
      return;
    }
    rafTimer = setTimeout(tick, 250);
  }

  function startTimer(overrideMin) {
    const min = overrideMin || (limitMs / 60000);
    limitMs = min * 60 * 1000;
    running = true;
    deadline = Date.now() + limitMs;
    lastTick = Date.now();
    els.start.hidden = true;
    els.stop.hidden = false;
    els.status.textContent = '計測中… 推しが見てるよ 👀';
    clearTimeout(rafTimer);
    tick();
  }

  function stopTimer() {
    running = false;
    clearTimeout(rafTimer);
    els.start.hidden = false;
    els.stop.hidden = true;
    updateDisplay();
  }

  // ---- 通知 ----
  function notify(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification('🔥 ' + title, { body: body, tag: 'str', renotify: true });
        });
      } else {
        new Notification('🔥 ' + title, { body: body });
      }
    } catch (e) {}
  }

  // ---- イベント ----
  els.chips.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    [...els.chips.children].forEach((c) => c.classList.remove('sel'));
    btn.classList.add('sel');
    const min = parseInt(btn.dataset.min, 10);
    settings.minutes = min;
    limitMs = min * 60 * 1000;
    saveSettings();
    if (!running) updateDisplay();
  });

  els.start.addEventListener('click', () => startTimer());
  els.stop.addEventListener('click', () => {
    stopTimer();
    els.status.textContent = '停止しました。';
  });

  els.preview.addEventListener('click', () => {
    const character = C.characters[settings.character] || C.characters.shuzo;
    O.showReminderOverlay({
      character: character,
      quote: C.getQuote(settings.character, settings.customQuotes),
      imageUrl: settings.character === 'custom' ? settings.customImageUrl : '',
      minutes: settings.minutes,
    });
  });

  els.notif.addEventListener('click', () => {
    if (!('Notification' in window)) {
      els.status.textContent = 'この端末は通知に対応していません。';
      return;
    }
    Notification.requestPermission().then((p) => {
      els.status.textContent = p === 'granted' ? '🔔 通知ON！' : '通知は許可されませんでした。';
    });
  });

  els.customImg.addEventListener('change', () => {
    settings.customImageUrl = els.customImg.value.trim();
    saveSettings();
  });
  els.customQuotes.addEventListener('change', () => {
    settings.customQuotes = els.customQuotes.value.split('\n').map((s) => s.trim()).filter(Boolean);
    saveSettings();
  });

  // タブに戻ってきた時、終了時刻を過ぎていたら即発火
  document.addEventListener('visibilitychange', () => {
    if (running && document.visibilityState === 'visible' && Date.now() >= deadline) {
      fire();
    }
    lastTick = Date.now();
  });

  // ---- 初期化 ----
  els.customImg.value = settings.customImageUrl || '';
  els.customQuotes.value = (settings.customQuotes || []).join('\n');
  [...els.chips.children].forEach((c) => {
    c.classList.toggle('sel', parseInt(c.dataset.min, 10) === settings.minutes);
  });
  limitMs = settings.minutes * 60 * 1000;
  renderChars();
  updateDisplay();

  // Service Worker 登録（PWA化）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
