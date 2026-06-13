import { getSaintsModel } from "../domain/saintsModel.js?v=15";
import { card, icon, pageHeading } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderSaints(state) {
  const model = getSaintsModel({
    language: state.preferences.language,
    query: state.saintsQuery,
    saintId: state.saintId
  });

  if (model.screen === "detail") {
    return renderSaintDetail(model);
  }

  return renderSaintsList(model);
}

function renderSaintsList(model) {
  return `
    <section class="page saints-page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${renderSearchCard(model)}
      <div class="saint-list-grid">
        ${model.saints.length ? model.saints.map((saint) => `
          <button class="card saint-list-card" type="button" data-saint-open="${escapeHtml(saint.id)}">
            <div class="card-header">
              <div>
                <p class="card-eyebrow">${escapeHtml(model.labels.feastDay)} ${escapeHtml(saint.feastDay)}</p>
                <h3 class="card-title">${escapeHtml(saint.name)}</h3>
              </div>
              ${icon(saint.iconName)}
            </div>
            <p class="card-body">${escapeHtml(saint.summary)}</p>
            <span class="saint-card-action">
              <span>${escapeHtml(model.labels.readLife)}</span>
              ${icon("chevron_right")}
            </span>
          </button>
        `).join("") : `
          <p class="status-note">${escapeHtml(model.labels.noResults)}</p>
        `}
      </div>
    </section>
  `;
}

function renderSaintDetail(model) {
  const saint = model.selectedSaint;

  return `
    <section class="page saint-detail-page">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-saints-back>
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToList)}</span>
        </button>
        <h2>${escapeHtml(saint.name)}</h2>
        <p>${escapeHtml(model.labels.feastDay)} ${escapeHtml(saint.feastDay)}</p>
      </div>
      ${card({
        eyebrow: model.labels.biography,
        title: saint.name,
        iconName: saint.iconName,
        className: "saint-detail-card",
        content: `
          <div class="saint-biography">
            ${saint.biography.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </div>
        `
      })}
      ${card({
        eyebrow: model.labels.quote,
        title: model.labels.quote,
        iconName: "format_quote",
        className: "saint-quote-card",
        content: `<blockquote>${escapeHtml(saint.quote)}</blockquote>`
      })}
    </section>
  `;
}

function renderSearchCard(model) {
  return card({
    eyebrow: model.labels.biographies,
    title: model.labels.searchTitle,
    iconName: "search",
    className: "saints-search-card wide-card",
    content: `
      <label class="sr-only" for="saints-search">${escapeHtml(model.labels.searchTitle)}</label>
      <input class="search-field" id="saints-search" data-saints-search value="${escapeHtml(model.query)}" placeholder="${escapeHtml(model.labels.searchPlaceholder)}">
    `
  });
}
