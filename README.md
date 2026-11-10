# Dr. Polina Aesthetics — Website Redesign

A light, calm redesign of the Dr. Polina Aesthetics clinic website. Static HTML/CSS/JS — no build step, no backend required.

## Pages

- `index.html` — Home
- `about.html` — About the clinic
- `services.html` — Treatments & services
- `booking.html` — Appointment request form (hands off to WhatsApp)
- `contact.html` — Contact details, locations, hours

## Notes for the client

- **Photos**: every photo spot on the site is currently a dashed placeholder box. Drop real photos into the `images/` folder and swap the placeholder `<div class="img-placeholder">` blocks in the HTML for `<img>` tags once you have them.
- **WhatsApp number**: set to `+264 81 368 8846` (from the current site). Update it in `js/main.js` (`WHATSAPP_NUMBER`) and in every `wa.me` / `tel:` link if it changes.
- **WhatsApp chat widget**: the floating button bottom-right opens a small quick-reply panel; each option hands off to a real WhatsApp chat with a pre-filled message — no backend needed.
- **Booking page**: the form doesn't send email — it builds a WhatsApp message from the form fields and opens WhatsApp so the clinic can confirm directly. If you'd rather have bookings land in an inbox or calendar, that would need a small backend or a service like Calendly — happy to wire that in later.
- **Booking policy text**: the exact deposit / cancellation terms on the booking page are placeholders — confirm the real policy and update `booking.html`.
- **Facebook / TikTok links**: left as `#` placeholders in the footer and contact page since the exact handles weren't confirmed — update once you have the URLs.
- **Colors**: warm white, soft blush/rose, and charcoal text — no purple, no gradients.

## Local preview

Just open `index.html` in a browser, or serve the folder with any static file server.

## Deployment

Hosted via GitHub Pages from the `main` branch.
