# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| dr-polina (2026-11-15) | Clinic consultation (authored: hard black/grey cuts, no drift, multi-page) | Margin rail: vertical wordmark, menu, live folio; difference blended; bar on phones | Layered pin: giant name behind a real cutout portrait, two photo frames at different rates | 8 acts: pin, flow, pin, flow+slideshow, pin (peak 4.2vh), pan, flow, pin | Appointment card plate with footer inside the stage | The balance line: scroll sweeps a blush line across a real before and after, ticking six treatments; draggable and keyboard operable | Photographic, client's own photos only | 4500 |
| dr-polina-v2 (2026-11-25) | Object led editorial (one 3D object opens, then magazine spreads each with its own interaction) | Centred serif masthead, menu left, bag and book right; ink follows section theme; hides on scroll down | WebGL transmission drop in front of a cutout portrait plane, clinic photos as 3D planes; scroll dollies the camera through them | 9 acts: 3D pin (peak 2.6vh), flow words, 3D ring pin, lens, slices, turntables, spotlight, card builder, name | Appointment card that fills in from chips and sends to WhatsApp (shares the card idea with dr-polina) | Touchable serum drop: dents under the cursor, ripples on click, refracts her portrait | Photographic plus rendered glass | 4500 |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- Margin rail with a live chapter folio (dr-polina).
- Name set behind a cutout subject as the hero (dr-polina).
- Before and after line swept by scroll with ticking checklist (dr-polina).
- Appointment card close (dr-polina, dr-polina-v2).
- WebGL glass object over a photographic plane (dr-polina-v2).
- Cylinder ring of cards turned by scroll and drag (dr-polina-v2).
- Cursor lens revealing an after image (dr-polina-v2).

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
