const cacheName = "site-cache-v1";
const assetsToCache = ["/", "/index.html", "/styles.css", "/index.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(assetsToCache)),
  );
});
