# Dr. Polina Aesthetics website

Static site (HTML, CSS, vanilla JS). No build step. Hosted on GitHub Pages from `main`.

## Pages

- `index.html` home: layered portrait hero, skin types, concerns, clinic slideshow, facial balancing before and after (drag the line), shop rail, review, community, appointment card
- `services.html` treatments, facial assessment, lip filler article, booking policy
- `shop.html` products, bag, WhatsApp checkout
- `about.html` practice, clinic slideshow, community, journal
- `booking.html` appointment request that opens WhatsApp
- `contact.html` both clinics with maps, hours, socials

## Editing the shop

Everything lives in `js/products.js`: name, price (N$), stock (`in`, `order`, `out`), packaging text, and images.
At checkout the bag opens WhatsApp (+264 81 36 888 46) with every product, quantity, unit price, line total, total,
name and collection or delivery choice already written.

## Content sources

All copy, prices, addresses, hours, policy text and photos come from drpolinaaesthetics.com (home, services, shop,
product pages, blog). The hero portrait is a local cutout of the studio photo on that site.
No statistics or claims were invented. Visible text contains no hyphens or dashes.

## Structure

- `css/scrollcraft.css`, `js/scrollcraft.js` scroll engine (scroll-craft skill, unmodified)
- `css/site.css` the design: black, light grey, one blush accent; Archivo and Geist
- `js/site.js` menu, folio, bag and checkout, slideshows, booking form, balance line
- `scrollcraft/` design brief and build registry

## Preview locally

Serve the folder with any static server, for example `npx serve .`, then open the printed URL.
