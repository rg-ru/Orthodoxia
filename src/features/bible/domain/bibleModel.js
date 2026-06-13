import { bibleRepository } from "../data/BibleRepository.js?v=11";
import { BibleSearchService } from "./BibleSearchService.js?v=11";
import { t } from "../../../shared/i18n.js?v=11";

const bibleSearchService = new BibleSearchService(bibleRepository);

export function getBibleModel({
  language = "en",
  bookId = "",
  chapterNumber = "",
  searchDraft = "",
  searchQuery = ""
} = {}) {
  const book = bibleRepository.getBook(bookId);
  const chapter = book ? bibleRepository.getChapter(book.id, chapterNumber) : null;
  const status = bibleRepository.getStatus();
  const search = bibleSearchService.search(searchQuery);

  return {
    screen: getScreen(book, chapter),
    overview: {
      title: t(language, "bible.title"),
      body: t(language, "bible.body")
    },
    labels: {
      books: t(language, "bible.books"),
      chapters: t(language, "bible.chapters"),
      reader: t(language, "bible.reader"),
      openBook: t(language, "bible.openBook"),
      openChapter: t(language, "bible.openChapter"),
      backToBooks: t(language, "bible.backToBooks"),
      backToChapters: t(language, "bible.backToChapters"),
      chapterCount: t(language, "bible.chapterCount"),
      verseCount: t(language, "bible.verses"),
      readingProgress: t(language, "bible.readingProgress"),
      offlineTitle: t(language, "bible.offline.title"),
      offlineBody: t(language, "bible.offline.body"),
      translation: t(language, "bible.translation"),
      loadError: t(language, "bible.loadError"),
      searchEyebrow: t(language, "bible.search.eyebrow"),
      searchTitle: t(language, "bible.search.title"),
      searchPlaceholder: t(language, "bible.search.placeholder"),
      searchHelp: t(language, "bible.search.help"),
      searchResults: t(language, "bible.search.results"),
      noSearchResults: t(language, "bible.search.empty"),
      searchError: t(language, "bible.search.error"),
      resultBook: t(language, "bible.result.book"),
      resultChapter: t(language, "bible.result.chapter"),
      resultVerse: t(language, "bible.result.verse"),
      resultKeyword: t(language, "bible.result.keyword"),
      openResult: t(language, "bible.result.open")
    },
    status,
    search: {
      ...search,
      draft: searchDraft
    },
    books: bibleRepository.getBooks().map(toBookSummary),
    book: book ? toBookDetail(book) : null,
    chapters: book ? book.chapters.map((item) => toChapterSummary(book, item)) : [],
    chapter: chapter ? toChapterDetail(book, chapter) : null
  };
}

function getScreen(book, chapter) {
  if (chapter) {
    return "reader";
  }

  if (book) {
    return "chapters";
  }

  return "books";
}

function toBookSummary(book) {
  return {
    id: book.id,
    title: book.title,
    testament: book.testament,
    summary: book.summary,
    iconName: book.iconName,
    chapterCount: book.chapterCount
  };
}

function toBookDetail(book) {
  return {
    ...toBookSummary(book),
    chapters: book.chapters
  };
}

function toChapterSummary(book, chapter) {
  return {
    bookId: book.id,
    bookTitle: book.title,
    number: chapter.number,
    title: chapter.title,
    summary: chapter.summary,
    reference: chapter.reference,
    verseCount: chapter.verseCount
  };
}

function toChapterDetail(book, chapter) {
  const chapterIndex = book.chapters.findIndex((item) => item.number === chapter.number);
  const progress = Math.round(((chapterIndex + 1) / Math.max(book.chapterCount, 1)) * 100);

  return {
    ...toChapterSummary(book, chapter),
    verses: chapter.verses,
    progress
  };
}
