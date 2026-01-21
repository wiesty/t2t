// Service Worker für Tic2Talk
// Network-First-Strategie für bessere Update-Verwaltung

const CACHE_NAME = 'tic2talk-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/img/favicon.svg',
  '/img/android-icon-192x192.png',
  '/img/apple-icon-180x180.png'
];

// Install Event - Cache die essentiellen Dateien
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Sofort aktivieren
  self.skipWaiting();
});

// Activate Event - Lösche alte Caches und übernehme sofort
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Sofort alle Clients übernehmen
  return self.clients.claim();
});

// Fetch Event - Network-First-Strategie (versuche immer neue Inhalte zu laden)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Nur valide Responses cachen
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Wenn Netzwerk fehlschlägt, versuche aus Cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback für HTML-Requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});
