/*
 * characters.js — 共通キャラクター & 名言データ
 * --------------------------------------------------
 * これがキャラ定義の「正本(canonical)」です。
 * extension/ と mobile/ には同じ内容のコピーを置いています。
 * キャラを追加・編集したら、このファイルを直して両方にコピーしてください。
 *
 * ※ 名言は「松岡修造さん風の熱血テイスト」のオリジナル文です。
 *   実在の人物の写真や実際の発言をそのまま使うと著作権/肖像権の問題が
 *   出るため、画像はユーザーが自分で差し替える設計にしています。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SCREEN_REMINDER_CHARACTERS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const characters = {
    shuzo: {
      id: 'shuzo',
      name: '熱血コーチ',
      emoji: '🔥',
      art: '🔥💪😤',
      color: '#ff4500',
      bg: 'linear-gradient(135deg,#ff512f 0%,#dd2476 100%)',
      quotes: [
        'おい！その手を止めろ！今こそ熱くなる時だ！🔥',
        'できる！君ならできる！画面を閉じて世界に飛び出せ！',
        '今日という日は二度と来ない！スクロールより自分を磨け！',
        'まだ間に合う！立ち上がれ！君の本気はそんなもんじゃない！',
        'のどが渇いてからじゃ遅い！夢が渇く前に動き出せ！',
        'うつむくな！前を向け！画面の外に答えはある！',
        '君は今日、何を成し遂げた？さあ、まだ時間はあるぞ！',
        '燃えてるか！？燃えてないなら、今ここで燃えろ！',
      ],
    },
    cat: {
      id: 'cat',
      name: 'のんびり猫',
      emoji: '🐱',
      art: '🐱',
      color: '#9b59b6',
      bg: 'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
      quotes: [
        'にゃ〜、ちょっと見すぎじゃない？🐾',
        'ごろん。そろそろ休憩したら？にゃ',
        '画面より、窓の外のほうが面白いにゃよ',
        'おやつの時間…じゃなくて、ひと息つく時間だにゃ',
        'にゃんで、そんなに頑張って見てるの？目、休めて',
        'スマホ置いて、ナデナデしてほしいにゃ',
        'ふみふみ…。気づいてる？けっこう時間たってるにゃ',
        'にゃるほど。でも今日はもう十分見たと思うにゃ',
      ],
    },
    dog: {
      id: 'dog',
      name: 'いぬの相棒',
      emoji: '🐶',
      art: '🐶',
      color: '#e67e22',
      bg: 'linear-gradient(135deg,#f6d365 0%,#fda085 100%)',
      quotes: [
        'ワン！散歩いこ！画面より外だワン！🐾',
        'クゥ〜ン。ずっと見てると心配だワン',
        'おかえり、現実世界へ！待ってたワン！',
        '一緒に深呼吸しよ！スマホはちょっと置いて！',
        'ボール投げて！…の前に、休憩しよワン！',
        '君が笑ってるほうが、ぼくは嬉しいワン',
      ],
    },
    owl: {
      id: 'owl',
      name: '賢者のフクロウ',
      emoji: '🦉',
      art: '🦉',
      color: '#2c3e50',
      bg: 'linear-gradient(135deg,#30cfd0 0%,#330867 100%)',
      quotes: [
        'ホー。時間は戻らぬ。今、何に使うべきか考えよ。',
        '一日の終わりに「見ただけ」では、何も残らぬぞ。',
        '情報の海で溺れるな。岸に上がる時間も大切じゃ。',
        '賢者は時を制す。さあ、画面を閉じる勇気を。',
        'その5分が、積もれば一年で30時間。何が出来る？',
      ],
    },
    custom: {
      id: 'custom',
      name: '自分の推し',
      emoji: '⭐',
      art: '⭐',
      color: '#16a085',
      bg: 'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
      // ユーザーが設定で画像URLと名言を上書きできる
      quotes: [
        'そろそろ顔を上げよう。大事なこと、忘れてない？',
        '今このタイミングが、切り替えどき。',
        'ちょっと休もう。君のことを応援してるよ。',
      ],
    },
  };

  /** ランダムに名言を1つ返す（custom名言があれば優先） */
  function getQuote(characterId, customQuotes) {
    const c = characters[characterId] || characters.shuzo;
    const pool = (customQuotes && customQuotes.length) ? customQuotes : c.quotes;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return { characters, getQuote };
});
