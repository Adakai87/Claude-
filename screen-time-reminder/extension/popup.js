/* popup.js — 今日の利用時間サマリを表示 */
(function () {
  'use strict';

  const listEl = document.getElementById('usage-list');
  const emojiEl = document.getElementById('hd-emoji');

  const CHAR_EMOJI = { shuzo: '🔥', cat: '🐱', dog: '🐶', owl: '🦉', custom: '⭐' };

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    if (m < 60) return m + '分';
    return Math.floor(m / 60) + '時間' + (m % 60) + '分';
  }

  function render(usage, settings) {
    emojiEl.textContent = CHAR_EMOJI[settings.character] || '🔥';
    const watched = settings.watched || [];

    // 監視対象を上限の近さ順で表示、その他サイトも下に
    const entries = Object.keys(usage)
      .map((host) => {
        const w = watched.find((x) => host.indexOf(x.host) !== -1);
        return { host, sec: usage[host], limit: w ? w.limitMin : null };
      })
      .filter((e) => e.sec >= 30) // 30秒未満は省略
      .sort((a, b) => b.sec - a.sec);

    if (!entries.length) {
      listEl.innerHTML = '<li class="empty">まだ計測データがありません</li>';
      return;
    }

    listEl.innerHTML = '';
    entries.forEach((e) => {
      const li = document.createElement('li');
      li.className = 'u-row';
      const min = Math.floor(e.sec / 60);
      const over = e.limit != null && min >= e.limit;

      const top = document.createElement('div');
      top.className = 'top';
      const host = document.createElement('span');
      host.className = 'u-host';
      host.textContent = e.host;
      const time = document.createElement('span');
      time.className = 'u-time' + (over ? ' over' : '');
      time.textContent = fmt(e.sec) + (e.limit != null ? ' / ' + e.limit + '分' : '');
      top.appendChild(host);
      top.appendChild(time);
      li.appendChild(top);

      if (e.limit != null) {
        const bar = document.createElement('div');
        bar.className = 'u-bar';
        const span = document.createElement('span');
        const pct = Math.min(100, Math.round((min / e.limit) * 100));
        span.style.width = pct + '%';
        if (over) span.className = 'over';
        bar.appendChild(span);
        li.appendChild(bar);
      }
      listEl.appendChild(li);
    });
  }

  chrome.runtime.sendMessage({ type: 'STR_GET_USAGE' }, (res) => {
    if (res) render(res.usage || {}, res.settings || {});
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'STR_RESET_TODAY' }, () => {
      listEl.innerHTML = '<li class="empty">リセットしました</li>';
    });
  });

  document.getElementById('options-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
})();
