const LOCAL_SAINTS_JSON_URL = new URL("./saints-local.json?v=15", import.meta.url);

export class SaintDataSource {
  constructor({
    localJsonUrl = LOCAL_SAINTS_JSON_URL,
    clientFactory = null
  } = {}) {
    this.localJsonUrl = localJsonUrl;
    this.clientFactory = clientFactory;
  }

  async loadLocalJson() {
    const response = await fetch(this.localJsonUrl, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Saints JSON request failed with ${response.status}`);
    }

    return response.json();
  }

  async loadFromSupabase() {
    if (!this.clientFactory) {
      throw new Error("Supabase client factory is not configured for saints.");
    }

    const client = this.clientFactory();
    const result = await client
      .from("saints")
      .select("id,name,biography,short_biography,long_biography,feast_day,quote,category,icon_url")
      .order("feast_day", { ascending: true })
      .order("name", { ascending: true });

    if (result.error) {
      throw result.error;
    }

    return {
      version: "supabase-saints-v1",
      source: "supabase",
      saints: result.data ?? []
    };
  }
}
