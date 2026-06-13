const CACHE_NAME = "orthodoxia-v16";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./styles.css?v=9",
  "./styles.css?v=10",
  "./styles.css?v=11",
  "./styles.css?v=12",
  "./styles.css?v=13",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./src/main.js",
  "./src/main.js?v=9",
  "./src/main.js?v=10",
  "./src/main.js?v=11",
  "./src/main.js?v=12",
  "./src/main.js?v=13",
  "./src/main.js?v=15",
  "./src/main.js?v=16",
  "./src/shared/i18n.js",
  "./src/shared/i18n.js?v=9",
  "./src/shared/i18n.js?v=10",
  "./src/shared/i18n.js?v=11",
  "./src/shared/i18n.js?v=12",
  "./src/shared/i18n.js?v=13",
  "./src/shared/i18n.js?v=16",
  "./src/shared/supabaseConfig.js",
  "./src/shared/supabaseConfig.js?v=14",
  "./src/shared/supabaseConfig.js?v=16",
  "./src/shared/supabaseClient.js",
  "./src/shared/supabaseClient.js?v=14",
  "./src/shared/supabaseClient.js?v=16",
  "./src/shared/html.js",
  "./src/shared/ui.js",
  "./src/features/auth/data/AuthRepository.js",
  "./src/features/auth/data/AuthRepository.js?v=14",
  "./src/features/auth/data/AuthRepository.js?v=16",
  "./src/features/auth/domain/AuthSession.js",
  "./src/features/auth/domain/AuthSession.js?v=14",
  "./src/features/auth/domain/AuthSession.js?v=16",
  "./src/features/backend/data/OrthodoxiaBackendRepository.js",
  "./src/features/backend/data/OrthodoxiaBackendRepository.js?v=14",
  "./src/features/backend/data/OrthodoxiaBackendRepository.js?v=16",
  "./src/features/backend/domain/backendSchema.js",
  "./src/features/backend/domain/backendSchema.js?v=14",
  "./src/features/home/data/homeData.js",
  "./src/features/home/data/homeData.js?v=9",
  "./src/features/home/domain/homeModel.js",
  "./src/features/home/domain/homeModel.js?v=9",
  "./src/features/home/presentation/homeView.js",
  "./src/features/home/presentation/homeView.js?v=9",
  "./src/features/calendar/data/calendarData.js",
  "./src/features/calendar/domain/calendarModel.js",
  "./src/features/calendar/presentation/calendarView.js",
  "./src/features/prayerBook/data/prayerData.js",
  "./src/features/prayerBook/domain/prayerModel.js",
  "./src/features/prayerBook/presentation/prayerBookView.js",
  "./src/features/bible/data/bibleData.js",
  "./src/features/bible/data/bibleData.js?v=10",
  "./src/features/bible/data/bibleData.js?v=11",
  "./src/features/bible/data/bible-local.json",
  "./src/features/bible/data/bible-local.json?v=10",
  "./src/features/bible/data/bible-local.json?v=11",
  "./src/features/bible/data/BibleRepository.js",
  "./src/features/bible/data/BibleRepository.js?v=10",
  "./src/features/bible/data/BibleRepository.js?v=11",
  "./src/features/bible/domain/BibleBook.js",
  "./src/features/bible/domain/BibleBook.js?v=10",
  "./src/features/bible/domain/BibleBook.js?v=11",
  "./src/features/bible/domain/BibleChapter.js",
  "./src/features/bible/domain/BibleChapter.js?v=10",
  "./src/features/bible/domain/BibleChapter.js?v=11",
  "./src/features/bible/domain/BibleVerse.js",
  "./src/features/bible/domain/BibleVerse.js?v=10",
  "./src/features/bible/domain/BibleVerse.js?v=11",
  "./src/features/bible/domain/SearchResult.js",
  "./src/features/bible/domain/SearchResult.js?v=11",
  "./src/features/bible/domain/BibleSearchService.js",
  "./src/features/bible/domain/BibleSearchService.js?v=11",
  "./src/features/bible/domain/bibleModel.js",
  "./src/features/bible/domain/bibleModel.js?v=10",
  "./src/features/bible/domain/bibleModel.js?v=11",
  "./src/features/bible/presentation/bibleView.js",
  "./src/features/bible/presentation/bibleView.js?v=10",
  "./src/features/bible/presentation/bibleView.js?v=11",
  "./src/features/bible/presentation/SearchScreen.js",
  "./src/features/bible/presentation/SearchScreen.js?v=11",
  "./src/features/search/data/searchStorage.js",
  "./src/features/search/data/searchStorage.js?v=12",
  "./src/features/search/domain/GlobalSearchResult.js",
  "./src/features/search/domain/GlobalSearchResult.js?v=12",
  "./src/features/search/domain/GlobalSearchService.js",
  "./src/features/search/domain/GlobalSearchService.js?v=12",
  "./src/features/search/domain/GlobalSearchService.js?v=15",
  "./src/features/search/domain/searchModel.js",
  "./src/features/search/domain/searchModel.js?v=12",
  "./src/features/search/domain/searchModel.js?v=15",
  "./src/features/search/presentation/searchView.js",
  "./src/features/search/presentation/searchView.js?v=12",
  "./src/features/search/presentation/searchView.js?v=15",
  "./src/features/saints/data/saintsData.js",
  "./src/features/saints/data/saintsData.js?v=15",
  "./src/features/saints/data/saints-local.json",
  "./src/features/saints/data/saints-local.json?v=15",
  "./src/features/saints/data/SaintDataSource.js",
  "./src/features/saints/data/SaintDataSource.js?v=15",
  "./src/features/saints/data/SaintRepository.js",
  "./src/features/saints/data/SaintRepository.js?v=15",
  "./src/features/saints/domain/SaintModel.js",
  "./src/features/saints/domain/SaintModel.js?v=15",
  "./src/features/saints/domain/saintsModel.js",
  "./src/features/saints/domain/saintsModel.js?v=15",
  "./src/features/saints/presentation/saintsView.js",
  "./src/features/saints/presentation/saintsView.js?v=15",
  "./src/features/ai/data/aiData.js",
  "./src/features/ai/data/aiData.js?v=13",
  "./src/features/ai/data/AiRepository.js",
  "./src/features/ai/data/AiRepository.js?v=13",
  "./src/features/ai/data/ConversationStorage.js",
  "./src/features/ai/data/ConversationStorage.js?v=13",
  "./src/features/ai/domain/ChatService.js",
  "./src/features/ai/domain/ChatService.js?v=13",
  "./src/features/ai/domain/MessageModel.js",
  "./src/features/ai/domain/MessageModel.js?v=13",
  "./src/features/ai/domain/aiModel.js",
  "./src/features/ai/domain/aiModel.js?v=13",
  "./src/features/ai/presentation/aiView.js",
  "./src/features/ai/presentation/aiView.js?v=13",
  "./src/features/settings/data/settingsData.js",
  "./src/features/settings/data/settingsData.js?v=16",
  "./src/features/settings/domain/settingsModel.js",
  "./src/features/settings/domain/settingsModel.js?v=16",
  "./src/features/settings/presentation/settingsView.js",
  "./src/features/settings/presentation/settingsView.js?v=16"
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
