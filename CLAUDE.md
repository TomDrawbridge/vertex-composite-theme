# Vertex Composite theme

Shopify theme for Vertex Composite (composite decking, cladding and trims), built by Drawbridge Labs on Horizon 4.5.0. Client contact goes through JP (Plug Social Media) and Dan Dawson; the business is run by Scott Gair (Scottwood Timber Ltd).

Store: `vertex-composite-ihcbegr8.myshopify.com` (storefront `vertex-composite.myshopify.com`).

## How this repo is wired

- This repo is connected to Shopify through the GitHub integration. **`main` is the live theme.** Shopify commits theme-editor changes back to `main`, so pull before you push.
- Work on a branch and open a PR. Merge to publish.
- Every page is built from custom `vx-` sections ported from the approved designs. The JSON templates hold the content; Horizon's own sections are only used for search results and the cart drawer.
- A page's template is set by its template suffix in Shopify admin: `page.faqs`, `page.policy` (delivery, returns, terms, privacy), `page.contact`, `page.warranty`, `page.installation-guide`. Other pages use `page.json`. Page hero photo and intro come from the page metafields `vertex.hero_image` and `vertex.intro`.
- Shopify's Liquid parser ends `{{ }}` at the first `}`, so never put `{` or `}` inside a string in an output tag (Theme Check won't catch it). Do it in an `assign` instead. Upload JSON templates as TEXT through the Admin API to see validation errors; URL uploads fail silently.
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

- Warranty registration photo upload (app proxy or forms app: decision open). Until then the form sends through Shopify's contact form and asks for photos by email.
- Delivery profiles and rates (waiting on Scott).
- Data sheet PDFs into `vertex.data_sheet` metafields when supplied.
