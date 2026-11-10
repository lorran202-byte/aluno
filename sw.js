// Guarda a "casca" da página para abrir rápido; os dados do treino sempre vêm da internet.
var CACHE = "la-aluno-v2";
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(["./", "config.js", "icone-192.png", "outfit_regular.ttf", "outfit_semibold.ttf", "outfit_bold.ttf"]); }).catch(function () {}));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // rede primeiro (pega atualizações); sem internet, usa a cópia guardada
  e.respondWith(fetch(e.request).then(function (r) {
    var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copia); }).catch(function () {});
    return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
