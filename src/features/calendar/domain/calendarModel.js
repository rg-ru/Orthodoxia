import { getLocale, t } from "../../../shared/i18n.js";
import { calendarData } from "../data/calendarData.js";

const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const fastingLabels = {
  none: "calendar.fast.none",
  fast: "calendar.fast.fast",
  strict: "calendar.fast.strict",
  fish: "calendar.fast.fish"
};

export function getCalendarModel(language = "en", selectedDate = "") {
  const { year, monthIndex } = calendarData.month;
  const locale = getLocale(language);
  const monthDate = new Date(year, monthIndex, 1);
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric"
  }).format(monthDate);

  const days = buildCalendarDays(year, monthIndex, language);
  const selectedDay = selectedDate ? getDayDetail(selectedDate, language) : null;

  return {
    overview: {
      title: t(language, "calendar.title"),
      body: t(language, "calendar.body")
    },
    labels: {
      monthView: t(language, "calendar.monthView"),
      mockData: t(language, "calendar.mockData"),
      feast: t(language, "calendar.feast"),
      fasting: t(language, "calendar.fasting"),
      ordinary: t(language, "calendar.ordinary"),
      noFixedFeast: t(language, "calendar.noFixedFeast"),
      readings: t(language, "calendar.readings"),
      troparion: t(language, "calendar.troparion"),
      kontakion: t(language, "calendar.kontakion"),
      note: t(language, "calendar.note"),
      backToMonth: t(language, "calendar.backToMonth"),
      today: t(language, "calendar.today")
    },
    weekdays: weekdayKeys.map((key) => t(language, `calendar.weekday.${key}`)),
    monthLabel,
    days,
    selectedDay
  };
}

function buildCalendarDays(year, monthIndex, language) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const todayKey = formatDateKey(new Date());
  const days = [];

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - firstWeekday + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      days.push({ isCurrentMonth: false });
      continue;
    }

    const date = new Date(year, monthIndex, dayNumber);
    const dateKey = formatDateKey(date);
    const detail = getDayDetail(dateKey, language);

    days.push({
      ...detail,
      dayNumber,
      isCurrentMonth: true,
      isToday: dateKey === todayKey
    });
  }

  return days;
}

function getDayDetail(dateKey, language) {
  const data = calendarData.days[dateKey] ?? calendarData.defaultDay;
  const date = parseDateKey(dateKey);
  const locale = getLocale(language);
  const feasts = data.feasts ?? [];
  const fasting = data.fasting ?? "none";

  return {
    dateKey,
    dateLabel: new Intl.DateTimeFormat(locale, {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(date),
    feasts,
    primaryFeast: feasts[0] ?? t(language, "calendar.noFixedFeast"),
    fasting,
    fastingLabel: t(language, fastingLabels[fasting] ?? fastingLabels.none),
    readings: data.readings,
    troparion: data.troparion,
    kontakion: data.kontakion,
    note: data.note,
    hasFeast: feasts.length > 0,
    isFastingDay: fasting !== "none"
  };
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}
