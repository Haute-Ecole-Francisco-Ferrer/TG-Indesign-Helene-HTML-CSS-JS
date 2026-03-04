# Insights — Techniques Graphiques HEFF

### 2026-02-19 — InDesign → Figma → Web pipeline

- **[Figma MCP]** — **load_font_async timeout pour polices variables**
  Les polices variables (.ttf VF) comme SligoilVF peuvent avoir des noms de famille non standards dans Figma. `mdls -name kMDItemFonts` révèle le vrai nom (`Sligoil Micro`), mais même avec le bon nom, `load_font_async` timeout. `GTWalsheim-Light` (police statique .otf) se charge correctement. Piste : essayer `set_font_name` directement sur un nœud texte.

- **[CSS Grid]** — **grid-template-areas vs positionnement absolu InDesign**
  InDesign utilise des coordonnées absolues (x, y en points), CSS Grid utilise des zones nommées déclaratives. Le Figma doit refléter le design web (grille), pas l'InDesign (absolu). Calcul : viewport 1440px − sidebar 56px = 1384px ÷ 8 colonnes = 173px/col.

- **[Assets]** — **Conversion multi-formats via sips (macOS natif)**
  `sips` convertit HEIC→JPG et PSD→PNG nativement. Pour les PDF, `sips` produit des PNG de la première page. AI et EPS ne sont pas supportés par sips — utiliser le JPG fallback quand disponible (`90969.jpg` pour `90969 [Converti].ai`).

- **[Figma MCP]** — **Deux MCP complémentaires**
  `claude-talk-to-figma` (WebSocket + plugin) = création d'éléments. `figma-console-mcp` (API Token + Desktop Bridge) = extraction et debug. Le Desktop Bridge plugin est différent du Claude MCP Plugin — les deux ne sont pas interchangeables.

- **[Architecture]** — **Sidebar fixe = margin-left, pas grid**
  La sidebar 56px est un élément `position: fixed` en dehors de la grille. Le contenu (grille, footer, menu) utilise `margin-left: 56px`. Dans Figma, c'est un frame séparé à x=0, et la grille commence à x=56.

### 📅 2026-02-20 — Polices, auto-layouts, composants, pages responsive

- **[Figma MCP]** — **Variable fonts = timeout confirmé, pas erreur de nom**
  Quand Figma ne trouve pas une police, il renvoie une erreur immédiate ("font not found"). Un timeout systématique indique que le fichier VF est reconnu mais Figma ne peut pas instancier un style statique depuis l'axe variable via le MCP. Testé `Sligoil`, `Sligoil Micro`, `SligoilMicro`, `Sligoil-Micro`, `SligoilMicro-Regular` — tous timeout. Solution : appliquer manuellement dans Figma.

- **[Figma Auto-layout]** — **CSS Grid 2D ≠ auto-layout Figma**
  L'auto-layout Figma est un flexbox (1 dimension). Une grille CSS `grid-template-areas` 2D ne peut pas être représentée en auto-layout pur. Stratégie : auto-layout sur les sous-conteneurs (sidebar VERTICAL/SPACE_BETWEEN, colonnes menu VERTICAL, footer HORIZONTAL/SPACE_BETWEEN, info panel VERTICAL) et positionnement statique pour la grille d'images elle-même.

- **[Figma Composants]** — **create_component_set timeout quand composants intégrés**
  `combineAsVariants()` nécessite que les composants soient sur la même page et proches spatialement. Quand les composants sont intégrés dans un layout existant (enfants d'un frame), les déplacer pour les combiner risque de casser le design. Alternative : nommer en `Option=Web`, `Option=Édition` — Figma les regroupe visuellement dans Assets.

- **[Responsive]** — **Breakpoint 4 col : même zones, grille différente**
  À ≥1520px, le CSS passe de 8 à 4 colonnes. Calcul : 1520 − 56px sidebar = 1464px ÷ 4 = 366px/col. Les 4 premières lignes = `100vh/4 = 225px` (hero zone), les 4 suivantes = `minmax(120px, auto)`. Les mêmes 17 zones (a-q + s + t) sont réarrangées dans un layout plus carré.

- **[MCP Stabilité]** — **Trop d'appels parallèles = timeout WebSocket**
  Les appels MCP Figma en parallèle massif (>4 simultanés) provoquent des timeouts. Stratégie : limiter à 2-3 appels parallèles, ou alterner scans/modifications en séquentiel. Après beaucoup d'opérations, le WebSocket peut décrocher → reconnecter avec un nouveau channel ID.
