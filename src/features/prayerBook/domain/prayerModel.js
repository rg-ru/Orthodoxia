import { t } from "../../../shared/i18n.js";
import { prayerData } from "../data/prayerData.js";

export function getPrayerBookModel(language = "en", categoryId = "", prayerId = "") {
  const category = prayerData.categories.find((item) => item.id === categoryId) ?? null;
  const prayer = category?.prayers.find((item) => item.id === prayerId) ?? null;

  return {
    screen: getScreen(category, prayer),
    overview: {
      title: t(language, "prayer.title"),
      body: t(language, "prayer.body")
    },
    labels: {
      categories: t(language, "prayer.categories"),
      prayers: t(language, "prayer.prayers"),
      reader: t(language, "prayer.reader"),
      backToCategories: t(language, "prayer.backToCategories"),
      backToPrayers: t(language, "prayer.backToPrayers"),
      startReading: t(language, "prayer.startReading"),
      prayerCount: t(language, "prayer.prayerCount"),
      readingProgress: t(language, "prayer.readingProgress")
    },
    categories: prayerData.categories.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      iconName: item.iconName,
      prayerCount: item.prayers.length
    })),
    category,
    prayer: prayer ? withProgress(category, prayer) : null
  };
}

function getScreen(category, prayer) {
  if (prayer) {
    return "reader";
  }

  if (category) {
    return "list";
  }

  return "categories";
}

function withProgress(category, prayer) {
  const prayerIndex = category.prayers.findIndex((item) => item.id === prayer.id);
  const progress = Math.round(((prayerIndex + 1) / category.prayers.length) * 100);

  return {
    ...prayer,
    categoryTitle: category.title,
    progress
  };
}
