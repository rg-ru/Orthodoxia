import { t } from "../../../shared/i18n.js";

export function getPrayerBookModel(language = "en") {
  return {
    overview: {
      title: t(language, "prayer.title"),
      body: t(language, "prayer.body")
    },
    labels: {
      reading: t(language, "prayer.reading"),
      rule: t(language, "prayer.rule"),
      sections: t(language, "prayer.sections")
    },
    currentPrayer: {
      title: t(language, "prayer.current.title"),
      body: t(language, "prayer.current.body"),
      progress: 48
    },
    sections: [
      { title: t(language, "prayer.morning"), body: t(language, "prayer.morning.body") },
      { title: t(language, "prayer.evening"), body: t(language, "prayer.evening.body") },
      { title: t(language, "prayer.confession"), body: t(language, "prayer.confession.body") },
      { title: t(language, "prayer.list"), body: t(language, "prayer.list.body") }
    ]
  };
}
