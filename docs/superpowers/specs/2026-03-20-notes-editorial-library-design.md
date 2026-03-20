# Notes Editorial Library Design

**Date:** 2026-03-20

## Goal

Turn the Notes app into a finished editorial surface for readers and recruiters by combining:

- your own structured Notes content
- visitor guestbook notes
- functional tags
- a real recently deleted bucket

The app should still feel like one coherent Notes experience, not two separate products.

## Product Direction

The Notes app now has two complementary roles:

1. `Mes notes` acts as your curated editorial library.
2. `Notes visiteurs` remains the public guestbook.

This keeps the app personal and informative at the same time. Recruiters can read your own notes to understand your profile, while visitor notes still give the app social proof and warmth.

## Core Product Rules

- `Mes notes` must be populated with real owner-authored content.
- `Notes visiteurs` must continue to show public guestbook submissions.
- `Supprimées récemment` must show trashed notes from the database.
- `Tags` must be fully operational and clickable in the sidebar.
- Tags must structure owner notes and filter visible notes by theme.
- Tag filtering should work inside the existing Notes UI, without introducing a separate search mode.
- The Notes app must remain visually consistent with the current macOS-inspired direction.

## Data Model

### Notes

The `notes` table remains the primary content table and must support:

- `source = 'owner' | 'visitor'`
- `status = 'published' | 'trashed'`

This allows the app to distinguish:

- your editorial notes
- public visitor notes
- recently deleted notes

### Tags

Tags must be stored in the database as first-class entities, not hardcoded in the client.

Use a relational model:

- `notes`
- `tags`
- `note_tags`

This is the source of truth for filtering and editorial organization.

### Tag Semantics

Tags are primarily for owner-note structure. They should help a recruiter quickly move through topics such as:

- about
- experience
- projects
- skills
- vision

V1 should support multiple tags per note, but only one active tag filter at a time in the UI.

## UI Behavior

### Sidebar

The sidebar keeps four visible groups:

- `Mes notes`
- `Notes visiteurs`
- `Supprimées récemment`
- `Tags`

The `Tags` section must become interactive:

- clicking a tag activates a filter
- clicking another tag switches the filter
- clearing or changing the section resets invalid filters as needed

### Notes List

The list/gallery surface should reflect both the active section and the active tag filter.

Expected behavior:

- `Mes notes` can be filtered by tag
- `Notes visiteurs` may show no results for a given tag if none apply
- `Supprimées récemment` should still behave like a bucket, but may also respect the active tag when relevant

### Detail Pane

The detail pane should continue to behave like the reading surface for the selected note.

No new visual mode is required for this phase. The finalization work is about data richness and operational filtering, not another layout rewrite.

## Content Strategy

`Mes notes` should be seeded with meaningful owner content written for readers and recruiters.

These notes should explain:

- who you are
- how you work
- what you build
- what you care about technically
- what kind of opportunities make sense for you

Each note should be short enough to read comfortably inside Notes, but substantial enough to communicate something useful.

## API and Query Behavior

The Notes API should evolve from a simple guestbook feed into a source-aware content endpoint.

Public reads must:

- return published notes only by default
- include source and tag information needed by the UI
- support filtering by section and tag

Writes from the public app must:

- still create `visitor` notes
- still respect cooldown protection
- not be allowed to author `owner` notes from the client

Owner notes continue to be managed directly in Supabase.

## Production Readiness Requirements

The final Notes phase must include:

- Supabase migration(s) for tags and note/tag relationships
- seeded or documented owner content insertion
- robust tests for section filtering and tag filtering
- stable i18n-safe rendering
- a short runbook describing how to add, tag, trash, and maintain owner notes

## Success Criteria

This phase is complete when:

- `Mes notes` contains real owner content
- tags are stored in base and work in the UI
- `Notes visiteurs` and `Supprimées récemment` are backed by real data buckets
- recruiters can use the app as a genuine reading surface about you
- the Notes app feels finished enough to ship as part of the portfolio
