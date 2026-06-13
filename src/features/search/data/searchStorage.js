const SEARCH_HISTORY_KEY = "orthodoxia:search:history";
const MAX_HISTORY_ITEMS = 8;

export function readSearchHistory() {
  try {
    const value = localStorage.getItem(SEARCH_HISTORY_KEY);
    const history = JSON.parse(value ?? "[]");
    return Array.isArray(history)
      ? history.filter((item) => typeof item === "string").slice(0, MAX_HISTORY_ITEMS)
      : [];
  } catch {
    return [];
  }
}

export function saveSearchQuery(query) {
  const cleanQuery = normalizeQuery(query);
  if (!cleanQuery) {
    return readSearchHistory();
  }

  const nextHistory = [
    cleanQuery,
    ...readSearchHistory().filter((item) => item.toLowerCase() !== cleanQuery.toLowerCase())
  ].slice(0, MAX_HISTORY_ITEMS);

  writeSearchHistory(nextHistory);
  return nextHistory;
}

export function clearSearchHistory() {
  writeSearchHistory([]);
  return [];
}

function writeSearchHistory(history) {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Search history is optional; search itself remains fully local and available.
  }
}

function normalizeQuery(query) {
  return String(query ?? "").trim().replace(/\s+/g, " ");
}
