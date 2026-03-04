# Design : Texture grain globale sur tout le site

**Date** : 2026-03-04
**Statut** : Validé
**Projet** : techniques-graphiques-Helene

---

## Contexte

Le design InDesign original comporte un calque de texture grain (bruit/noise) violet posé par-dessus tous les éléments de la page, donnant un rendu organique façon papier imprimé. Dans le Figma (node `0:3` du fichier `r5tYpYeuGrBpIHmZMFuMHy`), cette texture est un bitmap violet avec du bruit fractal.

Le site web n'avait le grain que sur les 3 colonnes du menu overlay (`.menu-overlay__col::before`), via un filtre SVG `feTurbulence` inline.

L'objectif est d'étendre cet effet à **tout le site** — fonds colorés et images de projets — pour un rendu fidèle au design print.

---

## Décision retenue : Approche A — `body::before` global

Un seul pseudo-élément `body::before` avec `position: fixed` couvre tout le viewport. Le grain est appliqué uniformément sur tout le contenu visible.

### Variables CSS ajustables (`:root`)

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `--grain-opacity` | `0.08` | Opacité du calque grain |
| `--grain-blend` | `hard-light` | Mode de fusion CSS |
| `--grain-frequency` | `0.75` | Fréquence du bruit fractal SVG |
| `--grain-octaves` | `4` | Nombre d'octaves du bruit |

### CSS à ajouter

```css
:root {
  --grain-opacity: 0.08;
  --grain-blend: hard-light;
  --grain-frequency: 0.75;
  --grain-octaves: 4;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
  opacity: var(--grain-opacity);
  mix-blend-mode: var(--grain-blend);
  background-image: url("data:image/svg+xml,...feTurbulence...");
  background-repeat: repeat;
}
```

### CSS à supprimer

- `.menu-overlay__col::before` (lignes 521-531) — remplacé par le calque global
- `.menu-overlay__col > *` z-index override (lignes 533-536) — plus nécessaire

### z-index

Le calque est à `z-index: 10000`, au-dessus de tous les éléments du site :
- Sidebar : 100
- Menu overlay : 90
- Menu toggle : 110
- Vue détail : 200

---

## Approches alternatives (historique)

### Approche B — Pseudo-éléments par composant

Dupliquer le pattern `::before` sur chaque composant individuellement :
- `.sidebar::before`
- `.grid__school::before`
- `.grid__intro::before`
- `.grid__tooltip::before`
- `.menu-overlay__col::before` (existant)
- `.menu-overlay__bottom::before`
- `.footer::before`
- `.detail__info::before`
- `.grid__item::before`

**Avantages** : Contrôle fin par section (opacité, fréquence, blend mode différents par zone). Possibilité de désactiver le grain sur certaines zones.

**Inconvénients** : 8-10 pseudo-éléments à maintenir. Risque de conflits z-index. Chaque nouveau composant doit ajouter son `::before`. Beaucoup de CSS dupliqué.

### Approche C — Hybride (global + overrides)

Un `body::before` global comme base, avec des pseudo-éléments locaux supplémentaires sur certaines zones pour modifier l'intensité.

**Avantages** : Couverture totale par défaut + personnalisation par zone si besoin.

**Inconvénients** : Plus complexe à maintenir. Double couche de grain possible si mal configuré.

---

## Options proposées avant le design

### Source de la texture

1. **Filtre SVG `feTurbulence` inline** (retenu) — Léger (~0 ko), paramétrable via variables CSS, rendu généré par le navigateur.
2. **Bitmap téléchargé depuis Figma** — Plus fidèle au design original, mais ajoute 50-100 ko au poids de la page. L'image est un PNG violet avec du bruit.
3. **Filtre CSS** — Moins de contrôle que SVG, support navigateur inégal.

### Zones d'application

1. **Fonds colorés uniquement** — Grain sur les aplats violets et lavande. Les images restent intactes.
2. **Tout le site** (retenu) — Le grain couvre aussi les images de la mosaïque, comme un calque global façon risographie/impression offset.
3. **Fonds + hover images** — Grain permanent sur les fonds colorés, apparition au hover sur les vignettes de projets.

### Intensité

1. **Uniforme partout** — Même opacité et blend mode sur tout le site.
2. **Plus léger sur images** — ~5% sur les vignettes, ~10-15% sur les fonds.
3. **Ajustable via variables CSS** (retenu) — Variables CSS pour tweaker en inspecteur navigateur sans modifier le code.

---

## Impact fichiers

| Fichier | Action |
|---------|--------|
| `assets/css/style.css` | Ajouter variables `:root`, ajouter `body::before`, supprimer `.menu-overlay__col::before` et `.menu-overlay__col > *` z-index |

---

## Pour revenir en arrière

Si le grain global ne convient pas :
1. **Désactiver** : Mettre `--grain-opacity: 0` dans `:root`
2. **Revenir à l'approche B** : Supprimer `body::before`, remettre les `::before` par composant
3. **Utiliser le bitmap Figma** : Télécharger l'image du node `0:3` et la mettre en `background-image` au lieu du SVG
4. **Supprimer complètement** : Retirer `body::before` et les variables CSS
