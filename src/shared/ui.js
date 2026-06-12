import { escapeHtml, formatPercent } from "./html.js";

export function icon(name) {
  return `<span class="material-symbols-rounded" aria-hidden="true">${escapeHtml(name)}</span>`;
}

export function pageHeading(title, body) {
  return `
    <div class="page-heading">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(body)}</p>
    </div>
  `;
}

export function card({ eyebrow, title, body, iconName, className = "", content = "" }) {
  const iconMarkup = iconName ? icon(iconName) : "";
  return `
    <article class="card ${escapeHtml(className)}">
      <div class="card-header">
        <div>
          ${eyebrow ? `<p class="card-eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
          <h3 class="card-title">${escapeHtml(title)}</h3>
        </div>
        ${iconMarkup}
      </div>
      ${body ? `<p class="card-body">${escapeHtml(body)}</p>` : ""}
      ${content}
    </article>
  `;
}

export function readingProgress(value, label = "Reading progress") {
  return `
    <div class="reading-progress" aria-label="${escapeHtml(label)}">
      <span style="--progress: ${formatPercent(value)}"></span>
    </div>
  `;
}

export function quietList(items) {
  return `
    <ul class="quiet-list">
      ${items.map((item) => `
        <li>
          <strong>${escapeHtml(item.title)}</strong>
          <span class="meta-line">${escapeHtml(item.body)}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

export function actionButton({ label, iconName, route, action }) {
  const routeAttribute = route ? `data-route="${escapeHtml(route)}"` : "";
  const actionAttribute = action ? `data-action="${escapeHtml(action)}"` : "";
  return `
    <button class="text-button" type="button" ${routeAttribute} ${actionAttribute}>
      ${icon(iconName)}
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}
