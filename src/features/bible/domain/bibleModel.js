import { t } from "../../../shared/i18n.js";

export function getBibleModel(query = "", language = "en") {
  const passages = [
    { title: t(language, "bible.passage.title"), body: t(language, "bible.result.john.body") },
    { title: t(language, "bible.result.psalm.title"), body: t(language, "bible.result.psalm.body") },
    { title: t(language, "bible.result.matthew.title"), body: t(language, "bible.result.matthew.body") }
  ];
  const searchQuery = query.trim().toLowerCase();
  const results = searchQuery
    ? passages.filter((passage) =>
      `${passage.title} ${passage.body}`.toLowerCase().includes(searchQuery)
    )
    : passages;

  return {
    overview: {
      title: t(language, "bible.title"),
      body: t(language, "bible.body")
    },
    labels: {
      reading: t(language, "bible.reading"),
      searchEyebrow: t(language, "bible.search.eyebrow"),
      searchTitle: t(language, "bible.search.title"),
      searchPlaceholder: t(language, "bible.search.placeholder")
    },
    passage: {
      title: t(language, "bible.passage.title"),
      body: t(language, "bible.passage.body"),
      progress: 24
    },
    passages,
    query,
    results
  };
}
