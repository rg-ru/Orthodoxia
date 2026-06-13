import { BibleChapter } from "./BibleChapter.js?v=11";

export class BibleBook {
  constructor({ id, title, testament, summary, iconName, chapters = [] }) {
    this.id = String(id ?? "");
    this.title = String(title ?? "");
    this.testament = String(testament ?? "");
    this.summary = String(summary ?? "");
    this.iconName = String(iconName ?? "auto_stories");
    this.chapters = chapters.map((chapter) =>
      chapter instanceof BibleChapter
        ? chapter
        : new BibleChapter({ ...chapter, bookId: this.id, bookTitle: this.title })
    );
    this.chapterCount = this.chapters.length;
    Object.freeze(this.chapters);
    Object.freeze(this);
  }
}
