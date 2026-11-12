"""Apply the Vertex Direction B settings to the Horizon theme JSON files.

Idempotent: rerun after Horizon updates. Edits only JSON config/templates;
Liquid/CSS changes are made by hand and listed in CHANGES.md.
"""
import json, re, copy, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.dirname(os.path.abspath(__file__))
IMG = lambda f: f'shopify://shop_images/{f}'

INK = '#1d1c1c'; NEAR_BLACK = '#161616'; BAR = '#0f0f0f'; SAND = '#efebe5'; LIGHT_SAND = '#f6f4f1'
LINE = '#e2ddd5'; BRONZE_TEXT = '#8a5e3b'; BRONZE = '#b6855f'; WHITE = '#ffffff'


def load(path):
    s = open(f'{ROOT}/{path}').read()
    m = re.match(r'(\s*/\*.*?\*/\s*)', s, re.S)
    head = m.group(1) if m else ''
    return head, json.loads(s[len(head):])


def save(path, head, data):
    open(f'{ROOT}/{path}', 'w').write(head + json.dumps(data, indent=2, ensure_ascii=False) + '\n')


def text(html, preset='rte', **kw):
    s = {'text': html, 'type_preset': preset}
    s.update(kw)
    return {'type': 'text', 'settings': s, 'blocks': {}}


def button(label, link, style='button', **kw):
    s = {'label': label, 'link': link, 'style_class': style}
    s.update(kw)
    return {'type': 'button', 'settings': s, 'blocks': {}}


def blocks(**kv):
    return {'blocks': dict(kv), 'block_order': list(kv.keys())}


# ---------------------------------------------------------------- settings_data
head, sd = load('config/settings_data.json')
cur = sd['current']
cur.update({
    'logo': IMG('vertex-logo.svg'),
    'logo_inverse': IMG('vertex-logo-light.svg'),
    'logo_height': 30, 'logo_height_mobile': 24,
    'type_body_font': 'dm_sans_n4', 'type_subheading_font': 'dm_sans_n5',
    'type_heading_font': 'dm_sans_n7', 'type_accent_font': 'dm_sans_n7',
    'type_size_paragraph': '16', 'type_line_height_paragraph': 'body-loose',
    'type_size_h1': '72', 'type_letter_spacing_h1': 'heading-tight', 'type_line_height_h1': 'display-tight',
    'type_size_h2': '48', 'type_letter_spacing_h2': 'heading-tight',
    'type_size_h3': '32', 'type_letter_spacing_h3': 'heading-tight',
    'type_size_h6': '12',
    'page_width': 'normal',
    'card_hover_effect': 'subtle-zoom',
    'badge_corner_radius': 0, 'badge_text_transform': 'uppercase',
    'button_border_radius_primary': 0, 'button_border_radius_secondary': 0,
    'primary_button_border_width': 0, 'secondary_button_border_width': 1,
    'inputs_border_radius': 0, 'popover_border_radius': 0,
    'product_corner_radius': 0, 'card_corner_radius': 0,
    'variant_swatch_width': 40, 'variant_swatch_height': 40, 'variant_swatch_radius': 0,
    'variant_button_radius': 0, 'variant_button_width': 'default-width-buttons',
    'show_variant_image': True,
    'color_palette': {'background': WHITE, 'foreground': INK, 'color1': NEAR_BLACK, 'color2': SAND, 'color3': LINE},
    'palette_primary_button_background': BRONZE,
    'palette_primary_button_text': NEAR_BLACK,
    'palette_primary_button_border': BRONZE,
    'palette_secondary_button_background': '#ffffff00',
    'palette_secondary_button_text': INK,
    'palette_secondary_button_border': INK,
    'palette_selected_variant_background': INK,
    'palette_selected_variant_text': WHITE,
    'palette_selected_variant_border': INK,
    'badge_sold_out_background_color': SAND,
    'palette_input_border': '#cfc7bc',
    'palette_variant_border': '#cfc7bc',
})
sd['current'] = cur
save('config/settings_data.json', head, sd)

# ---------------------------------------------------------------- header group
head, hg = load('sections/header-group.json')
ann = hg['sections']['header_announcements_9jGBFp']
ann['blocks'] = {
    'announcement_warranty': {'type': '_announcement', 'settings': {
        'text': '10-year fade warranty on decking and cladding (terms apply)', 'link': 'shopify://pages/warranty',
        'font': 'var(--font-subheading--family)', 'font_size': '0.75rem', 'letter_spacing': 'normal', 'case': 'none'}, 'blocks': {}},
    'announcement_offer': {'type': '_announcement', 'settings': {
        'text': '[DELIVERY OR SAMPLE OFFER MESSAGE]', 'link': 'shopify://pages/delivery',
        'font': 'var(--font-subheading--family)', 'font_size': '0.75rem', 'letter_spacing': 'normal', 'case': 'none'}, 'blocks': {}},
}
ann['block_order'] = ['announcement_warranty', 'announcement_offer']
ann['settings'].update({'background_color': BAR, 'divider_width': 0, 'padding-block-start': 10, 'padding-block-end': 10})
hdr = hg['sections']['header_section']
hdr['blocks']['header-menu']['settings'].update({'menu': 'main-menu', 'menu_style': 'text', 'menu_font_style': 'regular',
                                                 'type_font_primary_size': '0.9375rem'})
hdr['settings'].update({
    'menu_position': 'center', 'show_country': False, 'show_language': False,
    'background_color_top': NEAR_BLACK, 'text_color_top': WHITE,
    'background_color_bottom': NEAR_BLACK, 'text_color_bottom': WHITE,
    'bubble_background_color': BRONZE, 'bubble_text_color': NEAR_BLACK,
    'enable_transparent_header_home': True, 'text_color_transparent_home': WHITE,
    'enable_transparent_header_collection': False, 'enable_transparent_header_product': False,
    'divider_width': 0, 'border_width': 0,
})
save('sections/header-group.json', head, hg)

# ---------------------------------------------------------------- footer group
head, fg = load('sections/footer-group.json')
ft = fg['sections']['footer']
signup = ft['blocks']['group_wErUQf']
signup['blocks']['text_pF6rVi']['settings']['text'] = '<h2>Ideas, new colours and project guides, now and then.</h2>'
signup['blocks']['text_HafH7P']['settings']['text'] = '<p>Join the Vertex list. Unsubscribe at any time.</p>'
menus = {
    'menu_footer': ('footer', 'Shop'),
    'menu_main': ('footer-help', 'Help'),
}
for k, (m, h) in menus.items():
    ft['blocks'][k]['settings'].update({'menu': m, 'heading': h})
company = copy.deepcopy(ft['blocks']['menu_main'])
company['settings'].update({'menu': 'footer-company', 'heading': 'Company'})
ft['blocks']['menu_company'] = company
ft['block_order'] = ['group_wErUQf', 'menu_footer', 'menu_main', 'menu_company']
ft['settings']['background_color'] = NEAR_BLACK
ut = fg['sections']['utilities']
ut['settings']['background_color'] = NEAR_BLACK
ut['blocks'].pop('social_icons', None)  # no social URLs supplied yet
ut['block_order'] = [k for k in ut['block_order'] if k != 'social_icons']
ut['blocks']['copyright']['settings']['show_powered_by'] = False
es = signup['blocks']['email-signup_HafH7P']['settings']
es.update({'border_radius': 0, 'input_background_color': '#ffffff00', 'style_class': 'button'})
save('sections/footer-group.json', head, fg)

# ---------------------------------------------------------------- homepage
head, idx = load('templates/index.json')
presets = {f: json.load(open(f'{SP}/preset-{f}.json')) for f in ['collection-list', 'media-with-content', 'product-list']}

hero = idx['sections']['hero_jVaWmY']
hero['settings'].update({
    'image_1': IMG('vertex-twin-deck-storm-silver-oak-sunken-seating.jpg'), 'media_type_1': 'image',
    'section_width': 'full-width', 'section_height': 'large',
    'horizontal_alignment_flex_direction_column': 'flex-start', 'vertical_alignment_flex_direction_column': 'flex-end',
    'toggle_overlay': True, 'overlay_style': 'gradient', 'overlay_color': '#0a0a0acc', 'gradient_direction': 'to top',
    'gap': 16, 'padding-block-start': 160, 'padding-block-end': 96,
})
hero.update(blocks(
    kicker=text('<p>Composite decking &amp; cladding</p>', 'h6', text_color=SAND),
    heading=text('<h1>Outside, finished properly.</h1>', 'h1', text_color=WHITE, max_width='narrow'),
    body=text('<p>Composite decking and cladding in four considered colours. Backed by a 10-year fade warranty (terms apply).</p>',
              'rte', text_color=WHITE, max_width='narrow'),
    cta=button('Shop decking', 'shopify://collections/decking', 'button'),
    cta2=button('Order samples', 'shopify://pages/samples', 'button-custom', custom_button_background='rgba(0, 0, 0, 0)',
                custom_button_text=WHITE, custom_button_border=WHITE),
))


def from_preset(kind, idx_):
    p = copy.deepcopy(presets[kind][idx_])
    sec = {'type': kind, 'settings': p.get('settings', {})}
    sec['blocks'] = p.get('blocks', {})
    sec['block_order'] = p.get('block_order', list(sec['blocks'].keys()))

    def fix(b):
        for c in b.get('blocks', {}).values():
            c.setdefault('settings', {})
            c.setdefault('blocks', {})
            if c['blocks'] and 'block_order' not in c:
                c['block_order'] = list(c['blocks'].keys())
            fix(c)
    fix(sec)
    return sec


rng = from_preset('collection-list', 1)
rng['settings'].update({'collection_list': ['decking', 'cladding', 'trims-and-fixings'], 'columns': 3, 'max_collections': 3,
                        'padding-block-start': 96, 'padding-block-end': 48})
grp = rng['blocks']['group_Lg9LkF']
grp.update(blocks(
    kicker=text('<p>01 / The range</p>', 'h6', text_color=BRONZE_TEXT),
    heading=text('<h2>Every surface, outside.</h2>', 'h2'),
))

shop = from_preset('product-list', 0)
shop['settings'].update({'collection': 'all', 'max_products': 8, 'padding-block-start': 48, 'padding-block-end': 96})
shop['blocks']['static-header']['blocks']['product_list_text']['settings']['text'] = '<h2>Shop the range</h2>'
shop['blocks']['static-header']['blocks']['product_list_button']['settings']['label'] = 'Shop all products'
for k, b in shop['blocks']['static-product-card']['blocks'].items():
    if b['type'] == 'price':
        b['settings']['show_tax_info'] = False


def editorial(image, kicker, heading, body, label, link, position='left', bg=None):
    s = from_preset('media-with-content', 0)
    s['settings'].update({'media_position': position, 'media_width': 'medium', 'media_height': '70svh'})
    if bg:
        s['settings']['background_color'] = bg
    s['blocks']['media']['settings']['image'] = IMG(image)
    c = s['blocks']['content']
    c['blocks']['caption']['settings'].update({'text': f'<p>{kicker}</p>', 'text_color': BRONZE_TEXT})
    c['blocks']['group']['blocks']['heading']['settings'].update({'text': f'<h2>{heading}</h2>', 'type_preset': 'h2'})
    c['blocks']['group']['blocks']['text']['settings']['text'] = f'<p>{body}</p>'
    c['blocks']['button']['settings'].update({'label': label, 'link': link})
    return s


colour = editorial('vertex-twin-deck-eclipse-storm-pool-terrace.jpg', '02 / Colour', 'Four colours. Two reversible boards.',
                   'Each Twin Deck board has a different colour on each face: Eclipse with Storm, Chestnut with Silver Oak. '
                   'Choose your pair, then decide which side faces up as you lay it. £29.99 a 4 m board.',
                   'Shop Twin Deck', 'shopify://products/twin-deck', 'left', SAND)
system = editorial('vertex-twin-deck-eclipse-lit-terrace.jpg', '03 / The system', 'Built from the ground up.',
                   'Boards, fixings and trims designed to work together. One order, one delivery, one finish. '
                   'S-MF07 L-corner trims come in all four deck colours, plus Dark grey, for a clean edge on every side.',
                   'Read the installation guide', 'shopify://pages/installation-guide', 'right')
cladding = editorial('vertex-slatted-cladding-house-extension.jpg', '04 / Cladding', 'Change the character of a building.',
                     'Flush boards for a smooth, modern face. Slatted profiles for depth and shadow. Both in Storm and 4 m lengths, '
                     'with a matching slatted corner. From £18.99 a board.',
                     'Shop cladding', 'shopify://collections/cladding', 'left')

samples = {'type': 'section', 'settings': {
    'background_color': NEAR_BLACK, 'section_width': 'page-width', 'section_height': '',
    'horizontal_alignment_flex_direction_column': 'center', 'gap': 16,
    'padding-block-start': 112, 'padding-block-end': 112}}
samples.update(blocks(
    kicker=text('<p>Samples</p>', 'h6', alignment='center', text_color=SAND),
    heading=text('<h2>Hold the colours in your hand.</h2>', 'h2', alignment='center', text_color=WHITE),
    body=text('<p>Order samples of up to [NUMBER] colours, sent [SAMPLE DELIVERY TERMS]. Compare them against your '
              'brickwork, paving and planting before you commit.</p>', 'rte', alignment='center', text_color=WHITE,
              max_width='narrow'),
    cta=button('Order samples', 'shopify://pages/samples', 'button'),
))

idx['sections'] = {'hero_jVaWmY': hero, 'vx_range': rng, 'vx_colour': colour, 'vx_shop': shop,
                   'vx_system': system, 'vx_cladding': cladding, 'vx_samples': samples}
idx['order'] = list(idx['sections'].keys())
save('templates/index.json', head, idx)

# ---------------------------------------------------------------- product page
head, pr = load('templates/product.json')
pd = pr['sections']['main']['blocks']['product-details']
hdrg = pd['blocks']['group_icgrde']
hdrg['blocks']['vx_kicker'] = text('<p>Model {{ closest.product.metafields.vertex.model.value }}</p>', 'h6', text_color=BRONZE_TEXT)
price_key = [k for k, b in hdrg['blocks'].items() if b['type'] == 'price'][0]
hdrg['blocks'][price_key]['settings']['show_tax_info'] = False
hdrg['blocks']['vx_unit'] = text('<p>{{ closest.product.metafields.vertex.unit_label.value }}</p>', 'rte',
                                 text_color='#5b554f')
hdrg['block_order'] = ['vx_kicker'] + [k for k in hdrg['block_order'] if k not in ('vx_kicker', 'vx_unit')] + ['vx_unit']
for b in pd['blocks'].values():
    if b['type'] == 'variant-picker':
        b['settings'].update({'variant_style': 'buttons', 'show_swatches': True})
pd['blocks']['vx_facts'] = text(
    '<p><strong>Size:</strong> {{ closest.product.metafields.vertex.dimensions.value }}<br>'
    '<strong>Weight:</strong> {{ closest.product.metafields.vertex.weight_label.value }}<br>'
    '<strong>Warranty:</strong> {{ closest.product.metafields.vertex.warranty_summary.value }}, '
    '<a href="/pages/warranty">register and terms</a><br>'
    '<strong>Delivery:</strong> calculated at checkout. <a href="/pages/delivery">Delivery information</a><br>'
    '<strong>Questions?</strong> <a href="mailto:sales@vertexcomposite.co.uk">sales@vertexcomposite.co.uk</a></p>', 'rte')
order = [k for k in pd['block_order'] if k != 'vx_facts']
bi = order.index([k for k in order if pd['blocks'][k]['type'] == 'buy-buttons'][0])
order.insert(bi + 1, 'vx_facts')
pd['block_order'] = order
save('templates/product.json', head, pr)

# ---------------------------------------------------------------- collection page price note
head, co = load('templates/collection.json')
for b in co['sections']['main']['blocks']['product-card']['blocks'].values():
    if b['type'] == 'price':
        b['settings']['show_tax_info'] = False
save('templates/collection.json', head, co)
print('ok')
