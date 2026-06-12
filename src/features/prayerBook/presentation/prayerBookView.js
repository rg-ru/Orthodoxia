import { getPrayerBookModel } from "../domain/prayerModel.js";
import { card, pageHeading, quietList, readingProgress } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderPrayerBook() {
  const model = getPrayerBookModel();

  return `
    <section class="page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: "Reading",
        title: model.currentPrayer.title,
        iconName: "menu_book",
        className: "reading-card",
        content: `
          <p class="reading-text">${escapeHtml(model.currentPrayer.body)}</p>
          ${readingProgress(model.currentPrayer.progress)}
        `
      })}
      ${card({
        eyebrow: "Prayer Rule",
        title: "Sections",
        iconName: "format_list_bulleted",
        content: quietList(model.sections)
      })}
    </section>
  `;
}
