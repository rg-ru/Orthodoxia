import { getCalendarModel } from "../domain/calendarModel.js";
import { escapeHtml } from "../../../shared/html.js";
import { card, icon, pageHeading, quietList } from "../../../shared/ui.js";

export function renderCalendar(state) {
  const model = getCalendarModel(state.preferences.language, state.calendarSelectedDate);

  if (model.selectedDay) {
    return renderDayDetail(model);
  }

  return `
    <section class="page calendar-page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: model.labels.monthView,
        title: model.monthLabel,
        iconName: "calendar_month",
        className: "wide-card calendar-card",
        content: `
          <div class="calendar-legend" aria-label="${escapeHtml(model.labels.mockData)}">
            <span class="small-pill">${icon("circle")} ${escapeHtml(model.labels.feast)}</span>
            <span class="small-pill">${icon("radio_button_unchecked")} ${escapeHtml(model.labels.fasting)}</span>
            <span class="small-pill">${escapeHtml(model.labels.mockData)}</span>
          </div>
          <div class="calendar-grid" role="grid" aria-label="${escapeHtml(model.monthLabel)}">
            ${model.weekdays.map((day) => `<div class="calendar-weekday" role="columnheader">${escapeHtml(day)}</div>`).join("")}
            ${model.days.map((day) => renderCalendarCell(day, model.labels)).join("")}
          </div>
        `
      })}
    </section>
  `;
}

function renderCalendarCell(day, labels) {
  if (!day.isCurrentMonth) {
    return `<div class="calendar-day calendar-day-empty" role="presentation"></div>`;
  }

  const classes = [
    "calendar-day",
    day.hasFeast ? "has-feast" : "",
    day.isFastingDay ? "has-fast" : "",
    day.isToday ? "is-today" : ""
  ].filter(Boolean).join(" ");

  const indicators = [
    day.hasFeast ? `<span class="calendar-dot feast-dot" aria-label="${escapeHtml(labels.feast)}"></span>` : "",
    day.isFastingDay ? `<span class="calendar-dot fast-dot" aria-label="${escapeHtml(labels.fasting)}"></span>` : ""
  ].join("");

  return `
    <button
      class="${escapeHtml(classes)}"
      type="button"
      data-calendar-day="${escapeHtml(day.dateKey)}"
      aria-label="${escapeHtml(`${day.dateLabel}. ${day.primaryFeast}. ${day.fastingLabel}`)}"
    >
      <span class="calendar-day-number">${day.dayNumber}</span>
      <span class="calendar-day-title">${escapeHtml(day.primaryFeast)}</span>
      <span class="calendar-indicators">${indicators}</span>
    </button>
  `;
}

function renderDayDetail(model) {
  const day = model.selectedDay;
  const feastItems = day.feasts.length
    ? day.feasts.map((feast) => ({ title: feast, body: model.labels.feast }))
    : [{ title: model.labels.noFixedFeast, body: model.labels.ordinary }];

  return `
    <section class="page calendar-detail-page">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-calendar-back>
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToMonth)}</span>
        </button>
        <h2>${escapeHtml(day.dateLabel)}</h2>
        <p>${escapeHtml(day.primaryFeast)}</p>
      </div>
      ${card({
        eyebrow: model.labels.feast,
        title: day.primaryFeast,
        iconName: "church",
        content: quietList(feastItems)
      })}
      ${card({
        eyebrow: model.labels.fasting,
        title: day.fastingLabel,
        body: day.note,
        iconName: "restaurant"
      })}
      ${card({
        eyebrow: model.labels.readings,
        title: model.labels.readings,
        iconName: "auto_stories",
        content: quietList(day.readings.map((reading) => ({ title: reading, body: model.labels.readings })))
      })}
      ${card({
        eyebrow: model.labels.troparion,
        title: model.labels.troparion,
        body: day.troparion,
        iconName: "music_note"
      })}
      ${card({
        eyebrow: model.labels.kontakion,
        title: model.labels.kontakion,
        body: day.kontakion,
        iconName: "notes"
      })}
    </section>
  `;
}
