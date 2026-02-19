# Contexte de reprise — Techniques Graphiques HEFF

## Projet
- **Chemin** : `/Users/man/htdocs/techniques-graphiques-Helene/`
- **URL locale** : `http://127.0.0.1:5501/index.html`
- **But** : Site vitrine creative des etudiants Techniques Graphiques HEFF (Bruxelles)

## Stack technique
- HTML5 / CSS3 (CSS Grid, Flexbox) / Vanilla JS
- Polices : Sligoil VF (titres), GTWalsheim-Light (corps)
- Couleurs : Fond #0d0d0d, Texte #fff, Accent violet rgb(96,38,158)
- Test visuel : Playwright MCP sur http://127.0.0.1:5501/index.html

## Fichiers cles

| Fichier | Role |
|---------|------|
| `index.html` | Page principale — sidebar + grille (19 zones) + menu burger + vue detail |
| `assets/css/style.css` | Styles complets (grid, sidebar, tooltips, menu, detail, 3 breakpoints) |
| `assets/js/main.js` | Interactivite (ouverture detail, 8 projets avec donnees) |
| `assets/fonts/` | SligoilVF.ttf, GTWalsheim-Light.otf |
| `assets/images/` | 22 images web-ready |
| `docs/extraction/*.json` | Donnees extraites d'InDesign (structure, styles, couleurs, textes, images) |

## Etat actuel (2026-02-19)

### Ce qui est fait (sessions precedentes)
- [x] Extraction InDesign complete (13 pages → JSON)
- [x] Design Figma complet (13 pages peuplees)
- [x] Structure HTML : sidebar fixe, grille 8 colonnes, vue detail modale
- [x] 17 items dans la grille avec images et tooltips
- [x] Vue detail : image principale + 4 thumbnails + panneau info violet

### Fait cette session (2026-02-19)
- [x] grid-template-rows : hero = 100vh (6 lignes en 8 col, 4 lignes en 4 col)
- [x] Media query min-width:1520px : 4 colonnes visuelles (1 item/colonne)
- [x] Item a (hero) sur 2 colonnes en layout large
- [x] Sidebar violette rgb(96,38,158), writing-mode vertical-rl + rotate(180deg)
- [x] Sidebar : justify-content space-between, titre en haut, "Heff" pill en bas
- [x] Menu hamburger : cercle violet 44px en haut a droite (comme Figma)
- [x] Bouton close detail : cercle violet 44px avec x blanc (bien visible)
- [x] Tooltips : flush en bas, badge option uppercase fond semi-transparent, mots en gras
- [x] School card (zone `s`) : item de grille violet "Haute Ecole Francisco Ferrer" en haut centre
- [x] Intro banner (zone `t`) : item de grille violet "Bienvenue... Techniques Graphiques" sous le hero
- [x] Zone `t` entouree d'images (i a gauche, k a droite) — pas de bandes noires
- [x] 8 projets avec donnees completes dans main.js
- [x] Tous les 17 items avec tooltips enrichis (descriptions, auteurs, mots en gras, coeurs)

### A faire
- [ ] Footer : infos ecole, adresse, telephone, email, transports (STIB/SNCB), logos BXL/HEFF
- [ ] Conversion assets restants (3 PSD, 5 HEIC, 6 PDF dans preparation/Links/)
- [ ] Optimiser le responsive mobile (tester 768px)
- [ ] Accessibilite (focus visible, navigation clavier)
- [ ] Performance (taille images, compression)
- [ ] Fonctionnalite du menu hamburger
- [ ] Pages secondaires (options, galerie, contact) selon les 13 pages Figma
- [ ] Theme WordPress (phase ulterieure)

## Architecture de la grille

### Zones grid-template-areas
19 zones : a-q (17 projets) + s (school card) + t (intro banner)

### Layout 8 colonnes (769-1519px) — 12 lignes
```
"a a a s s c c c"   hero row 1
"a a a b b c c c"   hero row 2
"a a a b b c c c"   hero row 3
"d d d e f c c c"   hero row 4
"d d d e f g g h"   hero row 5
"d d d e f g g h"   hero row 6  ← fin 100vh
"i i t t t k k k"   row 7 (intro banner entre images)
"i i j j j k k k"   row 8
"l l m m m k k k"   row 9
"n n o o p p p q"   row 10
"n n o o p p p q"   row 11
"n n o o p p p q"   row 12
```

### Layout 4 colonnes (>=1520px) — 8 lignes
```
"a a s c"   hero row 1
"a a b c"   hero row 2
"e f g d"   hero row 3
"e f h d"   hero row 4  ← fin 100vh
"i t t k"   row 5 (intro banner entre images)
"i j l k"   row 6
"m n o p"   row 7
"m n o q"   row 8
```

### Layout mobile (<=768px) — 10 lignes
```
"s s s s"   school card pleine largeur
"a a b b" / "c c c c" / "t t t t" / etc.
```

## Decisions prises
- Grille CSS avec grid-template-areas nommes (a-q + s + t)
- Sidebar fixe 56px violet, writing-mode vertical-rl rotate(180deg)
- School card `s` = item de grille (pas flottant)
- Intro banner `t` = item de grille entoure d'images
- Tooltips flush en bas des items, badge option uppercase
- Menu + bouton close = cercles violets 44px
- Vue detail : flex layout 38%/62%
- Vanilla JS uniquement, lazy loading images

## Breakpoints responsive
| Breakpoint | Colonnes | Lignes 100vh | Sidebar |
|------------|----------|-------------|---------|
| <= 768px | 4 col (mobile) | auto | 44px |
| 769-1519px | 8 col (defaut) | 6 premieres | 56px |
| >= 1520px | 4 col (large) | 4 premieres | 56px |

## Projets dans main.js
| ID | Auteur | Option | Description courte |
|----|--------|--------|-------------------|
| mahira | Mahira, 2e | edition | Packagings chocolatier x herboristerie |
| iman | Iman, 2e | edition | Livret imprime cine club Palace |
| ayman | Hayman & Logan, 3e | 3D/VFX | Sequence film prises de vues + 3D |
| julie | Julie Braban, 3e | web | Site musee du design Bruxelles |
| vocabase | Sofian & Melina, 2e | web | Vocabase design editorial et web |
| elodie | Elodie Devos, 1re | edition | Etiquettes kombucha |
| yiwei | Yiwei, 2e | 3D/VFX | Modelisation personnage 3D |
| abir | Abir, 2e | edition | Illegaal x Habeebee identite visuelle |

## Footer (a implementer)
Contenu du footer (depuis Figma) :
- Col 1 : "TECHNIQUES GRAPHIQUES est un departement de la Haute Ecole Francisco Ferrer"
- Col 2 : "Quai de Willebroeck 33, 1000 Bruxelles" + "+32 (0)2 279 57 92" + "heff.technique@he-ferrer.eu"
- Col 3 : "STIB / SNCB" + "TRAM 4 • 10 • 25 • 55" + "BUS 14 • 20 • 56 • 61 • 80 • 88" + "TRAIN • GARE DU NORD"
- Col 4 : Logos BXL + HEFF + "HAUTE ECOLE FRANCISCO FERRER TECHNIQUE"
- Fond : violet clair/lavande

## Prochaine etape
- Implementer le footer
- Tester le responsive mobile
- Fonctionnalite menu hamburger
