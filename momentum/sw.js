/* MOMENTUM Service Worker — オフライン対応（アプリシェルのキャッシュ） */
const CACHE = 'momentum-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  // ナビゲーション: ネット優先 → 失敗時キャッシュ（オフラインでも起動）
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // その他: キャッシュ優先 → ネット → キャッシュ更新
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
