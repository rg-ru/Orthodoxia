import { t } from "../../../shared/i18n.js";

export function getCalendarModel(language = "en") {
  return {
    overview: {
      title: t(language, "calendar.title"),
      body: t(language, "calendar.body")
    },
    labels: {
      rhythm: t(language, "calendar.rhythm"),
      calendar: t(language, "calendar.card.title"),
      hymn: t(language, "calendar.hymn")
    },
    days: [
      { title: t(language, "calendar.today"), body: t(language, "calendar.today.body") },
      { title: t(language, "calendar.tomorrow"), body: t(language, "calendar.tomorrow.body") },
      { title: t(language, "calendar.week"), body: t(language, "calendar.week.body") }
    ],
    hymn: {
      title: t(language, "calendar.troparion"),
      body: t(language, "calendar.troparion.body")
    },
    kontakion: {
      title: t(language, "calendar.kontakion"),
      body: t(language, "calendar.kontakion.body")
    }
  };
}
