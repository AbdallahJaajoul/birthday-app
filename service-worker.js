self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('birthday-app').then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './script.js',
        './manifest.json',
        './assets/background-desktop.jpg',
        './assets/background-mobile.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
