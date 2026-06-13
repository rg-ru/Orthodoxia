export class SearchResult {
  constructor({
    id,
    type,
    bookId,
    bookTitle,
    chapterNumber = "",
    verseNumber = "",
    reference,
    title,
    subtitle,
    excerpt,
    score = 0
  }) {
    this.id = String(id ?? "");
    this.type = String(type ?? "keyword");
    this.bookId = String(bookId ?? "");
    this.bookTitle = String(bookTitle ?? "");
    this.chapterNumber = chapterNumber === "" ? "" : Number(chapterNumber);
    this.verseNumber = verseNumber === "" ? "" : Number(verseNumber);
    this.reference = String(reference ?? "");
    this.title = String(title ?? "");
    this.subtitle = String(subtitle ?? "");
    this.excerpt = String(excerpt ?? "");
    this.score = Number(score);
    Object.freeze(this);
  }
}
