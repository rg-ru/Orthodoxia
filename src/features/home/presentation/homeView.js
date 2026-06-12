import { getHomeModel } from "../domain/homeModel.js";
import { actionButton, card, pageHeading, readingProgress } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderHome() {
  const model = getHomeModel();

  return `
    <section class="page">
      ${pageHeading("Home", model.todayLabel)}
      ${card({
        eyebrow: "Saint of the Day",
        title: model.saint.title,
        body: model.saint.body,
        iconName: "church"
      })}
      ${card({
        eyebrow: "Today's Reading",
        title: model.reading.title,
        iconName: "auto_stories",
        className: "reading-card",
        content: `
          <p class="reading-text">${escapeHtml(model.reading.body)}</p>
          ${readingProgress(model.reading.progress)}
        `
      })}
      ${card({
        eyebrow: "Fasting Status",
        title: model.fasting.title,
        body: model.fasting.body,
        iconName: "restaurant"
      })}
      ${card({
        eyebrow: "Daily Quote",
        title: model.quote.title,
        body: `${model.quote.body} - ${model.quote.author}`,
        iconName: "format_quote"
      })}
      ${card({
        eyebrow: "Quick Actions",
        title: "Begin with attention",
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
