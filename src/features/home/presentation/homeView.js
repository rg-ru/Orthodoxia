import { getHomeModel } from "../domain/homeModel.js?v=9";
import { icon, pageHeading, readingProgress } from "../../../shared/ui.js";
import { escapeHtml, formatPercent } from "../../../shared/html.js";

export function renderHome(state) {
  const model = getHomeModel(state.preferences.language);

  return `
    <section class="page home-page">
      ${pageHeading(model.labels.title, model.todayLabel)}
      <div class="home-card-grid">
        ${renderSaintCard(model)}
        ${renderReadingCard(model)}
        ${renderFastingCard(model)}
        ${renderQuoteCard(model)}
        ${renderQuickActions(model)}
      </div>
    </section>
  `;
}

function renderSaintCard(model) {
  return `
    <article class="card home-card home-saint-card" data-home-section="saint">
      ${homeCardHeader(model.saint)}
      <p class="home-card-body">${escapeHtml(model.saint.body)}</p>
    </article>
  `;
}

function renderReadingCard(model) {
  return `
    <article class="card home-card home-reading-card" data-home-section="reading">
      ${homeCardHeader(model.reading)}
      <p class="home-reading-text">${escapeHtml(model.reading.body)}</p>
      <div class="home-reading-progress">
        <div class="home-progress-label">
          <span>${escapeHtml(model.labels.readingProgress)}</span>
          <strong>${formatPercent(model.reading.progress)}</strong>
        </div>
        ${readingProgress(model.reading.progress, model.labels.readingProgress)}
      </div>
    </article>
  `;
}

function renderFastingCard(model) {
  return `
    <article class="card home-card home-fasting-card" data-home-section="fasting">
      ${homeCardHeader(model.fasting)}
      <p class="home-card-body">${escapeHtml(model.fasting.body)}</p>
    </article>
  `;
}

function renderQuoteCard(model) {
  return `
    <article class="card home-card home-quote-card" data-home-section="quote">
      ${homeCardHeader(model.quote)}
      <blockquote>
        <p>${escapeHtml(model.quote.body)}</p>
        <cite>${escapeHtml(model.quote.author)}</cite>
      </blockquote>
    </article>
  `;
}

function renderQuickActions(model) {
  return `
    <article class="card home-card home-quick-card" data-home-section="quick-actions">
      <div class="card-header">
        <div>
          <p class="card-eyebrow">${escapeHtml(model.labels.quickActions)}</p>
          <h3 class="card-title">${escapeHtml(model.labels.beginAttention)}</h3>
        </div>
        ${icon("apps")}
      </div>
      <div class="home-action-grid">
        ${model.quickActions.map((action) => `
          <button class="home-action-button" type="button" data-route="${escapeHtml(action.route)}">
            <span class="home-action-icon">${icon(action.iconName)}</span>
            <span class="home-action-copy">
              <strong>${escapeHtml(action.label)}</strong>
              <span>${escapeHtml(action.body)}</span>
            </span>
            <span class="home-action-open">
              <span>${escapeHtml(model.labels.open)}</span>
              ${icon("chevron_right")}
            </span>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function homeCardHeader(section) {
  return `
    <div class="card-header">
      <div>
        <p class="card-eyebrow">${escapeHtml(section.eyebrow)}</p>
        <h3 class="card-title">${escapeHtml(section.title)}</h3>
      </div>
      ${icon(section.iconName)}
    </div>
  `;
}
