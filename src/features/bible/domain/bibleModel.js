import { t } from "../../../shared/i18n.js";
import { bibleData } from "../data/bibleData.js";

export function getBibleModel({
  query = "",
  language = "en",
  bookId = "",
  chapterNumber = ""
} = {}) {
  const book = bibleData.books.find((item) => item.id === bookId) ?? null;
  const normalizedChapterNumber = Number(chapterNumber);
  const chapter = book?.chapters.find((item) => item.number === normalizedChapterNumber) ?? null;
  const searchQuery = query.trim().toLowerCase();
  const searchResults = searchQuery ? getSearchResults(searchQuery) : [];

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
      searchEyebrow: t(language, "bible.search.eyebrow"),
      searchTitle: t(language, "bible.search.title"),
      searchPlaceholder: t(language, "bible.search.placeholder"),
      searchResults: t(language, "bible.searchResults"),
      noSearchResults: t(language, "bible.noSearchResults"),
      readingPlan: t(language, "bible.readingPlan"),
      readingPlanBody: t(language, "bible.readingPlan.body"),
      continueReading: t(language, "bible.continueReading"),
      openBook: t(language, "bible.openBook"),
      openChapter: t(language, "bible.openChapter"),
      backToBooks: t(language, "bible.backToBooks"),
      backToChapters: t(language, "bible.backToChapters"),
      chapterCount: t(language, "bible.chapterCount"),
      verses: t(language, "bible.verses"),
      readingProgress: t(language, "bible.readingProgress")
    },
    query,
    books: bibleData.books.map((item) => ({
      id: item.id,
      title: item.title,
      testament: item.testament,
      summary: item.summary,
      iconName: item.iconName,
      chapterCount: item.chapters.length
    })),
    readingPlan: bibleData.readingPlan.map((item) => ({
      ...item,
      reference: getReference(item.bookId, item.chapterNumber)
    })),
    book,
    chapter: chapter ? withChapterDetails(book, chapter) : null,
    searchResults
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

function withChapterDetails(book, chapter) {
  const chapterIndex = book.chapters.findIndex((item) => item.number === chapter.number);
  const progress = Math.round(((chapterIndex + 1) / book.chapters.length) * 100);

  return {
    ...chapter,
    bookId: book.id,
    bookTitle: book.title,
    reference: `${book.title} ${chapter.number}`,
    progress
  };
}

function getSearchResults(searchQuery) {
  return bibleData.books.flatMap((book) =>
    book.chapters.flatMap((chapter) =>
      chapter.verses.map((verse) => ({
        id: `${book.id}-${chapter.number}-${verse.number}`,
        bookId: book.id,
        chapterNumber: chapter.number,
        verseNumber: verse.number,
        reference: `${book.title} ${chapter.number}:${verse.number}`,
        title: `${book.title} ${chapter.number}`,
        body: verse.text
      }))
    )
  ).filter((result) =>
    `${result.reference} ${result.title} ${result.body}`.toLowerCase().includes(searchQuery)
  ).slice(0, 6);
}

function getReference(bookId, chapterNumber) {
  const book = bibleData.books.find((item) => item.id === bookId);
  if (!book) {
    return "";
  }

  return `${book.title} ${chapterNumber}`;
}
