/*
 * overlay.js — 全画面リマインダーを表示する共通ロジック
 * showReminderOverlay(opts) を呼ぶと画面に推しが登場します。
 *
 * opts = {
 *   character,        // characters.js のキャラ定義オブジェクト
 *   quote,            // 表示する一言
 *   imageUrl,         // (任意) customキャラ用の画像URL
 *   minutes,          // (任意) 経過した分。"◯分見てるよ" 表示用
 *   siteLabel,        // (任意) 対象サイト/アプリ名
 *   onPrimary,        // 「閉じて切り替える」ボタンのコールバック
 *   onSnooze,         // 「あと5分だけ」ボタンのコールバック
 * }
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SCREEN_REMINDER_OVERLAY = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ROOT_ID = 'str-overlay-root';

  function removeOverlay() {
    const el = document.getElementById(ROOT_ID);
    if (el) el.remove();
  }

  function showReminderOverlay(opts) {
    opts = opts || {};
    const c = opts.character || { name: '推し', art: '⭐', bg: '#333' };
    removeOverlay(); // 二重表示を防ぐ

    const overlay = document.createElement('div');
    overlay.id = ROOT_ID;
    overlay.className = 'str-overlay';

    const card = document.createElement('div');
    card.className = 'str-card';
    card.style.background = c.bg || c.color || '#333';

    // キャラ表示（画像があれば画像、なければ絵文字アート）
    const charEl = document.createElement('div');
    charEl.className = 'str-char';
    if (opts.imageUrl) {
      const img = document.createElement('img');
      img.src = opts.imageUrl;
      img.alt = c.name;
      img.referrerPolicy = 'no-referrer';
      charEl.appendChild(img);
    } else {
      charEl.textContent = c.art || c.emoji || '⭐';
    }

    const nameEl = document.createElement('div');
    nameEl.className = 'str-name';
    nameEl.textContent = c.name || '推し';

    const quoteEl = document.createElement('p');
    quoteEl.className = 'str-quote';
    quoteEl.textContent = opts.quote || 'そろそろ顔を上げよう。';

    const actions = document.createElement('div');
    actions.className = 'str-actions';

    const primary = document.createElement('button');
    primary.className = 'str-btn str-btn-primary';
    primary.textContent = '✋ わかった、切り替える';
    primary.addEventListener('click', function () {
      removeOverlay();
      if (typeof opts.onPrimary === 'function') opts.onPrimary();
    });

    const snooze = document.createElement('button');
    snooze.className = 'str-btn str-btn-ghost';
    snooze.textContent = '😅 あと5分だけ…';
    snooze.addEventListener('click', function () {
      removeOverlay();
      if (typeof opts.onSnooze === 'function') opts.onSnooze();
    });

    actions.appendChild(primary);
    actions.appendChild(snooze);

    card.appendChild(charEl);
    card.appendChild(nameEl);
    card.appendChild(quoteEl);

    if (opts.minutes != null) {
      const meta = document.createElement('div');
      meta.className = 'str-meta';
      const label = opts.siteLabel ? opts.siteLabel + 'を' : '';
      meta.textContent = '⏱ 今日は' + label + '合計 ' + opts.minutes + ' 分';
      card.appendChild(meta);
    }

    card.appendChild(actions);
    overlay.appendChild(card);
    document.documentElement.appendChild(overlay);

    return { close: removeOverlay };
  }

  return { showReminderOverlay, removeOverlay };
});
