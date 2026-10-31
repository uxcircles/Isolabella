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

## Structure

```
index.html            Home: hero (shopfront, a dish and a set-menu stamp), welcome, favourite dishes, set menu, wine, gallery, find us
menu.html             Full menu (generated once from the PDFs; edit the HTML directly from now on)
book.html             Favourite Table booking (sitecode 1702), group rules, contact, hours
styles.css            All styles; colours and fonts are at the top in :root
main.js               Mobile nav, open-now status, gallery lightbox, menu index and search, map loader
assets/map.js         Map style and markers (colours in the C object at the top)
assets/vendor/maplibre MapLibre GL JS 4.7.1 (BSD-3), only loaded when the map scrolls into view
assets/img/           Photos (WebP, 800 and 1600 wide), logo.svg, logo-light.svg, mark-light.svg (map pin), og.jpg
files/                The restaurant's PDF menus, at the same paths as on the current site
favicon.svg, apple-touch-icon.png, robots.txt
```

Photos, logo and menus come from the current isolabellarestaurant.co.uk. The logo was traced from the site's PNG into SVG so it stays sharp. This concept uses only the italic ISOLABELLA wordmark, without the green hill and blue line above and below it; the favicon and map pin use its italic “I”.

`canonical`, `og:url` and the JSON-LD point to `https://uxcircles.github.io/Isolabella/`; update them if the site moves to its own domain. The PDFs stay at `files/…`, so old links to them keep working.

## Design direction

- **Colours from the original logo:** its green (`--hill`) for buttons and labels, its blue (`--lake`) for emphasis, a deep navy (`--ink`) for text and dark bands, and a warm linen background like the white tablecloths
- **Type:** Cormorant Garamond, an Italian-flavoured serif with an italic that echoes the logo's italic capitals, for headings and dish names; Manrope for body text. Both from Google Fonts (SIL Open Font License)
- **Hero:** the shopfront in an arched frame, a round close-up of a dish laid over it, and a slowly turning “Set menu · £44.50” stamp that links to the set menu. On load the text fades up in turn and the shopfront eases out of a slow zoom (switched off for visitors who prefer reduced motion)
- **Italian first, English underneath:** dishes keep their Italian names, with the English description below

## Everyday updates

| What | Where |
|---|---|
| Dishes and prices | `menu.html` (each `.menu-section`); the home page "favourites" and set menu also show prices |
| Opening hours | `index.html` Visit table (`data-open` / `data-close` drive the open-now status), the footer, the JSON-LD, and `book.html` |
| Set menu | `index.html` `#set-menu` and `menu.html` `#set-menu` |
| Photos | Add to `assets/img/` as WebP at 800 and 1600 px wide |
| After changing CSS/JS | Bump `styles.css?v=1` / `main.js?v=1` on all three pages so visitors don't get a cached copy |

## Internal notes

The review of the current site, the items to confirm with the client and the pitch material are kept locally in `.private/` (git-ignored, never committed).

After cloning, enable the git hooks:

```
git config core.hooksPath .githooks
```

Commits and pushes are then blocked if they include `.private/` or a phrase from `.private/blocklist.txt`, and the open to-dos in `.private/NOTES.md` are printed. To see them any time: `sh .githooks/remind.sh`
