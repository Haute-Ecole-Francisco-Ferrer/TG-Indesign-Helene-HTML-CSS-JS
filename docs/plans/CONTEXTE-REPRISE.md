# Contexte de reprise — InDesign → Figma Pipeline

## Projet
- **Chemin** : `/Users/man/htdocs/techniques-graphiques-Helene/`
- **Figma** : https://www.figma.com/design/BP5yIRa2ibXTJugNtu9xww/TG-Indesign-Hélène
- **But** : Extraire la maquette InDesign HEFF (Techniques Graphiques, Haute École Francisco Ferrer, Bruxelles) et la recréer dans Figma avec structure BEM et auto-layouts. Ensuite HTML/CSS/JS puis thème WordPress.

## Stack technique
- **Source** : InDesign 2026 (fichier `preparation/Dossier HEFF_site_TG/HEFF_site_TG.indd`)
- **Extraction** : ExtendScript via `osascript` (AppleScript → InDesign)
- **Figma MCP** : `claude-talk-to-figma` (WebSocket port 3055, plugin dans `~/claude-talk-to-figma-mcp/src/claude_mcp_plugin/manifest.json`)
- **MCP InDesign** : `~/indesign-mcp-server/` (installé mais non chargé par Claude Code — on utilise osascript directement)

## Pour reprendre le travail Figma
1. Ouvrir Figma Desktop sur le fichier TG-Indesign-Hélène
2. Lancer le WebSocket : `cd ~/claude-talk-to-figma-mcp && bun run dist/socket.js`
3. Dans Figma : Plugins → Development → Claude MCP Plugin → Connect
4. Donner le channel ID à Claude
5. Claude fait `join_channel` puis peut travailler

## Ce qui a été fait

### Extraction InDesign (100% terminée)
Tous les fichiers sont dans `docs/extraction/` :
- `document-structure.json` — 13 pages, 1024px large, hauteurs variables (1220, 1214, 924, 1092)
- `styles.json` — Sligoil (Micro Bold, titres 30-36pt), GTWalsheim-Light (corps 7-22pt)
- `colors.json` — Noir, Blanc (Paper), Violet rgb(96,38,158)
- `text-frames.json` — Tous les blocs texte avec position (x,y), dimensions, contenu, style, fonte
- `image-frames.json` — Tous les blocs images avec position, dimensions, chemin source (Links/)

### Figma — Pages et frames (100%)
13 pages créées avec frames aux bonnes dimensions, fond noir :

| Page | Page ID | Frame ID | Dimensions | Contenu |
|------|---------|----------|-----------|---------|
| 01 — Accueil | 0:1 | 3:42 | 1024×1220 | **PEUPLÉE** : 3 textes + 16 placeholders images |
| 02 — Accueil (hover) | 3:30 | 3:43 | 1024×1220 | **PEUPLÉE** : 6 textes + 16 placeholders |
| 03 — Accueil (sélection) | 3:31 | 3:44 | 1024×1220 | **PEUPLÉE** : 6 textes + 16 placeholders |
| 04 — Projet détail (Édition) | 3:32 | 3:45 | 1024×1220 | **PEUPLÉE** : 4 textes + 20 placeholders |
| 05 — Projet détail (3D/VFX) | 3:33 | 3:46 | 1024×1220 | **PEUPLÉE** : 4 textes + 17 placeholders |
| 06 — Galerie | 3:34 | 3:47 | 1024×1220 | **PEUPLÉE** : 3 textes + 20 placeholders |
| 07 — Les options | 3:35 | 3:48 | 1024×1214 | **PEUPLÉE** : 7 textes + 4 shapes |
| 08 — Option Web | 3:36 | 3:49 | 1024×924 | **PEUPLÉE** : 6 textes + 6 placeholders |
| 09 — Option Édition | 3:37 | 3:50 | 1024×924 | **PEUPLÉE** : 4 textes + 7 placeholders |
| 10 — Option 3D/VFX | 3:38 | 3:51 | 1024×924 | **PEUPLÉE** : 6 textes + 6 placeholders |
| 11 — Galerie élargie | 3:39 | 3:52 | 1024×924 | **PEUPLÉE** : 2 textes + 6 placeholders |
| 12 — Contact | 3:40 | 3:53 | 1024×1092 | **PEUPLÉE** : 3 textes + 18 placeholders |
| 13 — Contact (variante) | 3:41 | 3:54 | 1024×1092 | **PEUPLÉE** : 3 textes + 18 placeholders |

## Ce qui reste à faire

### ~~1. Peupler les pages vides (10 pages)~~ FAIT
Toutes les 13 pages sont peuplées avec textes et placeholders images (rectangles gris #333).

### 2. Conversion des assets images
Les fichiers dans `preparation/Dossier HEFF_site_TG/Links/` contiennent des formats non-web :
- 3 PSD → convertir en PNG
- 5 HEIC → convertir en JPG (`sips --setProperty format jpeg`)
- 1 AI, 1 EPS → exporter manuellement ou utiliser PDF comme fallback
- 6 PDF → exporter en PNG
- Les JPG et PNG existants sont prêts

### 3. Structuration Figma
- **Naming BEM** : Déjà appliqué sur les pages peuplées. Continuer sur les nouvelles pages.
- **Auto-layouts** : header, grilles, cards, footer — mapper sur CSS flexbox
- **Composants** : project-card, option-card, sidebar, header, footer

### 4. Plus tard (pas dans cette phase)
- Code HTML/CSS/JS statique
- Thème WordPress custom

## Décisions prises

| Décision | Choix | Raison |
|----------|-------|--------|
| MCP InDesign | osascript direct | MCP non chargé par Claude Code, osascript fait la même chose |
| Placement Figma | Élément par élément via MCP | Plus précis que batch, l'utilisateur n'est pas pressé |
| Naming | BEM (block__element--modifier) | Mapping direct vers classes CSS |
| Figma | Étape intermédiaire | Pas source de vérité long terme |
| Polices | Sligoil VF (titres), GTWalsheim-Light (corps) | Extraites du document InDesign |
| Couleur accent | Violet rgb(96,38,158) → Figma {r:0.376, g:0.149, b:0.62} | Unique couleur custom du design |
| Fond | Noir {r:0.05, g:0.05, b:0.05} | Cohérent avec le design InDesign |

## Contenu du site (pour référence)
- **HEFF** = Haute École Francisco Ferrer, Bruxelles
- **Département** : Techniques Graphiques
- **3 options** : Web, Édition, 3D / Effets spéciaux
- **Contenu** : Vitrine créative des étudiants (projets de packaging, sites web, livrets, 3D/VFX)
- **Adresse** : Quai de Willebroeck 33, 1000 Bruxelles — +32 (0)2 279 57 92 — heff.technique@he-ferrer.eu

## Éléments récurrents sur chaque page (header/sidebar)
Ces éléments apparaissent sur quasi toutes les pages InDesign :
- Logo "Heff" : x=15, y=419, fontSize=22, GTWalsheim-Light, blanc
- Sidebar "Techniques graphiques" : x=20, y=26, fontSize=30, Sligoil Micro Bold, blanc
- Bloc intro "Bienvenue sur la vitrine..." : x=597, y=563, fontSize=14, GTWalsheim-Light, blanc

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `preparation/Dossier HEFF_site_TG/HEFF_site_TG.indd` | Source InDesign (21 Mo) |
| `preparation/Dossier HEFF_site_TG/HEFF_site_TG.idml` | Format échange (XML dans ZIP) |
| `preparation/Dossier HEFF_site_TG/Links/` | 44 assets visuels |
| `preparation/Dossier HEFF_site_TG/Document fonts/` | GTWalsheim-Light.otf, SligoilVF.ttf |
| `docs/extraction/*.json` | Données extraites d'InDesign |
| `docs/plans/2026-02-19-indesign-to-figma.md` | Plan d'implémentation détaillé |
| `/tmp/extract_*.jsx` | Scripts ExtendScript utilisés pour l'extraction |
| `~/indesign-mcp-server/` | MCP InDesign cloné et adapté pour 2026 |
| `~/claude-talk-to-figma-mcp/src/claude_mcp_plugin/` | Plugin Figma (manifest corrigé avec editorType "dev") |

## Scripts ExtendScript réutilisables
Pour relancer une extraction, les scripts sont dans `/tmp/extract_*.jsx`. Commande type :
```bash
osascript -e 'tell application "Adobe InDesign 2026"
  do script POSIX file "/tmp/extract_textframes.jsx" language javascript
end tell'
```
Note : ExtendScript n'a pas de JSON natif — les scripts incluent un polyfill `jsonStringify()`.
