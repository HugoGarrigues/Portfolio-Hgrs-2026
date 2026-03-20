create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.note_tags (
  note_id uuid not null references public.notes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (note_id, tag_id)
);

create index if not exists note_tags_tag_id_idx
  on public.note_tags (tag_id);

create index if not exists note_tags_note_id_idx
  on public.note_tags (note_id);

create index if not exists tags_slug_idx
  on public.tags (slug);
