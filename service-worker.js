self.addEventListener("install", event => {
  console.log("📦 Service Worker instalado");
});

self.addEventListener("fetch", event => {
  // Aqui poderias adicionar cache offline
  console.log("🔎 Requisição:", event.request.url);
});
