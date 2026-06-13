# Orthodoxia Supabase Foundation

This folder contains the production database foundation for Orthodoxia.

## Apply The Schema

Run the migration with the Supabase CLI or paste it into the Supabase SQL editor:

```bash
supabase db push
```

The migration creates:

- `users`
- `saints`
- `prayers`
- `bible_books`
- `bible_chapters`
- `bible_verses`
- `favorites`
- `notes`
- `prayer_lists`
- `prayer_list_items`
- `bible_bookmarks`
- `settings`

It also enables Row Level Security on every public table and adds policies for:

- public read access to Orthodox content tables
- authenticated user access to their own profile, favorites, notes, prayer lists, bookmarks, and settings
- anonymous guest users through the normal authenticated role after `signInAnonymously()`

The Saints pipeline migration adds `short_biography`, `long_biography`, and `category` to prepare the local JSON model for a future Supabase content migration.

## Supabase Auth Settings

In the Supabase dashboard:

1. Enable the Email provider under Authentication.
2. Keep Magic Link or OTP enabled for email login.
3. Enable Google under Authentication providers.
4. Enable Anonymous Sign-Ins.
5. Set the Site URL to the production app URL.
6. Add local and production redirect URLs:
   - `https://rg-ru.github.io/Orthodoxia/`
   - `http://localhost:4198/`
   - `http://localhost:4199/`

## Client Configuration

The browser app reads only public Supabase values:

- Supabase URL
- Supabase publishable anon key

Do not put a service role key in the app.

Configure the app with either a global object:

```html
<script>
  window.ORTHODOXIA_SUPABASE = {
    url: "https://txspopmkxaklvoufxmiz.supabase.co",
    publishableKey: "your-publishable-anon-key"
  };
</script>
```

or meta tags:

```html
<meta name="orthodoxia-supabase-url" content="https://txspopmkxaklvoufxmiz.supabase.co">
<meta name="orthodoxia-supabase-publishable-key" content="your-publishable-anon-key">
```
