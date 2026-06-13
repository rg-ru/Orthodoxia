export const backendTables = Object.freeze({
  users: "users",
  saints: "saints",
  prayers: "prayers",
  bibleBooks: "bible_books",
  bibleChapters: "bible_chapters",
  bibleVerses: "bible_verses",
  favorites: "favorites",
  notes: "notes",
  prayerLists: "prayer_lists",
  prayerListItems: "prayer_list_items",
  bibleBookmarks: "bible_bookmarks",
  settings: "settings"
});

export const favoriteItemTypes = Object.freeze({
  saint: "saint",
  prayer: "prayer",
  verse: "verse"
});

export const defaultRemoteSettings = Object.freeze({
  language: "en",
  theme: "system",
  notifications_enabled: true
});
