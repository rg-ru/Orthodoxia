export const settingsData = {
  appVersion: "0.1.0",
  buildNumber: "2026.06.12",
  account: {
    isLoggedIn: false,
    email: "",
    futureAuth: ["Google Sign In", "Apple Sign In"]
  },
  bibleTranslations: [
    "Orthodox Study Bible",
    "King James Version",
    "Lutherbibel",
    "Synodal Russian"
  ],
  prayerLanguages: [
    "English",
    "German",
    "Russian"
  ],
  futureLanguages: [
    "Greek",
    "Romanian",
    "Serbian",
    "Ukrainian",
    "Arabic"
  ],
  aboutPages: [
    { key: "aboutOrthodoxia", action: "about-orthodoxia" },
    { key: "mission", action: "mission-statement" },
    { key: "privacy", action: "privacy-policy" },
    { key: "terms", action: "terms-of-service" }
  ],
  supportActions: [
    { key: "contact", action: "contact-support", iconName: "mail" },
    { key: "bug", action: "report-bug", iconName: "bug_report" },
    { key: "suggest", action: "suggest-feature", iconName: "lightbulb" }
  ]
};
