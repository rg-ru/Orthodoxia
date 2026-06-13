import { SaintDataSource } from "./SaintDataSource.js?v=15";
import { saintsData } from "./saintsData.js?v=15";
import { SaintModel, normalizeCategory, normalizeSearch } from "../domain/SaintModel.js?v=15";

const STORAGE_KEY = "orthodoxia:saints:dataset";

export class SaintRepository {
  constructor({
    dataSource = new SaintDataSource(),
    initialDataset = saintsData
  } = {}) {
    this.dataSource = dataSource;
    this.loadState = "ready";
    this.loadError = "";
    this.source = "bundled";
    const storedDataset = readStoredDataset();
    this.setDataset(storedDataset ?? initialDataset, storedDataset?.source ?? this.source);
  }

  async loadLocalJson() {
    this.loadState = "loading";
    this.loadError = "";

    try {
      const dataset = await this.dataSource.loadLocalJson();
      this.setDataset(dataset, "local-json");
      writeStoredDataset(dataset);
      this.loadState = "ready";
      return { ok: true, source: this.source };
    } catch (error) {
      this.loadState = "ready";
      this.loadError = error instanceof Error ? error.message : "Saints JSON could not be loaded.";
      return { ok: false, source: this.source, error: this.loadError };
    }
  }

  async loadFromSupabase(dataSource = this.dataSource) {
    this.loadState = "loading";
    this.loadError = "";

    try {
      const dataset = await dataSource.loadFromSupabase();
      this.setDataset(dataset, "supabase");
      writeStoredDataset(dataset);
      this.loadState = "ready";
      return { ok: true, source: this.source };
    } catch (error) {
      this.loadState = "ready";
      this.loadError = error instanceof Error ? error.message : "Saints could not be loaded from Supabase.";
      return { ok: false, source: this.source, error: this.loadError };
    }
  }

  getStatus() {
    return {
      loadState: this.loadState,
      loadError: this.loadError,
      source: this.source,
      version: this.version,
      count: this.saints.length
    };
  }

  getSaints() {
    return this.saints;
  }

  getSaint(saintId) {
    return this.saintById.get(String(saintId ?? "")) ?? null;
  }

  getCategories() {
    return this.categories;
  }

  searchByName(query) {
    const searchQuery = normalizeSearch(query);
    if (!searchQuery) {
      return this.saints;
    }

    return this.saints.filter((saint) => normalizeSearch(saint.name).includes(searchQuery));
  }

  searchByFeastDay(feastDay) {
    const searchQuery = normalizeSearch(feastDay);
    if (!searchQuery) {
      return this.saints;
    }

    return this.saints.filter((saint) => normalizeSearch(saint.feastDay).includes(searchQuery));
  }

  filterByCategory(category) {
    const categoryValue = String(category ?? "").trim();
    if (!categoryValue) {
      return this.saints;
    }

    const normalizedCategory = normalizeCategory(categoryValue);
    return this.saints.filter((saint) => saint.category === normalizedCategory);
  }

  search({
    query = "",
    feastDay = "",
    category = ""
  } = {}) {
    const searchQuery = normalizeSearch(query);
    const feastDayQuery = normalizeSearch(feastDay);
    const normalizedCategory = category ? normalizeCategory(category) : "";

    return this.saints.filter((saint) => {
      if (searchQuery && !saint.searchText.includes(searchQuery)) {
        return false;
      }

      if (feastDayQuery && !normalizeSearch(saint.feastDay).includes(feastDayQuery)) {
        return false;
      }

      if (normalizedCategory && saint.category !== normalizedCategory) {
        return false;
      }

      return true;
    });
  }

  setDataset(dataset, source) {
    const safeDataset = normalizeDataset(dataset);
    this.version = safeDataset.version;
    this.saints = safeDataset.saints;
    this.saintById = new Map(this.saints.map((saint) => [saint.id, saint]));
    this.categories = Object.freeze([...new Set(this.saints.map((saint) => saint.category))].sort());
    this.source = source;
    Object.freeze(this.saints);
  }
}

function normalizeDataset(dataset) {
  const rawSaints = Array.isArray(dataset)
    ? dataset
    : Array.isArray(dataset?.saints)
      ? dataset.saints
      : [];

  if (!rawSaints.length && dataset !== saintsData) {
    return normalizeDataset(saintsData);
  }

  return {
    version: String(dataset?.version ?? saintsData.version),
    source: String(dataset?.source ?? saintsData.source),
    saints: rawSaints.map((record) => createSaint(record)).filter((saint) => saint.id && saint.name)
  };
}

function createSaint(record) {
  if (record?.feast_day || record?.short_biography || record?.long_biography) {
    return SaintModel.fromSupabaseRow(record);
  }

  if (Array.isArray(record?.biography) || record?.summary) {
    return SaintModel.fromLegacy(record);
  }

  return SaintModel.fromLocalJson(record);
}

function readStoredDataset() {
  try {
    const storage = globalThis.window?.localStorage;
    const value = storage?.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeStoredDataset(dataset) {
  try {
    globalThis.window?.localStorage?.setItem(STORAGE_KEY, JSON.stringify(dataset));
  } catch {
    // The service worker cache remains the offline source if storage is full or unavailable.
  }
}

export const saintRepository = new SaintRepository();
