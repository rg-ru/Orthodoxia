import { t } from "../../../shared/i18n.js";
import { saintsData } from "../data/saintsData.js";

export function getSaintsModel({
  language = "en",
  query = "",
  saintId = ""
} = {}) {
  const selectedSaint = saintsData.saints.find((saint) => saint.id === saintId) ?? null;
  const searchQuery = query.trim().toLowerCase();
  const filteredSaints = searchQuery
    ? saintsData.saints.filter((saint) =>
      `${saint.name} ${saint.feastDay} ${saint.summary} ${saint.quote}`.toLowerCase().includes(searchQuery)
    )
    : saintsData.saints;

  return {
    screen: selectedSaint ? "detail" : "list",
    overview: {
      title: t(language, "saints.title"),
      body: t(language, "saints.body")
    },
    labels: {
      biographies: t(language, "saints.biographies"),
      lives: t(language, "saints.lives"),
      searchTitle: t(language, "saints.search.title"),
      searchPlaceholder: t(language, "saints.search.placeholder"),
      noResults: t(language, "saints.noResults"),
      feastDay: t(language, "saints.feastDay"),
      biography: t(language, "saints.biography"),
      quote: t(language, "saints.quote"),
      readLife: t(language, "saints.readLife"),
      backToList: t(language, "saints.backToList")
    },
    query,
    saints: filteredSaints,
    selectedSaint
  };
}
