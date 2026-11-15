/* ==========================================================================
   Dr. Polina Aesthetics: shared behaviour.
   Menu, folio, bag with WhatsApp checkout, slideshows, booking handoff,
   and the balance line on the home page.
   ========================================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "264813688846";            // +264 81 36 888 46
  var BAG_KEY = "dpa.bag.v1";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PRODUCTS = window.DPA_PRODUCTS || [];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function wa(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }
  function money(n) { return "N$" + n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function stockText(s) { return s === "in" ? "In stock" : s === "order" ? "Available on backorder" : "Out of stock"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.24 8.24 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
  };

  /* ------------------------------------------------------------- chrome -- */
  var page = document.body.getAttribute("data-page") || "";
  var LINKS = [
    ["index.html", "Home", "home", "images/portrait-studio.webp"],
    ["services.html", "Treatments", "services", "images/skin-treatment.webp"],
    ["shop.html", "Shop", "shop", "images/shop/lipo-lab-3.webp"],
    ["about.html", "About", "about", "images/portrait-gold.webp"],
    ["booking.html", "Booking", "booking", "images/clinic-room.webp"],
    ["contact.html", "Contact", "contact", "images/clinic-reception.webp"]
  ];

  function buildChrome() {
    var links = LINKS.map(function (l) {
      return '<li><a href="' + l[0] + '" data-img="' + l[3] + '"' + (l[2] === page ? ' aria-current="page"' : "") + ">" + l[1] + "</a></li>";
    }).join("");
    var imgs = LINKS.map(function (l, i) {
      return '<img src="' + l[3] + '" alt="" loading="lazy" data-for="' + l[3] + '"' + ((l[2] === page || (!page && i === 0)) ? ' class="is-on"' : "") + ">";
    }).join("");

    var html =
      '<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site menu">' +
        '<div class="menu__main">' +
          '<ul class="menu__links">' + links + "</ul>" +
          '<div class="menu__info">' +
            '<div><p class="label">Windhoek</p><p>No. 4 Feld Street, Ausspannplatz</p></div>' +
            '<div><p class="label">Oshikango</p><p>Freedom Square, Shop B3, First Floor (opposite Standard Bank)</p></div>' +
            '<div><p class="label">Hours</p><p>Monday to Saturday, 09:00 to 18:00<br>Sunday closed</p></div>' +
            '<div><p class="label">Follow</p><p><a href="https://www.instagram.com/drpolina_aesthetics/" target="_blank" rel="noopener">Instagram</a> &middot; <a href="https://www.facebook.com/drp.medspa" target="_blank" rel="noopener">Facebook</a> &middot; <a href="https://www.tiktok.com/@drpolina_aesthetics" target="_blank" rel="noopener">TikTok</a></p></div>' +
          "</div>" +
        "</div>" +
        '<div class="menu__visual" aria-hidden="true">' + imgs + "</div>" +
        '<button class="menu__close" type="button" data-menu-close>Close</button>' +
      "</div>" +

      '<div class="scrim" data-scrim></div>' +
      '<aside class="bag" id="bag" role="dialog" aria-modal="true" aria-labelledby="bag-title">' +
        '<div class="bag__head"><p class="label" id="bag-title">Your bag</p><button class="btn btn--ghost" type="button" data-bag-close style="min-height:38px;padding:0 14px">Close</button></div>' +
        '<div class="bag__body" data-bag-body></div>' +
        '<div class="bag__foot" data-bag-foot></div>' +
      "</aside>" +

      '<div class="wa" data-wa>' +
        '<div class="wa__panel" id="wa-panel" role="dialog" aria-label="Chat on WhatsApp">' +
          '<div class="wa__head"><div><p class="label">Dr. Polina Aesthetics</p><p>Choose a topic and WhatsApp opens with your message ready.</p></div><button class="wa__x" type="button" aria-label="Close" data-wa-close>&times;</button></div>' +
          '<div class="wa__opts">' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I would like to book an appointment.">Book an appointment</button>' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I would like to book a facial assessment for facial balancing.">Facial balancing assessment</button>' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I have a question about a treatment.">Ask about a treatment</button>' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I have a question about a product in your shop.">Ask about a product</button>' +
          "</div>" +
        "</div>" +
        '<button class="wa__launch" type="button" aria-expanded="false" aria-controls="wa-panel" aria-label="Chat with us on WhatsApp" data-wa-open>' + ICON.wa + "</button>" +
      "</div>" +
      '<div class="toast" role="status" aria-live="polite" data-toast><span data-toast-text></span><button type="button" data-bag-open>View bag</button></div>';

    var holder = document.createElement("div");
    holder.innerHTML = html;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);
  }

  /* --------------------------------------------------------------- menu -- */
  var lastFocus = null;
  function openMenu() {
    var m = $("#menu"); lastFocus = document.activeElement;
    m.classList.add("is-open"); document.documentElement.style.overflow = "hidden";
    $$("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    setTimeout(function () { var a = $(".menu__links a", m); if (a) a.focus({ preventScroll: true }); }, 80);
  }
  function closeMenu() {
    var m = $("#menu"); if (!m.classList.contains("is-open")) return;
    m.classList.remove("is-open"); document.documentElement.style.overflow = "";
    $$("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function initMenu() {
    $$("[data-menu-open]").forEach(function (b) { b.addEventListener("click", openMenu); });
    $("[data-menu-close]").addEventListener("click", closeMenu);
    $$(".menu__links a").forEach(function (a) {
      function show() {
        var src = a.getAttribute("data-img");
        $$(".menu__visual img").forEach(function (im) { im.classList.toggle("is-on", im.getAttribute("data-for") === src); });
      }
      a.addEventListener("mouseenter", show); a.addEventListener("focus", show);
    });
  }

  /* -------------------------------------------------------------- folio -- */
  function initFolio() {
    var out = $("[data-folio-out]"); if (!out) return;
    var secs = $$("[data-folio]"); if (!secs.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) out.textContent = e.target.getAttribute("data-folio");
      });
    }, { rootMargin: "-50% 0px -50% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ---------------------------------------------------------------- bag -- */
  var bag = [];
  try { bag = JSON.parse(localStorage.getItem(BAG_KEY) || "[]").filter(function (l) { return byId(l.id) && l.qty > 0; }); } catch (e) { bag = []; }
  function save() { try { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); } catch (e) {} renderBag(); }
  function count() { return bag.reduce(function (n, l) { return n + l.qty; }, 0); }
  function total() { return bag.reduce(function (n, l) { var p = byId(l.id); return n + (p ? p.price * l.qty : 0); }, 0); }

  function add(id, qty) {
    var p = byId(id); if (!p) return;
    var line = null; bag.forEach(function (l) { if (l.id === id) line = l; });
    if (line) line.qty = Math.min(20, line.qty + (qty || 1)); else bag.push({ id: id, qty: qty || 1 });
    save(); toast(p.name + " added to your bag");
  }
  function setQty(id, q) {
    bag = bag.map(function (l) { if (l.id === id) l.qty = Math.max(0, Math.min(20, q)); return l; }).filter(function (l) { return l.qty > 0; });
    save();
  }

  var toastTimer;
  function toast(msg) {
    var t = $("[data-toast]"); if (!t) return;
    $("[data-toast-text]", t).textContent = msg; t.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  function renderBag() {
    $$("[data-bag-count]").forEach(function (el) { el.textContent = count(); });
    var body = $("[data-bag-body]"), foot = $("[data-bag-foot]"); if (!body) return;
    if (!bag.length) {
      body.innerHTML = '<div class="bag__empty"><p class="display d-sm">Your bag is empty.</p><p>Browse the shop and add a product. At checkout WhatsApp opens with your order written out, ready to send.</p><p style="margin-top:1.5rem"><a class="btn btn--ink" href="shop.html">Visit the shop</a></p></div>';
      foot.innerHTML = ""; return;
    }
    body.innerHTML = bag.map(function (l) {
      var p = byId(l.id);
      return '<div class="line">' +
        '<img src="' + p.images[0] + '" alt="">' +
        '<div><h4>' + esc(p.name) + "</h4><p>" + money(p.price) + " each &middot; " + stockText(p.stock) + "</p>" +
          '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '">' +
            '<button type="button" data-q="' + p.id + '" data-d="-1" aria-label="Remove one"><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" style="margin:auto"><path d="M2 6h8" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
            "<output>" + l.qty + "</output>" +
            '<button type="button" data-q="' + p.id + '" data-d="1" aria-label="Add one">+</button>' +
          "</div><br>" +
          '<button class="line__remove" type="button" data-rm="' + p.id + '">Remove</button>' +
        "</div>" +
        '<div class="line__price">' + money(p.price * l.qty) + "</div>" +
      "</div>";
    }).join("");

    foot.innerHTML =
      '<div class="bag__total"><span class="label">Total</span><strong>' + money(total()) + "</strong></div>" +
      '<button class="btn btn--ink btn--block" type="button" data-checkout-start>Checkout</button>' +
      '<form class="checkout" data-checkout hidden novalidate>' +
        '<div class="field" data-f="name"><label for="co-name">Your name</label><input id="co-name" name="name" autocomplete="name" required><span class="field__err">Please add your name.</span></div>' +
        '<fieldset class="field choices"><legend>How would you like to receive it?</legend>' +
          '<label class="choice"><input type="radio" name="via" value="Collect at the Windhoek clinic, No. 4 Feld Street, Ausspannplatz" checked> Collect in Windhoek</label>' +
          '<label class="choice"><input type="radio" name="via" value="Collect at the Oshikango clinic, Freedom Square, Shop B3"> Collect in Oshikango</label>' +
          '<label class="choice"><input type="radio" name="via" value="Delivery"> Ask about delivery</label>' +
        "</fieldset>" +
        '<div class="field" data-f="addr" hidden><label for="co-addr">Delivery town and address</label><input id="co-addr" name="addr" autocomplete="street-address"></div>' +
        '<div class="field"><label for="co-note">Note (optional)</label><input id="co-note" name="note"></div>' +
        '<button class="btn btn--ink btn--block" type="submit">' + ICON.wa + " Send order on WhatsApp</button>" +
      "</form>" +
      '<p class="bag__note">WhatsApp opens with every product, quantity, price and your total already written. The clinic confirms availability and payment with you there.</p>';
  }

  function orderMessage(form) {
    var lines = ["Hello Dr. Polina Aesthetics, I would like to place an order from your website.", "", "ORDER"];
    bag.forEach(function (l) {
      var p = byId(l.id);
      lines.push(l.qty + " x " + p.name + " at " + money(p.price) + " = " + money(p.price * l.qty) + (p.stock !== "in" ? " (" + stockText(p.stock).toLowerCase() + " on the website)" : ""));
    });
    lines.push("", "TOTAL: " + money(total()), "");
    lines.push("Name: " + form.name.value.trim());
    var via = form.querySelector("input[name=via]:checked").value;
    lines.push("Receive: " + via + (via === "Delivery" && form.addr.value.trim() ? ", " + form.addr.value.trim() : ""));
    if (form.note.value.trim()) lines.push("Note: " + form.note.value.trim());
    lines.push("", "Please confirm availability and how I can pay. Thank you.");
    return lines.join("\n");
  }

  function openBag() {
    closeMenu(); lastFocus = document.activeElement;
    $("#bag").classList.add("is-open"); $("[data-scrim]").classList.add("is-on");
    document.documentElement.style.overflow = "hidden";
    setTimeout(function () { var b = $("[data-bag-close]"); if (b) b.focus({ preventScroll: true }); }, 60);
  }
  function closeBag() {
    var b = $("#bag"); if (!b || !b.classList.contains("is-open")) return;
    b.classList.remove("is-open"); $("[data-scrim]").classList.remove("is-on");
    document.documentElement.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  function initBag() {
    renderBag();
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      var el;
      if ((el = t.closest("[data-add]"))) { e.preventDefault(); add(el.getAttribute("data-add"), Number(el.getAttribute("data-qty") || 1)); return; }
      if (t.closest("[data-bag-open]")) { e.preventDefault(); $("[data-toast]").classList.remove("is-on"); openBag(); return; }
      if (t.closest("[data-bag-close]") || t.closest("[data-scrim]")) { closeBag(); return; }
      if ((el = t.closest("[data-q]"))) { var l = bag.filter(function (x) { return x.id === el.getAttribute("data-q"); })[0]; if (l) setQty(l.id, l.qty + Number(el.getAttribute("data-d"))); return; }
      if ((el = t.closest("[data-rm]"))) { setQty(el.getAttribute("data-rm"), 0); return; }
      if (t.closest("[data-checkout-start]")) {
        var f = $("[data-checkout]"); f.hidden = false; t.closest("[data-checkout-start]").hidden = true;
        f.name.focus(); return;
      }
    });
    document.addEventListener("change", function (e) {
      if (e.target.name === "via") { var a = $("[data-f=addr]"); if (a) a.hidden = e.target.value !== "Delivery"; }
    });
    document.addEventListener("submit", function (e) {
      if (!e.target.matches("[data-checkout]")) return;
      e.preventDefault();
      var f = e.target, nf = $("[data-f=name]", f);
      if (!f.name.value.trim()) { nf.setAttribute("aria-invalid", "true"); f.name.focus(); return; }
      nf.removeAttribute("aria-invalid");
      window.open(wa(orderMessage(f)), "_blank", "noopener");
    });
  }

  /* -------------------------------------------------------- WhatsApp FAB -- */
  function initWa() {
    var root = $("[data-wa]"), btn = $("[data-wa-open]");
    function set(open) { root.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); }
    btn.addEventListener("click", function () { set(!root.classList.contains("is-open")); });
    $("[data-wa-close]").addEventListener("click", function () { set(false); btn.focus(); });
    $$(".wa__opt").forEach(function (o) {
      o.addEventListener("click", function () { window.open(wa(o.getAttribute("data-msg")), "_blank", "noopener"); set(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      set(false); closeMenu(); closeBag();
    });
  }

  /* ---------------------------------------------------------- slideshow -- */
  function Slideshow(root) {
    var slides = $$(".slide", root); if (slides.length < 2) { if (slides[0]) slides[0].classList.add("is-on"); return; }
    var ms = Number(root.getAttribute("data-interval") || 5500);
    var auto = root.getAttribute("data-auto") !== "false";
    root.style.setProperty("--slide-ms", ms + "ms");
    var i = 0, timer = null, visible = false, hovering = false;

    var bar = document.createElement("div"); bar.className = "slides__bar";
    bar.innerHTML = '<button class="slides__arrow" type="button" aria-label="Previous image">' + ICON.prev + "</button>" +
      '<div class="slides__ticks">' + slides.map(function (_, k) { return '<button class="slides__tick" type="button" aria-label="Show image ' + (k + 1) + ' of ' + slides.length + '"><i></i></button>'; }).join("") + "</div>" +
      '<button class="slides__arrow" type="button" aria-label="Next image">' + ICON.next + "</button>";
    root.appendChild(bar);
    var ticks = $$(".slides__tick", bar), arrows = $$(".slides__arrow", bar);

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); s.setAttribute("aria-hidden", k === i ? "false" : "true"); });
      ticks.forEach(function (t, k) {
        t.classList.remove("is-on"); t.classList.toggle("is-done", k < i);
        void t.offsetWidth;
        if (k === i) t.classList.add("is-on");
        t.setAttribute("aria-current", k === i ? "true" : "false");
      });
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      var running = auto && visible && !hovering && !reduce && !document.hidden;
      root.classList.toggle("is-paused", !running);
      if (running) timer = setTimeout(function () { show(i + 1); }, ms);
    }
    arrows[0].addEventListener("click", function (e) { e.stopPropagation(); show(i - 1); });
    arrows[1].addEventListener("click", function (e) { e.stopPropagation(); show(i + 1); });
    ticks.forEach(function (t, k) { t.addEventListener("click", function (e) { e.stopPropagation(); show(k); }); });
    root.addEventListener("mouseenter", function () { hovering = true; schedule(); });
    root.addEventListener("mouseleave", function () { hovering = false; schedule(); });
    root.addEventListener("focusin", function () { hovering = true; schedule(); });
    root.addEventListener("focusout", function () { hovering = false; schedule(); });
    document.addEventListener("visibilitychange", schedule);

    var sx = null;
    root.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(root);
    } else { visible = true; }
    show(0);
    root._show = show;
  }

  /* ----------------------------------------------------------- products -- */
  function slidesHTML(p, extraClass) {
    return '<div class="slides ' + (extraClass || "") + '" data-slideshow data-interval="3200" data-auto="' + (extraClass === "is-view" ? "true" : "false") + '">' +
      p.images.map(function (src, k) { return '<figure class="slide"><img src="' + src + '" alt="' + esc(p.name) + ", photo " + (k + 1) + '"' + (k ? ' loading="lazy"' : "") + "></figure>"; }).join("") +
    "</div>";
  }

  function renderShop() {
    var grid = $("[data-shop]"); if (!grid) return;
    grid.innerHTML = PRODUCTS.map(function (p) {
      return '<article class="prod" data-sc-in id="' + p.id + '">' +
        slidesHTML(p).replace('class="slides ', 'data-view="' + p.id + '" class="slides ') +
        '<div class="prod__meta"><h2>' + esc(p.name) + '</h2><span class="prod__price">' + money(p.price) + "</span>" +
        '<span class="prod__stock" data-s="' + p.stock + '">' + stockText(p.stock) + "</span></div>" +
        (p.spec ? '<p class="prod__spec">' + esc(p.spec) + "</p>" : "") +
        '<div class="prod__act"><button class="btn btn--ink" type="button" data-add="' + p.id + '">Add to bag</button>' +
        '<button class="btn btn--ghost" type="button" data-view-btn="' + p.id + '">View</button></div>' +
      "</article>";
    }).join("");
    $$("[data-slideshow]", grid).forEach(Slideshow);

    var dlg = $("[data-pview]");
    function view(id) {
      var p = byId(id); if (!p || !dlg) return;
      $("[data-pview-media]", dlg).innerHTML = slidesHTML(p, "is-view");
      $("[data-pview-info]", dlg).innerHTML =
        '<p class="label label--soft">Dr. Polina Aesthetics shop</p>' +
        '<h2 class="display d-lg">' + esc(p.name) + "</h2>" +
        '<p class="display d-sm" style="font-variant-numeric:tabular-nums">' + money(p.price) + "</p>" +
        '<p class="prod__stock" data-s="' + p.stock + '">' + stockText(p.stock) + "</p>" +
        (p.spec ? '<p class="prose">' + esc(p.spec) + "</p>" : '<p class="prose">Ask us about this product on WhatsApp and the clinic will advise.</p>') +
        '<div class="field"><label for="pv-qty">Quantity</label><select id="pv-qty">' + [1,2,3,4,5,6].map(function (n) { return "<option>" + n + "</option>"; }).join("") + "</select></div>" +
        '<button class="btn btn--ink btn--block" type="button" data-add="' + p.id + '" data-pv-add>Add to bag</button>' +
        '<a class="btn btn--ghost btn--block" target="_blank" rel="noopener" href="' + wa("Hello Dr. Polina Aesthetics, I have a question about " + p.name + " (" + money(p.price) + ").") + '">' + ICON.wa + " Ask about it</a>";
      var sel = $("#pv-qty", dlg), addBtn = $("[data-pv-add]", dlg);
      sel.addEventListener("change", function () { addBtn.setAttribute("data-qty", sel.value); });
      $$("[data-slideshow]", dlg).forEach(Slideshow);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    }
    document.addEventListener("click", function (e) {
      var v = e.target.closest("[data-view-btn]") || (e.target.closest(".slides__bar") ? null : e.target.closest("[data-view]"));
      if (v) view(v.getAttribute("data-view-btn") || v.getAttribute("data-view"));
      if (e.target.closest("[data-pv-close]")) dlg.close();
      if (e.target.closest("[data-pv-add]")) dlg.close();
    });
    if (dlg) dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    if (location.hash && byId(location.hash.slice(1))) setTimeout(function () { view(location.hash.slice(1)); }, 400);
  }

  function renderRail() {
    var rail = $("[data-rail-products]"); if (!rail) return;
    var html = PRODUCTS.map(function (p) {
      return '<a class="pcard" href="shop.html#' + p.id + '">' +
        '<div class="pcard__img"><img src="' + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<div class="pcard__meta"><h3>' + esc(p.name) + "</h3><span>" + money(p.price) + "</span></div>" +
        '<p class="pcard__stock">' + stockText(p.stock) + "</p></a>";
    }).join("");
    rail.insertAdjacentHTML("afterend", html);
    rail.parentNode.removeChild(rail);
  }

  /* --------------------------------------------------------- booking ----- */
  function initBooking() {
    var form = $("#booking-form"); if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["name", "phone"].forEach(function (n) {
        var f = form.querySelector('[data-f="' + n + '"]');
        var bad = !form[n].value.trim(); if (bad) ok = false;
        if (bad) f.setAttribute("aria-invalid", "true"); else f.removeAttribute("aria-invalid");
      });
      if (!ok) { form.querySelector('[aria-invalid="true"] input').focus(); return; }
      var L = [
        "Hello Dr. Polina Aesthetics, I would like to request an appointment.", "",
        "Name: " + form.name.value.trim(),
        "Phone: " + form.phone.value.trim(),
        "Clinic: " + form.location.value,
        "Treatment: " + form.service.value
      ];
      if (form.date.value) L.push("Preferred date: " + form.date.value);
      if (form.time.value) L.push("Preferred time: " + form.time.value);
      if (form.notes.value.trim()) L.push("Notes: " + form.notes.value.trim());
      window.open(wa(L.join("\n")), "_blank", "noopener");
      $("#booking-confirm").classList.add("is-on");
    });
  }

  /* ----------------------------------------- signature: the balance line --
     A blush line crosses a real before and after. Scroll moves it; the six
     facial balancing treatments tick as it passes. Grab it and it is yours. */
  function initBalance() {
    var act = $("[data-balance]"); if (!act) return;
    var cmp = $(".compare", act), knob = $(".compare__knob", act), ticks = $$(".ticks li", act);
    var x = 1, manual = null, lastY = window.scrollY, dragging = false;

    function apply(v) {
      x = Math.max(0, Math.min(1, v));
      cmp.style.setProperty("--x", (4 + x * 92).toFixed(2) + "%");
      var swept = 1 - x;
      ticks.forEach(function (li, k) { li.classList.toggle("is-on", swept >= (k + 1) / (ticks.length + 1)); });
      knob.setAttribute("aria-valuenow", Math.round(swept * 100));
      knob.setAttribute("aria-valuetext", Math.round(swept * 100) + " percent after");
    }
    function fromScroll() {
      var r = act.getBoundingClientRect(), travel = r.height - window.innerHeight;
      var p = travel > 0 ? Math.max(0, Math.min(1, -r.top / travel)) : 0;
      var s = Math.max(0, Math.min(1, (p - 0.12) / 0.66));
      s = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
      return 1 - s;
    }
    var raf = 0;
    function tick() {
      raf = 0;
      if (dragging) return;
      if (manual !== null && Math.abs(window.scrollY - lastY) > 60) manual = null;
      if (manual === null) apply(fromScroll());
    }
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
    window.addEventListener("resize", tick);

    function at(clientX) { var r = cmp.getBoundingClientRect(); return ((clientX - r.left) / r.width - 0.04) / 0.92; }
    cmp.addEventListener("pointerdown", function (e) {
      dragging = true; cmp.setPointerCapture && cmp.setPointerCapture(e.pointerId);
      apply(at(e.clientX)); manual = x; lastY = window.scrollY;
    });
    cmp.addEventListener("pointermove", function (e) { if (dragging) { apply(at(e.clientX)); manual = x; } });
    function end() { dragging = false; lastY = window.scrollY; }
    cmp.addEventListener("pointerup", end); cmp.addEventListener("pointercancel", end);
    knob.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 0.1 : 0.04;
      if (e.key === "ArrowLeft") { apply(x - step); manual = x; lastY = window.scrollY; e.preventDefault(); }
      if (e.key === "ArrowRight") { apply(x + step); manual = x; lastY = window.scrollY; e.preventDefault(); }
      if (e.key === "Home") { apply(1); manual = x; e.preventDefault(); }
      if (e.key === "End") { apply(0); manual = x; e.preventDefault(); }
    });
    apply(fromScroll());
  }

  /* ------------------------------------------------- rail item settle ---- */
  function initRailSettle() {
    var act = $("[data-settle]"); if (!act || reduce) return;
    var cards = $$(".pcard", act), raf = 0;
    function run() {
      raf = 0;
      var vw = window.innerWidth;
      cards.forEach(function (c) {
        var r = c.getBoundingClientRect();
        var v = Math.max(0, Math.min(1, (vw - r.left) / (vw * 0.35)));
        c.style.setProperty("--settle", v.toFixed(3));
      });
    }
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(run); }, { passive: true });
    run();
  }

  /* --------------------------------------------------------------- boot -- */
  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    initMenu(); initFolio(); initBag(); initWa();
    renderRail(); renderShop();
    $$("[data-slideshow]").forEach(function (s) { if (!s._init) { s._init = 1; if (!$(".slides__bar", s)) Slideshow(s); } });
    initBooking(); initBalance(); initRailSettle();
    $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
    if (window.ScrollCraft) window.ScrollCraft.mount(document.body);
  });
})();
