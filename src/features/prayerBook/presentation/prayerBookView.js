import { getPrayerBookModel } from "../domain/prayerModel.js";
import { escapeHtml } from "../../../shared/html.js";
import { card, icon, pageHeading, readingProgress } from "../../../shared/ui.js";

export function renderPrayerBook(state) {
  const model = getPrayerBookModel(
    state.preferences.language,
    state.prayerCategoryId,
    state.prayerId
  );

  if (model.screen === "reader") {
    return renderPrayerReader(model);
  }

  if (model.screen === "list") {
    return renderPrayerList(model);
  }

  return renderPrayerCategories(model);
}

function renderPrayerCategories(model) {
  return `
    <section class="page prayer-page">
      ${pageHeading(model.overview.title, model.overview.body)}
      <div class="prayer-category-grid">
        ${model.categories.map((category) => `
          <button class="card prayer-category-card" type="button" data-prayer-category="${escapeHtml(category.id)}">
            <div class="card-header">
              <div>
                <p class="card-eyebrow">${escapeHtml(model.labels.categories)}</p>
                <h3 class="card-title">${escapeHtml(category.title)}</h3>
              </div>
              ${icon(category.iconName)}
            </div>
            <p class="card-body">${escapeHtml(category.summary)}</p>
            <span class="meta-line">${category.prayerCount} ${escapeHtml(model.labels.prayerCount)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderPrayerList(model) {
  return `
    <section class="page prayer-page">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-prayer-back="categories">
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToCategories)}</span>
        </button>
        <h2>${escapeHtml(model.category.title)}</h2>
        <p>${escapeHtml(model.category.summary)}</p>
      </div>
      ${card({
        eyebrow: model.labels.prayers,
        title: model.category.title,
        iconName: model.category.iconName,
        className: "wide-card",
        content: `
          <div class="prayer-list">
            ${model.category.prayers.map((prayer) => `
              <button class="prayer-list-item" type="button" data-prayer-open="${escapeHtml(prayer.id)}">
                <span>
                  <strong>${escapeHtml(prayer.title)}</strong>
                  <span class="meta-line">${escapeHtml(prayer.duration)}</span>
                </span>
                <span class="prayer-list-action">
                  <span>${escapeHtml(model.labels.startReading)}</span>
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

function renderPrayerReader(model) {
  return `
    <section class="page prayer-reader-page">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-prayer-back="list">
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToPrayers)}</span>
        </button>
        <h2>${escapeHtml(model.prayer.title)}</h2>
        <p>${escapeHtml(model.prayer.categoryTitle)}</p>
      </div>
      <article class="card prayer-reader-card">
        <div class="prayer-reader-meta">
          <span class="card-eyebrow">${escapeHtml(model.labels.reader)}</span>
          <span class="meta-line">${escapeHtml(model.prayer.duration)}</span>
        </div>
        <div class="prayer-reader-text">
          ${model.prayer.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
        <div class="prayer-reader-progress">
          <span class="meta-line">${escapeHtml(model.labels.readingProgress)}</span>
          ${readingProgress(model.prayer.progress, model.labels.readingProgress)}
        </div>
      </article>
    </section>
  `;
}
