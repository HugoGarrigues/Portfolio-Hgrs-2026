# Plan de l'application Notes (Portfolio OS)

Ce document transforme la note existante en **plan d'implémentation clair** pour l'application **Notes** du Portfolio OS. Il inclut aussi les **skills à utiliser** pour exécuter le travail dans le bon ordre.

---

## 1. Objectif produit

Créer une application **Notes** servant de **guestbook public** dans le Portfolio OS, avec une interface inspirée de **Notes sur macOS Tahoe** en mode sombre.

### Attendus UX

- Affichage d'une liste de notes sous forme de cartes.
- Création d'une note avec `pseudo`, `titre`, `message`.
- Navigation entre les notes actives et la corbeille.
- Recherche locale dans les notes.
- Déplacement d'une note vers la corbeille, puis restauration.
- Interface fidèle à l'OS Portfolio et cohérente sur desktop et mobile.

---

## 2. Skills à utiliser

J'ai utilisé la logique de `.agents/skills/find-skills/SKILL.md` pour déterminer les skills pertinents à partir du besoin. Pour ce projet, les skills à utiliser sont ceux déjà disponibles dans le repo.

### Skills principaux

1. **`react-nextjs-development`**
   - À utiliser pour la structure globale de l'application dans Next.js App Router, les composants React, les routes API, le typage TypeScript et l'intégration au projet.

2. **`senior-frontend`**
   - À utiliser pour la qualité d'implémentation frontend, l'accessibilité, la structure des composants, la robustesse UI et la revue de code.

3. **`tailwind-css-patterns`**
   - À utiliser pour construire toute l'interface Notes, la sidebar, l'en-tête, la grille de cartes, la modale d'édition et les états responsive.

4. **`vercel-react-best-practices`**
   - À utiliser pour éviter les patterns React/Next.js coûteux, améliorer les performances perçues, limiter les rerenders inutiles et garder une base saine.

### Skills optionnels selon l'implémentation

5. **`framer-motion`**
   - À utiliser uniquement si l'app Notes inclut de vraies animations: ouverture de fenêtre, transitions de cartes, apparition de la modale, micro-interactions ou transitions de layout.

6. **`find-skills`**
   - À réutiliser si une nouvelle partie du scope apparaît et qu'un besoin spécialisé n'est pas couvert par les skills ci-dessus.

### Skills non prioritaires pour cette app

- **`backend-dev-guidelines`** : non prioritaire ici, car cette app est un projet Next.js frontend-centric et non un monorepo Langfuse/tRPC/Express.
- **`skill-creator` / `skill-installer`** : utiles seulement si un skill manque réellement et qu'il faut en installer ou en créer un nouveau.

---

## 3. Ordre d'utilisation recommandé des skills

### Phase 1 - Architecture et base applicative

- Utiliser **`react-nextjs-development`**
- Puis vérifier la qualité de structure avec **`senior-frontend`**

### Phase 2 - Construction de l'interface

- Utiliser **`tailwind-css-patterns`**
- Compléter avec **`senior-frontend`** pour l'accessibilité, la hiérarchie visuelle et les états UX

### Phase 3 - Performance et finition React/Next.js

- Utiliser **`vercel-react-best-practices`**
- Ajouter **`framer-motion`** seulement si des animations réelles sont retenues

### Phase 4 - Extension éventuelle du scope

- Utiliser **`find-skills`** si un nouveau besoin apparaît, par exemple authentification, persistence avancée, workflow de contenu ou animations complexes

---

## 4. Plan fonctionnel de l'application

### A. Interface Notes

- Sidebar avec sections:
  - `iCloud`
  - `Notes`
  - `Suppr. récentes`
  - `Tags`
- En-tête avec:
  - bouton `Nouvelle Note`
  - bouton d'actions secondaires
  - champ de recherche
- Zone principale:
  - grille de notes
  - état vide si aucune note
  - filtre local sur le titre et le contenu

### B. Création et édition

- Ouvrir une interface de composition au clic sur `Nouvelle Note`
- Champs requis:
  - `author_name`
  - `title`
  - `content`
- Validation minimale côté client
- Soumission vers l'API
- Mise à jour immédiate de l'interface après création

### C. Gestion des dossiers

- Dossier principal `notes`
- Dossier corbeille `bin`
- Déplacement d'une note vers la corbeille
- Restauration d'une note depuis la corbeille

### D. Recherche

- Recherche locale instantanée
- Filtrage par `title` et `content`
- Conservation d'une UI fluide même avec plusieurs notes

---

## 5. Plan technique

### Frontend

- Composant principal: `components/apps/NotesApp.tsx`
- Gestion d'état locale pour:
  - dossier actif
  - recherche
  - notes chargées
  - état de composition
  - chargement / erreur
- Responsive design aligné avec les conventions existantes du Portfolio OS

### Backend / API

- Route API: `app/api/notes/route.ts`
- Endpoints prévus:
  - `GET /api/notes?folder=notes|bin`
  - `POST /api/notes`
  - `PATCH /api/notes`

### Persistance

- Connexion Supabase via `lib/supabase.ts`
- Table `notes` avec les champs:
  - `id`
  - `title`
  - `content`
  - `author_name`
  - `folder`
  - `author_type`
  - `created_at`

---

## 6. Préparation base de données

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://dwnjrvuhihxokhutqkzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_NtRiFK7gvfeowQ6-HwThwA_HBxtPn0K
```

### Schéma SQL prévu

```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  folder TEXT DEFAULT 'notes',
  author_type TEXT DEFAULT 'guest',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
```

### Point d'attention

- La désactivation de la RLS rend le guestbook 100% public.
- Si l'application doit évoluer, il faudra revoir cette décision avant mise en production avancée.

---

## 7. Dépendances prévues

```bash
npm install @supabase/supabase-js
```

`framer-motion` est déjà présent dans le projet et ne doit être utilisé que si les animations apportent une vraie valeur.

---

## 8. Étapes d'exécution concrètes

1. Structurer l'app avec **`react-nextjs-development`**.
2. Construire l'UI avec **`tailwind-css-patterns`**.
3. Revoir l'ergonomie et la qualité de code avec **`senior-frontend`**.
4. Vérifier les performances et patterns React avec **`vercel-react-best-practices`**.
5. Ajouter **`framer-motion`** uniquement pour les animations nécessaires.
6. Réutiliser **`find-skills`** si le scope change et nécessite un nouveau skill.

---

## 9. Résultat final attendu

Une application **Notes** crédible, stable et intégrée au Portfolio OS, avec:

- une expérience proche de macOS Notes,
- une persistance des messages visiteurs,
- une navigation simple entre notes actives et corbeille,
- un rendu frontend propre, performant et maintenable,
- un usage de skills cohérent avec le stack réel du projet.
