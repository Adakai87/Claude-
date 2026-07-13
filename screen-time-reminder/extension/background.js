/*
 * background.js — 利用時間トラッカー（サービスワーカー）
 * ------------------------------------------------------
 * 仕組み:
 *  - アクティブなタブのホスト名と「見始めた時刻」を storage に保存
 *  - タブ切替/ウィンドウフォーカス変化/1分ごとのアラームで経過時間を集計
 *  - 監視対象サイトの今日の合計が上限を超えたら content.js に表示を依頼
 *  - 日付が変わったら自動リセット
 *
 * サービスワーカーはいつでも停止されうるので、状態は必ず storage に持つ。
 */

const DEFAULT_SETTINGS = {
  character: 'shuzo',     // 表示キャラ
  customImageUrl: '',     // customキャラ用画像
  customQuotes: [],       // 任意の自作名言
  reSnoozeMin: 5,         // スヌーズ後に再表示するまでの分
  // 監視対象サイト（host は部分一致）
  watched: [
    { host: 'youtube.com', limitMin: 30 },
    { host: 'twitter.com', limitMin: 20 },
    { host: 'x.com', limitMin: 20 },
    { host: 'instagram.com', limitMin: 20 },
    { host: 'tiktok.com', limitMin: 15 },
  ],
};

function todayStr() {
  // 端末ローカル日付（YYYY-MM-DD）
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
}

async function getState() {
  const data = await chrome.storage.local.get(['settings', 'usage', 'date', 'active', 'shownAt']);
  const settings = Object.assign({}, DEFAULT_SETTINGS, data.settings || {});
  let usage = data.usage || {};
  let date = data.date || todayStr();
  if (date !== todayStr()) {
    usage = {};
    date = todayStr();
    await chrome.storage.local.set({ usage, date, shownAt: {} });
  }
  return {
    settings,
    usage,
    date,
    active: data.active || null,      // { host, since }
    shownAt: data.shownAt || {},      // { host: minutesAtLastShown }
  };
}

/** watched 設定にマッチするエントリを返す（部分一致） */
function matchWatched(host, watched) {
  if (!host) return null;
  return watched.find((w) => host.indexOf(w.host) !== -1) || null;
}

/** 現在アクティブだったホストの経過秒を usage に加算して保存 */
async function flush() {
  const s = await getState();
  const now = Date.now();
  if (s.active && s.active.host && s.active.since) {
    const elapsed = Math.round((now - s.active.since) / 1000);
    if (elapsed > 0 && elapsed < 60 * 30) { // 異常値ガード(30分超は無視)
      s.usage[s.active.host] = (s.usage[s.active.host] || 0) + elapsed;
    }
  }
  await chrome.storage.local.set({ usage: s.usage });
  return s;
}

/** アクティブタブを設定し直す（フォーカスが外れたら null） */
async function setActive(host) {
  await chrome.storage.local.set({
    active: host ? { host, since: Date.now() } : null,
  });
}

/** 今アクティブなタブを調べて状態を更新し、上限チェックする */
async function refreshActiveAndCheck() {
  await flush();
  let host = null;
  let tab = null;
  try {
    const [t] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (t && t.url) {
      host = hostOf(t.url);
      tab = t;
    }
  } catch (e) { /* noop */ }

  await setActive(host);
  if (host && tab) await checkLimit(host, tab.id);
}

/** 上限超過していたら content.js に表示依頼 */
async function checkLimit(host, tabId) {
  const s = await getState();
  const w = matchWatched(host, s.settings.watched);
  if (!w) return;

  const usedMin = Math.floor((s.usage[host] || 0) / 60);
  if (usedMin < w.limitMin) return;

  // 一度出したら reSnoozeMin 分以上経つまで再表示しない
  const last = s.shownAt[host];
  const reMin = s.settings.reSnoozeMin || 5;
  if (last != null && usedMin - last < reMin) return;

  s.shownAt[host] = usedMin;
  await chrome.storage.local.set({ shownAt: s.shownAt });

  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'STR_SHOW_OVERLAY',
      payload: {
        character: s.settings.character,
        customImageUrl: s.settings.customImageUrl,
        customQuotes: s.settings.customQuotes,
        minutes: usedMin,
        siteLabel: w.host,
      },
    });
  } catch (e) {
    // content scriptが無いページ(chrome:// 等)は無視
  }
}

// ---- イベント登録 ----
chrome.tabs.onActivated.addListener(() => refreshActiveAndCheck());
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'complete' || info.url) refreshActiveAndCheck();
});
chrome.windows.onFocusChanged.addListener((winId) => {
  if (winId === chrome.windows.WINDOW_ID_NONE) {
    // 全ウィンドウからフォーカスが外れた → 計測停止
    flush().then(() => setActive(null));
  } else {
    refreshActiveAndCheck();
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get('settings');
  if (!data.settings) await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  chrome.alarms.create('str-heartbeat', { periodInMinutes: 1 });
  refreshActiveAndCheck();
});
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('str-heartbeat', { periodInMinutes: 1 });
  refreshActiveAndCheck();
});

// 1分ごとに計測を確定＆チェック
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === 'str-heartbeat') refreshActiveAndCheck();
});

// popup / options からの問い合わせに応答
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'STR_GET_USAGE') {
    flush().then(async () => {
      const s = await getState();
      sendResponse({ usage: s.usage, settings: s.settings, date: s.date });
    });
    return true; // 非同期応答
  }
  if (msg.type === 'STR_RESET_TODAY') {
    chrome.storage.local.set({ usage: {}, shownAt: {}, date: todayStr() }).then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }
});
