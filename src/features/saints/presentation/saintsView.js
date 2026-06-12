import { getSaintsModel } from "../domain/saintsModel.js";
import { card, pageHeading, quietList } from "../../../shared/ui.js";

export function renderSaints(state) {
  const model = getSaintsModel(state.preferences.language);

  return `
    <section class="page two-column">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: model.labels.biographies,
        title: model.labels.lives,
        iconName: "church",
        content: quietList(model.saints)
      })}
      ${card({
        eyebrow: model.labels.quotes,
        title: model.labels.from,
        iconName: "format_quote",
        content: quietList(model.quotes)
      })}
    </section>
  `;
}
