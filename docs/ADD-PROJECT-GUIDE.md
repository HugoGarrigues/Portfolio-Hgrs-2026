# Guide Claude Code — Ajouter un projet

Ce guide est destiné à Claude Code. Quand l'utilisateur dit "ajoute ce projet" ou "crée une fiche projet", suivre ces étapes exactement.

## Étape 1 — Lire le fichier source

```
Read: data/projects.json
```

Ne pas modifier FinderApp.tsx ni lib/projects.ts. La seule source de vérité est le JSON.

## Étape 2 — Construire l'objet projet

Collecter les informations suivantes auprès de l'utilisateur si manquantes :

| Champ | Type | Obligatoire | Notes |
|-------|------|-------------|-------|
| `id` | string | oui | kebab-case, unique, ex: `"mon-projet"` |
| `name` | string | oui | Nom affiché, ex: `"Mon Projet"` |
| `tagline` | string | oui | Sous-titre court (affiché en liste) |
| `description` | string | oui | Paragraphe complet (affiché en détail), en français |
| `categories` | string[] | oui | Voir valeurs valides ci-dessous |
| `stack` | string[] | oui | Technologies, ex: `["Next.js", "TypeScript"]` |
| `year` | number | oui | Année de début ou de livraison |
| `status` | string | oui | Voir valeurs valides ci-dessous |
| `links.github` | string\|null | non | URL complète ou null |
| `links.live` | string\|null | non | URL complète ou null |
| `thumbnail` | string\|null | non | Chemin `/thumbnails/id.png` ou null |

**Valeurs valides pour `categories`** :
- `"web-apps"` → sidebar "Web Apps"
- `"ai-agentic"` → sidebar "AI / Agentic"
- `"in-progress"` → sidebar "In Progress"

Un projet peut avoir plusieurs catégories : `["web-apps", "in-progress"]`

**Valeurs valides pour `status`** :
- `"Deployed"` → badge vert
- `"In Progress"` → badge jaune
- `"Concept"` → badge gris

Note : `status: "In Progress"` n'implique PAS `categories: ["in-progress"]` automatiquement — ajouter les deux si nécessaire.

## Étape 3 — Éditer data/projects.json

Ajouter le nouvel objet à la fin du tableau `projects`, avant le `]` fermant.

```json
{
  "id": "mon-projet",
  "name": "Mon Projet",
  "tagline": "...",
  "description": "...",
  "categories": ["web-apps"],
  "stack": ["Next.js", "TypeScript"],
  "year": 2026,
  "status": "Deployed",
  "links": {
    "github": "https://github.com/HugoGarrigues/mon-projet",
    "live": null
  },
  "thumbnail": null
}
```

## Étape 4 — Vérifier le build

```bash
npm run build
```

Si le build échoue, vérifier :
- Le JSON est valide (pas de virgule manquante ou en trop)
- Le `id` est unique dans le tableau
- Les valeurs de `status` et `categories` respectent les types de `lib/projects.ts`

## Ce qu'il NE faut PAS faire

- Ne pas modifier `lib/projects.ts` pour ajouter des données — c'est uniquement des helpers
- Ne pas modifier `components/apps/FinderApp.tsx` pour ajouter des projets
- Ne pas créer de nouveaux fichiers pour un projet individuel
- Ne pas inventer des champs non définis dans le type `Project`
