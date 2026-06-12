import { getSaintsModel } from "../domain/saintsModel.js";
import { card, pageHeading, quietList } from "../../../shared/ui.js";

export function renderSaints() {
  const model = getSaintsModel();

  return `
    <section class="page two-column">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: "Biographies",
        title: "Lives of the Saints",
        iconName: "church",
        content: quietList(model.saints)
      })}
      ${card({
        eyebrow: "Quotes",
        title: "From the Saints",
        iconName: "format_quote",
        content: quietList(model.quotes)
      })}
    </section>
  `;
}
