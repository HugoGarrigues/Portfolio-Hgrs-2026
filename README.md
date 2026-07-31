# HGRS Portfolio 2026

Portfolio interactif et vitrine professionnelle de Hugo Garrigues (Développeur full-stack & agentic engineer).

- **Expérience Desktop** : Simulation macOS avec gestionnaire de fenêtres, terminal et applications interactives (`/desktop`).
- **Mode SEO & Mobile** : Rendu statique SSR optimisé pour les moteurs de recherche et l'indexation rapide (`/`).

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router, SSG & SSR)
- **Langage** : TypeScript (Strict Mode)
- **Styles** : Tailwind CSS v4
- **Animations & 3D** : Framer Motion 12, React Three Fiber 9
- **Tests** : Vitest + React Testing Library

---

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer les tests unitaires
npm run test:run

# Builder pour la production
npm run build
```

---

## 📋 Guide d'Indexation Google Search Console

Si vos pages affichent l'état **« Explorée, actuellement non indexée »** dans la Google Search Console, suivez ce guide étape par étape.

### 🔍 Résumé des corrections appliquées dans le code

1. **Rendu SSR complet sur la page d'accueil (`/`)** :
   - Suppression du test de `User-Agent` qui servait un HTML vide (`{ ssr: false }`) aux robots desktop.
   - Désormais, Googlebot (Mobile et Desktop) reçoit 100% de la structure HTML pré-rendue (titres `<h1>`, métadonnées, schémas JSON-LD et cartes de projets).

2. **Fixation du domaine canonique** :
   - L'URL de base par défaut pointe vers `https://hgrs.studio-saas.com` au lieu de `http://localhost:3000`.
   - Les balises `<link rel="canonical">` et le fichier `sitemap.xml` génèrent maintenant des URLs valides.

3. **Nettoyage du Sitemap** :
   - Le sitemap inclut uniquement les vraies pages applicatives (`/`, `/projects`, `/about`, `/contact`, `/projects/[slug]`). Fichiers système et pages de test exclus.

---

### 📝 Procédure à suivre sur Google Search Console

#### Étape 1 : Soumettre à nouveau le Sitemap XML
1. Rendez-vous sur la [Google Search Console](https://search.google.com/search-console).
2. Dans le menu latéral gauche, cliquez sur **Sitemaps**.
3. Saisissez l'URL exacte : `sitemap.xml` (URL complète : `https://hgrs.studio-saas.com/sitemap.xml`).
4. Cliquez sur **Envoyer**.

#### Étape 2 : Tester et Demander l'indexation de la page d'accueil
1. Dans la barre de recherche tout en haut de GSC (*"Inspecter n'importe quelle URL..."*), entrez :
   `https://hgrs.studio-saas.com/`
2. Cliquez sur le bouton **Tester l'URL en direct** (en haut à droite).
3. Une fois le test terminé, cliquez sur **Afficher la page testée** :
   - Onglet **Capture d'écran** : Vérifiez que la page d'accueil s'affiche avec son visuel complet.
   - Onglet **HTML** : Assurez-vous de voir les balises `<h1>`, le texte et le code source complet.
4. Si le test est réussi, cliquez sur **Demander l'indexation**.

#### Étape 3 : Valider la correction de l'erreur d'indexation
1. Dans le menu de gauche, allez dans **Indexation > Pages**.
2. Cliquez sur la ligne **Explorée, actuellement non indexée**.
3. En haut du rapport, cliquez sur le bouton **Valider la correction**.
4. Google relancera l'exploration de vos pages (cela peut prendre de 24h à quelques jours).
