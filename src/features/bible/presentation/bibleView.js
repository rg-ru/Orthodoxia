import { getBibleModel } from "../domain/bibleModel.js";
import { card, icon, pageHeading, readingProgress } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderBible(state) {
  const model = getBibleModel({
    query: state.bibleQuery,
    language: state.preferences.language,
    bookId: state.bibleBookId,
    chapterNumber: state.bibleChapterNumber
  });

  if (model.screen === "reader") {
    return renderVerseReader(model);
  }

  if (model.screen === "chapters") {
    return renderChapters(model);
  }

  return renderBooks(model);
}

function renderBooks(model) {
  return `
    <section class="page bible-page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${renderSearchCard(model)}
      ${renderReadingPlan(model)}
      <div class="bible-book-grid">
        ${model.books.map((book) => `
          <button class="card bible-book-card" type="button" data-bible-book="${escapeHtml(book.id)}">
            <div class="card-header">
              <div>
                <p class="card-eyebrow">${escapeHtml(book.testament)}</p>
                <h3 class="card-title">${escapeHtml(book.title)}</h3>
              </div>
              ${icon(book.iconName)}
            </div>
            <p class="card-body">${escapeHtml(book.summary)}</p>
            <span class="meta-line">${book.chapterCount} ${escapeHtml(model.labels.chapterCount)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderChapters(model) {
  return `
    <section class="page bible-page">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-bible-back="books">
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToBooks)}</span>
        </button>
        <h2>${escapeHtml(model.book.title)}</h2>
        <p>${escapeHtml(model.book.summary)}</p>
      </div>
      ${renderSearchCard(model)}
      ${card({
        eyebrow: model.book.testament,
        title: model.labels.chapters,
        iconName: model.book.iconName,
        className: "wide-card",
        content: `
          <div class="bible-chapter-list">
            ${model.book.chapters.map((chapter) => `
              <button class="bible-chapter-item" type="button" data-bible-chapter="${chapter.number}">
                <span>
                  <strong>${escapeHtml(model.book.title)} ${chapter.number}</strong>
                  <span class="meta-line">${escapeHtml(chapter.title)}</span>
                  <span class="meta-line">${escapeHtml(chapter.summary)}</span>
                </span>
                <span class="bible-row-action">
                  <span>${escapeHtml(model.labels.openChapter)}</span>
                  ${icon("chevron_right")}
                </span>
              </button>
            `).join("")}
          </div>
        `
      })}
    </section>
  `;
}

function renderVerseReader(model) {
  return `
    <section class="page bible-reader-page">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-bible-back="chapters">
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToChapters)}</span>
        </button>
        <h2>${escapeHtml(model.chapter.reference)}</h2>
        <p>${escapeHtml(model.chapter.title)}</p>
      </div>
      <article class="card bible-reader-card">
        <div class="bible-reader-meta">
          <span class="card-eyebrow">${escapeHtml(model.labels.reader)}</span>
          <span class="meta-line">${model.chapter.verses.length} ${escapeHtml(model.labels.verses)}</span>
        </div>
        <div class="bible-verse-list">
          ${model.chapter.verses.map((verse) => `
            <p class="bible-verse">
              <sup class="bible-verse-number">${verse.number}</sup>
              <span>${escapeHtml(verse.text)}</span>
            </p>
          `).join("")}
        </div>
        <div class="bible-reader-progress">
          <span class="meta-line">${escapeHtml(model.labels.readingProgress)}</span>
          ${readingProgress(model.chapter.progress, model.labels.readingProgress)}
        </div>
      </article>
    </section>
  `;
}

function renderSearchCard(model) {
  return card({
    eyebrow: model.labels.searchEyebrow,
    title: model.labels.searchTitle,
    iconName: "search",
    className: "bible-search-card wide-card",
    content: `
      <label class="sr-only" for="bible-search">${escapeHtml(model.labels.searchTitle)}</label>
      <input class="search-field" id="bible-search" data-bible-search value="${escapeHtml(model.query)}" placeholder="${escapeHtml(model.labels.searchPlaceholder)}">
      ${renderSearchResults(model)}
    `
  });
}

function renderSearchResults(model) {
  if (!model.query.trim()) {
    return "";
  }

  if (!model.searchResults.length) {
    return `<p class="meta-line">${escapeHtml(model.labels.noSearchResults)}</p>`;
  }

  return `
    <div class="bible-search-results" aria-label="${escapeHtml(model.labels.searchResults)}">
      ${model.searchResults.map((result) => `
        <button class="bible-search-result" type="button" data-bible-open-book="${escapeHtml(result.bookId)}" data-bible-open-chapter="${result.chapterNumber}">
          <span>
            <strong>${escapeHtml(result.reference)}</strong>
            <span class="meta-line">${escapeHtml(result.body)}</span>
          </span>
          <span class="bible-row-action">
            <span>${escapeHtml(model.labels.continueReading)}</span>
            ${icon("chevron_right")}
          </span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderReadingPlan(model) {
  return card({
    eyebrow: model.labels.readingPlan,
    title: model.labels.continueReading,
    body: model.labels.readingPlanBody,
    iconName: "event_note",
    className: "wide-card",
    content: `
      <div class="bible-plan-list">
        ${model.readingPlan.map((item) => `
          <button class="bible-plan-item" type="button" data-bible-open-book="${escapeHtml(item.bookId)}" data-bible-open-chapter="${item.chapterNumber}">
            <span>
              <span class="card-eyebrow">${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.reference)}</strong>
              <span class="meta-line">${escapeHtml(item.body)}</span>
            </span>
            <span class="bible-row-action">
              <span>${escapeHtml(model.labels.continueReading)}</span>
              ${icon("chevron_right")}
            </span>
          </button>
        `).join("")}
      </div>
    `
  });
}
