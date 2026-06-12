import { renderHome } from "./features/home/presentation/homeView.js";
import { renderCalendar } from "./features/calendar/presentation/calendarView.js";
import { renderPrayerBook } from "./features/prayerBook/presentation/prayerBookView.js";
import { renderBible } from "./features/bible/presentation/bibleView.js";
import { renderSaints } from "./features/saints/presentation/saintsView.js";
import { renderAi } from "./features/ai/presentation/aiView.js";
import { getAiReflection } from "./features/ai/domain/aiModel.js";
import { icon } from "./shared/ui.js";

const routes = [
  { id: "home", label: "Home", iconName: "home", render: renderHome },
  { id: "calendar", label: "Calendar", iconName: "calendar_month", render: renderCalendar },
  { id: "prayer", label: "Prayer Book", iconName: "menu_book", render: renderPrayerBook },
  { id: "bible", label: "Bible", iconName: "auto_stories", render: renderBible },
  { id: "saints", label: "Saints", iconName: "church", render: renderSaints },
  { id: "ai", label: "AI", iconName: "forum", render: renderAi }
];

const app = document.querySelector("#app");
const preferredTheme = localStorage.getItem("orthodoxia-theme");
const state = {
  route: getInitialRoute(),
  bibleQuery: "",
  aiQuestion: "",
  aiReflection: ""
};

if (preferredTheme) {
  document.documentElement.dataset.theme = preferredTheme;
}

function getInitialRoute() {
  const hash = window.location.hash.replace("#", "");
  return routes.some((route) => route.id === hash) ? hash : "home";
}

function getCurrentRoute() {
  return routes.find((route) => route.id === state.route) ?? routes[0];
}

function render() {
  const route = getCurrentRoute();
  app.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <div>
          <p class="caption">Digital Orthodox companion</p>
          <h1 class="app-title">Orthodoxia</h1>
        </div>
        <button class="icon-button" type="button" data-theme-toggle aria-label="Toggle dark mode">
          ${icon(document.documentElement.dataset.theme === "dark" ? "light_mode" : "dark_mode")}
        </button>
      </header>
      <main class="content" id="main" tabindex="-1">
        ${route.render(state)}
      </main>
      <nav class="bottom-nav" aria-label="Main">
        ${routes.map((item) => `
          <button class="nav-item" type="button" data-route="${item.id}" aria-current="${item.id === route.id ? "page" : "false"}">
            ${icon(item.iconName)}
            <span>${item.label}</span>
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

  const themeTarget = event.target.closest("[data-theme-toggle]");
  if (themeTarget) {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("orthodoxia-theme", nextTheme);
    render();
    return;
  }

  const reflectionTarget = event.target.closest("[data-action='prepare-reflection']");
  if (reflectionTarget) {
    state.aiReflection = getAiReflection(state.aiQuestion);
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

render();
