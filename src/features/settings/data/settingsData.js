export const settingsData = {
  appVersion: "0.1.0",
  buildNumber: "2026.06.12",
  account: {
    isLoggedIn: false,
    email: "",
    futureAuth: ["Google Sign In", "Apple Sign In"]
  },
  sections: [
    { id: "account", key: "account", bodyKey: "account.body", iconName: "account_circle" },
    { id: "appearance", key: "appearance", bodyKey: "appearance.body", iconName: "contrast" },
    { id: "language", key: "language", bodyKey: "language.body", iconName: "language" },
    { id: "notifications", key: "notifications", bodyKey: "notifications.body", iconName: "notifications" },
    { id: "prayer-preferences", key: "prayerPreferences", bodyKey: "prayerPreferences.body", iconName: "volunteer_activism" },
    { id: "app-settings", key: "appSettings", bodyKey: "appSettings.body", iconName: "settings_applications" },
    { id: "about", key: "about", bodyKey: "about.body", iconName: "info" },
    { id: "support", key: "support", bodyKey: "support.body", iconName: "help" }
  ],
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
