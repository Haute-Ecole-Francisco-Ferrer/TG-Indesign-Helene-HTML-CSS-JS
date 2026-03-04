# Contexte de reprise — Techniques Graphiques HEFF

## Projet
- **Chemin** : `/Users/man/htdocs/techniques-graphiques-Helene/`
- **URL locale** : `http://127.0.0.1:5501/index.html`
- **Repo** : `https://github.com/Haute-Ecole-Francisco-Ferrer/TG-Indesign-Helene-HTML-CSS-JS`
- **But** : Site vitrine creative des etudiants Techniques Graphiques HEFF (Bruxelles)

## Stack technique
- HTML5 / CSS3 (CSS Grid, Flexbox) / Vanilla JS
- Polices : Sligoil VF (titres), GTWalsheim-Light (corps)
- Couleurs : Fond #0d0d0d, Texte #fff, Accent violet rgb(96,38,158), Footer lavande #d4b8e8
- Test visuel : Playwright MCP sur http://127.0.0.1:5501/index.html

## Fichiers cles

| Fichier | Role |
|---------|------|
| `index.html` | Page principale — sidebar + grille (19 zones) + menu overlay + vue detail + footer |
| `assets/css/style.css` | Styles complets (grid, sidebar, tooltips, menu overlay, detail, footer, 3 breakpoints) |
| `assets/js/main.js` | Interactivite (ouverture detail, menu toggle, 8 projets avec donnees) |
| `assets/fonts/` | SligoilVF.ttf, GTWalsheim-Light.otf |
| `assets/images/` | 22 images web-ready |
| `docs/extraction/*.json` | Donnees extraites d'InDesign (structure, styles, couleurs, textes, images) |
| `contexte.md` | Ce fichier de reprise |
| `.gitignore` | Exclut preparation/, .DS_Store, .playwright-mcp/, workspace |

## Etat actuel (2026-02-19)

### Ce qui est fait
- [x] Extraction InDesign complete (13 pages → JSON)
- [x] Design Figma complet (13 pages peuplees)
- [x] Structure HTML : sidebar fixe, grille 8 colonnes, vue detail modale
- [x] 17 items dans la grille avec images et tooltips
- [x] Vue detail : image principale + 4 thumbnails + panneau info violet
- [x] grid-template-rows : hero = 100vh (6 lignes en 8 col, 4 lignes en 4 col)
- [x] Media query min-width:1520px : 4 colonnes visuelles (1 item/colonne)
- [x] Item a (hero) sur 2 colonnes en layout large
- [x] Sidebar violette rgb(96,38,158), writing-mode vertical-rl + rotate(180deg)
- [x] Sidebar : justify-content space-between, titre en haut, "Heff" pill en bas
- [x] Menu hamburger : cercle violet 44px en haut a droite
- [x] Bouton close detail : cercle violet 44px avec x blanc
- [x] Tooltips : flush en bas, badge option uppercase fond semi-transparent, mots en gras
- [x] School card (zone `s`) : item de grille violet "Haute Ecole Francisco Ferrer"
- [x] Intro banner (zone `t`) : item de grille violet "Bienvenue... Techniques Graphiques"
- [x] Zone `t` entouree d'images (i a gauche, k a droite)
- [x] 8 projets avec donnees completes dans main.js
- [x] Tous les 17 items avec tooltips enrichis
- [x] Grille sans bordures noires (gap: 0)
- [x] Footer lavande 4 colonnes (infos ecole, adresse, transports, logos CSS)
- [x] Menu overlay plein ecran 100vh (3 colonnes WEB/EDITION/3D + barre INFORMATIONS GENERALES)
- [x] Menu : couleurs fideles InDesign (degrades violet), barre info lavande avec texte violet
- [x] Menu : bouton hamburger → x (cercle bordure blanche), fermeture Escape
- [x] Nettoyage projet : 35 screenshots temporaires supprimes
- [x] Git initialise, remote GitHub, push sur main

### A faire
- [ ] Conversion assets restants (3 PSD, 5 HEIC, 6 PDF dans preparation/Links/)
- [ ] Optimiser le responsive mobile (tester 768px)
- [ ] Accessibilite (focus visible, navigation clavier)
- [ ] Performance (taille images, compression)
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

## Menu overlay (page 7 InDesign)
- 3 colonnes : WEB rgb(96,38,158), EDITION rgb(113,52,172), 3D rgb(130,65,188)
- Colonnes flex:7, barre info flex:3 → 100vh total
- Barre INFORMATIONS GENERALES : fond lavande rgba(210,190,230,0.95), texte violet
- Texte info en Sligoil bold (comme InDesign page 7 fillColor = R=96 V=38 B=158)
- Badges titre avec bordure blanche semi-transparente
- Fleches → en bas de chaque colonne (margin-top: auto)

## Footer
- Fond lavande #d4b8e8, texte #2a1245
- 4 colonnes grid : infos ecole | adresse+contact | transports | logos+nom
- Logos BXL/HEFF en cercles CSS (pas d'assets image)
- Responsive mobile : 2 colonnes, logos pleine largeur

## Decisions prises
- Grille CSS avec grid-template-areas nommes (a-q + s + t)
- Sidebar fixe 56px violet, writing-mode vertical-rl rotate(180deg)
- School card `s` = item de grille (pas flottant)
- Intro banner `t` = item de grille entoure d'images
- Tooltips flush en bas des items, badge option uppercase
- Menu overlay z-index:90 (sous sidebar z-index:100 et burger z-index:110)
- Menu + bouton close = cercles violets 44px
- Vue detail : flex layout 38%/62%
- Vanilla JS uniquement, lazy loading images
- Gap:0 sur la grille (pas de bordures noires entre images)

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

## Prochaine etape
- Optimiser le responsive mobile (tester 768px)
- Pages secondaires selon les 13 pages Figma/InDesign
- Conversion assets restants
