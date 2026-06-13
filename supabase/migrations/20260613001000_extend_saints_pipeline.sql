alter table public.saints
  add column if not exists short_biography text,
  add column if not exists long_biography text,
  add column if not exists category text not null default 'saint';

update public.saints
set
  short_biography = coalesce(short_biography, nullif(left(biography, 240), '')),
  long_biography = coalesce(long_biography, biography)
where short_biography is null
  or long_biography is null;

create index if not exists saints_category_idx on public.saints(category);
