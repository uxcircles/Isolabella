# Isolabella — website redesign

A redesign concept for [Isolabella](http://www.isolabellarestaurant.co.uk/), an Italian restaurant at 45 Red Lion Street, Holborn, London. Plain HTML, CSS and JavaScript with no build step, so any static host can serve it.

> **Concept only.** Designed by [UX CIRCLES](https://ux-circles.com/web); this is not Isolabella's official website.
> Every page has a "Concept" stripe at the top and `noindex`, and `robots.txt` blocks crawlers, so it won't compete with the real site in search.
> If the restaurant adopts it: remove `.concept-bar` from each page, remove `<meta name="robots" content="noindex, nofollow">`, and change `robots.txt` to `Allow: /`.

**Pages:** Home · Menu · Book a table

## Run locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173. The booking frame and the map only work over http(s), not by double-clicking the HTML file.

## What this fixes on the current site

Reviewed on isolabellarestaurant.co.uk on 21 October 2026 (a Nicepage template):

| # | Problem | What the redesign does |
|---|---|---|
| 1 | The page `<title>` and meta description are **empty**, so Google and link previews have nothing to show | Each page has its own title, description and Open Graph image |
| 2 | **The map is a blank grey box** (the Google Maps embed doesn't load) | Map drawn in the site's colours, with the restaurant pin, Holborn station and a Directions button |
| 3 | Menus are **PDF only**; nothing can be read or searched on a phone | Full HTML menu: à la carte, set menu and the whole wine and drinks list, with a section index and dish/wine search. PDFs kept for printing |
| 4 | Booking opens a 700 px popup that doesn't fit a phone screen | Booking page with the same Favourite Table booking (site 1702) embedded at full width, plus group rules and phone/email |
| 5 | Phone number isn't a link, so it can't be tapped to call | `tel:` links everywhere, and a Call / Book bar on phones |
| 6 | The About text is one 180-word paragraph; there's no hierarchy past "About us" | Short sections with one H1 per page and a proper heading order |
| 7 | Gallery photos have **no alt text** | Every photo is described |
| 8 | No structured data | `Restaurant` JSON-LD with address, coordinates, phone, hours and menu link |
| 9 | Nothing says whether the restaurant is open now | "Open now · until 22:30" status worked out on London time; today's row is highlighted in the hours |
| 10 | Loads jQuery and a 1.2 MB CSS framework; photos are 0.8–1.4 MB JPEGs | One stylesheet, one small script, no jQuery; photos as WebP at two sizes, lazy-loaded |
| 11 | The menus' spelling is inconsistent ("Caeser", "Fruitti", "Margarita", "Saltinbocca"…) | Tidied in the HTML menu (see the checklist below) |

## Structure

```
index.html            Home: hero, welcome, favourite dishes, set menu, wine, gallery, find us
menu.html             Full menu (generated once from the PDFs; edit the HTML directly from now on)
book.html             Favourite Table booking (sitecode 1702), group rules, contact, hours
styles.css            All styles; colours and fonts are at the top in :root
main.js               Mobile nav, open-now status, gallery lightbox, menu index and search, map loader
assets/map.js         Map style and markers (colours in the C object at the top)
assets/vendor/maplibre MapLibre GL JS 4.7.1 (BSD-3), only loaded when the map scrolls into view
assets/img/           Photos (WebP, 800 and 1600 wide), logo.svg, logo-light.svg, ridge motif, og.jpg
files/                The restaurant's PDF menus, at the same paths as on the current site
favicon.svg, apple-touch-icon.png, robots.txt
```

Photos, logo and menus come from the current isolabellarestaurant.co.uk. The logo was traced from the site's PNG into SVG so it stays sharp; colours are unchanged.

`canonical`, `og:url` and the JSON-LD point to `https://uxcircles.github.io/Isolabella/`; update them if the site moves to its own domain. The PDFs stay at `files/…`, so old links to them keep working.

## Design direction

- **Colours from the logo:** the green of the hill (`--hill`) for buttons and labels, the blue of the lake line (`--lake`) for emphasis, a deep navy (`--ink`) for text and dark bands, and a warm linen background like the white tablecloths
- **Type:** Cormorant Garamond, an Italian-flavoured serif with an italic that echoes the logo's italic capitals, for headings and dish names; Manrope for body text. Both from Google Fonts (SIL Open Font License)
- **Motifs:** the logo's hill-and-lake line reused as a small mark before section labels, on the map pin and the favicon; an arched frame for the shopfront photo
- **Italian first, English underneath:** dishes keep their Italian names, with the English description below

## To confirm with the restaurant before launch

- [ ] **Menu prices**: the à la carte PDF is labelled 2024. Are prices current? Prices in the PDF text layer were cut off, so they were read from the rendered pages. Please double-check them
- [ ] **Spelling fixes** in the HTML menu, e.g. Caesar, frutti di mare, Margherita, Napoletana, Quattro formaggi, Saltimbocca, Bignè, Mousse al cioccolato, Gelato alla nocciola, Moretti, Veuve Clicquot. Check they're happy with them
- [ ] **Wine notes** were shortened, and obvious copy errors in the PDF were left out (e.g. the Prosecco note repeats the Merlot's "hint of oak"; Planeta La Segreta, a white, mentions tannins). The Zinfandel bottle price is £34.94 in the PDF; shown as £34.95
- [ ] **Christmas menu**: the 2025 Christmas menu (£47.50) is commented out on the current site and isn't shown here. Add a 2026 version when it's ready
- [ ] **Booking widget styling**: Favourite Table's own stylesheet fails to load (404 on their side), so the booking form looks plain inside its frame. Worth raising with Favourite Table
- [ ] **Allergens and dietary marks**: the menus have none apart from gluten-free pasta. Vegetarian / vegan / allergen labels would help
- [ ] **Map pin**: placed from OpenStreetMap (51.51987, −0.11749); confirm it sits on the right doorway
- [ ] **Social links**: none found on the current site. Add Instagram/Facebook to the footer if they exist

## Everyday updates

| What | Where |
|---|---|
| Dishes and prices | `menu.html` (each `.menu-section`); the home page "favourites" and set menu also show prices |
| Opening hours | `index.html` Visit table (`data-open` / `data-close` drive the open-now status), the footer, the JSON-LD, and `book.html` |
| Set menu | `index.html` `#set-menu` and `menu.html` `#set-menu` |
| Photos | Add to `assets/img/` as WebP at 800 and 1600 px wide |
| After changing CSS/JS | Bump `styles.css?v=1` / `main.js?v=1` on all three pages so visitors don't get a cached copy |
