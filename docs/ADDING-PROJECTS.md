# Ajouter un projet

Tout le contenu des projets est géré depuis un seul fichier :

```
data/projects.json
```

## Étapes

### 1. Ouvrir `data/projects.json`

### 2. Ajouter un nouvel objet dans le tableau `projects`

```json
{
  "id": "mon-projet",
  "name": "Mon Projet",
  "tagline": "Une courte description — affichée dans la liste",
  "description": "Description complète affichée dans la vue détail. Plusieurs phrases, en français.",
  "categories": ["web-apps"],
  "stack": ["Next.js", "TypeScript", "Tailwind CSS"],
  "year": 2026,
  "status": "In Progress",
  "links": {
    "github": "https://github.com/HugoGarrigues/mon-projet",
    "live": null
  },
  "thumbnail": null
}
```

### 3. (Optionnel) Ajouter une image

Déposer l'image dans `/public/thumbnails/mon-projet.png` et mettre à jour :

```json
"thumbnail": "/thumbnails/mon-projet.png"
```

## Valeurs valides

**`categories`** — tableau, une ou plusieurs valeurs :
- `"web-apps"` → apparaît dans "Web Apps"
- `"ai-agentic"` → apparaît dans "AI / Agentic"
- `"in-progress"` → apparaît dans "In Progress"

**`status`** — une seule valeur :
- `"Deployed"` → badge vert
- `"In Progress"` → badge jaune
- `"Concept"` → badge gris

**`links`** — mettre `null` si le lien n'existe pas encore.

## Résultat

Le projet apparaît automatiquement dans le Finder de l'OS portfolio, dans les bonnes catégories sidebar.
