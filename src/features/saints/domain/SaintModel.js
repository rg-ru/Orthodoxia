const DEFAULT_CATEGORY = "saint";
const DEFAULT_ICON = "church";

export class SaintModel {
  constructor({
    id = "",
    name = "",
    biographyShort = "",
    biographyLong = [],
    feastDay = "",
    quote = "",
    category = DEFAULT_CATEGORY,
    iconName = DEFAULT_ICON,
    iconUrl = ""
  } = {}) {
    const longBiography = normalizeBiographyLong(biographyLong);

    this.id = String(id);
    this.name = String(name);
    this.biographyShort = String(biographyShort);
    this.biographyLong = longBiography.length ? longBiography : getFallbackBiography(this.biographyShort);
    this.feastDay = String(feastDay);
    this.quote = String(quote);
    this.category = normalizeCategory(category);
    this.iconName = String(iconName || DEFAULT_ICON);
    this.iconUrl = String(iconUrl || "");

    // Compatibility with the existing Saints presentation layer.
    this.summary = this.biographyShort;
    this.biography = this.biographyLong;
    this.searchText = normalizeSearch([
      this.name,
      this.feastDay,
      this.category,
      this.biographyShort,
      this.biographyLong.join(" "),
      this.quote
    ].join(" "));

    Object.freeze(this.biographyLong);
    Object.freeze(this);
  }

  static fromLocalJson(record = {}) {
    return SaintModel.fromRecord(record);
  }

  static fromLegacy(record = {}) {
    return SaintModel.fromRecord(record);
  }

  static fromSupabaseRow(row = {}) {
    return new SaintModel({
      id: row.id,
      name: row.name,
      biographyShort: row.short_biography ?? getShortBiography(row.biography),
      biographyLong: row.long_biography ?? row.biography,
      feastDay: row.feast_day,
      quote: row.quote,
      category: row.category,
      iconName: row.icon_name,
      iconUrl: row.icon_url
    });
  }

  static fromRecord(record = {}) {
    const biography = record.biography ?? {};

    return new SaintModel({
      id: record.id,
      name: record.name,
      biographyShort: record.biographyShort ?? record.shortBiography ?? biography.short ?? record.summary,
      biographyLong: record.biographyLong ?? record.longBiography ?? biography.long ?? biography,
      feastDay: record.feastDay ?? record.feast_day,
      quote: record.quote,
      category: record.category,
      iconName: record.iconName ?? record.icon_name,
      iconUrl: record.iconUrl ?? record.icon_url
    });
  }

  toSupabaseRow() {
    const longBiography = this.biographyLong.join("\n\n");

    return {
      id: this.id,
      name: this.name,
      biography: longBiography,
      short_biography: this.biographyShort,
      long_biography: longBiography,
      feast_day: this.feastDay,
      quote: this.quote,
      category: this.category,
      icon_url: this.iconUrl
    };
  }
}

export function normalizeCategory(value) {
  const normalized = String(value || DEFAULT_CATEGORY)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || DEFAULT_CATEGORY;
}

export function normalizeSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeBiographyLong(value) {
  if (Array.isArray(value)) {
    return value.map((paragraph) => String(paragraph).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  }

  if (value && typeof value === "object") {
    return normalizeBiographyLong(value.long);
  }

  return [];
}

function getFallbackBiography(biographyShort) {
  return biographyShort ? [biographyShort] : [];
}

function getShortBiography(value) {
  const paragraphs = normalizeBiographyLong(value);
  return paragraphs[0] ?? "";
}
