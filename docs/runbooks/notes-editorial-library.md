# Notes Editorial Library Runbook

## Goal

Keep the Notes app populated with high-signal owner content while preserving the visitor guestbook and tag structure.

## Database Objects

This runbook assumes these tables exist:

- `public.notes`
- `public.tags`
- `public.note_tags`

## Owner Notes Rules

- Owner-authored content must use `source = 'owner'`
- Public guestbook submissions must keep `source = 'visitor'`
- Visible notes use `status = 'published'`
- Recently deleted notes use `status = 'trashed'`

## Recommended Initial Tags

- `about`
- `experience`
- `projects`
- `skills`
- `vision`

## Insert or Update Tags

```sql
insert into public.tags (slug, label)
values
  ('about', 'About'),
  ('experience', 'Experience'),
  ('projects', 'Projects'),
  ('skills', 'Skills'),
  ('vision', 'Vision')
on conflict (slug) do update
set label = excluded.label;
```

## Insert an Owner Note

```sql
insert into public.notes (title, content, author_name, client_id, source, status)
values (
  'About',
  'Your note body here',
  'Hugo Garrigues',
  'owner-seeded',
  'owner',
  'published'
)
returning id;
```

## Attach Tags to a Note

```sql
insert into public.note_tags (note_id, tag_id)
select
  '<NOTE_ID>'::uuid,
  t.id
from public.tags t
where t.slug in ('about', 'vision')
on conflict do nothing;
```

## Add an Owner Note Translation

```sql
insert into public.owner_note_translations (note_id, locale, title, content)
select
  n.id,
  'fr',
  'À propos',
  'Version française de votre note owner'
from public.notes n
where n.title = 'About'
  and n.author_name = 'Hugo Garrigues'
limit 1
on conflict (note_id, locale) do update
set
  title = excluded.title,
  content = excluded.content;
```

## Add an English Translation

```sql
insert into public.owner_note_translations (note_id, locale, title, content)
select
  n.id,
  'en',
  'About',
  'English version of your owner note'
from public.notes n
where n.title = 'About'
  and n.author_name = 'Hugo Garrigues'
limit 1
on conflict (note_id, locale) do update
set
  title = excluded.title,
  content = excluded.content;
```

## Translation Fallback Rule

- Owner notes use the translation matching the active app locale when it exists
- If no translation exists for that locale, the app falls back to the base note stored in `public.notes`
- Visitor notes are never translated by the app and always render their original content

## Trash a Note

```sql
update public.notes
set status = 'trashed'
where id = '<NOTE_ID>'::uuid;
```

## Restore a Note

```sql
update public.notes
set status = 'published'
where id = '<NOTE_ID>'::uuid;
```

## Content Maintenance Guidelines

- Keep owner notes short enough to read comfortably in the Notes detail pane
- Prefer one clear idea per note
- Reuse tags consistently rather than inventing many near-duplicates
- Treat `Mes notes` as an editorial library for recruiters and readers, not as a changelog

## Suggested Refresh Routine

- Review owner notes monthly
- Archive outdated notes to `trashed` instead of deleting them
- Add tags before publishing new owner notes so the sidebar stays useful
