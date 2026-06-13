const DEFAULT_SUPABASE_URL = "https://txspopmkxaklvoufxmiz.supabase.co";
const CONFIG_ERROR = "Supabase is not configured. Add the project URL and publishable anon key before using backend features.";

export function getSupabaseConfig() {
  const globalConfig = getGlobalConfig();
  const metaConfig = getMetaConfig();
  const localConfig = getLocalConfig();
  const url = normalizeValue(globalConfig.url || metaConfig.url || localConfig.url || DEFAULT_SUPABASE_URL);
  const anonKey = normalizeValue(globalConfig.anonKey || metaConfig.anonKey || localConfig.anonKey);
  const missing = [
    url ? "" : "url",
    anonKey ? "" : "anonKey"
  ].filter(Boolean);

  return {
    url,
    anonKey,
    isConfigured: missing.length === 0,
    missing,
    errorMessage: missing.length ? CONFIG_ERROR : ""
  };
}

export function assertSupabaseConfig() {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    throw new Error(config.errorMessage);
  }

  return config;
}

function getGlobalConfig() {
  const config = globalThis.ORTHODOXIA_SUPABASE ?? {};
  return {
    url: globalThis.ORTHODOXIA_SUPABASE_URL ?? config.url,
    anonKey: globalThis.ORTHODOXIA_SUPABASE_ANON_KEY ?? globalThis.ORTHODOXIA_SUPABASE_PUBLISHABLE_KEY ?? config.anonKey ?? config.publishableKey
  };
}

function getMetaConfig() {
  const documentRef = globalThis.document;
  if (!documentRef) {
    return {};
  }

  return {
    url: documentRef.querySelector('meta[name="orthodoxia-supabase-url"]')?.getAttribute("content"),
    anonKey: documentRef.querySelector('meta[name="orthodoxia-supabase-anon-key"]')?.getAttribute("content")
      ?? documentRef.querySelector('meta[name="orthodoxia-supabase-publishable-key"]')?.getAttribute("content")
  };
}

function getLocalConfig() {
  try {
    const saved = JSON.parse(globalThis.localStorage?.getItem("orthodoxia:supabase:config") ?? "null");
    if (!saved || typeof saved !== "object") {
      return {};
    }

    return {
      url: saved.url,
      anonKey: saved.anonKey ?? saved.publishableKey
    };
  } catch {
    return {};
  }
}

function normalizeValue(value) {
  return typeof value === "string" ? value.trim() : "";
}
