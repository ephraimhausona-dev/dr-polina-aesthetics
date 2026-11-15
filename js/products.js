/* ==========================================================================
   Shop catalogue. Every name, price, stock status and image here is taken from
   drpolinaaesthetics.com/ten/ (the live shop) as of November 2026.

   To edit the shop, change this file only:
     price   number in Namibian dollars, no symbol (1580 shows as N$1,580.00)
     stock   "in"    : In stock
             "order" : Available on backorder
             "out"   : Out of stock (people can still send an order request)
     spec    only text printed on the product packaging; leave "" if unsure
   ========================================================================== */
window.DPA_PRODUCTS = [
  {
    id: "pine-bottle",
    name: "Pine Bottle",
    price: 1580,
    stock: "order",
    spec: "",
    images: ["images/shop/pine-bottle-1.webp", "images/shop/pine-bottle-2.webp", "images/shop/pine-bottle-3.webp"]
  },
  {
    id: "lipo-lab",
    name: "Lipo Lab",
    price: 1580,
    stock: "out",
    spec: "PPC solution. Phosphatidylcholine 1,000mg. Box of 10 vials, 10ml each. Marked for medical use only.",
    images: ["images/shop/lipo-lab-1.webp", "images/shop/lipo-lab-2.webp", "images/shop/lipo-lab-3.webp"]
  },
  {
    id: "lipo-vela",
    name: "Lipo Vela",
    price: 1580,
    stock: "out",
    spec: "Lipolytic mesotherapy solution, advanced. 10ml vial.",
    images: ["images/shop/lipo-vela-2.webp", "images/shop/lipo-vela-1.webp"]
  },
  {
    id: "facial-ice-globes",
    name: "Facial Ice Globes",
    price: 390,
    stock: "out",
    spec: "",
    images: ["images/shop/ice-globes-1.webp", "images/shop/ice-globes-2.webp"]
  }
];
