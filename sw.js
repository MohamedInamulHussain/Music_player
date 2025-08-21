// Simple cache-first service worker for offline shell
const CACHE_NAME = 'music-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // add icons below if you include them:
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Cache-first for same-origin GET requests
  if (request.method === 'GET' && new URL(request.url).origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
