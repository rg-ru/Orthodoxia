import { getHomeModel } from "../domain/homeModel.js";
import { actionButton, card, pageHeading, readingProgress } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderHome(state) {
  const model = getHomeModel(state.preferences.language);

  return `
    <section class="page">
      ${pageHeading(model.labels.title, model.todayLabel)}
      ${card({
        eyebrow: model.labels.saintOfDay,
        title: model.saint.title,
        body: model.saint.body,
        iconName: "church"
      })}
      ${card({
        eyebrow: model.labels.todaysReading,
        title: model.reading.title,
        iconName: "auto_stories",
        className: "reading-card",
        content: `
          <p class="reading-text">${escapeHtml(model.reading.body)}</p>
          ${readingProgress(model.reading.progress)}
        `
      })}
      ${card({
        eyebrow: model.labels.fastingStatus,
        title: model.fasting.title,
        body: model.fasting.body,
        iconName: "restaurant"
      })}
      ${card({
        eyebrow: model.labels.dailyQuote,
        title: model.quote.title,
        body: `${model.quote.body} - ${model.quote.author}`,
        iconName: "format_quote"
      })}
      ${card({
        eyebrow: model.labels.quickActions,
        title: model.labels.beginAttention,
        iconName: "apps",
        content: `
          <div class="action-grid">
            ${model.quickActions.map(actionButton).join("")}
          </div>
        `
      })}
    </section>
  `;
}
