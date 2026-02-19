# Design : Pipeline InDesign → Figma

**Date** : 2026-02-19
**Projet** : techniques-graphiques-Helene (HEFF — Haute École Francisco Ferrer)
**Objectif** : Extraire la maquette InDesign et la recréer dans Figma avec une structure propre (BEM, auto-layouts)

## Contexte

- Maquette InDesign : 13 spreads, 132 blocs texte, 44 assets visuels
- Polices : Sligoil (variable, titres), GTWalsheim-Light (corps)
- Contenu : Vitrine créative des étudiants TG — 3 options : Web, Édition, 3D/FX
- Aucun code web existant

## Pipeline

```
InDesign (.indd) → MCP InDesign → Claude Code → MCP Figma → Figma (structuré)
                   (lucdesign)     (orchestre)   (talk-to-figma)
```

## MCP choisi : lucdesign/indesign-mcp-server

- 40+ outils dont `execute_indesign_code` (ExtendScript arbitraire)
- Communication : AppleScript → ExtendScript
- macOS uniquement, Node.js, setup simple

## Phases

### Phase 1 — Setup MCP InDesign
- Cloner le repo
- Adapter la version InDesign
- Configurer dans le projet
- Tester la connexion

### Phase 2 — Extraction des données InDesign
- Structure des pages (dimensions, marges)
- Blocs texte (position, contenu, style)
- Définitions de styles (fonte, taille, couleur, interlignage)
- Blocs images (position, source)
- Palette de couleurs

### Phase 3 — Construction Figma
- Créer les pages
- Recréer les frames
- Placer textes et images
- Appliquer les couleurs

### Phase 4 — Structuration Figma
- Naming BEM sur tous les layers
- Auto-layouts (header, grilles, cards, footer)
- Composants réutilisables
- Vérification alignement

## Décisions

- Pas de code web dans cette phase
- Figma comme livrable design autonome
- MCP InDesign de lucdesign (seul à offrir ExtendScript arbitraire)
