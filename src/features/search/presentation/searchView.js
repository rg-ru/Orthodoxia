import { getSearchModel } from "../domain/searchModel.js?v=15";
import { card, icon, pageHeading } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderSearch(state) {
  const model = getSearchModel({
    language: state.preferences.language,
    draft: state.globalSearchDraft,
    query: state.globalSearchQuery
  });

  return `
    <section class="page global-search-page" data-search-screen>
      ${pageHeading(model.overview.title, model.overview.body)}
      ${renderSearchInput(model)}
      ${renderRecentSearches(model)}
      ${renderSearchResults(model)}
    </section>
  `;
}

function renderSearchInput(model) {
  return card({
    eyebrow: model.labels.inputEyebrow,
    title: model.labels.inputTitle,
    iconName: "search",
    className: "global-search-card wide-card",
    content: `
      <label class="sr-only" for="global-search">${escapeHtml(model.labels.inputTitle)}</label>
      <input
        class="search-field"
        id="global-search"
        type="search"
        inputmode="search"
        autocomplete="off"
        data-search-input
        value="${escapeHtml(model.draft)}"
        placeholder="${escapeHtml(model.labels.placeholder)}"
      >
      <p class="meta-line">${escapeHtml(model.labels.help)}</p>
    `
  });
}

function renderRecentSearches(model) {
  return card({
    eyebrow: model.labels.recent,
    title: model.labels.recent,
    iconName: "history",
    className: "global-search-history-card wide-card",
    content: model.history.length ? `
      <div class="search-history-row" aria-label="${escapeHtml(model.labels.recent)}">
        ${model.history.map((query) => `
          <button class="small-pill search-history-chip" type="button" data-search-history="${escapeHtml(query)}">
            ${icon("history")}
            <span>${escapeHtml(query)}</span>
          </button>
        `).join("")}
      </div>
      <button class="text-button search-clear-button" type="button" data-search-clear-history>
        ${icon("delete")}
        <span>${escapeHtml(model.labels.clearHistory)}</span>
      </button>
    ` : `
      <p class="meta-line">${escapeHtml(model.labels.noHistory)}</p>
    `
  });
}

function renderSearchResults(model) {
  if (model.search.state === "idle") {
    return "";
  }

  if (model.search.state === "error") {
    return card({
      eyebrow: model.labels.error,
      title: model.labels.error,
      body: model.search.error || model.labels.error,
      iconName: "error",
      className: "wide-card"
    });
  }

  if (model.search.state === "empty") {
    return card({
      eyebrow: model.labels.resultsLabel,
      title: model.labels.empty,
      body: model.search.query,
      iconName: "search_off",
      className: "wide-card"
    });
  }

  return `
    <div class="global-search-groups" aria-label="${escapeHtml(model.labels.resultsLabel)}">
      ${model.groups.map((group) => renderResultGroup(group, model.labels)).join("")}
    </div>
  `;
}

function renderResultGroup(group, labels) {
  return card({
    eyebrow: `${group.count} ${labels.resultsLabel}`,
    title: group.title,
    iconName: getGroupIcon(group.id),
    className: "global-search-group-card wide-card",
    content: group.results.length ? `
      <div class="global-search-result-list" role="list" aria-label="${escapeHtml(group.title)}">
        ${group.results.map((result) => renderResult(result, labels)).join("")}
      </div>
    ` : `
      <p class="meta-line">${escapeHtml(group.emptyLabel)}</p>
    `
  });
}

function renderResult(result, labels) {
  return `
    <button
      class="global-search-result"
      type="button"
      data-search-result
      data-search-route="${escapeHtml(result.route)}"
      data-search-bible-book="${escapeHtml(result.payload.bibleBookId ?? "")}"
      data-search-bible-chapter="${escapeHtml(result.payload.bibleChapterNumber ?? "")}"
      data-search-saint="${escapeHtml(result.payload.saintId ?? "")}"
      data-search-prayer-category="${escapeHtml(result.payload.prayerCategoryId ?? "")}"
      data-search-prayer="${escapeHtml(result.payload.prayerId ?? "")}"
      data-search-calendar-day="${escapeHtml(result.payload.calendarSelectedDate ?? "")}"
    >
      <span class="global-search-result-icon">${icon(result.iconName)}</span>
      <span class="global-search-result-body">
        <strong>${escapeHtml(result.title)}</strong>
        <span class="meta-line">${escapeHtml(result.subtitle)}</span>
        <span class="global-search-excerpt">${escapeHtml(result.excerpt)}</span>
      </span>
      <span class="bible-row-action">
        <span>${escapeHtml(labels.open)}</span>
        ${icon("chevron_right")}
      </span>
    </button>
  `;
}

function getGroupIcon(groupId) {
  const icons = {
    bible: "auto_stories",
    saints: "church",
    prayers: "menu_book",
    calendar: "calendar_month"
  };

  return icons[groupId] ?? "search";
}
