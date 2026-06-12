import { getLocale, t } from "../../../shared/i18n.js";

export function getHomeModel(language = "en") {
  return {
    labels: {
      title: t(language, "nav.home"),
      saintOfDay: t(language, "home.saint.eyebrow"),
      todaysReading: t(language, "home.reading.eyebrow"),
      fastingStatus: t(language, "home.fasting.eyebrow"),
      dailyQuote: t(language, "home.quote.eyebrow"),
      quickActions: t(language, "home.quick.eyebrow"),
      beginAttention: t(language, "home.quick.title")
    },
    saint: {
      title: t(language, "home.saint.title"),
      body: t(language, "home.saint.body")
    },
    reading: {
      title: t(language, "home.reading.title"),
      body: t(language, "home.reading.body"),
      progress: 32
    },
    fasting: {
      title: t(language, "home.fasting.title"),
      body: t(language, "home.fasting.body")
    },
    quote: {
      title: t(language, "home.quote.title"),
      body: t(language, "home.quote.body"),
      author: t(language, "home.quote.author")
    },
    quickActions: [
      { label: t(language, "home.quick.morning"), iconName: "wb_twilight", route: "prayer" },
      { label: t(language, "home.quick.scripture"), iconName: "auto_stories", route: "bible" },
      { label: t(language, "home.quick.saints"), iconName: "church", route: "saints" },
      { label: t(language, "home.quick.question"), iconName: "forum", route: "ai" }
    ],
    todayLabel: new Intl.DateTimeFormat(getLocale(language), {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(new Date())
  };
}
