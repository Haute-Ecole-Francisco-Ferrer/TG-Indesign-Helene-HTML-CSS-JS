# Contexte de reprise — TG HEFF (InDesign → Figma → Web)

## Projet
- **Chemin** : `/Users/man/htdocs/techniques-graphiques-Helene/`
- **Figma (layout WEB)** : https://www.figma.com/design/BP5yIRa2ibXTJugNtu9xww/TG-Indesign-Hélène
- **Figma (import InDesign)** : https://www.figma.com/design/2prI8jyOGIRGeZOtuZohgZ/TF-Hélène (référence typo/couleurs)
- **But** : Site vitrine créative étudiants Techniques Graphiques HEFF. Pipeline : InDesign → Figma → HTML/CSS/JS → WordPress.

## Pour reprendre le travail Figma
1. Ouvrir Figma Desktop sur le fichier TG-Indesign-Hélène
2. Lancer le WebSocket : `cd ~/claude-talk-to-figma-mcp && bun run dist/socket.js`
3. Dans Figma : Plugins → Development → Claude MCP Plugin → Connect
4. Donner le channel ID à Claude → `join_channel`

## État des polices Figma
- **GTWalsheim-Light** : installée, **APPLIQUÉE** à tous les textes corps (toutes pages InDesign + WEB)
- **Sligoil Micro** : installée dans `~/Library/Fonts/SligoilVF.ttf`, **IMPOSSIBLE via MCP** (timeout systématique — police variable). Essayé : `Sligoil`, `Sligoil Micro`, `SligoilMicro`, `Sligoil-Micro`, `SligoilMicro-Regular` + `load_font_async` + `set_font_name`. **→ À appliquer manuellement dans Figma** aux titres : sidebar__title, sidebar__logo/header__logo, menu__badge--*, info__title, footer__col-4

## Structure du Figma

### Pages InDesign originales (13 pages)
Pages 01-13 avec positionnement absolu InDesign. Textes + placeholders images gris (#333).

| Page | Frame ID | Corrections appliquées |
|------|----------|----------------------|
| 01 — Accueil | 3:42 | Placeholders harmonisés #333 |
| 07 — Les options | 3:48 | Couleurs violettes corrigées, mosaïque ajoutée |
| 08 — Option Web | 3:49 | Texte description redimensionné 320px |
| 09 — Option Édition | 3:50 | Texte description redimensionné 320px |
| 10 — Option 3D/VFX | 3:51 | Texte description redimensionné 320px |
| Autres pages | 3:43-3:54 | Pas de corrections |

### Pages WEB (reflètent le design HTML/CSS)

| Page | Page ID | Frame ID | Contenu | Auto-layout |
|------|---------|----------|---------|-------------|
| WEB — 01 Accueil (Grille 8 col) | 4:290 | 4:291 | Grille CSS 8 col, 19 zones, sidebar 56px, 1440×1800 | sidebar, school-card, intro-card |
| WEB — 02 Menu overlay | 4:318 | 4:321 | 3 colonnes violettes + barre info lavande, 1440×900 | 3 colonnes, info bar, sidebar |
| WEB — 03 Vue détail | 4:319 | 4:335 | Layout flex 38%/62%, info panel violet, 1440×900 | info panel, sidebar |
| WEB — 04 Footer | 4:320 | 4:348 | Barre lavande 4 colonnes + logos, 1440×160 | footer HORIZONTAL, sidebar |
| WEB — 05 Hover state | 10:40 | 10:43 | Extrait grille avec tooltip violet visible, 1440×900 | tooltip VERTICAL |
| WEB — 06 Breakpoint 4 col | 10:41 | 10:56 | Grille 4 col (≥1520px), 1520×1700 | — |
| WEB — 07 Mobile | 10:42 | 10:80 | Grille 4 col mobile (≤768px), 375×1490 | — |

### Composants Figma créés

| Composant | ID | Clé |
|---|---|---|
| sidebar | 10:30 | a1eb05c... |
| footer | 10:31 | 1e18b8a... |
| detail__info-panel | 10:32 | f37b6ae... |
| school-card | 10:33 | e306d5d... |
| intro-card | 10:34 | 32bc40d... |
| Option=Web | 10:35 | 7e5e7c2... |
| Option=Édition | 10:36 | d29cf69... |
| Option=3D / VFX | 10:37 | a1b7ca3... |

### IDs importants dans les pages WEB

**Page Accueil (4:291) :**
- Sidebar : 4:292
- Zone s (school card) : 4:296, textes 4:314, 4:315
- Zone t (intro) : 4:305, texte 4:316
- Zones images : a=4:295, b=4:297, c=4:298, d=4:299, e=4:300, f=4:301, g=4:302, h=4:303, i=4:304, j=4:306, k=4:307, l=4:308, m=4:309, n=4:310, o=4:311, p=4:312, q=4:313
- Menu toggle : 4:317

**Page Menu (4:321) :**
- Colonnes : web=4:323, edition=4:324, 3d=4:325
- Info bar : 4:326

**Page Détail (4:335) :**
- Image main : 4:337, Info panel : 4:338, Thumbs : 4:339-4:342

## Mapping grille CSS → images

```
"a a a s s c c c"   a=mahira-1.jpg    s=school card violet    c=ayman-logan.jpg
"a a a b b c c c"   b=screenshot-48-36.png
"a a a b b c c c"
"d d d e f c c c"   d=6-copie.png     e=img-9898.jpg          f=vocabase-06.jpg
"d d d e f g g h"   g=marais.png      h=screenshot-46-48.png
"d d d e f g g h"
"i i t t t k k k"   i=screenshot-50-21.png  t=intro violet    k=devos-elodie.jpg
"i i j j j k k k"   j=personnage-yiwei.png
"l l m m m k k k"   l=screenshot-47-34.png  m=vocabase-05.jpg
"n n o o p p p q"   n=scan-blaireau.jpg  o=image07.jpg  p=90969.jpg  q=img-9060.jpg
```

Calcul : 1440px - 56px sidebar = 1384px ÷ 8 = **173px/col**. Hero 6 lignes × 150px = 900px (100vh).

## Ce qui a été fait

- [x] Extraction InDesign complète (13 pages → 5 JSON)
- [x] 13 pages Figma InDesign peuplées (textes + placeholders)
- [x] Corrections InDesign : couleurs p7, textes p8-10, placeholders p1, mosaïque p7
- [x] 4 pages Figma WEB créées (Accueil grille, Menu, Détail, Footer)
- [x] Conversion assets : 5 HEIC→JPG, 3 PSD→PNG, 5 PDF→PNG
- [x] 57 fichiers dans `assets/images/`
- [x] Site HTML/CSS/JS complet et fonctionnel (index.html, style.css, main.js)
- [x] GTWalsheim-Light chargée et appliquée à tous les textes corps (toutes pages)
- [x] Auto-layouts appliqués : sidebars, colonnes menu, info panel, footer, school-card, intro-card
- [x] 8 composants Figma créés (sidebar, footer, detail-info, school-card, intro-card, 3 option-cards)
- [x] 3 pages WEB supplémentaires : Hover state, Breakpoint 4 col, Mobile
- [x] Menu overlay affiné pixel-perfect vs PDF InDesign :
  - [x] Dégradé couleurs colonnes : clair→foncé (gauche→droite) corrigé
  - [x] Texture grain/noise ajoutée sur les 3 colonnes (SVG feTurbulence)
  - [x] Sligoil variable font activée (font-weight: 100 900)
  - [x] Proportions colonnes/bottom ajustées (flex 7:3)
  - [x] Typographie corrigée via analyse Figma (fichier TF-Hélène importé depuis InDesign) :
    - [x] Badges (WEB, ÉDITION, 3D) → GTWalsheim Light 21px (était Sligoil)
    - [x] Listes colonnes → Sligoil 11px line-height 2.2 (était GTWalsheim 15px)
    - [x] INFORMATIONS GÉNÉRALES → GTWalsheim Light 21px (était Sligoil bold 26px)
    - [x] Info-list → Sligoil 12px line-height 2.2 (était 15px)
    - [x] Sidebar titre → Sligoil weight 300 (était 700)
  - [x] Grain texture : mix-blend-mode hard-light ajouté (conforme Figma)
  - [x] Footer : couleur texte corrigée #652da1 (était #2a1245, confirmé par Figma)

## Ce qui reste à faire

### 1. Sligoil Micro (MANUEL)
- [ ] Appliquer Sligoil Micro manuellement dans Figma aux titres (sidebar__title, sidebar__logo, menu__badge--*, info__title, footer__col-4)

### 2. Images Figma
- [ ] Remplacer placeholders gris par vraies images (MCP ne peut pas importer → drag & drop manuel)

### 3. Restant hors Figma
- [ ] EPS `899.eps` : pas de conversion auto (page 8 option Web)
- [ ] Git commit des changements

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `index.html` | 303 lignes — sidebar + grille 19 zones + menu + détail + footer |
| `assets/css/style.css` | 717 lignes — grid-template-areas, 3 breakpoints |
| `assets/js/main.js` | 206 lignes — 8 projets, modal, menu, Escape |
| `docs/extraction/*.json` | 5 fichiers JSON extraits d'InDesign |
| `docs/plans/CONTEXTE-REPRISE.md` | Ce fichier |
| `contexte.md` | Ancien contexte (HTML/CSS focus) |

## Prochaine étape
→ Appliquer Sligoil Micro manuellement aux titres dans Figma → Remplacer les placeholders gris par les vraies images (drag & drop) → Git commit
