import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const requiredFeatures = ["home", "calendar", "prayerBook", "bible", "saints", "ai", "settings"];
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

const main = await readFile(join(root, "src/main.js"), "utf8");
const routeCount = (main.match(/labelKey:/g) || []).length;
if (routeCount !== 6) {
  throw new Error(`Expected 6 main tabs, found ${routeCount}`);
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
for (const marker of ["data-settings-section", "data-settings-back", "settings-section-card", "settings-subpage"]) {
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

for (const modelFile of ["BibleBook.js", "BibleChapter.js", "BibleVerse.js"]) {
  const model = await readFile(join(root, `src/features/bible/domain/${modelFile}`), "utf8");
  if (!model.includes(`class ${modelFile.replace(".js", "")}`)) {
    throw new Error(`Missing ${modelFile} model class`);
  }
}

const bibleView = await readFile(join(root, "src/features/bible/presentation/bibleView.js"), "utf8");
for (const marker of ["data-bible-screen", "data-bible-book", "data-bible-chapter", "data-bible-back", "bible-reader-card"]) {
  if (!bibleView.includes(marker)) {
    throw new Error(`Missing bible view marker ${marker}`);
  }
}

for (const rejected of ["data-bible-search", "data-bible-open-book", "bible-plan", "renderSearch", "renderReadingPlan"]) {
  if (bibleView.includes(rejected)) {
    throw new Error(`Bible reader should not include ${rejected} yet`);
  }
}

const saintsData = await readFile(join(root, "src/features/saints/data/saintsData.js"), "utf8");
for (const marker of ["Saint Seraphim of Sarov", "Saint Mary of Egypt", "Saint John Chrysostom", "Saint Nina of Georgia", "Saint Nicholas of Myra"]) {
  if (!saintsData.includes(marker)) {
    throw new Error(`Missing saint mock data marker ${marker}`);
  }
}

const saintsView = await readFile(join(root, "src/features/saints/presentation/saintsView.js"), "utf8");
for (const marker of ["data-saints-search", "data-saint-open", "data-saints-back", "saint-detail-card"]) {
  if (!saintsView.includes(marker)) {
    throw new Error(`Missing saints view marker ${marker}`);
  }
}

const aiView = await readFile(join(root, "src/features/ai/presentation/aiView.js"), "utf8");
for (const marker of ["data-ai-input", "data-ai-send", "data-ai-prompt", "ai-message-bubble", "ai-welcome"]) {
  if (!aiView.includes(marker)) {
    throw new Error(`Missing AI assistant marker ${marker}`);
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
