import { card, icon } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderSearchScreen(model) {
  return card({
    eyebrow: model.labels.searchEyebrow,
    title: model.labels.searchTitle,
    iconName: "search",
    className: "bible-search-card wide-card",
    content: `
      <label class="sr-only" for="bible-search">${escapeHtml(model.labels.searchTitle)}</label>
      <input
        class="search-field"
        id="bible-search"
        type="search"
        inputmode="search"
        autocomplete="off"
        data-bible-search
        value="${escapeHtml(model.search.draft)}"
        placeholder="${escapeHtml(model.labels.searchPlaceholder)}"
      >
      ${renderSearchState(model)}
    `
  });
}

function renderSearchState(model) {
  if (model.search.state === "error") {
    return renderSearchMessage(model.labels.searchError, model.search.error);
  }

  if (model.search.state === "idle") {
    return renderSearchMessage(model.labels.searchHelp);
  }

  if (model.search.state === "empty") {
    return renderSearchMessage(model.labels.noSearchResults, model.search.query);
  }

  return `
    <div class="bible-search-results" role="list" aria-label="${escapeHtml(model.labels.searchResults)}">
      ${model.search.results.map((result) => renderResult(result, model.labels)).join("")}
    </div>
  `;
}

function renderSearchMessage(title, detail = "") {
  return `
    <div class="bible-search-status">
      <p class="meta-line">${escapeHtml(title)}</p>
      ${detail ? `<p>${escapeHtml(detail)}</p>` : ""}
    </div>
  `;
}

function renderResult(result, labels) {
  return `
    <button
      class="bible-search-result"
      type="button"
      data-bible-search-result
      data-bible-result-book="${escapeHtml(result.bookId)}"
      data-bible-result-chapter="${escapeHtml(result.chapterNumber)}"
    >
      <span class="bible-search-result-body">
        <span class="bible-search-result-header">
          <span class="small-pill">${escapeHtml(getResultLabel(result.type, labels))}</span>
          <strong>${escapeHtml(result.reference)}</strong>
        </span>
        <span class="meta-line">${escapeHtml(result.subtitle)}</span>
        <span class="bible-search-excerpt">${escapeHtml(result.excerpt)}</span>
      </span>
      <span class="bible-row-action">
        <span>${escapeHtml(labels.openResult)}</span>
        ${icon("chevron_right")}
      </span>
    </button>
  `;
}

function getResultLabel(type, labels) {
  const labelsByType = {
    book: labels.resultBook,
    chapter: labels.resultChapter,
    verse: labels.resultVerse,
    keyword: labels.resultKeyword
  };

  return labelsByType[type] ?? labels.resultKeyword;
}
