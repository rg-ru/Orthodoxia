import { getBibleModel } from "../domain/bibleModel.js";
import { card, pageHeading, quietList, readingProgress } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderBible(state) {
  const model = getBibleModel(state.bibleQuery, state.preferences.language);

  return `
    <section class="page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: model.labels.reading,
        title: model.passage.title,
        iconName: "auto_stories",
        className: "reading-card",
        content: `
          <p class="reading-text">${escapeHtml(model.passage.body)}</p>
          ${readingProgress(model.passage.progress)}
        `
      })}
      ${card({
        eyebrow: model.labels.searchEyebrow,
        title: model.labels.searchTitle,
        iconName: "search",
        content: `
          <label class="sr-only" for="bible-search">${escapeHtml(model.labels.searchTitle)}</label>
          <input class="search-field" id="bible-search" data-bible-search value="${escapeHtml(model.query)}" placeholder="${escapeHtml(model.labels.searchPlaceholder)}">
          ${quietList(model.results)}
        `
      })}
    </section>
  `;
}
