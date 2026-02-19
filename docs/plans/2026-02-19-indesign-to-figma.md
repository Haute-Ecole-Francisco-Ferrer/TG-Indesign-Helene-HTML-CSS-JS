# InDesign → Figma Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extraire la maquette InDesign HEFF (Techniques Graphiques) et la recréer dans Figma avec structure BEM et auto-layouts.

**Architecture:** MCP InDesign (lucdesign/indesign-mcp-server) extrait les données du document via ExtendScript → Claude Code orchestre → MCP talk-to-figma reconstruit le design dans Figma. Phase Figma uniquement — pas de code web.

**Tech Stack:** Node.js (MCP InDesign), Bun (MCP Figma), ExtendScript (scripting InDesign), AppleScript (bridge macOS)

---

## Prérequis

- InDesign 2026 ouvert avec le fichier `HEFF_site_TG.indd`
- Figma Desktop ouvert
- WebSocket talk-to-figma actif (`cd ~/claude-talk-to-figma-mcp && bun run dist/socket.js`)
- Plugin Figma "Claude MCP Plugin" connecté

## Fichiers clés du projet

| Fichier | Rôle |
|---------|------|
| `preparation/Dossier HEFF_site_TG/HEFF_site_TG.indd` | Source InDesign (21 Mo) |
| `preparation/Dossier HEFF_site_TG/HEFF_site_TG.idml` | Format échange InDesign (XML) |
| `preparation/Dossier HEFF_site_TG/Links/` | 44 assets visuels (JPG, PDF, PSD, PNG, HEIC) |
| `preparation/Dossier HEFF_site_TG/Document fonts/` | GTWalsheim-Light.otf, SligoilVF.ttf |

---

### Task 1: Installer et configurer le MCP InDesign

**Files:**
- Clone: `~/indesign-mcp-server/` (depuis GitHub)
- Modify: `~/indesign-mcp-server/index.js` (version InDesign)
- Modify: `~/.claude.json` (ajouter le MCP server)

**Step 1: Cloner le repo lucdesign/indesign-mcp-server**

Run:
```bash
cd ~ && git clone https://github.com/lucdesign/indesign-mcp-server.git
```
Expected: Repo cloné dans `~/indesign-mcp-server/`

**Step 2: Installer les dépendances**

Run:
```bash
cd ~/indesign-mcp-server && npm install
```
Expected: `@modelcontextprotocol/sdk` installé

**Step 3: Adapter la version InDesign**

Le fichier `index.js` contient des références hardcodées à `"Adobe InDesign 2025"`. Les remplacer par `"Adobe InDesign 2026"` (la version active sur cette machine).

Chercher toutes les occurrences de `Adobe InDesign 2025` dans `index.js` et les remplacer par `Adobe InDesign 2026`.

**Step 4: Configurer le MCP dans Claude Code**

Ajouter dans `~/.claude.json` sous `mcpServers` :
```json
"indesign-mcp": {
  "command": "node",
  "args": ["/Users/man/indesign-mcp-server/index.js"],
  "allowedTools": ["*"]
}
```

**Step 5: Redémarrer Claude Code et tester**

Relancer Claude Code. Tester avec l'outil MCP `get_document_info` sur le document InDesign ouvert.
Expected: Retour avec les métadonnées du document (nb pages, dimensions, etc.)

**Step 6: Commit**

```bash
cd ~/indesign-mcp-server
git add -A
git commit -m "chore: adapt InDesign MCP server for InDesign 2026"
```

---

### Task 2: Extraire la structure du document InDesign

**Objectif:** Obtenir une vue complète du document — pages, dimensions, contenu par page.

**Step 1: Extraire les infos document**

Utiliser l'outil MCP `get_document_info`.
Expected: Nombre de pages, dimensions (largeur × hauteur), unités, marges.

**Step 2: Extraire la structure page par page**

Utiliser `execute_indesign_code` avec un script ExtendScript qui parcourt chaque page et liste :
- Numéro de page
- Nombre de blocs texte
- Nombre de blocs images
- Nombre de formes

```javascript
// ExtendScript à exécuter via execute_indesign_code
var doc = app.activeDocument;
var result = [];
for (var i = 0; i < doc.pages.length; i++) {
    var page = doc.pages[i];
    var textFrames = 0, imageFrames = 0, shapes = 0;
    for (var j = 0; j < page.allPageItems.length; j++) {
        var item = page.allPageItems[j];
        if (item instanceof TextFrame) textFrames++;
        else if (item instanceof Rectangle && item.images.length > 0) imageFrames++;
        else shapes++;
    }
    result.push({
        page: i + 1,
        name: page.name,
        textFrames: textFrames,
        imageFrames: imageFrames,
        shapes: shapes
    });
}
JSON.stringify(result, null, 2);
```

Expected: JSON avec la répartition du contenu par page.

**Step 3: Sauvegarder les données extraites**

Sauvegarder le résultat dans `docs/extraction/document-structure.json`.

---

### Task 3: Extraire les styles typographiques

**Objectif:** Récupérer toutes les définitions de styles (paragraph styles + character styles) pour les reproduire dans Figma.

**Files:**
- Create: `docs/extraction/styles.json`

**Step 1: Lister les styles via MCP**

Utiliser l'outil `list_styles` du MCP InDesign.
Expected: Liste des paragraph styles et character styles.

**Step 2: Extraire les propriétés détaillées des styles**

Utiliser `execute_indesign_code` :

```javascript
var doc = app.activeDocument;
var styles = [];
for (var i = 0; i < doc.paragraphStyles.length; i++) {
    var s = doc.paragraphStyles[i];
    styles.push({
        name: s.name,
        fontFamily: s.appliedFont ? s.appliedFont.fontFamily : "unknown",
        fontStyle: s.fontStyle,
        pointSize: s.pointSize,
        leading: s.leading,
        tracking: s.tracking,
        fillColor: s.fillColor ? s.fillColor.name : "unknown",
        justification: s.justification.toString(),
        spaceAfter: s.spaceAfter,
        spaceBefore: s.spaceBefore
    });
}
JSON.stringify(styles, null, 2);
```

Expected: JSON avec les propriétés typographiques de chaque style.

**Step 3: Sauvegarder**

Sauvegarder dans `docs/extraction/styles.json`.

---

### Task 4: Extraire les couleurs

**Files:**
- Create: `docs/extraction/colors.json`

**Step 1: Extraire la palette de couleurs**

Utiliser `execute_indesign_code` :

```javascript
var doc = app.activeDocument;
var colors = [];
for (var i = 0; i < doc.colors.length; i++) {
    var c = doc.colors[i];
    if (c.name !== "" && c.name.indexOf("[") !== 0) {
        colors.push({
            name: c.name,
            model: c.model.toString(),
            colorValue: c.colorValue,
            space: c.space.toString()
        });
    }
}
JSON.stringify(colors, null, 2);
```

Expected: JSON avec les couleurs nommées (CMJN/RVB).

---

### Task 5: Extraire les blocs texte avec positions

**Objectif:** Pour chaque page, extraire chaque bloc texte avec son contenu, sa position, et son style.

**Files:**
- Create: `docs/extraction/text-frames.json`

**Step 1: Extraire les text frames page par page**

Utiliser `execute_indesign_code` avec un script qui, pour chaque page, collecte :
- Position (x, y) en points
- Dimensions (largeur, hauteur) en points
- Contenu texte
- Style de paragraphe appliqué
- Fonte et taille

```javascript
var doc = app.activeDocument;
var pages = [];
for (var i = 0; i < doc.pages.length; i++) {
    var page = doc.pages[i];
    var frames = [];
    for (var j = 0; j < page.textFrames.length; j++) {
        var tf = page.textFrames[j];
        var bounds = tf.geometricBounds; // [y1, x1, y2, x2]
        var content = "";
        try { content = tf.contents.substring(0, 200); } catch(e) {}
        var styleName = "";
        try { styleName = tf.paragraphs[0].appliedParagraphStyle.name; } catch(e) {}
        var fontName = "";
        var fontSize = 0;
        try {
            fontName = tf.paragraphs[0].appliedFont.fontFamily;
            fontSize = tf.paragraphs[0].pointSize;
        } catch(e) {}
        frames.push({
            x: bounds[1],
            y: bounds[0],
            width: bounds[3] - bounds[1],
            height: bounds[2] - bounds[0],
            content: content,
            paragraphStyle: styleName,
            fontFamily: fontName,
            fontSize: fontSize
        });
    }
    pages.push({ page: i + 1, textFrames: frames });
}
JSON.stringify(pages, null, 2);
```

Expected: JSON structuré avec toutes les text frames et leurs propriétés.

---

### Task 6: Extraire les blocs images avec sources

**Files:**
- Create: `docs/extraction/image-frames.json`

**Step 1: Extraire les images**

```javascript
var doc = app.activeDocument;
var pages = [];
for (var i = 0; i < doc.pages.length; i++) {
    var page = doc.pages[i];
    var images = [];
    for (var j = 0; j < page.allPageItems.length; j++) {
        var item = page.allPageItems[j];
        if (item instanceof Rectangle && item.images.length > 0) {
            var bounds = item.geometricBounds;
            var link = "";
            try { link = item.images[0].itemLink.filePath; } catch(e) {}
            images.push({
                x: bounds[1],
                y: bounds[0],
                width: bounds[3] - bounds[1],
                height: bounds[2] - bounds[0],
                sourceFile: link
            });
        }
    }
    pages.push({ page: i + 1, images: images });
}
JSON.stringify(pages, null, 2);
```

Expected: JSON avec les positions et chemins source de chaque image.

---

### Task 7: Préparer les assets images pour Figma

**Objectif:** Convertir les assets non-web (PSD, HEIC, EPS, AI) en formats utilisables.

**Files:**
- Create: `assets/images/` (dossier avec images optimisées)

**Step 1: Lister les formats non-web dans Links/**

```bash
ls "preparation/Dossier HEFF_site_TG/Links/" | grep -iE '\.(psd|heic|ai|eps)$'
```

**Step 2: Convertir les images avec sips/ImageMagick**

Pour chaque fichier non-web :
- HEIC → JPG via `sips --setProperty format jpeg`
- PSD → PNG via `sips --setProperty format png` ou ImageMagick
- AI/EPS : exporter manuellement depuis Illustrator ou utiliser le PDF comme fallback

**Step 3: Copier les images web-ready (JPG, PNG) dans `assets/images/`**

```bash
mkdir -p assets/images
cp "preparation/Dossier HEFF_site_TG/Links/"*.jpg assets/images/
cp "preparation/Dossier HEFF_site_TG/Links/"*.png assets/images/
```

---

### Task 8: Se connecter à Figma et créer le document

**Prérequis:**
- Figma Desktop ouvert
- WebSocket server : `cd ~/claude-talk-to-figma-mcp && bun run dist/socket.js`
- Plugin Figma connecté — noter le channel ID

**Step 1: Rejoindre le channel Figma**

Utiliser l'outil MCP `join_channel` avec le channel ID du plugin.
Expected: Connexion établie.

**Step 2: Créer les pages dans Figma**

Pour chaque spread/page du document InDesign, créer une page Figma correspondante :
- Page 1 → "Couverture"
- Page 2 → "Accueil"
- Pages 3-12 → Nommées selon le contenu extrait
- Page 13 → "Contact"

Utiliser `create_page` pour chaque page.

**Step 3: Créer un frame principal sur chaque page**

Utiliser `create_frame` avec les dimensions du document InDesign (converties de points en pixels) pour chaque page.

---

### Task 9: Recréer les éléments dans Figma — Page par page

**Objectif:** Pour chaque page, recréer les text frames et image frames aux bonnes positions.

**Step 1: Convertir les unités**

InDesign utilise des points (1pt = 1.333px à 96dpi). Multiplier toutes les coordonnées par 1.333 pour Figma.

**Step 2: Pour chaque page, créer les frames texte**

En utilisant les données de `text-frames.json`, pour chaque text frame :
1. `create_frame` avec les dimensions
2. `create_text` avec le contenu
3. Positionner avec `move_node`
4. Appliquer la fonte via `set_font_name` et `set_font_size`

**Step 3: Pour chaque page, placer les images**

En utilisant les données de `image-frames.json` :
1. `create_rectangle` pour le placeholder
2. Positionner avec `move_node`

Note : L'import d'images dans Figma via MCP est limité — les images seront placées manuellement ou via le plugin Figma. Les rectangles avec les bonnes dimensions servent de placeholders.

**Step 4: Appliquer les couleurs**

Utiliser `set_fill_color` pour appliquer les couleurs extraites.

---

### Task 10: Structurer le Figma — Naming BEM

**Objectif:** Renommer tous les layers avec une nomenclature BEM exploitable pour le développement web.

**Step 1: Définir la convention BEM pour le projet**

Convention à appliquer :
```
header                    (block)
header__logo              (element)
header__nav               (element)
header__nav-item          (element)
header__nav-item--active  (modifier)

hero                      (block)
hero__title               (element)
hero__subtitle            (element)
hero__image               (element)

section-options           (block)
section-options__card     (element)
section-options__card--web (modifier)

project-card              (block)
project-card__image       (element)
project-card__title       (element)
project-card__meta        (element)

footer                    (block)
footer__address           (element)
footer__contact           (element)
```

**Step 2: Renommer les layers avec `rename_node`**

Pour chaque page, identifier les sections logiques et appliquer les noms BEM en utilisant l'outil MCP `rename_node`.

---

### Task 11: Structurer le Figma — Auto-layouts

**Objectif:** Mettre en place les auto-layouts dans Figma pour que la structure reflète la logique CSS flexbox.

**Step 1: Appliquer auto-layout au header**

Utiliser `set_auto_layout` sur le frame header :
- Direction : horizontal
- Gap : 16px
- Padding : 24px

**Step 2: Appliquer auto-layout aux sections de contenu**

Pour chaque section :
- Direction : vertical ou horizontal selon le layout
- Gap : adapté à l'espacement InDesign
- Padding : adapté aux marges InDesign

**Step 3: Appliquer auto-layout aux grilles de cards**

- Direction : horizontal + wrap
- Gap : 24px
- Items : fill container

**Step 4: Appliquer auto-layout au footer**

- Direction : vertical ou horizontal selon le design

---

### Task 12: Créer les composants Figma

**Objectif:** Identifier et créer les composants réutilisables.

**Step 1: Identifier les patterns répétés**

D'après le contenu extrait, les composants probables sont :
- **Project Card** : image + option tag + titre + étudiant + année
- **Section Title** : titre en Sligoil + sous-titre en GTWalsheim
- **Option Badge** : "web", "édition", "3D / effets spéciaux"
- **Navigation Item** : lien de nav

**Step 2: Créer un composant Project Card**

1. Sélectionner un exemple de card projet
2. Le convertir en composant Figma
3. Définir les variantes si nécessaire (par option : web, édition, 3D)

**Step 3: Créer les autres composants**

Répéter pour chaque pattern identifié.

---

### Task 13: Vérification et validation visuelle

**Step 1: Comparer chaque page Figma avec le PDF InDesign**

Ouvrir le PDF côte à côte avec Figma et vérifier :
- Positions des éléments
- Tailles de texte
- Couleurs
- Espacements

**Step 2: Prendre des screenshots via figma-console-mcp**

Utiliser `figma_take_screenshot` pour capturer chaque page et comparer visuellement.

**Step 3: Corriger les écarts**

Ajuster les éléments qui ne correspondent pas.

---

### Task 14: Mettre à jour le fichier de contexte de reprise

**Files:**
- Create: `docs/plans/CONTEXTE-REPRISE.md`

**Step 1: Écrire le fichier de reprise**

Documenter :
- Ce qui a été fait (avec checkmarks)
- Ce qui reste à faire
- Décisions prises
- Fichiers clés
- Prochaine étape

---

## Résumé des fichiers créés/modifiés

| Fichier | Action |
|---------|--------|
| `~/indesign-mcp-server/` | Clone + adaptation version |
| `~/.claude.json` | Ajout MCP InDesign |
| `docs/extraction/document-structure.json` | Structure pages |
| `docs/extraction/styles.json` | Styles typographiques |
| `docs/extraction/colors.json` | Palette couleurs |
| `docs/extraction/text-frames.json` | Blocs texte + positions |
| `docs/extraction/image-frames.json` | Blocs images + sources |
| `assets/images/` | Assets convertis |
| `docs/plans/CONTEXTE-REPRISE.md` | Fichier de reprise |

## Notes importantes

- **InDesign 2026** est la version active — adapter le MCP en conséquence
- **Polices** : Sligoil (variable) et GTWalsheim-Light doivent être installées dans Figma
- **Images** : Le MCP Figma ne peut pas importer d'images directement — utiliser des placeholders dimensionnés puis placer manuellement
- **Conversion unités** : InDesign points → Figma pixels = × 1.333
- **Pas de code web** dans cette phase — focus Figma uniquement
