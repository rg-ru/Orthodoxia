export const homeData = {
  sections: {
    saint: {
      iconName: "church",
      eyebrowKey: "home.saint.eyebrow",
      titleKey: "home.saint.title",
      bodyKey: "home.saint.body"
    },
    reading: {
      iconName: "auto_stories",
      eyebrowKey: "home.reading.eyebrow",
      titleKey: "home.reading.title",
      bodyKey: "home.reading.body",
      progress: 32
    },
    fasting: {
      iconName: "restaurant",
      eyebrowKey: "home.fasting.eyebrow",
      titleKey: "home.fasting.title",
      bodyKey: "home.fasting.body"
    },
    quote: {
      iconName: "format_quote",
      eyebrowKey: "home.quote.eyebrow",
      titleKey: "home.quote.title",
      bodyKey: "home.quote.body",
      authorKey: "home.quote.author"
    }
  },
  quickActions: [
    { labelKey: "home.quick.morning", bodyKey: "home.quick.morning.body", iconName: "wb_twilight", route: "prayer" },
    { labelKey: "home.quick.scripture", bodyKey: "home.quick.scripture.body", iconName: "auto_stories", route: "bible" },
    { labelKey: "home.quick.saints", bodyKey: "home.quick.saints.body", iconName: "church", route: "saints" },
    { labelKey: "home.quick.question", bodyKey: "home.quick.question.body", iconName: "forum", route: "ai" }
  ]
};
