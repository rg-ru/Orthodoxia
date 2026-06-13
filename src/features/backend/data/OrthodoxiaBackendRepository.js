import { getSupabaseClient } from "../../../shared/supabaseClient.js?v=16";
import { backendTables, defaultRemoteSettings } from "../domain/backendSchema.js?v=14";

export class OrthodoxiaBackendRepository {
  constructor({ clientFactory = getSupabaseClient } = {}) {
    this.clientFactory = clientFactory;
  }

  get client() {
    return this.clientFactory();
  }

  async listSaints() {
    return unwrap(
      await this.client
        .from(backendTables.saints)
        .select("*")
        .order("feast_day", { ascending: true })
        .order("name", { ascending: true })
    );
  }

  async listPrayers(category = "") {
    let query = this.client
      .from(backendTables.prayers)
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    return unwrap(await query);
  }

  async listBibleBooks() {
    return unwrap(
      await this.client
        .from(backendTables.bibleBooks)
        .select("*")
        .order("book_order", { ascending: true })
        .order("name", { ascending: true })
    );
  }

  async listBibleChapters(bookId) {
    return unwrap(
      await this.client
        .from(backendTables.bibleChapters)
        .select("*")
        .eq("book_id", bookId)
        .order("chapter_number", { ascending: true })
    );
  }

  async listBibleVerses(chapterId) {
    return unwrap(
      await this.client
        .from(backendTables.bibleVerses)
        .select("*")
        .eq("chapter_id", chapterId)
        .order("verse_number", { ascending: true })
    );
  }

  async getUserProfile(userId) {
    return unwrapSingle(
      await this.client
        .from(backendTables.users)
        .select("*")
        .eq("id", userId)
        .single()
    );
  }

  async updateUserProfile({ userId, displayName }) {
    return unwrapSingle(
      await this.client
        .from(backendTables.users)
        .update({ display_name: displayName })
        .eq("id", userId)
        .select()
        .single()
    );
  }

  async listFavorites(userId) {
    return unwrap(
      await this.client
        .from(backendTables.favorites)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
    );
  }

  async addFavorite({ userId, itemType, itemId }) {
    return unwrapSingle(
      await this.client
        .from(backendTables.favorites)
        .upsert({ user_id: userId, item_type: itemType, item_id: itemId }, { onConflict: "user_id,item_type,item_id" })
        .select()
        .single()
    );
  }

  async removeFavorite({ userId, itemType, itemId }) {
    return unwrap(
      await this.client
        .from(backendTables.favorites)
        .delete()
        .eq("user_id", userId)
        .eq("item_type", itemType)
        .eq("item_id", itemId)
    );
  }

  async listNotes(userId) {
    return unwrap(
      await this.client
        .from(backendTables.notes)
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
    );
  }

  async saveNote({ id, userId, title, content }) {
    const payload = { user_id: userId, title, content };
    if (id) {
      payload.id = id;
    }

    return unwrapSingle(
      await this.client
        .from(backendTables.notes)
        .upsert(payload)
        .select()
        .single()
    );
  }

  async listPrayerLists(userId) {
    return unwrap(
      await this.client
        .from(backendTables.prayerLists)
        .select("*, prayer_list_items(*)")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
    );
  }

  async savePrayerList({ id, userId, title, description = "" }) {
    const payload = { user_id: userId, title, description };
    if (id) {
      payload.id = id;
    }

    return unwrapSingle(
      await this.client
        .from(backendTables.prayerLists)
        .upsert(payload)
        .select()
        .single()
    );
  }

  async listBibleBookmarks(userId) {
    return unwrap(
      await this.client
        .from(backendTables.bibleBookmarks)
        .select("*, bible_verses(*, bible_chapters(*, bible_books(*)))")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
    );
  }

  async addBibleBookmark({ userId, verseId, label = "" }) {
    return unwrapSingle(
      await this.client
        .from(backendTables.bibleBookmarks)
        .upsert({ user_id: userId, verse_id: verseId, label }, { onConflict: "user_id,verse_id" })
        .select()
        .single()
    );
  }

  async getSettings(userId) {
    return unwrapSingle(
      await this.client
        .from(backendTables.settings)
        .select("*")
        .eq("user_id", userId)
        .single()
    );
  }

  async upsertSettings({ userId, settings }) {
    return unwrapSingle(
      await this.client
        .from(backendTables.settings)
        .upsert({
          user_id: userId,
          ...defaultRemoteSettings,
          ...settings
        })
        .select()
        .single()
    );
  }
}

function unwrap(result) {
  if (result.error) {
    throw result.error;
  }

  return result.data ?? [];
}

function unwrapSingle(result) {
  if (result.error) {
    throw result.error;
  }

  return result.data ?? null;
}

export const orthodoxiaBackendRepository = new OrthodoxiaBackendRepository();
