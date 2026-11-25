# Dr. Polina Aesthetics website

Static site (HTML, CSS, vanilla JS, one Three.js bundle). Hosted on GitHub Pages from `main`.

## Pages

- `index.html` home. A real 3D hero: a liquid glass serum drop in front of the portrait that dents under the
  cursor, ripples on click and refracts what is behind it, with clinic photos floating in depth. Then a word by
  word manifesto, a 3D ring of concerns you can drag, the facial balancing lens (move it to see the after),
  a 3D strip slideshow of the clinics, turntable products, a cursor lit review, and an appointment card that
  fills in as you choose and sends to WhatsApp.
- `services.html` treatment index with floating previews, facial assessment, journal article, booking policy.
  Every row links to booking with that treatment already selected.
- `shop.html` products, product view, bag, WhatsApp checkout.
- `about.html` practice story, clinic slideshow, review, community, journal.
- `booking.html` full request form with the live appointment card. Opens WhatsApp.
- `contact.html` both clinics with maps, phone, hours, socials.

## Editing the shop

Everything lives in `js/products.js`: name, price (N$), stock (`in`, `order`, `out`), packaging text and images.
At checkout WhatsApp (+264 81 36 888 46) opens with every product, quantity, unit price, line total, total,
name and collection or delivery choice already written.

## Content sources

All copy, prices, addresses, hours, policy text and photos come from drpolinaaesthetics.com (home, services,
shop, product pages, blog). No statistics or claims were invented. Visible text contains no hyphens or dashes.

## Structure

- `css/main.css` the whole design: black, light grey, a touch of blush; Bodoni Moda and Hanken Grotesk.
- `js/app.js` header, menu, cursor, page transitions, bag and checkout, ring, lens, slideshow, tilt, forms.
- `js/hero.js` the 3D hero, bundled and minified from `src/hero.js` (Three.js r187).
  Rebuild after editing the source: `npx esbuild src/hero.js --bundle --minify --format=esm --outfile=js/hero.js`
  (with `three` installed). If WebGL is unavailable the hero falls back to a still composition.
- `scrollcraft/` design brief and build registry.

## Preview locally

Serve the folder with any static server, for example `npx serve .`, then open the printed URL.
