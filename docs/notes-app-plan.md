# Documentation de l'Application Notes (Portfolio OS)

Ce document récapitule l'intégralité du processus de réflexion, de mise en place, et de code réalisé pour l'application **Notes** de l'OS Portfolio, qui sert de "Guestbook" (Livre d'or) public pour les visiteurs, en imitant l'interface exacte de l'application Notes de macOS Tahoe.

---

## 1. Objectif & Design de l'App

- **Rôle :** Un livre d'or public sous forme de post-its / notes. Les visiteurs peuvent y laisser un pseudo, un titre, et un message.
- **Design :** Réplication parfaite de l'application **Notes de macOS Tahoe** en mode sombre (Dark Mode).
  - Barre latérale (Sidebar) avec sections "iCloud", "Notes", "Suppr. récentes" (Corbeille) et "Tags".
  - En-tête avec bouton "Nouvelle Note" (SquarePen), "Plus" (...), et barre de recherche.
  - Grille asymétrique (Masonry) affichant les cartes de notes avec le titre en gras et le jour de création en dessous.
  - Easter Egg : Déplacement des notes vers la corbeille ("Suppr. récentes") avec possibilité de restauration.

---

## 2. Infrastructure Base de Données (Supabase)

Pour la persistance des notes, nous avons choisi **Supabase**.

### Identifiants de connexion (`.env.local`)
Ces variables ont été ajoutées à la racine du projet :
```env
NEXT_PUBLIC_SUPABASE_URL=https://dwnjrvuhihxokhutqkzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_NtRiFK7gvfeowQ6-HwThwA_HBxtPn0K
```

### Schéma SQL de la table `notes`
Ce script a été (ou doit être) exécuté manuellement sur la console SQL de votre projet Supabase :
```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  folder TEXT DEFAULT 'notes', -- Valeurs: 'notes' (actif) ou 'bin' (corbeille)
  author_type TEXT DEFAULT 'guest', -- Valeurs: 'me' (admin) ou 'guest' (visiteur)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Désactivation des règles de sécurité (Row Level Security) car l'accès est 100% public 
-- pour lire et créer des notes (Guestbook).
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
```

---

## 3. Dépendances Installées

Installation du SDK JavaScript officiel de Supabase pour communiquer avec la base depuis Next.js :
```bash
npm install @supabase/supabase-js
```

---

## 4. Fichiers Créés / Modifiés

### A. Client Supabase : `lib/supabase.ts`
Fichier servant à initialiser la connexion Supabase et à l'exporter pour l'utiliser dans nos routes API.
```typescript
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### B. Routes API (Backend) : `app/api/notes/route.ts`
Gestion complète du CRUD des notes via des requêtes HTTP :
- **`GET /api/notes?folder={nom_du_dossier}`** :
  - Récupère toutes les notes d'un dossier donné (`notes` ou `bin`) classées de la plus récente à la plus ancienne.
- **`POST /api/notes`** :
  - Accepte `title`, `content`, `author_name`.
  - Insère la nouvelle note dans la table avec le dossier `notes` par défaut et le type `guest`.
- **`PATCH /api/notes`** :
  - Accepte l'ID d'une note (`id`) et sa nouvelle destination (`folder`). 
  - Utilisé pour l'easter egg : envoyer une note à la corbeille ou la restaurer.

### C. Interface Utilisateur (Frontend) : `components/apps/NotesApp.tsx`
C'est le composant principal du système d'exploitation pour cette application.
- **Gestion d'état locale :**
  - Un système de navigation entre les dossiers "Notes" actives et la "Corbeille" (`activeFolder`).
  - Une barre de recherche pour filtrer en direct le contenu des notes et les titres (`searchQuery`).
  - Un affichage modal par-dessus l'interface (`isComposing`) pour que les invités puissent écrire leur message.
- **Requêtes Fetch (`useEffect`) :**
  - Chargement asynchrone des notes à l'ouverture de l'application et lors du changement de dossier (API GET).
  - Suppression optimiste lors du déplacement d'une note (API PATCH).

### D. Enregistrement Système (OS)
L'application était déjà déclarée dans `lib/apps.ts` sous l'identifiant `notes`. Le composant frontend se charge d'instancier ses dimensions par défaut (400x500 originellement, mais adapté avec des styles responsifs tailwind dans `NotesApp.tsx`).

---

## 5. Flux d'utilisation final (UX de l'invité)
1. Le visiteur double-clique sur l'icône de l'app "Notes".
2. La fenêtre s'ouvre, montrant les notes existantes (requête API de démarrage).
3. Il clique sur le bouton de création au-dessus de la recherche (carré avec crayon).
4. La pop-ip s'ouvre (similant l'éditeur).
5. Il remplit son Pseudo, le Titre et son Message, puis clique sur "Save".
6. La note s'enregistre via l'API, s'ajoute dynamiquement à la liste et apparaît comme une mini page web assombrie dans la grille principale. 
7. Il peut passer sa souris sur une note et cliquer sur la corbeille pour la déplacer dans la section "Suppr. récentes" ajoutant un aspect "bac à sable" interactif.
