export class GlobalSearchResult {
  constructor({
    id,
    group,
    type,
    title,
    subtitle,
    excerpt,
    route,
    iconName,
    payload = {},
    score = 0
  }) {
    this.id = String(id ?? "");
    this.group = String(group ?? "");
    this.type = String(type ?? "");
    this.title = String(title ?? "");
    this.subtitle = String(subtitle ?? "");
    this.excerpt = String(excerpt ?? "");
    this.route = String(route ?? "");
    this.iconName = String(iconName ?? "search");
    this.payload = Object.freeze({ ...payload });
    this.score = Number(score);
    Object.freeze(this);
  }
}
