import { bibleRepository } from "../../bible/data/BibleRepository.js?v=11";
import { BibleSearchService } from "../../bible/domain/BibleSearchService.js?v=11";
import { calendarData } from "../../calendar/data/calendarData.js";
import { prayerData } from "../../prayerBook/data/prayerData.js";
import { saintsData } from "../../saints/data/saintsData.js";
import { getLocale } from "../../../shared/i18n.js?v=12";
import { GlobalSearchResult } from "./GlobalSearchResult.js?v=12";

const GROUPS = ["bible", "saints", "prayers", "calendar"];
const GROUP_LIMIT = 6;
const bibleSearchService = new BibleSearchService(bibleRepository);

export class GlobalSearchService {
  constructor() {
    this.indexKey = "";
    this.entries = [];
  }

  search(rawQuery, options = {}) {
    const query = cleanQuery(rawQuery);
    const language = options.language ?? "en";

    if (!query) {
      return {
        query: "",
        state: "idle",
        groups: createEmptyGroups(),
        error: ""
      };
    }

    try {
      const tokens = tokenize(query);
      if (!tokens.length) {
        return {
          query,
          state: "idle",
          groups: createEmptyGroups(),
          error: ""
        };
      }

      const groups = createEmptyGroups();

      for (const result of searchBible(query)) {
        groups.bible.results.push(result);
      }

      this.ensureIndex(language);
      const indexedResults = this.entries
        .map((entry) => toScoredResult(entry, tokens))
        .filter(Boolean)
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));

      for (const result of indexedResults) {
        if (groups[result.group].results.length < GROUP_LIMIT) {
          groups[result.group].results.push(result);
        }
      }

      for (const group of Object.values(groups)) {
        group.count = group.results.length;
      }

      const hasResults = Object.values(groups).some((group) => group.count > 0);

      return {
        query,
        state: hasResults ? "results" : "empty",
        groups,
        error: ""
      };
    } catch (error) {
      return {
        query,
        state: "error",
        groups: createEmptyGroups(),
        error: error instanceof Error ? error.message : "Global search failed."
      };
    }
  }

  ensureIndex(language) {
    const bibleStatus = bibleRepository.getStatus();
    const nextIndexKey = `${language}:${bibleStatus.version}:${bibleStatus.source}`;

    if (nextIndexKey === this.indexKey) {
      return;
    }

    this.entries = [
      ...buildSaintEntries(),
      ...buildPrayerEntries(),
      ...buildCalendarEntries(language)
    ];
    this.indexKey = nextIndexKey;
  }
}

function createEmptyGroups() {
  return Object.fromEntries(GROUPS.map((group) => [group, { id: group, count: 0, results: [] }]));
}

function searchBible(query) {
  return bibleSearchService.search(query, { limit: GROUP_LIMIT }).results.map((result) =>
    new GlobalSearchResult({
      id: `bible:${result.id}`,
      group: "bible",
      type: result.type,
      title: result.reference,
      subtitle: result.subtitle || result.bookTitle,
      excerpt: result.excerpt,
      route: "bible",
      iconName: "auto_stories",
      payload: {
        bibleBookId: result.bookId,
        bibleChapterNumber: result.chapterNumber || ""
      },
      score: result.score + 100
    })
  );
}

function buildSaintEntries() {
  return saintsData.saints.map((saint) =>
    createEntry({
      id: `saints:${saint.id}`,
      group: "saints",
      type: "saint",
      title: saint.name,
      subtitle: saint.feastDay,
      excerpt: saint.summary,
      route: "saints",
      iconName: saint.iconName,
      payload: {
        saintId: saint.id
      },
      searchText: `${saint.name} ${saint.feastDay} ${saint.summary} ${saint.biography.join(" ")} ${saint.quote}`
    })
  );
}

function buildPrayerEntries() {
  return prayerData.categories.flatMap((category) => {
    const categoryEntry = createEntry({
      id: `prayers:${category.id}`,
      group: "prayers",
      type: "prayerCategory",
      title: category.title,
      subtitle: `${category.prayers.length} prayers`,
      excerpt: category.summary,
      route: "prayer",
      iconName: category.iconName,
      payload: {
        prayerCategoryId: category.id,
        prayerId: ""
      },
      searchText: `${category.title} ${category.summary}`
    });

    const prayerEntries = category.prayers.map((prayer) =>
      createEntry({
        id: `prayers:${category.id}:${prayer.id}`,
        group: "prayers",
        type: "prayer",
        title: prayer.title,
        subtitle: category.title,
        excerpt: prayer.paragraphs[0] ?? category.summary,
        route: "prayer",
        iconName: category.iconName,
        payload: {
          prayerCategoryId: category.id,
          prayerId: prayer.id
        },
        searchText: `${category.title} ${category.summary} ${prayer.title} ${prayer.duration} ${prayer.paragraphs.join(" ")}`
      })
    );

    return [categoryEntry, ...prayerEntries];
  });
}

function buildCalendarEntries(language) {
  const locale = getLocale(language);

  return Object.entries(calendarData.days).map(([dateKey, day]) => {
    const dateLabel = formatCalendarDate(dateKey, locale);
    const feasts = day.feasts ?? [];
    const primaryFeast = feasts[0] ?? "Calendar day";

    return createEntry({
      id: `calendar:${dateKey}`,
      group: "calendar",
      type: "calendarDay",
      title: primaryFeast,
      subtitle: dateLabel,
      excerpt: day.note,
      route: "calendar",
      iconName: "calendar_month",
      payload: {
        calendarSelectedDate: dateKey
      },
      searchText: `${dateKey} ${dateLabel} ${feasts.join(" ")} ${day.fasting} ${day.readings.join(" ")} ${day.troparion} ${day.kontakion} ${day.note}`
    });
  });
}

function createEntry({
  id,
  group,
  type,
  title,
  subtitle,
  excerpt,
  route,
  iconName,
  payload,
  searchText
}) {
  const textKey = normalize(searchText);

  return {
    id,
    group,
    type,
    title,
    subtitle,
    excerpt,
    route,
    iconName,
    payload,
    textKey,
    tokenSet: new Set(textKey.split(" ").filter(Boolean))
  };
}

function toScoredResult(entry, tokens) {
  if (!tokens.every((token) => tokenMatches(entry, token))) {
    return null;
  }

  let score = getGroupBaseScore(entry.group);
  const normalizedTitle = normalize(entry.title);
  const normalizedSubtitle = normalize(entry.subtitle);
  const normalizedQuery = tokens.join(" ");

  if (normalizedTitle === normalizedQuery) {
    score += 500;
  } else if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 320;
  }

  if (normalizedSubtitle.includes(normalizedQuery)) {
    score += 160;
  }

  return new GlobalSearchResult({
    ...entry,
    score: score + tokens.length * 12
  });
}

function getGroupBaseScore(group) {
  const scores = {
    saints: 620,
    prayers: 560,
    calendar: 520
  };

  return scores[group] ?? 400;
}

function tokenMatches(entry, token) {
  if (/^\d+$/.test(token)) {
    return entry.tokenSet.has(token);
  }

  return entry.textKey.includes(token);
}

function formatCalendarDate(dateKey, locale) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(year, month - 1, day));
}

function cleanQuery(query) {
  return String(query ?? "").trim().replace(/\s+/g, " ");
}

function tokenize(query) {
  return normalize(query).split(" ").filter(Boolean);
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export const globalSearchService = new GlobalSearchService();
