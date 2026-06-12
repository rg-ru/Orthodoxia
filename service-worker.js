const CACHE_NAME = "orthodoxia-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./src/main.js",
  "./src/shared/i18n.js",
  "./src/shared/html.js",
  "./src/shared/ui.js",
  "./src/features/home/data/homeData.js",
  "./src/features/home/domain/homeModel.js",
  "./src/features/home/presentation/homeView.js",
  "./src/features/calendar/data/calendarData.js",
  "./src/features/calendar/domain/calendarModel.js",
  "./src/features/calendar/presentation/calendarView.js",
  "./src/features/prayerBook/data/prayerData.js",
  "./src/features/prayerBook/domain/prayerModel.js",
  "./src/features/prayerBook/presentation/prayerBookView.js",
  "./src/features/bible/data/bibleData.js",
  "./src/features/bible/domain/bibleModel.js",
  "./src/features/bible/presentation/bibleView.js",
  "./src/features/saints/data/saintsData.js",
  "./src/features/saints/domain/saintsModel.js",
  "./src/features/saints/presentation/saintsView.js",
  "./src/features/ai/data/aiData.js",
  "./src/features/ai/domain/aiModel.js",
  "./src/features/ai/presentation/aiView.js",
  "./src/features/settings/data/settingsData.js",
  "./src/features/settings/domain/settingsModel.js",
  "./src/features/settings/presentation/settingsView.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }

      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => {
      return caches.match(event.request).then((cached) => cached || caches.match("./index.html"));
    })
  );
});
