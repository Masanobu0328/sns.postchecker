// Service Worker（2026-11-22 修正）
// 以前の問題：CACHE_NAME が v7 のまま変わらず、fetch は cache-first だったため、
// デプロイ後も古い index.html / app.js / data.js が無期限に返され、
// 新しい index.html と古い app.js の組み合わせでアプリが起動せず
// ローディング画面のまま固まった。marketing.js はキャッシュ対象外でもあった。
// 修正：キャッシュ名を v9 に上げ、marketing.js を追加し、
// アプリ本体（HTML/JS/CSS）は network-first（失敗時のみキャッシュ）に変えた。
// 画像類は従来どおり cache-first でよい。
const CACHE_NAME = 'sns-posts-v10';
const urlsToCache = [
    './index.html',
    './style.css',
    './app.js',
    './data.js',
    './marketing.js',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.allSettled(urlsToCache.map(url => cache.add(url))))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// アプリ本体は network-first：新しいデプロイを確実に取りに行く。
// ネットワークが使えないときだけキャッシュにフォールバックする。
function isAppShell(request) {
    if (request.mode === 'navigate') return true;
    const dest = request.destination;
    return dest === 'script' || dest === 'style' || dest === 'document';
}

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (isAppShell(event.request)) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
    // 画像などは cache-first（stale-while-revalidate）
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                const network = fetch(event.request)
                    .then(netResponse => {
                        const copy = netResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                        return netResponse;
                    })
                    .catch(() => response);
                return response || network;
            })
    );
});
