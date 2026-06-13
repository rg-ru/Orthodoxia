import { t } from "../../../shared/i18n.js";
import { saintRepository } from "../data/SaintRepository.js?v=15";

export function getSaintsModel({
  language = "en",
  query = "",
  saintId = ""
} = {}) {
  const selectedSaint = saintRepository.getSaint(saintId);
  const filteredSaints = saintRepository.search({ query });

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
    selectedSaint,
    categories: saintRepository.getCategories(),
    status: saintRepository.getStatus()
  };
}
