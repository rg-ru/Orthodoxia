import { bibleData } from "../data/bibleData.js";

export function getBibleModel(query = "") {
  const searchQuery = query.trim().toLowerCase();
  const results = searchQuery
    ? bibleData.passages.filter((passage) =>
      `${passage.title} ${passage.body}`.toLowerCase().includes(searchQuery)
    )
    : bibleData.passages;

  return {
    ...bibleData,
    query,
    results
  };
}
