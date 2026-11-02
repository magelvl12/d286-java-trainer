// Offline support. Files are served from the cache first (instant, works offline) and
// refreshed in the background, so an edit shows up on the second open after it's published.
// Bump CACHE when adding or renaming files.
const CACHE = 'd286-v1';
const FILES = [
  './', 'index.html', 'styles.css', 'manifest.json',
  'js/highlight.js', 'js/store.js', 'js/exercises.js', 'js/app.js',
  'content/problems.js', 'content/reference.js',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request)
      .then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; })
      .catch(() => hit);
    return hit || fresh;
  }));
});
