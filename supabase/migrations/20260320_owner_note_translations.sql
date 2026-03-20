create table if not exists public.owner_note_translations (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  locale text not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (note_id, locale)
);

create index if not exists owner_note_translations_note_id_idx
  on public.owner_note_translations (note_id);

create index if not exists owner_note_translations_locale_idx
  on public.owner_note_translations (locale);
