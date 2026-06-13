import { getBibleModel } from "../domain/bibleModel.js?v=10";
import { card, icon, pageHeading, readingProgress } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderBible(state) {
  const model = getBibleModel({
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
    <section class="page bible-page" data-bible-screen="books">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${renderOfflineCard(model)}
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
    <section class="page bible-page" data-bible-screen="chapters">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-bible-back="books">
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToBooks)}</span>
        </button>
        <h2>${escapeHtml(model.book.title)}</h2>
        <p>${escapeHtml(model.book.summary)}</p>
      </div>
      ${card({
        eyebrow: model.book.testament,
        title: model.labels.chapters,
        iconName: model.book.iconName,
        className: "wide-card",
        content: `
          <div class="bible-chapter-list">
            ${model.chapters.map((chapter) => `
              <button class="bible-chapter-item" type="button" data-bible-chapter="${chapter.number}">
                <span>
                  <strong>${escapeHtml(chapter.reference)}</strong>
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
    <section class="page bible-reader-page" data-bible-screen="reader">
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
          <span class="meta-line">${model.chapter.verseCount} ${escapeHtml(model.labels.verseCount)}</span>
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

function renderOfflineCard(model) {
  return card({
    eyebrow: model.labels.translation,
    title: model.status.translation.label,
    body: model.status.loadError ? model.labels.loadError : model.labels.offlineBody,
    iconName: "download_done",
    className: "bible-offline-card wide-card",
    content: `
      <div class="segmented-row">
        <span class="small-pill">${escapeHtml(model.labels.offlineTitle)}</span>
        <span class="small-pill">${escapeHtml(model.status.version)}</span>
      </div>
    `
  });
}
