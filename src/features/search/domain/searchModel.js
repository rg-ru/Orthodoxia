import { readSearchHistory } from "../data/searchStorage.js";
import { globalSearchService } from "./GlobalSearchService.js?v=12";
import { t } from "../../../shared/i18n.js?v=12";

const groupOrder = ["bible", "saints", "prayers", "calendar"];

export function getSearchModel({
  language = "en",
  draft = "",
  query = ""
} = {}) {
  const search = globalSearchService.search(query, { language });
  const groups = groupOrder.map((groupId) => ({
    ...search.groups[groupId],
    title: t(language, `search.group.${groupId}`),
    emptyLabel: t(language, `search.group.${groupId}.empty`)
  }));

  return {
    overview: {
      title: t(language, "search.title"),
      body: t(language, "search.body")
    },
    labels: {
      inputTitle: t(language, "search.input.title"),
      inputEyebrow: t(language, "search.input.eyebrow"),
      placeholder: t(language, "search.placeholder"),
      help: t(language, "search.help"),
      recent: t(language, "search.recent"),
      clearHistory: t(language, "search.clearHistory"),
      noHistory: t(language, "search.noHistory"),
      empty: t(language, "search.empty"),
      error: t(language, "search.error"),
      open: t(language, "search.open"),
      resultsLabel: t(language, "search.resultsLabel")
    },
    draft,
    history: readSearchHistory(),
    search: {
      ...search,
      draft
    },
    groups
  };
}
