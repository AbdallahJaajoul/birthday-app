self.addEventListener('install', e => {
  console.log('Service Worker instalado');
  e.waitUntil(
    caches.open('v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/adicionar.html',
      '/js/main.js',
      '/js/adicionar.js',
      '/manifest.json',
      '/membros.json'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
