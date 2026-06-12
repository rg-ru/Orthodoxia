import { getCalendarModel } from "../domain/calendarModel.js";
import { card, pageHeading, quietList } from "../../../shared/ui.js";

export function renderCalendar(state) {
  const model = getCalendarModel(state.preferences.language);

  return `
    <section class="page two-column">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: model.labels.rhythm,
        title: model.labels.calendar,
        iconName: "calendar_month",
        className: "wide-card",
        content: quietList(model.days)
      })}
      ${card({
        eyebrow: model.labels.hymn,
        title: model.hymn.title,
        body: model.hymn.body,
        iconName: "music_note"
      })}
      ${card({
        eyebrow: model.labels.hymn,
        title: model.kontakion.title,
        body: model.kontakion.body,
        iconName: "notes"
      })}
    </section>
  `;
}
