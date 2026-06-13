import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const requiredFeatures = ["home", "calendar", "prayerBook", "bible", "saints", "ai", "settings", "search", "auth", "backend"];
const requiredLayers = ["presentation", "domain", "data"];
const requiredFiles = [
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "service-worker.js",
  ".github/workflows/pages.yml"
];

async function assertFile(path) {
  const file = join(root, path);
  const details = await stat(file);
  if (!details.isFile()) {
    throw new Error(`${path} is not a file`);
  }
}

async function assertDirectory(path) {
  const directory = join(root, path);
  const details = await stat(directory);
  if (!details.isDirectory()) {
    throw new Error(`${path} is not a directory`);
  }
}

async function readTree(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "dist" || entry.name === "node_modules" || entry.name === ".git") {
        continue;
      }
      files.push(...await readTree(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

for (const file of requiredFiles) {
  await assertFile(file);
}

for (const feature of requiredFeatures) {
  for (const layer of requiredLayers) {
    await assertDirectory(`src/features/${feature}/${layer}`);
  }
}

await assertFile("supabase/migrations/20260613000000_initial_schema.sql");
await assertFile("supabase/README.md");

const main = await readFile(join(root, "src/main.js"), "utf8");
const routeCount = (main.match(/labelKey:/g) || []).length;
if (routeCount !== 6) {
  throw new Error(`Expected 6 main tabs, found ${routeCount}`);
}

for (const marker of ["renderSearch", "data-route=\"search\"", "data-search-result", "scheduleGlobalSearch", "saveSearchQuery"]) {
  if (!main.includes(marker)) {
    throw new Error(`Missing global search app marker ${marker}`);
  }
}

for (const marker of ["authRepository", "handleGoogleSignIn", "signInWithGoogle", "initializeAuth", "isSupabaseConfigured"]) {
  if (!main.includes(marker)) {
    throw new Error(`Missing Google auth app marker ${marker}`);
  }
}

const homeData = await readFile(join(root, "src/features/home/data/homeData.js"), "utf8");
for (const marker of ["sections", "saint", "reading", "fasting", "quote", "quickActions"]) {
  if (!homeData.includes(marker)) {
    throw new Error(`Missing home data marker ${marker}`);
  }
}

const homeView = await readFile(join(root, "src/features/home/presentation/homeView.js"), "utf8");
for (const marker of ["data-home-section", "home-card-grid", "home-action-button", "home-reading-progress"]) {
  if (!homeView.includes(marker)) {
    throw new Error(`Missing home view marker ${marker}`);
  }
}

const settingsData = await readFile(join(root, "src/features/settings/data/settingsData.js"), "utf8");
for (const section of ["sections", "account", "futureLanguages", "aboutPages", "supportActions"]) {
  if (!settingsData.includes(section)) {
    throw new Error(`Missing settings section ${section}`);
  }
}

const settingsView = await readFile(join(root, "src/features/settings/presentation/settingsView.js"), "utf8");
for (const marker of ["data-settings-section", "data-settings-back", "settings-section-card", "settings-subpage", "google-sign-in", "sign-out"]) {
  if (!settingsView.includes(marker)) {
    throw new Error(`Missing settings subpage marker ${marker}`);
  }
}

const calendarData = await readFile(join(root, "src/features/calendar/data/calendarData.js"), "utf8");
for (const marker of ["monthIndex", "feasts", "fasting", "readings"]) {
  if (!calendarData.includes(marker)) {
    throw new Error(`Missing calendar mock data marker ${marker}`);
  }
}

const calendarView = await readFile(join(root, "src/features/calendar/presentation/calendarView.js"), "utf8");
for (const marker of ["calendar-grid", "data-calendar-day", "data-calendar-back"]) {
  if (!calendarView.includes(marker)) {
    throw new Error(`Missing calendar view marker ${marker}`);
  }
}

const prayerData = await readFile(join(root, "src/features/prayerBook/data/prayerData.js"), "utf8");
for (const marker of ["Morning Prayers", "Evening Prayers", "Communion Prayers", "Thanksgiving Prayers", "Psalms"]) {
  if (!prayerData.includes(marker)) {
    throw new Error(`Missing prayer category ${marker}`);
  }
}

const prayerView = await readFile(join(root, "src/features/prayerBook/presentation/prayerBookView.js"), "utf8");
for (const marker of ["data-prayer-category", "data-prayer-open", "data-prayer-back", "prayer-reader-card"]) {
  if (!prayerView.includes(marker)) {
    throw new Error(`Missing prayer view marker ${marker}`);
  }
}

const bibleData = await readFile(join(root, "src/features/bible/data/bibleData.js"), "utf8");
for (const marker of ["mock-bible-reader-v1", "Genesis", "Psalms", "Matthew", "John", "Romans"]) {
  if (!bibleData.includes(marker)) {
    throw new Error(`Missing bible mock data marker ${marker}`);
  }
}

const bibleJson = await readFile(join(root, "src/features/bible/data/bible-local.json"), "utf8");
for (const marker of ["mock-bible-reader-v1", "\"books\"", "\"chapters\"", "\"verses\""]) {
  if (!bibleJson.includes(marker)) {
    throw new Error(`Missing bible local JSON marker ${marker}`);
  }
}

const bibleRepository = await readFile(join(root, "src/features/bible/data/BibleRepository.js"), "utf8");
for (const marker of ["class BibleRepository", "loadLocalJson", "localStorage", "getChapter", "chapterByReference"]) {
  if (!bibleRepository.includes(marker)) {
    throw new Error(`Missing BibleRepository marker ${marker}`);
  }
}

for (const modelFile of ["BibleBook.js", "BibleChapter.js", "BibleVerse.js", "SearchResult.js"]) {
  const model = await readFile(join(root, `src/features/bible/domain/${modelFile}`), "utf8");
  if (!model.includes(`class ${modelFile.replace(".js", "")}`)) {
    throw new Error(`Missing ${modelFile} model class`);
  }
}

const bibleSearchService = await readFile(join(root, "src/features/bible/domain/BibleSearchService.js"), "utf8");
for (const marker of ["class BibleSearchService", "buildIndex", "ensureIndex", "parseReference", "keyword"]) {
  if (!bibleSearchService.includes(marker)) {
    throw new Error(`Missing BibleSearchService marker ${marker}`);
  }
}

const bibleView = await readFile(join(root, "src/features/bible/presentation/bibleView.js"), "utf8");
for (const marker of ["data-bible-screen", "data-bible-book", "data-bible-chapter", "data-bible-back", "bible-reader-card", "renderSearchScreen"]) {
  if (!bibleView.includes(marker)) {
    throw new Error(`Missing bible view marker ${marker}`);
  }
}

const bibleSearchScreen = await readFile(join(root, "src/features/bible/presentation/SearchScreen.js"), "utf8");
for (const marker of ["data-bible-search", "data-bible-search-result", "bible-search-results", "bible-search-status"]) {
  if (!bibleSearchScreen.includes(marker)) {
    throw new Error(`Missing Bible SearchScreen marker ${marker}`);
  }
}

for (const rejected of ["data-bible-open-book", "bible-plan", "renderReadingPlan"]) {
  if (bibleView.includes(rejected)) {
    throw new Error(`Bible module should not include ${rejected}`);
  }
}

const saintsData = await readFile(join(root, "src/features/saints/data/saintsData.js"), "utf8");
for (const marker of ["Saint Seraphim of Sarov", "Saint Mary of Egypt", "Saint John Chrysostom", "Saint Nina of Georgia", "Saint Nicholas of Myra"]) {
  if (!saintsData.includes(marker)) {
    throw new Error(`Missing saint mock data marker ${marker}`);
  }
}

const saintsJson = await readFile(join(root, "src/features/saints/data/saints-local.json"), "utf8");
for (const marker of ["orthodoxia-saints-v1", "\"short\"", "\"long\"", "\"category\"", "\"feastDay\""]) {
  if (!saintsJson.includes(marker)) {
    throw new Error(`Missing saints local JSON marker ${marker}`);
  }
}

const saintModel = await readFile(join(root, "src/features/saints/domain/SaintModel.js"), "utf8");
for (const marker of ["class SaintModel", "fromLocalJson", "fromSupabaseRow", "toSupabaseRow", "biographyShort", "biographyLong", "category"]) {
  if (!saintModel.includes(marker)) {
    throw new Error(`Missing SaintModel marker ${marker}`);
  }
}

const saintDataSource = await readFile(join(root, "src/features/saints/data/SaintDataSource.js"), "utf8");
for (const marker of ["class SaintDataSource", "loadLocalJson", "loadFromSupabase", "saints-local.json", "short_biography", "long_biography"]) {
  if (!saintDataSource.includes(marker)) {
    throw new Error(`Missing SaintDataSource marker ${marker}`);
  }
}

const saintRepository = await readFile(join(root, "src/features/saints/data/SaintRepository.js"), "utf8");
for (const marker of ["class SaintRepository", "loadLocalJson", "loadFromSupabase", "searchByName", "searchByFeastDay", "filterByCategory", "localStorage"]) {
  if (!saintRepository.includes(marker)) {
    throw new Error(`Missing SaintRepository marker ${marker}`);
  }
}

const saintsView = await readFile(join(root, "src/features/saints/presentation/saintsView.js"), "utf8");
for (const marker of ["data-saints-search", "data-saint-open", "data-saints-back", "saint-detail-card"]) {
  if (!saintsView.includes(marker)) {
    throw new Error(`Missing saints view marker ${marker}`);
  }
}

const searchStorage = await readFile(join(root, "src/features/search/data/searchStorage.js"), "utf8");
for (const marker of ["SEARCH_HISTORY_KEY", "readSearchHistory", "saveSearchQuery", "clearSearchHistory"]) {
  if (!searchStorage.includes(marker)) {
    throw new Error(`Missing global search storage marker ${marker}`);
  }
}

const globalSearchResult = await readFile(join(root, "src/features/search/domain/GlobalSearchResult.js"), "utf8");
if (!globalSearchResult.includes("class GlobalSearchResult")) {
  throw new Error("Missing GlobalSearchResult model class");
}

const globalSearchService = await readFile(join(root, "src/features/search/domain/GlobalSearchService.js"), "utf8");
for (const marker of ["class GlobalSearchService", "searchBible", "buildSaintEntries", "buildPrayerEntries", "buildCalendarEntries"]) {
  if (!globalSearchService.includes(marker)) {
    throw new Error(`Missing global search service marker ${marker}`);
  }
}

const searchView = await readFile(join(root, "src/features/search/presentation/searchView.js"), "utf8");
for (const marker of ["data-search-input", "data-search-result", "data-search-history", "global-search-groups"]) {
  if (!searchView.includes(marker)) {
    throw new Error(`Missing global search view marker ${marker}`);
  }
}

const supabaseMigration = await readFile(join(root, "supabase/migrations/20260613000000_initial_schema.sql"), "utf8");
for (const table of ["users", "saints", "prayers", "bible_books", "bible_chapters", "bible_verses", "favorites", "notes", "prayer_lists", "bible_bookmarks", "settings"]) {
  if (!supabaseMigration.includes(`public.${table}`)) {
    throw new Error(`Missing Supabase table ${table}`);
  }
}

for (const marker of ["enable row level security", "handle_new_user", "on_auth_user_created", "item_type in ('saint', 'prayer', 'verse')", "auth.uid()"]) {
  if (!supabaseMigration.includes(marker)) {
    throw new Error(`Missing Supabase migration marker ${marker}`);
  }
}

const saintsPipelineMigration = await readFile(join(root, "supabase/migrations/20260613001000_extend_saints_pipeline.sql"), "utf8");
for (const marker of ["short_biography", "long_biography", "category", "saints_category_idx"]) {
  if (!saintsPipelineMigration.includes(marker)) {
    throw new Error(`Missing Saints pipeline migration marker ${marker}`);
  }
}

const supabaseClient = await readFile(join(root, "src/shared/supabaseClient.js"), "utf8");
for (const marker of ["createClient", "persistSession", "detectSessionInUrl", "flowType", "getSupabaseClient"]) {
  if (!supabaseClient.includes(marker)) {
    throw new Error(`Missing Supabase client marker ${marker}`);
  }
}

const supabaseConfig = await readFile(join(root, "src/shared/supabaseConfig.js"), "utf8");
for (const marker of ["txspopmkxaklvoufxmiz.supabase.co", "ORTHODOXIA_SUPABASE_PUBLISHABLE_KEY", "orthodoxia-supabase-publishable-key", "publishableKey"]) {
  if (!supabaseConfig.includes(marker)) {
    throw new Error(`Missing Supabase config marker ${marker}`);
  }
}

const authRepository = await readFile(join(root, "src/features/auth/data/AuthRepository.js"), "utf8");
for (const marker of ["signInWithOtp", "verifyOtp", "signInAnonymously", "signInWithPassword", "signInWithOAuth", "signInWithGoogle", "signOut"]) {
  if (!authRepository.includes(marker)) {
    throw new Error(`Missing auth repository marker ${marker}`);
  }
}

const backendRepository = await readFile(join(root, "src/features/backend/data/OrthodoxiaBackendRepository.js"), "utf8");
for (const marker of ["listSaints", "listPrayers", "listBibleBooks", "listFavorites", "listNotes", "listPrayerLists", "listBibleBookmarks", "upsertSettings"]) {
  if (!backendRepository.includes(marker)) {
    throw new Error(`Missing backend repository marker ${marker}`);
  }
}

const aiView = await readFile(join(root, "src/features/ai/presentation/aiView.js"), "utf8");
for (const marker of ["data-ai-input", "data-ai-send", "data-ai-stop", "data-ai-clear", "data-ai-prompt", "ai-message-bubble", "ai-welcome", "ai-service-note"]) {
  if (!aiView.includes(marker)) {
    throw new Error(`Missing AI assistant marker ${marker}`);
  }
}

const aiRepository = await readFile(join(root, "src/features/ai/data/AiRepository.js"), "utf8");
for (const marker of ["class AiRepository", "streamChat", "parseStreamEvent", "/api/ai/chat", "text/event-stream"]) {
  if (!aiRepository.includes(marker)) {
    throw new Error(`Missing AI repository marker ${marker}`);
  }
}

const conversationStorage = await readFile(join(root, "src/features/ai/data/ConversationStorage.js"), "utf8");
for (const marker of ["class ConversationStorage", "localStorage", "sync", "saveConversation", "clearConversation"]) {
  if (!conversationStorage.includes(marker)) {
    throw new Error(`Missing conversation storage marker ${marker}`);
  }
}

const messageModel = await readFile(join(root, "src/features/ai/domain/MessageModel.js"), "utf8");
if (!messageModel.includes("class MessageModel")) {
  throw new Error("Missing MessageModel class");
}

const chatService = await readFile(join(root, "src/features/ai/domain/ChatService.js"), "utf8");
for (const marker of ["class ChatService", "sendMessage", "streaming", "conversationStorage"]) {
  if (!chatService.includes(marker)) {
    throw new Error(`Missing chat service marker ${marker}`);
  }
}

const aiFiles = [main, aiView, aiRepository, conversationStorage, messageModel, chatService, await readFile(join(root, "src/features/ai/domain/aiModel.js"), "utf8")];
for (const rejected of ["getMockAiResponse", "ai.mock", "responseTopics", "ai-mock-note"]) {
  if (aiFiles.some((file) => file.includes(rejected))) {
    throw new Error(`Rejected AI mock marker ${rejected}`);
  }
}

const styles = await readFile(join(root, "styles.css"), "utf8");
for (const color of ["#FFFFFF", "#F6F5F4", "#000000", "#615D59", "#DFDCD9", "#2383E2", "#191919", "#242424", "#B0B0B0"]) {
  if (!styles.includes(color)) {
    throw new Error(`Missing design color ${color}`);
  }
}

const appFiles = await readTree(join(root, "src"));
const rejectedPatterns = [/leaderboard/i, /achievement/i, /followers/i, /streak/i, /social feed/i];
for (const file of appFiles) {
  const text = await readFile(file, "utf8");
  for (const pattern of rejectedPatterns) {
    if (pattern.test(text)) {
      throw new Error(`Rejected pattern ${pattern} found in ${file}`);
    }
  }
}

console.log("Orthodoxia smoke checks passed.");
