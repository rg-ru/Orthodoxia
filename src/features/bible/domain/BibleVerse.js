export class BibleVerse {
  constructor({ number, text }) {
    this.number = Number(number);
    this.text = String(text ?? "");
    Object.freeze(this);
  }
}
