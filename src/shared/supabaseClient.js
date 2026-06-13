import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { assertSupabaseConfig, getSupabaseConfig } from "./supabaseConfig.js?v=16";

let supabaseClient = null;

export function isSupabaseConfigured() {
  return getSupabaseConfig().isConfigured;
}

export function getSupabaseClient() {
  const config = assertSupabaseConfig();
  if (!supabaseClient) {
    supabaseClient = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce"
      },
      db: {
        schema: "public"
      },
      global: {
        headers: {
          "x-application-name": "orthodoxia"
        }
      }
    });
  }

  return supabaseClient;
}

export function resetSupabaseClientForTests() {
  supabaseClient = null;
}
