import { supportedLanguages, t } from "../../../shared/i18n.js";
import { settingsData } from "../data/settingsData.js";

export const PREFERENCES_KEY = "orthodoxia-preferences";

export function getDefaultPreferences() {
  return {
    appearance: "system",
    textSize: "medium",
    language: "en",
    displayName: "",
    email: "",
    profilePicture: "",
    preferredBibleTranslation: "Orthodox Study Bible",
    preferredPrayerLanguage: "English",
    accountMode: "offline",
    notifications: {
      prayerReminders: true,
      dailyReadingReminder: false,
      saintReminder: false,
      feastReminder: false
    },
    notificationTimes: {
      prayerReminders: "07:00",
      dailyReadingReminder: "08:00",
      saintReminder: "08:30",
      feastReminder: "18:00"
    },
    prayerPreferences: {
      morningPrayerReminder: true,
      eveningPrayerReminder: false,
      communionReminder: false
    },
    prayerTimes: {
      morningPrayerReminder: "07:00",
      eveningPrayerReminder: "21:00",
      communionReminder: "19:00"
    },
    offlineDownloads: true,
    dataUsage: "wifi"
  };
}

export function normalizePreferences(rawPreferences = {}) {
  const defaults = getDefaultPreferences();
  const legacyTheme = localStorage.getItem("orthodoxia-theme");
  const appearance = rawPreferences.appearance ?? (legacyTheme === "light" || legacyTheme === "dark" ? legacyTheme : defaults.appearance);

  return {
    ...defaults,
    ...rawPreferences,
    appearance,
    notifications: {
      ...defaults.notifications,
      ...rawPreferences.notifications
    },
    notificationTimes: {
      ...defaults.notificationTimes,
      ...rawPreferences.notificationTimes
    },
    prayerPreferences: {
      ...defaults.prayerPreferences,
      ...rawPreferences.prayerPreferences
    },
    prayerTimes: {
      ...defaults.prayerTimes,
      ...rawPreferences.prayerTimes
    }
  };
}

export function getSettingsModel(preferences, statusMessage = "") {
  const language = preferences.language;

  return {
    title: t(language, "settings.title"),
    body: t(language, "settings.body"),
    statusMessage,
    preferences,
    account: settingsData.account,
    bibleTranslations: settingsData.bibleTranslations,
    prayerLanguages: settingsData.prayerLanguages,
    futureLanguages: settingsData.futureLanguages,
    supportedLanguages,
    aboutPages: settingsData.aboutPages.map((page) => ({
      ...page,
      label: t(language, `settings.${page.key}`)
    })),
    supportActions: settingsData.supportActions.map((action) => ({
      ...action,
      label: t(language, `settings.${action.key}`)
    })),
    appVersion: settingsData.appVersion,
    buildNumber: settingsData.buildNumber,
    labels: {
      account: t(language, "settings.account"),
      accountBody: t(language, "settings.account.body"),
      signIn: t(language, "settings.signIn"),
      createAccount: t(language, "settings.createAccount"),
      continueOffline: t(language, "settings.continueOffline"),
      displayName: t(language, "settings.displayName"),
      email: t(language, "settings.email"),
      profilePicture: t(language, "settings.profilePicture"),
      choose: t(language, "settings.choose"),
      bibleTranslation: t(language, "settings.bibleTranslation"),
      prayerLanguage: t(language, "settings.prayerLanguage"),
      appearance: t(language, "settings.appearance"),
      appearanceBody: t(language, "settings.appearance.body"),
      light: t(language, "settings.light"),
      dark: t(language, "settings.dark"),
      system: t(language, "settings.system"),
      textSize: t(language, "settings.textSize"),
      small: t(language, "settings.small"),
      medium: t(language, "settings.medium"),
      large: t(language, "settings.large"),
      language: t(language, "settings.language"),
      languageBody: t(language, "settings.language.body"),
      futureLanguages: t(language, "settings.futureLanguages"),
      notifications: t(language, "settings.notifications"),
      notificationsBody: t(language, "settings.notifications.body"),
      prayerReminders: t(language, "settings.prayerReminders"),
      dailyReadingReminder: t(language, "settings.dailyReadingReminder"),
      saintReminder: t(language, "settings.saintReminder"),
      feastReminder: t(language, "settings.feastReminder"),
      reminderTime: t(language, "settings.reminderTime"),
      prayerPreferences: t(language, "settings.prayerPreferences"),
      prayerPreferencesBody: t(language, "settings.prayerPreferences.body"),
      morningPrayerReminder: t(language, "settings.morningPrayerReminder"),
      eveningPrayerReminder: t(language, "settings.eveningPrayerReminder"),
      communionReminder: t(language, "settings.communionReminder"),
      appSettings: t(language, "settings.appSettings"),
      appSettingsBody: t(language, "settings.appSettings.body"),
      offlineDownloads: t(language, "settings.offlineDownloads"),
      clearCache: t(language, "settings.clearCache"),
      dataUsage: t(language, "settings.dataUsage"),
      wifiOnly: t(language, "settings.wifiOnly"),
      wifiAndCellular: t(language, "settings.wifiAndCellular"),
      version: t(language, "settings.version"),
      build: t(language, "settings.build"),
      about: t(language, "settings.about"),
      aboutBody: t(language, "settings.about.body"),
      support: t(language, "settings.support"),
      supportBody: t(language, "settings.support.body"),
      future: t(language, "settings.future"),
      enabled: t(language, "settings.enabled"),
      disabled: t(language, "settings.disabled")
    }
  };
}

export function getSettingsMessage(language, action) {
  if (action === "continue-offline") {
    return t(language, "settings.accountOffline");
  }

  if (action === "clear-cache") {
    return t(language, "settings.cacheCleared");
  }

  if (action === "sign-in" || action === "create-account") {
    return t(language, "settings.futureAction");
  }

  if (action?.startsWith("support-") || action === "contact-support" || action === "report-bug" || action === "suggest-feature") {
    return t(language, "settings.supportAction");
  }

  return t(language, "settings.pageAction");
}
