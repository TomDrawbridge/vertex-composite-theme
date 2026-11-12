# Changes to Horizon core files

Keep this list current so Horizon updates can be merged. Baseline: Horizon 4.5.0 (commit `c18ace1`).

| File | Change | Why |
|---|---|---|
| `layout/theme.liquid` | Added `{{ 'vx.css' \| asset_url \| stylesheet_tag }}` after `render 'color-palette'` | Loads the Vertex CSS layer |

## Files added (not part of Horizon)

- `assets/vx.css`: hexagon swatches, kicker style, square corners, spec tables.
- `.vertex/build_theme.py` and `.vertex/preset-*.json`: script that writes the Vertex settings into the JSON templates.
- `CLAUDE.md`, `CHANGES.md`.

## JSON files changed by `.vertex/build_theme.py`

These are settings, not code, and Shopify's theme editor can also change them:
`config/settings_data.json`, `sections/header-group.json`, `sections/footer-group.json`, `templates/index.json`, `templates/product.json`, `templates/collection.json`.
