create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saints (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  biography text not null,
  feast_day text not null,
  quote text,
  icon_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  text text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bible_books (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  book_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (name)
);

create table if not exists public.bible_chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.bible_books(id) on delete cascade,
  chapter_number integer not null check (chapter_number > 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (book_id, chapter_number)
);

create table if not exists public.bible_verses (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.bible_chapters(id) on delete cascade,
  verse_number integer not null check (verse_number > 0),
  text text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (chapter_id, verse_number)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  item_type text not null check (item_type in ('saint', 'prayer', 'verse')),
  item_id uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, item_type, item_id)
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.prayer_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.prayer_list_items (
  id uuid primary key default gen_random_uuid(),
  prayer_list_id uuid not null references public.prayer_lists(id) on delete cascade,
  prayer_id uuid references public.prayers(id) on delete cascade,
  custom_title text,
  custom_text text,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  check (prayer_id is not null or custom_text is not null)
);

create table if not exists public.bible_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  verse_id uuid not null references public.bible_verses(id) on delete cascade,
  label text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, verse_id)
);

create table if not exists public.settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  language text not null default 'en' check (language in ('en', 'de', 'ru')),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  notifications_enabled boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists saints_feast_day_idx on public.saints(feast_day);
create index if not exists prayers_category_idx on public.prayers(category);
create index if not exists bible_books_order_idx on public.bible_books(book_order);
create index if not exists bible_chapters_book_id_idx on public.bible_chapters(book_id);
create index if not exists bible_verses_chapter_id_idx on public.bible_verses(chapter_id);
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists prayer_lists_user_id_idx on public.prayer_lists(user_id);
create index if not exists bible_bookmarks_user_id_idx on public.bible_bookmarks(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

drop trigger if exists prayer_lists_set_updated_at on public.prayer_lists;
create trigger prayer_lists_set_updated_at
before update on public.prayer_lists
for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.created_at, timezone('utc', now()))
  )
  on conflict (id) do update
    set email = excluded.email;

  insert into public.settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users as profiles
  set
    email = new.email,
    display_name = case
      when coalesce(profiles.display_name, '') = '' then coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', profiles.display_name)
      else profiles.display_name
    end
  where profiles.id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_user_update();

alter table public.users enable row level security;
alter table public.saints enable row level security;
alter table public.prayers enable row level security;
alter table public.bible_books enable row level security;
alter table public.bible_chapters enable row level security;
alter table public.bible_verses enable row level security;
alter table public.favorites enable row level security;
alter table public.notes enable row level security;
alter table public.prayer_lists enable row level security;
alter table public.prayer_list_items enable row level security;
alter table public.bible_bookmarks enable row level security;
alter table public.settings enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.saints, public.prayers, public.bible_books, public.bible_chapters, public.bible_verses to anon, authenticated;
grant select, update on public.users to authenticated;
grant select, insert, update, delete on public.favorites, public.notes, public.prayer_lists, public.prayer_list_items, public.bible_bookmarks to authenticated;
grant select, insert, update on public.settings to authenticated;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
on public.users for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
on public.users for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Public can read saints" on public.saints;
create policy "Public can read saints"
on public.saints for select
to anon, authenticated
using (true);

drop policy if exists "Public can read prayers" on public.prayers;
create policy "Public can read prayers"
on public.prayers for select
to anon, authenticated
using (true);

drop policy if exists "Public can read bible books" on public.bible_books;
create policy "Public can read bible books"
on public.bible_books for select
to anon, authenticated
using (true);

drop policy if exists "Public can read bible chapters" on public.bible_chapters;
create policy "Public can read bible chapters"
on public.bible_chapters for select
to anon, authenticated
using (true);

drop policy if exists "Public can read bible verses" on public.bible_verses;
create policy "Public can read bible verses"
on public.bible_verses for select
to anon, authenticated
using (true);

drop policy if exists "Users can read own favorites" on public.favorites;
create policy "Users can read own favorites"
on public.favorites for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own favorites" on public.favorites;
create policy "Users can insert own favorites"
on public.favorites for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own favorites" on public.favorites;
create policy "Users can delete own favorites"
on public.favorites for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read own notes" on public.notes;
create policy "Users can read own notes"
on public.notes for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own notes" on public.notes;
create policy "Users can insert own notes"
on public.notes for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own notes" on public.notes;
create policy "Users can update own notes"
on public.notes for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own notes" on public.notes;
create policy "Users can delete own notes"
on public.notes for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read own prayer lists" on public.prayer_lists;
create policy "Users can read own prayer lists"
on public.prayer_lists for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own prayer lists" on public.prayer_lists;
create policy "Users can insert own prayer lists"
on public.prayer_lists for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own prayer lists" on public.prayer_lists;
create policy "Users can update own prayer lists"
on public.prayer_lists for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own prayer lists" on public.prayer_lists;
create policy "Users can delete own prayer lists"
on public.prayer_lists for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read own prayer list items" on public.prayer_list_items;
create policy "Users can read own prayer list items"
on public.prayer_list_items for select
to authenticated
using (
  exists (
    select 1
    from public.prayer_lists
    where prayer_lists.id = prayer_list_items.prayer_list_id
      and prayer_lists.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can insert own prayer list items" on public.prayer_list_items;
create policy "Users can insert own prayer list items"
on public.prayer_list_items for insert
to authenticated
with check (
  exists (
    select 1
    from public.prayer_lists
    where prayer_lists.id = prayer_list_items.prayer_list_id
      and prayer_lists.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can update own prayer list items" on public.prayer_list_items;
create policy "Users can update own prayer list items"
on public.prayer_list_items for update
to authenticated
using (
  exists (
    select 1
    from public.prayer_lists
    where prayer_lists.id = prayer_list_items.prayer_list_id
      and prayer_lists.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.prayer_lists
    where prayer_lists.id = prayer_list_items.prayer_list_id
      and prayer_lists.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can delete own prayer list items" on public.prayer_list_items;
create policy "Users can delete own prayer list items"
on public.prayer_list_items for delete
to authenticated
using (
  exists (
    select 1
    from public.prayer_lists
    where prayer_lists.id = prayer_list_items.prayer_list_id
      and prayer_lists.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can read own bible bookmarks" on public.bible_bookmarks;
create policy "Users can read own bible bookmarks"
on public.bible_bookmarks for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own bible bookmarks" on public.bible_bookmarks;
create policy "Users can insert own bible bookmarks"
on public.bible_bookmarks for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own bible bookmarks" on public.bible_bookmarks;
create policy "Users can update own bible bookmarks"
on public.bible_bookmarks for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own bible bookmarks" on public.bible_bookmarks;
create policy "Users can delete own bible bookmarks"
on public.bible_bookmarks for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read own settings" on public.settings;
create policy "Users can read own settings"
on public.settings for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own settings" on public.settings;
create policy "Users can insert own settings"
on public.settings for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own settings" on public.settings;
create policy "Users can update own settings"
on public.settings for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
