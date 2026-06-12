import { renderHome } from "./features/home/presentation/homeView.js";
import { renderCalendar } from "./features/calendar/presentation/calendarView.js";
import { renderPrayerBook } from "./features/prayerBook/presentation/prayerBookView.js";
import { renderBible } from "./features/bible/presentation/bibleView.js";
import { renderSaints } from "./features/saints/presentation/saintsView.js";
import { renderAi } from "./features/ai/presentation/aiView.js";
import { getAiReflection } from "./features/ai/domain/aiModel.js";
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
  bibleQuery: "",
  calendarSelectedDate: "",
  prayerCategoryId: "",
  prayerId: "",
  aiQuestion: "",
  aiReflection: "",
  settingsMessage: "",
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

  const reflectionTarget = event.target.closest("[data-action='prepare-reflection']");
  if (reflectionTarget) {
    state.aiReflection = getAiReflection(state.aiQuestion, state.preferences.language);
    render();
  }
});

app.addEventListener("input", (event) => {
  if (event.target.matches("[data-bible-search]")) {
    state.bibleQuery = event.target.value;
    render();
  }

  if (event.target.matches("[data-ai-question]")) {
    state.aiQuestion = event.target.value;
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
