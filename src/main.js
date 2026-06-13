import { renderHome } from "./features/home/presentation/homeView.js?v=9";
import { renderCalendar } from "./features/calendar/presentation/calendarView.js";
import { renderPrayerBook } from "./features/prayerBook/presentation/prayerBookView.js";
import { renderBible } from "./features/bible/presentation/bibleView.js?v=10";
import { renderSaints } from "./features/saints/presentation/saintsView.js";
import { renderAi } from "./features/ai/presentation/aiView.js";
import { bibleRepository } from "./features/bible/data/BibleRepository.js?v=10";
import { getMockAiResponse } from "./features/ai/domain/aiModel.js";
import { renderSettings } from "./features/settings/presentation/settingsView.js";
import { getSettingsMessage, normalizePreferences, PREFERENCES_KEY } from "./features/settings/domain/settingsModel.js";
import { t } from "./shared/i18n.js";
import { icon } from "./shared/ui.js";

const mainRoutes = [
  { id: "home", labelKey: "nav.home", iconName: "home", render: renderHome },
  { id: "calendar", labelKey: "nav.calendar", iconName: "calendar_month", render: renderCalendar },
  { id: "prayer", labelKey: "nav.prayer", iconName: "menu_book", render: renderPrayerBook },
  { id: "bible", labelKey: "nav.bible", iconName: "auto_stories", render: renderBible },
  { id: "saints", labelKey: "nav.saints", iconName: "church", render: renderSaints },
  { id: "ai", labelKey: "nav.ai", iconName: "forum", render: renderAi }
];

const subRoutes = [
  { id: "settings", render: renderSettings }
];

const routes = [...mainRoutes, ...subRoutes];
const app = document.querySelector("#app");
const state = {
  route: getInitialRoute(),
  bibleBookId: "",
  bibleChapterNumber: "",
  calendarSelectedDate: "",
  prayerCategoryId: "",
  prayerId: "",
  saintsQuery: "",
  saintId: "",
  aiDraft: "",
  aiMessages: [],
  settingsMessage: "",
  settingsSection: "",
  preferences: readPreferences()
};

applyPreferences(state.preferences);

function getInitialRoute() {
  const hash = window.location.hash.replace("#", "");
  return routes.some((route) => route.id === hash) ? hash : "home";
}

function getCurrentRoute() {
  return routes.find((route) => route.id === state.route) ?? routes[0];
}

function render() {
  const route = getCurrentRoute();
  const language = state.preferences.language;
  app.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <div>
          <p class="caption">${t(language, "app.caption")}</p>
          <h1 class="app-title">Orthodoxia</h1>
        </div>
        <div class="header-actions">
          <button class="icon-button" type="button" data-route="settings" aria-label="${t(language, "app.settings")}">
            ${icon("settings")}
          </button>
        </div>
      </header>
      <main class="content" id="main" tabindex="-1">
        ${route.render(state)}
      </main>
      <nav class="bottom-nav" aria-label="Main">
        ${mainRoutes.map((item) => `
          <button class="nav-item" type="button" data-route="${item.id}" aria-current="${item.id === route.id ? "page" : "false"}">
            ${icon(item.iconName)}
            <span>${t(language, item.labelKey)}</span>
          </button>
        `).join("")}
      </nav>
    </div>
  `;
}

function navigate(routeId) {
  if (!routes.some((route) => route.id === routeId)) {
    return;
  }

  state.route = routeId;
  if (routeId === "settings") {
    state.settingsSection = "";
  }
  window.location.hash = routeId;
  render();
  document.querySelector("#main")?.focus({ preventScroll: true });
}

app.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) {
    navigate(routeTarget.dataset.route);
    return;
  }

  const preferenceTarget = event.target.closest("[data-preference-option]");
  if (preferenceTarget) {
    updatePreference(preferenceTarget.dataset.preferenceOption, preferenceTarget.dataset.value);
    return;
  }

  const settingsActionTarget = event.target.closest("[data-settings-action]");
  if (settingsActionTarget) {
    handleSettingsAction(settingsActionTarget.dataset.settingsAction);
    return;
  }

  const settingsSectionTarget = event.target.closest("[data-settings-section]");
  if (settingsSectionTarget) {
    state.settingsSection = settingsSectionTarget.dataset.settingsSection;
    state.settingsMessage = "";
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const settingsBackTarget = event.target.closest("[data-settings-back]");
  if (settingsBackTarget) {
    state.settingsSection = "";
    state.settingsMessage = "";
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const calendarDayTarget = event.target.closest("[data-calendar-day]");
  if (calendarDayTarget) {
    state.calendarSelectedDate = calendarDayTarget.dataset.calendarDay;
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const calendarBackTarget = event.target.closest("[data-calendar-back]");
  if (calendarBackTarget) {
    state.calendarSelectedDate = "";
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const bibleBookTarget = event.target.closest("[data-bible-book]");
  if (bibleBookTarget) {
    state.bibleBookId = bibleBookTarget.dataset.bibleBook;
    state.bibleChapterNumber = "";
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const bibleChapterTarget = event.target.closest("[data-bible-chapter]");
  if (bibleChapterTarget) {
    state.bibleChapterNumber = bibleChapterTarget.dataset.bibleChapter;
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const bibleBackTarget = event.target.closest("[data-bible-back]");
  if (bibleBackTarget) {
    if (bibleBackTarget.dataset.bibleBack === "books") {
      state.bibleBookId = "";
      state.bibleChapterNumber = "";
    } else {
      state.bibleChapterNumber = "";
    }

    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const prayerCategoryTarget = event.target.closest("[data-prayer-category]");
  if (prayerCategoryTarget) {
    state.prayerCategoryId = prayerCategoryTarget.dataset.prayerCategory;
    state.prayerId = "";
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const prayerOpenTarget = event.target.closest("[data-prayer-open]");
  if (prayerOpenTarget) {
    state.prayerId = prayerOpenTarget.dataset.prayerOpen;
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const prayerBackTarget = event.target.closest("[data-prayer-back]");
  if (prayerBackTarget) {
    if (prayerBackTarget.dataset.prayerBack === "categories") {
      state.prayerCategoryId = "";
      state.prayerId = "";
    } else {
      state.prayerId = "";
    }

    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const saintOpenTarget = event.target.closest("[data-saint-open]");
  if (saintOpenTarget) {
    state.saintId = saintOpenTarget.dataset.saintOpen;
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const saintsBackTarget = event.target.closest("[data-saints-back]");
  if (saintsBackTarget) {
    state.saintId = "";
    render();
    document.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }

  const aiPromptTarget = event.target.closest("[data-ai-prompt]");
  if (aiPromptTarget) {
    sendAiMessage(aiPromptTarget.dataset.aiPrompt);
    return;
  }

  const aiSendTarget = event.target.closest("[data-ai-send]");
  if (aiSendTarget) {
    sendAiMessage();
  }
});

app.addEventListener("keydown", (event) => {
  if (event.target.matches("[data-ai-input]") && event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendAiMessage(event.target.value);
  }
});

app.addEventListener("input", (event) => {
  if (event.target.matches("[data-saints-search]")) {
    const cursor = event.target.selectionStart ?? event.target.value.length;
    state.saintsQuery = event.target.value;
    render();
    const searchField = document.querySelector("[data-saints-search]");
    searchField?.focus({ preventScroll: true });
    searchField?.setSelectionRange(cursor, cursor);
  }

  if (event.target.matches("[data-ai-input]")) {
    state.aiDraft = event.target.value;
    const sendButton = document.querySelector("[data-ai-send]");
    if (sendButton) {
      sendButton.disabled = !state.aiDraft.trim();
    }
  }

  if (event.target.matches("[data-setting-input]")) {
    updatePreference(event.target.dataset.settingInput, event.target.value, { renderAfterUpdate: false });
  }
});

app.addEventListener("change", (event) => {
  if (event.target.matches("[data-setting-select]")) {
    updatePreference(event.target.dataset.settingSelect, event.target.value);
  }

  if (event.target.matches("[data-setting-checkbox]")) {
    updatePreference(event.target.dataset.settingCheckbox, event.target.checked);
  }

  if (event.target.matches("[data-setting-time]")) {
    updatePreference(event.target.dataset.settingTime, event.target.value);
  }

  if (event.target.matches("[data-profile-picture]")) {
    updateProfilePicture(event.target.files?.[0]);
  }
});

window.addEventListener("hashchange", () => {
  const nextRoute = getInitialRoute();
  if (nextRoute !== state.route) {
    state.route = nextRoute;
    render();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

function readPreferences() {
  try {
    return normalizePreferences(JSON.parse(localStorage.getItem(PREFERENCES_KEY)) ?? {});
  } catch {
    return normalizePreferences({});
  }
}

function savePreferences() {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state.preferences));
}

function setPreferenceValue(path, value) {
  const parts = path.split(".");
  const key = parts.pop();
  let target = state.preferences;
  for (const part of parts) {
    target = target[part];
  }
  target[key] = value;
}

function updatePreference(path, value, options = {}) {
  setPreferenceValue(path, value);
  state.settingsMessage = "";
  savePreferences();
  applyPreferences(state.preferences);

  if (options.renderAfterUpdate === false) {
    return;
  }

  render();
}

function applyPreferences(preferences) {
  if (preferences.appearance === "light" || preferences.appearance === "dark") {
    document.documentElement.dataset.theme = preferences.appearance;
  } else {
    delete document.documentElement.dataset.theme;
  }

  document.documentElement.dataset.textSize = preferences.textSize;
  document.documentElement.lang = preferences.language;
}

function sendAiMessage(message = state.aiDraft) {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    return;
  }

  state.aiMessages = [
    ...state.aiMessages,
    { role: "user", text: cleanMessage },
    { role: "assistant", text: getMockAiResponse(cleanMessage, state.preferences.language) }
  ];
  state.aiDraft = "";
  render();
  focusAiInput();
}

function focusAiInput() {
  const input = document.querySelector("[data-ai-input]");
  if (!input) {
    return;
  }

  input.focus({ preventScroll: true });
  input.setSelectionRange(input.value.length, input.value.length);
}

async function handleSettingsAction(action) {
  if (action === "continue-offline") {
    state.preferences.accountMode = "offline";
    savePreferences();
  }

  if (action === "clear-cache" && "caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  state.settingsMessage = getSettingsMessage(state.preferences.language, action);
  render();
}

function updateProfilePicture(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.preferences.profilePicture = typeof reader.result === "string" ? reader.result : "";
    savePreferences();
    render();
  });
  reader.readAsDataURL(file);
}

render();

bibleRepository.loadLocalJson().then(() => {
  if (state.route === "bible") {
    render();
  }
});
