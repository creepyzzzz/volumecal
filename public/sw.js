const CACHE_NAME = 'volume-calculator-v1';

self.addEventListener('install', (event) => {
  // Don't cache anything on install - use network-first strategy
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy - always try network first
  // Only use cache if network fails
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If network request succeeds, return it
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request).then((cachedResponse) => {
          // If it's a document request and cache fails, return index.html
          if (!cachedResponse && event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          return cachedResponse;
        });
      })
  );
});

