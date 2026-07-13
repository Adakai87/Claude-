/*
 * content.js — ページ内に注入され、オーバーレイを表示する
 * background.js からの STR_SHOW_OVERLAY を受け取って推しを登場させる。
 * characters.js / overlay.js が先に読み込まれている前提（manifest順）。
 */
(function () {
  'use strict';

  const C = self.SCREEN_REMINDER_CHARACTERS;
  const O = self.SCREEN_REMINDER_OVERLAY;
  if (!C || !O) return;

  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.type !== 'STR_SHOW_OVERLAY') return;
    const p = msg.payload || {};
    const character = C.characters[p.character] || C.characters.shuzo;
    const quote = C.getQuote(p.character, p.customQuotes);

    O.showReminderOverlay({
      character: character,
      quote: quote,
      imageUrl: p.character === 'custom' ? p.customImageUrl : '',
      minutes: p.minutes,
      siteLabel: p.siteLabel,
      onPrimary: function () {
        // 「切り替える」→ 新しい空タブを開いて誘導（任意）
        // ここでは何もせず、ユーザーが自分で離れるのに任せる
      },
      onSnooze: function () {
        // スヌーズは background 側の reSnoozeMin で再表示が制御される
      },
    });
  });
})();
