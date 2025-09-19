self.addEventListener('install', e => {
  console.log('Service Worker instalado');
  e.waitUntil(
    caches.open('v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/adicionar.html',
      '/js/main.js',
      '/js/adicionar.js',
      '/manifest.json'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
