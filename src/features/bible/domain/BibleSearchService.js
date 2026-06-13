import { SearchResult } from "./SearchResult.js?v=11";

const DEFAULT_LIMIT = 24;
const MIN_QUERY_LENGTH = 1;

export class BibleSearchService {
  constructor(repository) {
    this.repository = repository;
    this.indexKey = "";
    this.entries = [];
  }

  search(rawQuery, options = {}) {
    const query = String(rawQuery ?? "").trim();
    const limit = Number(options.limit ?? DEFAULT_LIMIT);

    if (query.length < MIN_QUERY_LENGTH) {
      return {
        query: "",
        state: "idle",
        results: [],
        error: ""
      };
    }

    try {
      this.ensureIndex();
      const normalizedQuery = normalize(query);
      const tokens = tokenize(query);

      if (!tokens.length) {
        return {
          query,
          state: "idle",
          results: [],
          error: ""
        };
      }

      const parsedReference = parseReference(query);
      const results = this.entries
        .map((entry) => toScoredResult(entry, normalizedQuery, tokens, parsedReference))
        .filter(Boolean)
        .sort((left, right) => right.score - left.score || left.reference.localeCompare(right.reference))
        .slice(0, limit);

      return {
        query,
        state: results.length ? "results" : "empty",
        results,
        error: ""
      };
    } catch (error) {
      return {
        query,
        state: "error",
        results: [],
        error: error instanceof Error ? error.message : "Bible search failed."
      };
    }
  }

  ensureIndex() {
    const status = this.repository.getStatus();
    const books = this.repository.getBooks();
    const nextIndexKey = `${status.version}:${status.source}:${books.length}`;

    if (nextIndexKey === this.indexKey) {
      return;
    }

    this.entries = buildIndex(books);
    this.indexKey = nextIndexKey;
  }
}

function buildIndex(books) {
  return books.flatMap((book) => {
    const bookEntry = createIndexEntry({
      kind: "book",
      id: `book:${book.id}`,
      bookId: book.id,
      bookTitle: book.title,
      chapterNumber: "",
      verseNumber: "",
      reference: book.title,
      title: book.title,
      subtitle: book.testament,
      excerpt: book.summary,
      bookKey: normalize(book.title),
      chapterKey: "",
      verseKey: ""
    }, `${book.title} ${book.testament} ${book.summary}`);

    const chapterEntries = book.chapters.flatMap((chapter) => {
      const chapterEntry = createIndexEntry({
        kind: "chapter",
        id: `chapter:${book.id}:${chapter.number}`,
        bookId: book.id,
        bookTitle: book.title,
        chapterNumber: chapter.number,
        verseNumber: "",
        reference: chapter.reference,
        title: chapter.reference,
        subtitle: chapter.title,
        excerpt: chapter.summary,
        bookKey: normalize(book.title),
        chapterKey: normalize(`${book.title} ${chapter.number} ${chapter.reference} chapter ${chapter.number}`),
        verseKey: ""
      }, `${book.title} ${chapter.reference} chapter ${chapter.number} ${chapter.title} ${chapter.summary}`);

      const verseEntries = chapter.verses.map((verse) => createIndexEntry({
        kind: "verse",
        id: `verse:${book.id}:${chapter.number}:${verse.number}`,
        bookId: book.id,
        bookTitle: book.title,
        chapterNumber: chapter.number,
        verseNumber: verse.number,
        reference: `${chapter.reference}:${verse.number}`,
        title: `${chapter.reference}:${verse.number}`,
        subtitle: chapter.title,
        excerpt: verse.text,
        bookKey: normalize(book.title),
        chapterKey: normalize(`${book.title} ${chapter.number} ${chapter.reference}`),
        verseKey: normalize(`${book.title} ${chapter.number} ${verse.number} ${chapter.reference} ${verse.number}`)
      }, `${book.title} ${chapter.reference} ${verse.number} ${verse.text}`));

      return [chapterEntry, ...verseEntries];
    });

    return [bookEntry, ...chapterEntries];
  });
}

function createIndexEntry(entry, searchText) {
  const textKey = normalize(searchText);

  return {
    ...entry,
    textKey,
    tokenSet: new Set(textKey.split(" ").filter(Boolean))
  };
}

function toScoredResult(entry, normalizedQuery, tokens, parsedReference) {
  const score = scoreEntry(entry, normalizedQuery, tokens, parsedReference);

  if (!score) {
    return null;
  }

  return new SearchResult({
    id: entry.id,
    type: getResultType(entry, normalizedQuery, parsedReference),
    bookId: entry.bookId,
    bookTitle: entry.bookTitle,
    chapterNumber: entry.chapterNumber,
    verseNumber: entry.verseNumber,
    reference: entry.reference,
    title: entry.title,
    subtitle: entry.subtitle,
    excerpt: entry.excerpt,
    score
  });
}

function scoreEntry(entry, normalizedQuery, tokens, parsedReference) {
  const referenceScore = scoreReference(entry, normalizedQuery, parsedReference);
  if (referenceScore) {
    return referenceScore;
  }

  if (parsedReference.verseNumber) {
    const bookMatches = entry.bookKey === parsedReference.bookName || entry.bookKey.includes(parsedReference.bookName);
    if (bookMatches && entry.kind === "chapter" && entry.chapterNumber === parsedReference.chapterNumber) {
      return 1200;
    }

    return 0;
  }

  if (entry.kind === "verse" && entry.bookKey === normalizedQuery) {
    return 0;
  }

  if (!tokens.every((token) => entry.textKey.includes(token))) {
    return 0;
  }

  if (!tokens.every((token) => tokenMatches(entry, token))) {
    return 0;
  }

  const baseScores = {
    book: 520,
    chapter: 520,
    verse: 360
  };

  let score = baseScores[entry.kind] ?? 200;

  if (entry.textKey.startsWith(normalizedQuery)) {
    score += 160;
  }

  if (entry.bookKey === normalizedQuery) {
    score += 420;
  } else if (entry.bookKey.startsWith(normalizedQuery)) {
    score += 260;
  }

  if (entry.chapterKey === normalizedQuery || entry.verseKey === normalizedQuery) {
    score += 360;
  }

  if (entry.kind === "verse" && normalize(entry.excerpt).includes(normalizedQuery)) {
    score += 280;
  }

  return score + tokens.length * 8;
}

function scoreReference(entry, normalizedQuery, parsedReference) {
  if (parsedReference.bookName) {
    const bookMatches = entry.bookKey === parsedReference.bookName || entry.bookKey.includes(parsedReference.bookName);
    if (!bookMatches) {
      return 0;
    }

    if (parsedReference.verseNumber && entry.kind === "verse") {
      return entry.chapterNumber === parsedReference.chapterNumber && entry.verseNumber === parsedReference.verseNumber ? 2400 : 0;
    }

    if (parsedReference.chapterNumber && entry.kind === "chapter") {
      return entry.chapterNumber === parsedReference.chapterNumber ? 2100 : 0;
    }

    if (parsedReference.chapterNumber && entry.kind === "verse") {
      return entry.chapterNumber === parsedReference.chapterNumber ? 900 : 0;
    }
  }

  if (entry.kind === "chapter" && entry.chapterKey === normalizedQuery) {
    return 1800;
  }

  if (entry.kind === "verse" && entry.verseKey === normalizedQuery) {
    return 2200;
  }

  return 0;
}

function getResultType(entry, normalizedQuery, parsedReference) {
  if (entry.kind !== "verse") {
    return entry.kind;
  }

  if (parsedReference.chapterNumber || parsedReference.verseNumber || entry.verseKey === normalizedQuery) {
    return "verse";
  }

  return "keyword";
}

function tokenMatches(entry, token) {
  if (/^\d+$/.test(token)) {
    return entry.tokenSet.has(token);
  }

  return entry.textKey.includes(token);
}

function parseReference(query) {
  const trimmed = String(query ?? "").trim();
  const verseMatch = trimmed.match(/^([1-3]?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(\d+)\s*[:.]\s*(\d+)$/);
  if (verseMatch) {
    return {
      bookName: normalize(verseMatch[1]),
      chapterNumber: Number(verseMatch[2]),
      verseNumber: Number(verseMatch[3])
    };
  }

  const chapterMatch = trimmed.match(/^([1-3]?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(\d+)$/);
  if (chapterMatch) {
    return {
      bookName: normalize(chapterMatch[1]),
      chapterNumber: Number(chapterMatch[2]),
      verseNumber: ""
    };
  }

  return {
    bookName: "",
    chapterNumber: "",
    verseNumber: ""
  };
}

function tokenize(value) {
  return normalize(value).split(" ").filter(Boolean);
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
