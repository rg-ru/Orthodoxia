import { getCalendarModel } from "../domain/calendarModel.js";
import { card, pageHeading, quietList } from "../../../shared/ui.js";

export function renderCalendar() {
  const model = getCalendarModel();

  return `
    <section class="page two-column">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: "Daily Rhythm",
        title: "Calendar",
        iconName: "calendar_month",
        className: "wide-card",
        content: quietList(model.days)
      })}
      ${card({
        eyebrow: "Hymn",
        title: model.hymn.title,
        body: model.hymn.body,
        iconName: "music_note"
      })}
      ${card({
        eyebrow: "Hymn",
        title: model.kontakion.title,
        body: model.kontakion.body,
        iconName: "notes"
      })}
    </section>
  `;
}
