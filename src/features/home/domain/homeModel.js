import { homeData } from "../data/homeData.js";
import { getLocale, t } from "../../../shared/i18n.js";

function sectionFromData(section, language) {
  return {
    iconName: section.iconName,
    eyebrow: t(language, section.eyebrowKey),
    title: t(language, section.titleKey),
    body: t(language, section.bodyKey),
    progress: section.progress ?? 0,
    author: section.authorKey ? t(language, section.authorKey) : ""
  };
}

export function getHomeModel(language = "en") {
  return {
    labels: {
      title: t(language, "nav.home"),
      quickActions: t(language, "home.quick.eyebrow"),
      beginAttention: t(language, "home.quick.title"),
      readingProgress: t(language, "home.reading.progress"),
      open: t(language, "home.quick.open")
    },
    saint: sectionFromData(homeData.sections.saint, language),
    reading: sectionFromData(homeData.sections.reading, language),
    fasting: sectionFromData(homeData.sections.fasting, language),
    quote: sectionFromData(homeData.sections.quote, language),
    quickActions: homeData.quickActions.map((action) => ({
      label: t(language, action.labelKey),
      body: t(language, action.bodyKey),
      iconName: action.iconName,
      route: action.route
    })),
    todayLabel: new Intl.DateTimeFormat(getLocale(language), {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(new Date())
  };
}
