import { BibleVerse } from "./BibleVerse.js?v=11";

export class BibleChapter {
  constructor({ bookId, bookTitle, number, title, summary, verses = [] }) {
    this.bookId = String(bookId ?? "");
    this.bookTitle = String(bookTitle ?? "");
    this.number = Number(number);
    this.title = String(title ?? "");
    this.summary = String(summary ?? "");
    this.verses = verses.map((verse) => verse instanceof BibleVerse ? verse : new BibleVerse(verse));
    this.reference = `${this.bookTitle} ${this.number}`;
    this.verseCount = this.verses.length;
    Object.freeze(this.verses);
    Object.freeze(this);
  }
}
