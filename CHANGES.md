# Changes to Horizon core files

Keep this list current so Horizon updates can be merged. Baseline: Horizon 4.5.0 (commit `c18ace1`).

| File | Change | Why |
|---|---|---|
| `layout/theme.liquid` | Added DM Sans from Google Fonts and `{{ 'vx.css' \| asset_url \| stylesheet_tag }}` after `render 'color-palette'` | Loads the Vertex font and CSS layer |
| `templates/*.json` (index, product, collection, page, page.contact, cart, search, 404) and `sections/header-group.json`, `sections/footer-group.json` | Replaced Horizon's sections with `vx-` sections | Faithful port of the Direction B designs. Search keeps Horizon's `search-results` section |

## Files added (not part of Horizon)

- `assets/vx.css`, `assets/vx.js`: shared styles and behaviour (header, intro loader, hero, colour picker, planner, product, collection, FAQs page, basket).
- `assets/vx-install.*`, `assets/vx-warranty.*`: page-specific styles and scripts.
- `sections/vx-*.liquid`, `snippets/vx-*.liquid`, `assets/vx-*` images and video.
- New templates: `page.faqs.json`, `page.policy.json`, `page.warranty.json`, `page.installation-guide.json`.
- `CLAUDE.md`, `CHANGES.md`.

## JSON files

Templates and `config/settings_data.json` are content, and the theme editor commits changes to them back to `main`. Pull before editing.
