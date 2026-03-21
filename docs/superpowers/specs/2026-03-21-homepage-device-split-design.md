# Homepage Device-Split Design

## Goal

Restaurer l'effet "desktop immediat" sur `/` pour les utilisateurs ordinateur, tout en conservant une surface SEO solide et une experience utile sur mobile.

## Desired Behavior

- Sur desktop, `/` doit ouvrir immediatement l'experience desktop.
- Sur mobile, `/` doit afficher une landing page mobile orientee SEO.
- Pour les bots/crawlers, `/` doit servir la version SEO/mobile afin de garder un HTML riche et indexable.

## Recommended Approach

Utiliser une selection d'experience cote serveur sur `/`, basee sur les headers de la requete.

- `desktop human user` -> rendu de l'experience desktop sur `/`
- `mobile human user` -> rendu de la landing SEO/mobile sur `/`
- `bot/crawler` -> rendu de la landing SEO/mobile sur `/`

Cette approche preserve l'intention produit sur ordinateur sans sacrifier le mobile-first indexing.

## UX Shape

### Desktop

- Arrivee immediate sur le desktop
- Aucun interstitiel ni landing marketing avant l'entree
- Le desktop reste l'experience principale

### Mobile

- Hero mobile brandé
- Message clair: l'experience desktop complete est pensee pour ordinateur
- CTA principal vers `/projects`
- CTA secondaire vers `/contact`
- Sections SEO visibles sous le hero:
  - presentation
  - projets mis en avant
  - proposition de valeur
  - lien vers about/contact

Le ton doit rester premium et coherent avec le concept, pas punitif ni frustrant.

## SEO Constraints

- Le contenu mobile/SEO doit etre rendu cote serveur.
- Les pages publiques SSR restent actives:
  - `/projects`
  - `/projects/[slug]`
  - `/about`
  - `/contact`
- Les metadata, canonicals, OG, JSON-LD, sitemap et robots restent inchanges dans leur principe.
- `/desktop` peut devenir une route secondaire ou un alias, mais ne doit plus etre la porte d'entree principale pour desktop.

## Technical Notes

- Introduire un helper de detection de device/bot cote serveur sur `app/page.tsx`.
- Preferer une detection prudente basee sur `user-agent` et/ou headers standards, avec fallback vers la version SEO si le contexte est ambigu.
- Reutiliser la landing SEO actuelle comme base de la version mobile pour eviter de perdre le travail deja fait.
- Extraire si besoin la landing SEO dans un composant dedie pour pouvoir la rendre proprement depuis `/`.

## Risks

- Mauvaise detection device -> experience incoherente pour certains users.
- Divergence entre la homepage desktop et la homepage mobile si les contenus ne sont pas maintenus proprement.
- Rendu trop different pour Google si la logique bots/mobile n'est pas stable.

## Mitigations

- En cas de doute de detection, servir la version SEO/mobile.
- Garder les pages publiques dediees comme source stable de contenu indexable.
- Ajouter des tests unitaires sur la logique de detection et des verifications de metadata/rendu.

## Verification

- `desktop user-agent` -> `/` rend le desktop
- `mobile user-agent` -> `/` rend la landing mobile/SEO
- `bot user-agent` -> `/` rend la landing mobile/SEO
- `npm run lint`
- `npm run test:run`
- `npm run build`

## Implementation Direction

1. Extraire la homepage SEO actuelle dans un composant reutilisable.
2. Ajouter la detection server-side device/bot sur `/`.
3. Faire de `/` un routeur d'experience server-side.
4. Ajuster `/desktop` selon la nouvelle architecture.
5. Verifier SEO, tests et build.
