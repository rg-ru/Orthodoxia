import { getBibleModel } from "../domain/bibleModel.js";
import { card, pageHeading, quietList, readingProgress } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderBible(state) {
  const model = getBibleModel(state.bibleQuery);

  return `
    <section class="page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: "Reading",
        title: model.passage.title,
        iconName: "auto_stories",
        className: "reading-card",
        content: `
          <p class="reading-text">${escapeHtml(model.passage.body)}</p>
          ${readingProgress(model.passage.progress)}
        `
      })}
      ${card({
        eyebrow: "Bible Search",
        title: "Search Scripture",
        iconName: "search",
        content: `
          <label class="sr-only" for="bible-search">Search Scripture</label>
          <input class="search-field" id="bible-search" data-bible-search value="${escapeHtml(model.query)}" placeholder="Search by book, phrase, or theme">
          ${quietList(model.results)}
        `
      })}
    </section>
  `;
}
