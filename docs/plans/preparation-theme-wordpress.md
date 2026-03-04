# Prompt : Nouveau thème WordPress "Techniques Graphiques" (design Hélène)

## Projet source — Design statique (LIRE EN PREMIER)

Le site statique complet (HTML/CSS/JS) qui sert de maquette se trouve ici :

```
/Users/man/htdocs/techniques-graphiques-Helene/
```

**Fichiers à lire pour comprendre le design avant de coder :**

| Fichier | Rôle | Priorité |
|---------|------|----------|
| `docs/plans/CONTEXTE-REPRISE.md` | Vue d'ensemble du projet, structure Figma, mapping grille/images, état d'avancement | **Lire en 1er** |
| `index.html` | Structure HTML complète (sidebar, grille 19 zones, menu overlay, vue détail, footer) | **Lire en 2e** |
| `assets/css/style.css` | Tout le CSS (grid-template-areas, 3 breakpoints, grain overlay, animations) | **Lire en 3e** |
| `assets/js/main.js` | Données projets, logique vue détail, menu toggle | **Lire en 4e** |

> **Instruction** : Commence par lire ces 4 fichiers avant d'écrire la moindre ligne de code.

---

## Thème WordPress existant (LIRE AUSSI)

Un thème WordPress fonctionnel existe déjà sur ce même site :

```
/Users/man/htdocs/techniques-graphiques.be/wp-content/themes/techniques-graphiques/
```

**Fichiers clés de l'ancien thème à lire :**

| Fichier | Ce qu'il contient |
|---------|-------------------|
| `functions.php` | CPT `projet`, 4 taxonomies, ACF fields, rôle Prof, enqueue assets, vertical nav walker |
| `front-page.php` | Homepage actuelle (hero + galerie projets récents) |
| `single-projet.php` | Page projet (hero flou, briefing, démarche créative, galerie) |
| `page-projets.php` | Liste projets avec filtres dropdown + Isotope |
| `header.php` / `footer.php` | Structure commune |
| `style.css` | Tous les styles actuels (39KB, variables CSS, composants) |

> **Instruction** : Lis le `functions.php` de l'ancien thème pour comprendre l'infrastructure WordPress qui existe déjà. Tu ne dois **rien recréer** de ce qui y est défini.

---

## Ce qui EXISTE DÉJÀ dans WordPress (NE PAS recréer)

### Custom Post Type
- **`projet`** — déjà enregistré avec supports: title, editor, thumbnail

### Taxonomies (toutes attachées à `projet`)
- **`section`** — hierarchique (Web, Édition, 3D/FX)
- **`annee_academique`** — hierarchique
- **`type_travail`** — hierarchique
- **`competence`** — flat (tags)

### Champs ACF existants (sur le CPT `projet`)
- `galerie` — repeater d'images
- `etudiants` — repeater (champ `nom`)
- `briefing` — wysiwyg
- `demarche_creative` — wysiwyg
- `specificites_techniques` / `outils` — texte
- `projet_test` — checkbox (1 = visible en front)
- `position_projets` — alignement (centre/left/right)
- `annee` — niveau bac (1/2/3)

### Rôle "Prof"
- Déjà créé avec capabilities restreintes (edit/publish/delete projets uniquement)

### Plugin
- **Simple Custom Post Order** — déjà installé, gère `menu_order` par drag & drop

---

## Ce que je veux : un NOUVEAU thème

Je veux un nouveau thème WordPress qui reproduit fidèlement le design du site statique d'Hélène. Ce thème **remplace** l'ancien visuellement mais **réutilise** toute l'infrastructure WordPress existante (CPT, taxonomies, ACF fields, rôle Prof).

### Design à reproduire

Le site statique est une **single page** avec :
- **Sidebar fixe** à gauche (56px, violet rgb(96,38,158), titre vertical "Techniques Graphiques" + logo "HEFF")
- **Grille mosaïque** (CSS Grid 8 colonnes, `grid-template-areas` nommées a→q + s + t, gap 0 = mosaïque sans espaces)
- **Tooltip au hover** sur chaque projet (badge option, description, auteur — slide up depuis le bas)
- **Vue détail plein écran** au clic (100vw × 100vh) : image principale à gauche (38%) + 4 images en grille 2×2 à droite (62%) + bloc info violet
- **Menu overlay** plein écran (hamburger) : 3 colonnes violettes dégradées (Web / Édition / 3D) + section info en bas
- **Footer** 4 colonnes, fond violet clair (#d4b8e8)
- **Effet grain global** : `body::before` avec SVG feTurbulence (opacity 0.68, hard-light)
- **Polices** : Sligoil (variable, titres) + GTWalsheim Light (corps)

### Mapping données WordPress → design

| Élément du design | Source WordPress |
|---|---|
| Image dans la grille (1 par projet) | `the_post_thumbnail()` (featured image) |
| 4 images dans la vue détail (grille 2×2) | Champ ACF `galerie` (repeater) — prendre les 4 premières images |
| Image principale vue détail (gauche) | Featured image |
| Texte du tooltip / description | `get_the_content()` ou `get_the_excerpt()` |
| Badge option (tooltip + détail) | Taxonomie `section` (Web, Édition, 3D/FX) |
| Auteur (tooltip + détail) | Champ ACF `etudiants` (repeater → premier nom) + champ `annee` |
| Ordre des projets dans la grille | `menu_order` (géré par Simple Custom Post Order) |
| Filtre projets visibles | Champ ACF `projet_test` = 1 |

### Logique de la grille dynamique

- `WP_Query` sur le CPT `projet` avec `orderby => menu_order`, filtrés par `projet_test = 1`
- Les projets sont numérotés dans l'ordre de la query et assignés aux grid-areas `a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q`
- Les 2 cartes non-projet (`.grid__school` = area `s`, `.grid__intro` = area `t`) restent codées en dur
- Maximum 17 projets affichés (= 17 grid-areas disponibles)

### Vue détail : passage des données au JS

Les données de chaque projet sont passées via `data-*` attributes sur chaque `.grid__item` :

```html
<div class="grid__item"
     data-project="<?php echo get_the_ID(); ?>"
     data-images='<?php echo json_encode($images); ?>'
     data-option="option <?php echo esc_attr(strtolower($section_name)); ?>"
     data-desc="<?php echo esc_attr(get_the_excerpt()); ?>"
     data-auteur="<?php echo esc_attr($auteur_display); ?>"
     style="grid-area: <?php echo $area; ?>;">
```

Le JS lit ces `data-*` au clic pour remplir la vue détail (au lieu de l'objet `projects` codé en dur du site statique).

### Fichiers du nouveau thème

```
theme-tg-helene/
├── style.css                  ← Header WordPress + styles du site statique
├── functions.php              ← Enqueue styles/fonts, RIEN d'autre (le CPT/taxonomies/ACF restent dans l'ancien thème ou dans un plugin)
├── front-page.php             ← Homepage : grille mosaïque avec WP_Query
├── header.php                 ← <head>, sidebar fixe, menu toggle, grain overlay
├── footer.php                 ← Footer 4 colonnes + menu overlay + scripts
├── assets/
│   ├── js/
│   │   └── main.js            ← JS adapté (data-* attributes au lieu d'objet statique)
│   └── fonts/
│       ├── SligoilVF.ttf
│       └── GTWalsheim-Light.otf
└── screenshot.png
```

### Ce qui ne change PAS par rapport au site statique

- **Le CSS** : la grille, les animations, les couleurs, le grain, le responsive — tout reste identique, intégré dans `style.css` du thème
- **Le layout de la vue détail** : 38% gauche (image + info) / 62% droite (2×2 thumbnails)
- **Le sidebar** : fixe, 56px, violet, texte vertical Sligoil
- **Le menu overlay** : 3 colonnes violettes + section info lavande en bas
- **Le footer** : 4 colonnes, fond #d4b8e8
- **L'effet grain** : `body::before` avec SVG feTurbulence
- **Les polices** : Sligoil (variable) et GTWalsheim Light

---

## Point d'attention important

Le `functions.php` du nouveau thème doit **uniquement** :
- Enregistrer les styles et scripts (`wp_enqueue_style`, `wp_enqueue_script`)
- Enregistrer les polices custom (Sligoil, GTWalsheim)
- Déclarer `add_theme_support('post-thumbnails')`
- Déclarer les menus si nécessaire

Le CPT `projet`, les taxonomies, les champs ACF, le rôle Prof — tout ça est déjà défini dans le `functions.php` de l'ancien thème. **Si on change de thème, ces enregistrements disparaissent.** Il faudra donc soit :
1. **Copier** les sections CPT/taxonomies/ACF/rôles du `functions.php` de l'ancien thème vers le nouveau
2. **Ou** extraire ces enregistrements dans un **plugin mu** (`wp-content/mu-plugins/tg-infrastructure.php`) pour qu'ils persistent quel que soit le thème actif

> **Recommandation** : option 2 (mu-plugin). Lis le `functions.php` de l'ancien thème et extrais dans un mu-plugin tout ce qui concerne : `tg_register_projet_cpt`, `tg_register_taxonomies`, `tg_register_acf_fields`, `tg_setup_roles`, `tg_prof_*` (fonctions admin Prof), `tg_front_only_test_projets`.

---

## Résumé

| Élément du site statique | Équivalent WordPress |
|---|---|
| Objet JS `projects` codé en dur | `WP_Query` sur CPT `projet` (existe déjà) |
| `assets/images/` référencées dans le JS | Featured image + ACF `galerie` repeater (existe déjà) |
| Description dans l'objet JS | Contenu de l'éditeur WordPress |
| Auteur dans l'objet JS | ACF `etudiants` repeater + `annee` (existe déjà) |
| Option (web/édition/3D) dans l'objet JS | Taxonomie `section` (existe déjà) |
| Ordre fixe dans le HTML | `menu_order` + Simple Custom Post Order (existe déjà) |
| Grid-areas assignées manuellement | Assignées dynamiquement par index dans la WP_Query |
| Tooltip statique | Tooltip généré depuis les champs WordPress |
| Vue détail remplie par JS depuis objet | Vue détail remplie par JS depuis `data-*` attributes |
