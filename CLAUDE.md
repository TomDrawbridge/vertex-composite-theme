# Vertex Composite theme

Shopify theme for Vertex Composite (composite decking, cladding and trims), built by Drawbridge Labs on Horizon 4.5.0. Client contact goes through JP (Plug Social Media) and Dan Dawson; the business is run by Scott Gair (Scottwood Timber Ltd).

Store: `vertex-composite-ihcbegr8.myshopify.com` (storefront `vertex-composite.myshopify.com`).

## How this repo is wired

- This repo is connected to Shopify through the GitHub integration. **`main` is the live theme.** Shopify commits theme-editor changes back to `main`, so pull before you push.
- Work on a branch and open a PR. Merge to publish.
- `.vertex/build_theme.py` applies the Direction B settings (colours, fonts, homepage, header, footer, product page) to the JSON files. It is idempotent. Run it after merging a Horizon update: `python3 .vertex/build_theme.py`.
- Every edit to a Horizon core file is listed in `CHANGES.md`.

## Writing rules (all copy, comments shown to the client, commit messages)

- Plain British English: colour, organise, centre, metres.
- No em dashes. No AI-sounding phrasing. Never use the verb "land" ("landing page" is fine).
- Hedge product claims (ASA/CAP). No invented specs, figures, reviews or guarantees.
- Anything not yet known stays as a visible placeholder in square brackets, such as `[CONFIRM: board thickness]`.

## Approach

- Build on Horizon: keep its basket, cart drawer, search, product form, filters, accounts and accessibility.
- Custom files are prefixed `vx-` (`sections/vx-*.liquid`, `snippets/vx-*.liquid`, `assets/vx*.css|js`). Keep Horizon core edits to a minimum.
- Everything editable in the theme editor. Product facts come from metafields (namespace `vertex`), not hard-coded Liquid.
- Vanilla JS only, deferred, one file per feature.

## Store data model (already created via the Admin API)

- Products: Twin Deck (Z-BPS03, two colour pairs), L-corner trim (S-MF07, five colours), Flush cladding (SP-WP03), Slatted cladding (SP-WP14), Slatted corner (LG-C01), Fasteners MC03, SSL starter. SKUs like `Z-BPS03-ES`, `S-MF07-ECL`.
- Colour option values are linked to `shopify--color-pattern` metaobjects (eclipse, storm, chestnut, silver-oak, dark-grey, black, silver, eclipse-storm, chestnut-silver-oak), so Horizon shows swatches.
- Product metafields `vertex.*`: model, length, dimensions, unit_label, profile, warranty_summary, weight_label, data_sheet (file), safety_data_sheet (file).
- Collections: decking, cladding, trims, fixings, trims-and-fixings (automated by product type).
- Pages: about, warranty, installation-guide, faqs, trade-accounts, samples, data-sheets, delivery, returns-and-refunds, terms-and-conditions, privacy-policy, contact.
- Menus: main-menu, footer (Shop), footer-help, footer-company.

## Design system (Direction B)

- Font: DM Sans. Colours: ink `#1d1c1c`, near-black `#161616`, bar `#0f0f0f`, sand `#efebe5`, light sand `#f6f4f1`, lines `#e2ddd5`/`#cfc7bc`, muted `#5b554f`, bronze `#B6855F` (fills, buttons), bronze text `#8a5e3b` (small text on light), stock green `#2f6b3a`.
- Board colours: Eclipse `#232324`, Storm `#4A4B4C`, Chestnut `#6B4A36`, Silver Oak `#A9A59D`, Dark grey `#5C5D5E`.
- Square corners, hexagon motif for swatches, kicker labels in uppercase with 0.18em tracking.
- The approved designs and previews: https://drawbridgelabs.dsp.so/WMxGXqgM-vertex-composite-homepage-b (and linked pages).

## Still to build

- Twin Deck face flip and colour-pair picker, deck planner, height calculator, warranty registration form with photo upload (app proxy or forms app: decision open), cladding video band, inspiration gallery.
- Delivery profiles and rates (waiting on Scott).
- Data sheet PDFs into `vertex.data_sheet` metafields when supplied.
