import { t } from "../../../shared/i18n.js";

export function getSaintsModel(language = "en") {
  return {
    overview: {
      title: t(language, "saints.title"),
      body: t(language, "saints.body")
    },
    labels: {
      biographies: t(language, "saints.biographies"),
      lives: t(language, "saints.lives"),
      quotes: t(language, "saints.quotes"),
      from: t(language, "saints.from")
    },
    saints: [
      { title: t(language, "saints.seraphim"), body: t(language, "saints.seraphim.body") },
      { title: t(language, "saints.mary"), body: t(language, "saints.mary.body") },
      { title: t(language, "saints.chrysostom"), body: t(language, "saints.chrysostom.body") }
    ],
    quotes: [
      { title: t(language, "saints.watchfulness"), body: t(language, "saints.watchfulness.body") },
      { title: t(language, "saints.repentance"), body: t(language, "saints.repentance.body") }
    ]
  };
}
