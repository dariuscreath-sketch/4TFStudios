// ScoreVerse Service Worker
const CACHE_NAME = 'scoreverse-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const title = data.title || 'ScoreVerse';
    const options = {
      body: data.body || '',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      data: data.url ? { url: data.url } : {},
    };
    
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    // Fallback for plain text
    event.waitUntil(
      self.registration.showNotification('ScoreVerse', {
        body: event.data.text(),
        icon: '/favicon.svg',
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

// Cache static assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Only cache same-origin static assets
        if (event.request.url.startsWith(self.location.origin) &&
            event.request.destination === 'style' ||
            event.request.destination === 'script' ||
            event.request.destination === 'font' ||
            event.request.destination === 'image') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});