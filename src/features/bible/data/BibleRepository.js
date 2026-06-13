import { BibleBook } from "../domain/BibleBook.js?v=11";
import { bibleData } from "./bibleData.js?v=11";

const STORAGE_KEY = "orthodoxia:bible:dataset";
const LOCAL_BIBLE_JSON_URL = new URL("./bible-local.json?v=11", import.meta.url);

export class BibleRepository {
  constructor() {
    this.loadState = "ready";
    this.loadError = "";
    this.source = "bundled";
    this.setDataset(readStoredDataset() ?? bibleData, this.source);
  }

  async loadLocalJson() {
    this.loadState = "loading";
    this.loadError = "";

    try {
      const response = await fetch(LOCAL_BIBLE_JSON_URL, { cache: "force-cache" });
      if (!response.ok) {
        throw new Error(`Bible JSON request failed with ${response.status}`);
      }

      const dataset = await response.json();
      this.setDataset(dataset, "local-json");
      writeStoredDataset(dataset);
      this.loadState = "ready";
      return { ok: true, source: this.source };
    } catch (error) {
      this.loadState = "ready";
      this.loadError = error instanceof Error ? error.message : "Bible JSON could not be loaded.";
      return { ok: false, source: this.source, error: this.loadError };
    }
  }

  getStatus() {
    return {
      loadState: this.loadState,
      loadError: this.loadError,
      source: this.source,
      translation: this.translation,
      version: this.version
    };
  }

  getBooks() {
    return this.books;
  }

  getBook(bookId) {
    return this.bookById.get(String(bookId ?? "")) ?? null;
  }

  getChapters(bookId) {
    return this.getBook(bookId)?.chapters ?? [];
  }

  getChapter(bookId, chapterNumber) {
    return this.chapterByReference.get(getChapterKey(bookId, chapterNumber)) ?? null;
  }

  setDataset(dataset, source) {
    const safeDataset = normalizeDataset(dataset);
    this.version = safeDataset.version;
    this.translation = safeDataset.translation;
    this.books = safeDataset.books;
    this.bookById = new Map(this.books.map((book) => [book.id, book]));
    this.chapterByReference = new Map();

    for (const book of this.books) {
      for (const chapter of book.chapters) {
        this.chapterByReference.set(getChapterKey(book.id, chapter.number), chapter);
      }
    }

    this.source = source;
    Object.freeze(this.books);
  }
}

function normalizeDataset(dataset) {
  if (!dataset || !Array.isArray(dataset.books)) {
    return normalizeDataset(bibleData);
  }

  const translation = dataset.translation ?? bibleData.translation;

  return {
    version: String(dataset.version ?? bibleData.version),
    translation: {
      id: String(translation.id ?? bibleData.translation.id),
      label: String(translation.label ?? bibleData.translation.label),
      language: String(translation.language ?? bibleData.translation.language)
    },
    books: dataset.books.map((book) => new BibleBook(book))
  };
}

function getChapterKey(bookId, chapterNumber) {
  return `${String(bookId ?? "")}:${Number(chapterNumber)}`;
}

function readStoredDataset() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch {
    return null;
  }
}

function writeStoredDataset(dataset) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
  } catch {
    // Offline JSON remains available through the service worker cache.
  }
}

export const bibleRepository = new BibleRepository();
