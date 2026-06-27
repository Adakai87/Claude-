/* options.js — 設定画面のロジック */
(function () {
  'use strict';

  const C = self.SCREEN_REMINDER_CHARACTERS;
  const DEFAULTS = {
    character: 'shuzo',
    customImageUrl: '',
    customQuotes: [],
    reSnoozeMin: 5,
    watched: [
      { host: 'youtube.com', limitMin: 30 },
      { host: 'twitter.com', limitMin: 20 },
      { host: 'x.com', limitMin: 20 },
      { host: 'instagram.com', limitMin: 20 },
      { host: 'tiktok.com', limitMin: 15 },
    ],
  };

  let state = null;

  const grid = document.getElementById('char-grid');
  const customCard = document.getElementById('custom-card');
  const customImg = document.getElementById('custom-img');
  const customQuotes = document.getElementById('custom-quotes');
  const watchedList = document.getElementById('watched-list');
  const resnooze = document.getElementById('resnooze');
  const savedMsg = document.getElementById('saved-msg');

  function renderChars() {
    grid.innerHTML = '';
    Object.values(C.characters).forEach((c) => {
      const div = document.createElement('div');
      div.className = 'char-opt' + (state.character === c.id ? ' sel' : '');
      div.innerHTML = '<div class="em">' + c.emoji + '</div><div class="nm">' + c.name + '</div>';
      div.addEventListener('click', () => {
        state.character = c.id;
        renderChars();
        customCard.hidden = c.id !== 'custom';
      });
      grid.appendChild(div);
    });
    customCard.hidden = state.character !== 'custom';
  }

  function renderWatched() {
    watchedList.innerHTML = '';
    state.watched.forEach((w, i) => {
      const row = document.createElement('div');
      row.className = 'w-item';
      const host = document.createElement('span');
      host.className = 'host';
      host.textContent = w.host;
      const limit = document.createElement('input');
      limit.type = 'number';
      limit.min = '1';
      limit.value = w.limitMin;
      limit.addEventListener('change', () => {
        state.watched[i].limitMin = Math.max(1, parseInt(limit.value, 10) || 1);
      });
      const del = document.createElement('button');
      del.className = 'del';
      del.textContent = '削除';
      del.addEventListener('click', () => {
        state.watched.splice(i, 1);
        renderWatched();
      });
      row.appendChild(host);
      row.appendChild(limit);
      row.appendChild(del);
      watchedList.appendChild(row);
    });
  }

  document.getElementById('add-btn').addEventListener('click', () => {
    const host = document.getElementById('new-host').value.trim().replace(/^www\./, '');
    const limit = Math.max(1, parseInt(document.getElementById('new-limit').value, 10) || 20);
    if (!host) return;
    state.watched.push({ host, limitMin: limit });
    document.getElementById('new-host').value = '';
    renderWatched();
  });

  document.getElementById('save-btn').addEventListener('click', () => {
    state.customImageUrl = customImg.value.trim();
    state.customQuotes = customQuotes.value
      .split('\n').map((s) => s.trim()).filter(Boolean);
    state.reSnoozeMin = Math.max(1, parseInt(resnooze.value, 10) || 5);
    chrome.storage.local.set({ settings: state }, () => {
      savedMsg.textContent = '✓ 保存しました';
      setTimeout(() => (savedMsg.textContent = ''), 2000);
    });
  });

  chrome.storage.local.get('settings', (data) => {
    state = Object.assign({}, DEFAULTS, data.settings || {});
    state.watched = (state.watched || DEFAULTS.watched).map((w) => Object.assign({}, w));
    customImg.value = state.customImageUrl || '';
    customQuotes.value = (state.customQuotes || []).join('\n');
    resnooze.value = state.reSnoozeMin || 5;
    renderChars();
    renderWatched();
  });
})();
