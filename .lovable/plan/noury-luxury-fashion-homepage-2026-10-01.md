# Noury — Luxury Fashion Homepage

Build the Noury homepage at `/` matching the uploaded reference layout and the brief's copy exactly. Front-end only (no cart/login logic yet).

## Look and feel
- Palette: warm ivory background, cream/beige panels, taupe borders, mocha/warm-brown announcement bar and footer, champagne-gold accents.
- Fonts: Cormorant Garamond (headings, logo), Jost (nav, labels, body), Great Vibes for the handwritten "It's a Feeling".
- Thin 1px borders, sharp corners, generous spacing, subtle fade-in on scroll and slow image zoom on hover.

## Sections (top to bottom, per reference)
1. Announcement bar: "Free Shipping on Orders Over 999 EGP + Shop Now".
2. Header: search field (left), Noury logo with gold star + "DETAILS THAT DEFINE YOU" (center), account / wishlist / bag with badge (right); nav row Home, Accessories, Beauty, Gifts, Bags, Hijab, Collections, About; mobile menu drawer.
3. Hero: full-width photo of a model holding a structured leather bag in a warm boutique bedroom; "WELCOME TO NOURY", "More Than Just Products...", script "It's a Feeling", description, SHOP NOW; slide counter 01/03 with arrows cycling 3 hero images.
4. Five category cards: Accessories, Beauty, Gifts, Bags, Hijab with subtitles and arrows.
5. Benefits strip: Delivery, Secure Payment, centered Noury logo, Packaging, Support (thin line icons).
6. Featured Collection: model wearing jewelry + "Accessories / Small details. Big impact." + EXPLORE COLLECTION, beside Necklaces, Rings, Bracelets product shots.
7. Three-panel row: Our Story text card, packaging + thank-you card photo, Hijab Collection banner with SHOP NOW.
8. Our Instagram: 6 photo tiles + "Follow Our Journey @noury.eg" card.
9. Dark brown footer: cream logo, tagline, links, Instagram/TikTok/Pinterest icons, EGP selector.

## Photography
Generate ~17 photorealistic editorial images (warm window light, 85mm shallow depth of field, natural skin and hands): 3 hero slides, 5 categories, featured model + 3 products, story packaging, hijab model, 6 Instagram tiles (reusing some where sensible). Packaging text uses premium quality for legible "Noury".

## Technical details
- Rewrite `src/routes/index.tsx` with its own head() (title, description, og tags); update root title away from defaults.
- Tokens in `src/styles.css` (oklch) + font tokens; fonts via `<link>` in `__root.tsx`.
- Components under `src/components/noury/` per section; images in `src/assets/`.
- Record structure in AGENTS.md; save brand palette/fonts to memory.
