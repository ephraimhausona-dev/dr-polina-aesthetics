/* ==========================================================================
   Dr. Polina Aesthetics: site behaviour.
   Chrome (header, menu, bag, WhatsApp, cursor, page veil), the shop with
   WhatsApp checkout, and the page pieces: hero cues, manifesto, treatment
   ring, the lens, slice slideshow, turntable products, tilt cards, review
   spotlight, consultation card and the footer name.
   ========================================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "264813688846";
  var BAG_KEY = "dpa.bag.v1";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var PRODUCTS = window.DPA_PRODUCTS || [];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function wa(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }
  function money(n) { return "N$" + n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function stockText(s) { return s === "in" ? "In stock" : s === "order" ? "Available on backorder" : "Out of stock"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function onScroll(fn) { var raf = 0; function run() { raf = 0; fn(); } window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(run); }, { passive: true }); window.addEventListener("resize", run); run(); }
  function inView(el, cb, margin) {
    if (!("IntersectionObserver" in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, { rootMargin: margin || "0px" }).observe(el);
  }

  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.24 8.24 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    x: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>',
    minus: '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 6h8" stroke="currentColor" stroke-width="1.4"/></svg>',
    plus: '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 6h8M6 2v8" stroke="currentColor" stroke-width="1.4"/></svg>'
  };

  /* public hooks for the 3D hero */
  window.DPA = window.DPA || {};

  /* ------------------------------------------------------------ chrome -- */
  var page = document.body.getAttribute("data-page") || "";
  var LINKS = [
    ["index.html", "Home", "home", "images/portrait-studio.webp"],
    ["services.html", "Treatments", "services", "images/skin-treatment.webp"],
    ["shop.html", "Shop", "shop", "images/shop/ice-globes-1.webp"],
    ["about.html", "About", "about", "images/portrait-gold.webp"],
    ["booking.html", "Booking", "booking", "images/clinic-room.webp"],
    ["contact.html", "Contact", "contact", "images/clinic-reception.webp"]
  ];

  function buildChrome() {
    var links = LINKS.map(function (l, i) {
      return '<li><a href="' + l[0] + '" data-k="' + i + '" style="--i:' + i + '"' + (l[2] === page ? ' aria-current="page"' : "") + ">" + l[1] + "</a></li>";
    }).join("");
    var figs = LINKS.map(function (l, i) {
      var on = l[2] === page || (!page && i === 0);
      return '<figure data-k="' + i + '"' + (on ? ' class="is-on"' : "") + '><img src="' + l[3] + '" alt="" loading="lazy"></figure>';
    }).join("");

    var html =
      '<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site menu">' +
        '<button class="menu__close" type="button" data-menu-close><i aria-hidden="true"></i><span>Close</span></button>' +
        '<div class="menu__main">' +
          '<ul class="menu__links">' + links + "</ul>" +
          '<div class="menu__info">' +
            '<div><p class="eyebrow">Windhoek</p><p>No. 4 Feld Street, Ausspannplatz</p></div>' +
            '<div><p class="eyebrow">Oshikango</p><p>Freedom Square, Shop B3, First Floor, opposite Standard Bank</p></div>' +
            '<div><p class="eyebrow">Hours</p><p>Monday to Saturday, 09:00 to 18:00. Sunday closed.</p></div>' +
            '<div><p class="eyebrow">Call or WhatsApp</p><p><a href="tel:+264813688846">+264 81 36 888 46</a></p><p><a href="https://www.instagram.com/drpolina_aesthetics/" target="_blank" rel="noopener">Instagram</a> &middot; <a href="https://www.facebook.com/drp.medspa" target="_blank" rel="noopener">Facebook</a> &middot; <a href="https://www.tiktok.com/@drpolina_aesthetics" target="_blank" rel="noopener">TikTok</a></p></div>' +
          "</div>" +
        "</div>" +
        '<div class="menu__visual" aria-hidden="true">' + figs + "</div>" +
      "</div>" +

      '<div class="scrim" data-scrim></div>' +
      '<aside class="bag" id="bag" role="dialog" aria-modal="true" aria-labelledby="bag-title">' +
        '<div class="bag__head"><h2 class="h4 serif" id="bag-title">Your bag</h2><button class="bag__x" type="button" data-bag-close aria-label="Close bag">' + ICON.x + "</button></div>" +
        '<div class="bag__body" data-bag-body></div>' +
        '<div class="bag__foot" data-bag-foot></div>' +
      "</aside>" +

      '<div class="wa" data-wa>' +
        '<div class="wa__panel" id="wa-panel" role="dialog" aria-label="Chat on WhatsApp">' +
          '<div class="wa__head"><div><p class="eyebrow">Dr. Polina Aesthetics</p><p>Pick a topic and WhatsApp opens with your message ready.</p></div><button class="wa__x" type="button" aria-label="Close" data-wa-close>&times;</button></div>' +
          '<div class="wa__opts">' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I would like to book an appointment.">Book an appointment</button>' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I would like to book a facial assessment for facial balancing.">Facial balancing assessment</button>' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I have a question about a treatment.">Ask about a treatment</button>' +
            '<button class="wa__opt" type="button" data-msg="Hello Dr. Polina Aesthetics, I have a question about a product in your shop.">Ask about a product</button>' +
          "</div>" +
        "</div>" +
        '<button class="wa__launch" type="button" aria-expanded="false" aria-controls="wa-panel" aria-label="Chat with us on WhatsApp" data-wa-open>' + ICON.wa + "</button>" +
      "</div>" +
      '<div class="toast" role="status" aria-live="polite" data-toast><span data-toast-text></span><button type="button" data-bag-open>View bag</button></div>' +
      '<div class="cursor" aria-hidden="true"><div class="cursor__ring"><span></span></div><div class="cursor__dot"></div></div>' +
      '<div class="floaty" aria-hidden="true"><img alt=""></div>' +
      '<div class="veil" aria-hidden="true"><p class="veil__mark">Dr. Polina</p></div>';

    var holder = document.createElement("div");
    holder.innerHTML = html;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);
  }

  /* -------------------------------------------------------------- veil -- */
  function initVeil() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (root.classList.contains("is-entering")) {
          root.classList.add("is-entered");
          setTimeout(function () { root.classList.remove("is-entering", "is-entered"); }, 1300);
        }
      });
    });
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (reduce) return;
      e.preventDefault();
      try { sessionStorage.setItem("dpa.t", "1"); } catch (err) {}
      root.classList.add("is-leaving");
      setTimeout(function () { location.href = url.href; }, 620);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) root.classList.remove("is-leaving", "is-entering", "is-entered"); });
  }

  /* ------------------------------------------------------------ header -- */
  function initHeader() {
    var hdr = $("[data-hdr]"); if (!hdr) return;
    var secs = $$("[data-theme]").filter(function (s) { return !s.closest(".menu, .bag, .hdr"); });
    var lastY = window.scrollY;
    onScroll(function () {
      var y = window.scrollY, probe = hdr.offsetHeight / 2, theme = "light";
      for (var i = 0; i < secs.length; i++) {
        var r = secs[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) theme = secs[i].getAttribute("data-theme");
      }
      hdr.classList.toggle("is-dark", theme === "dark");
      hdr.classList.toggle("is-solid", y > 80);
      if (!root.classList.contains("menu-open")) {
        if (y > lastY + 6 && y > 400) hdr.classList.add("is-hidden");
        else if (y < lastY - 6 || y < 400) hdr.classList.remove("is-hidden");
      }
      lastY = y;
    });
  }

  /* -------------------------------------------------------------- menu -- */
  var lastFocus = null;
  function openMenu() {
    var m = $("#menu"); lastFocus = document.activeElement;
    m.classList.add("is-open"); root.classList.add("menu-open"); root.style.overflow = "hidden";
    $$("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    setTimeout(function () { var a = $(".menu__links a", m); if (a) a.focus({ preventScroll: true }); }, 120);
  }
  function closeMenu() {
    var m = $("#menu"); if (!m || !m.classList.contains("is-open")) return;
    m.classList.remove("is-open"); root.classList.remove("menu-open"); root.style.overflow = "";
    $$("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function initMenu() {
    $$("[data-menu-open]").forEach(function (b) { b.addEventListener("click", openMenu); });
    $("[data-menu-close]").addEventListener("click", closeMenu);
    $$(".menu__links a").forEach(function (a) {
      function show() { var k = a.getAttribute("data-k"); $$(".menu__visual figure").forEach(function (f) { f.classList.toggle("is-on", f.getAttribute("data-k") === k); }); }
      a.addEventListener("mouseenter", show); a.addEventListener("focus", show);
    });
  }

  /* ------------------------------------------------------------ cursor -- */
  function initCursor() {
    if (!fine || reduce) return;
    var c = $(".cursor"), ring = $(".cursor__ring", c), dot = $(".cursor__dot", c), label = $("span", ring);
    root.classList.add("has-cursor");
    var x = -100, y = -100, rx = -100, ry = -100, forced = null, hoverLabel = null;
    window.addEventListener("pointermove", function (e) { x = e.clientX; y = e.clientY; c.classList.remove("is-hidden"); }, { passive: true });
    document.addEventListener("pointerleave", function () { c.classList.add("is-hidden"); });
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      var lab = t.closest && t.closest("[data-cursor]");
      hoverLabel = lab ? lab.getAttribute("data-cursor") : null;
      var isLink = !hoverLabel && t.closest && t.closest("a, button, label, select, summary, [role=button]");
      c.classList.toggle("is-link", !!isLink);
      paint();
    });
    function paint() {
      var l = forced || hoverLabel;
      c.classList.toggle("is-label", !!l);
      if (l) label.textContent = l;
    }
    window.DPA.cursor = function (l) { forced = l; paint(); };
    (function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------ magnet -- */
  function initMagnet() {
    if (!fine || reduce) return;
    $$("[data-magnet]").forEach(function (el) {
      el.style.transition = "transform 0.6s cubic-bezier(.22,1,.36,1)";
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + dx * 0.28 + "px," + dy * 0.36 + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------- split + reveal -- */
  function initReveal() {
    $$("[data-split]").forEach(function (el) {
      var parts = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = parts.map(function (p, i) { return '<span class="ln"><span style="--i:' + i + '">' + p.trim() + "</span></span>"; }).join("");
    });
    var items = $$("[data-split], [data-reveal]");
    if (!("IntersectionObserver" in window) || reduce) { items.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------------- bag -- */
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
    bag = bag.map(function (l) { if (l.id === id) l.qty = clamp(q, 0, 20); return l; }).filter(function (l) { return l.qty > 0; });
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
      body.innerHTML = '<div class="bag__empty"><p class="h3 serif">Your bag is <em>empty.</em></p><p class="soft">Add a product and check out. WhatsApp opens with your order written out, ready to send.</p><p><a class="pill pill--ink" href="shop.html">Visit the shop</a></p></div>';
      foot.innerHTML = ""; return;
    }
    body.innerHTML = bag.map(function (l) {
      var p = byId(l.id);
      return '<div class="line"><img src="' + p.images[0] + '" alt="">' +
        "<div><h4>" + esc(p.name) + "</h4><p>" + money(p.price) + " each &middot; " + stockText(p.stock) + "</p>" +
          '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '">' +
            '<button type="button" data-q="' + p.id + '" data-d="-1" aria-label="Remove one">' + ICON.minus + "</button>" +
            "<output>" + l.qty + "</output>" +
            '<button type="button" data-q="' + p.id + '" data-d="1" aria-label="Add one">' + ICON.plus + "</button>" +
          "</div>" +
          '<button class="line__rm" type="button" data-rm="' + p.id + '">Remove</button>' +
        "</div>" +
        '<div class="line__price">' + money(p.price * l.qty) + "</div></div>";
    }).join("");
    foot.innerHTML =
      '<div class="bag__total"><span class="eyebrow">Total</span><strong>' + money(total()) + "</strong></div>" +
      '<button class="pill pill--ink pill--block" type="button" data-checkout-start>Checkout</button>' +
      '<form class="checkout" data-checkout hidden novalidate style="display:grid;gap:16px">' +
        '<div class="field" data-f="name"><label for="co-name">Your name</label><input id="co-name" name="name" autocomplete="name" required><span class="field__err">Please add your name.</span></div>' +
        '<fieldset class="fs"><legend>How would you like to receive it?</legend><div class="chips">' +
          '<label class="chip"><input type="radio" name="via" value="Collect at the Windhoek clinic, No. 4 Feld Street, Ausspannplatz" checked><span>Collect in Windhoek</span></label>' +
          '<label class="chip"><input type="radio" name="via" value="Collect at the Oshikango clinic, Freedom Square, Shop B3"><span>Collect in Oshikango</span></label>' +
          '<label class="chip"><input type="radio" name="via" value="Delivery"><span>Ask about delivery</span></label>' +
        "</div></fieldset>" +
        '<div class="field" data-f="addr" hidden><label for="co-addr">Delivery town and address</label><input id="co-addr" name="addr" autocomplete="street-address"></div>' +
        '<div class="field"><label for="co-note">Note (optional)</label><input id="co-note" name="note"></div>' +
        '<button class="pill pill--ink pill--block" type="submit">' + ICON.wa + "<span>Send order on WhatsApp</span></button>" +
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
    $("#bag").classList.add("is-open"); $("[data-scrim]").classList.add("is-on"); root.style.overflow = "hidden";
    setTimeout(function () { var b = $("[data-bag-close]"); if (b) b.focus({ preventScroll: true }); }, 60);
  }
  function closeBag() {
    var b = $("#bag"); if (!b || !b.classList.contains("is-open")) return;
    b.classList.remove("is-open"); $("[data-scrim]").classList.remove("is-on"); root.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function initBag() {
    renderBag();
    document.addEventListener("click", function (e) {
      var t = e.target; if (!t.closest) return;
      var el;
      if ((el = t.closest("[data-add]"))) { e.preventDefault(); add(el.getAttribute("data-add"), Number(el.getAttribute("data-qty") || 1)); return; }
      if (t.closest("[data-bag-open]")) { e.preventDefault(); $("[data-toast]").classList.remove("is-on"); openBag(); return; }
      if (t.closest("[data-bag-close]") || t.closest("[data-scrim]")) { closeBag(); return; }
      if ((el = t.closest("[data-q]"))) { var l = bag.filter(function (x) { return x.id === el.getAttribute("data-q"); })[0]; if (l) setQty(l.id, l.qty + Number(el.getAttribute("data-d"))); return; }
      if ((el = t.closest("[data-rm]"))) { setQty(el.getAttribute("data-rm"), 0); return; }
      if ((el = t.closest("[data-checkout-start]"))) { var f = $("[data-checkout]"); f.hidden = false; el.hidden = true; f.name.focus(); }
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

  /* ------------------------------------------------------- WhatsApp FAB -- */
  function initWa() {
    var w = $("[data-wa]"), btn = $("[data-wa-open]");
    function set(open) { w.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); }
    btn.addEventListener("click", function () { set(!w.classList.contains("is-open")); });
    $("[data-wa-close]").addEventListener("click", function () { set(false); btn.focus(); });
    $$(".wa__opt").forEach(function (o) { o.addEventListener("click", function () { window.open(wa(o.getAttribute("data-msg")), "_blank", "noopener"); set(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      set(false); closeMenu(); closeBag();
      var d = $("dialog[open]"); if (d) d.close();
    });
  }

  /* --------------------------------------------------- turntable cards -- */
  function turnHTML(p, opts) {
    opts = opts || {};
    return '<div class="turn" data-turn' + (opts.view ? ' data-view="' + p.id + '" data-cursor="View"' : "") + ">" +
      '<div class="turn__in">' +
        '<div class="turn__imgs">' + p.images.map(function (src, k) { return '<img src="' + src + '" alt="' + (k ? "" : esc(p.name)) + '"' + (k ? ' loading="lazy"' : "") + (k === 0 ? ' class="is-on"' : "") + ">"; }).join("") + "</div>" +
        '<span class="turn__stock" data-s="' + p.stock + '">' + stockText(p.stock) + "</span>" +
        (p.images.length > 1 ? '<span class="turn__hint" aria-hidden="true">' + p.images.length + " views</span>" : "") +
        '<div class="turn__ticks" aria-hidden="true">' + p.images.map(function (_, k) { return "<i" + (k ? "" : ' class="is-on"') + "></i>"; }).join("") + "</div>" +
        '<span class="turn__glare"></span>' +
      "</div></div>";
  }
  function initTurn(el) {
    if (el._turn) return; el._turn = 1;
    var imgs = $$(".turn__imgs img", el), ticks = $$(".turn__ticks i", el), inner = $(".turn__in", el), cur = 0;
    function show(k) {
      if (k === cur) return; cur = k;
      imgs.forEach(function (im, i) { im.classList.toggle("is-on", i === k); });
      ticks.forEach(function (t, i) { t.classList.toggle("is-on", i === k); });
    }
    el._show = show;
    if (fine) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
        show(clamp(Math.floor(fx * imgs.length), 0, imgs.length - 1));
        if (!reduce) {
          inner.style.setProperty("--ry", ((fx - 0.5) * 16).toFixed(2) + "deg");
          inner.style.setProperty("--rx", ((0.5 - fy) * 12).toFixed(2) + "deg");
        }
        inner.style.setProperty("--gx", fx * 100 + "%"); inner.style.setProperty("--gy", fy * 100 + "%");
      });
      el.addEventListener("pointerleave", function () { show(0); inner.style.setProperty("--rx", "0deg"); inner.style.setProperty("--ry", "0deg"); });
    } else if (imgs.length > 1 && !reduce) {
      var vis = false, timer;
      inView(el, function (v) { vis = v; clearInterval(timer); if (v) timer = setInterval(function () { show((cur + 1) % imgs.length); }, 1700); });
    }
  }

  function renderProducts() {
    $$("[data-products]").forEach(function (grid) {
      var full = grid.getAttribute("data-products") === "shop";
      grid.innerHTML = PRODUCTS.map(function (p, i) {
        return '<article class="prod" id="' + p.id + '" data-reveal style="--d:' + i * 90 + 'ms">' +
          (full ? turnHTML(p, { view: true }) : '<a href="shop.html#' + p.id + '" aria-label="' + esc(p.name) + ', view in the shop">' + turnHTML(p) + "</a>") +
          '<div class="prod__meta"><h3>' + esc(p.name) + '</h3><span class="prod__price">' + money(p.price) + "</span></div>" +
          (full && p.spec ? '<p class="prod__spec">' + esc(p.spec) + "</p>" : "") +
          '<div class="prod__act">' +
            '<button class="pill pill--ink pill--sm" type="button" data-add="' + p.id + '">Add to bag</button>' +
            (full ? '<button class="pill pill--sm pill--on-light" type="button" data-view-btn="' + p.id + '">View</button>' : "") +
          "</div></article>";
      }).join("");
      $$("[data-turn]", grid).forEach(initTurn);
    });

    var dlg = $("[data-pview]"); if (!dlg) return;
    function view(id) {
      var p = byId(id); if (!p) return;
      $("[data-pview-media]", dlg).innerHTML = turnHTML(p);
      $("[data-pview-info]", dlg).innerHTML =
        '<p class="eyebrow">Dr. Polina Aesthetics shop</p>' +
        '<h2 class="h2">' + esc(p.name) + "</h2>" +
        '<p class="pview__price">' + money(p.price) + "</p>" +
        '<p class="small soft">' + stockText(p.stock) + (p.stock !== "in" ? ". You can still send an order request and the clinic will confirm." : "") + "</p>" +
        (p.spec ? "<p>" + esc(p.spec) + "</p>" : "<p class=\"soft\">Ask us about this product on WhatsApp and the clinic will advise.</p>") +
        (p.images.length > 1 ? '<div class="pview__thumbs">' + p.images.map(function (s, k) { return '<button type="button" data-thumb="' + k + '" aria-label="Show photo ' + (k + 1) + '" aria-current="' + (k ? "false" : "true") + '"><img src="' + s + '" alt=""></button>'; }).join("") + "</div>" : "") +
        '<div class="field"><label for="pv-qty">Quantity</label><select id="pv-qty">' + [1, 2, 3, 4, 5, 6].map(function (n) { return "<option>" + n + "</option>"; }).join("") + "</select></div>" +
        '<button class="pill pill--ink pill--block" type="button" data-add="' + p.id + '" data-pv-add>Add to bag</button>' +
        '<a class="pill pill--block pill--on-light" target="_blank" rel="noopener" href="' + wa("Hello Dr. Polina Aesthetics, I have a question about " + p.name + " (" + money(p.price) + ").") + '">' + ICON.wa + "<span>Ask about it</span></a>";
      var t = $("[data-turn]", dlg); initTurn(t);
      $$("[data-thumb]", dlg).forEach(function (b) {
        b.addEventListener("click", function () {
          t._show(Number(b.getAttribute("data-thumb")));
          $$("[data-thumb]", dlg).forEach(function (o) { o.setAttribute("aria-current", String(o === b)); });
        });
      });
      var sel = $("#pv-qty", dlg), addBtn = $("[data-pv-add]", dlg);
      sel.addEventListener("change", function () { addBtn.setAttribute("data-qty", sel.value); });
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    }
    document.addEventListener("click", function (e) {
      if (!e.target.closest) return;
      var v = e.target.closest("[data-view-btn]") || e.target.closest("[data-view]");
      if (v && !dlg.contains(v)) view(v.getAttribute("data-view-btn") || v.getAttribute("data-view"));
      if (e.target.closest("[data-pv-close]") || e.target.closest("[data-pv-add]")) dlg.close();
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    if (location.hash && byId(location.hash.slice(1))) setTimeout(function () { view(location.hash.slice(1)); }, 500);
  }

  /* --------------------------------------------------------- hero cues -- */
  function initHeroCues() {
    var hero = $("[data-hero]"); if (!hero) return;
    var cues = $$("[data-cue]", hero).map(function (el) {
      var v = el.getAttribute("data-cue").split(/\s+/).map(Number);
      return { el: el, a: v[0], b: v[1] };
    });
    function sm(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
    onScroll(function () {
      var r = hero.getBoundingClientRect(), travel = r.height - window.innerHeight;
      var p = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;
      hero.style.setProperty("--p", p.toFixed(4));
      if (reduce) return;
      cues.forEach(function (c) {
        var f = 0.07;
        var o = (c.a <= 0 ? 1 : sm(c.a, c.a + f, p)) * (c.b >= 1 ? 1 : 1 - sm(c.b - f, c.b, p));
        c.el.style.opacity = o.toFixed(3);
        c.el.style.transform = "translateY(" + ((1 - o) * (p > c.a + f ? -24 : 24)).toFixed(1) + "px)";
        c.el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
    });
  }

  /* --------------------------------------------------------- manifesto -- */
  function splitWords(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
          else { var s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s); }
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) splitWords(n);
    });
  }
  function initWords() {
    $$("[data-words]").forEach(function (el) {
      splitWords(el);
      var ws = $$(".w", el), n = ws.length;
      if (reduce) return ws.forEach(function (w) { w.style.setProperty("--o", 1); });
      onScroll(function () {
        var r = el.getBoundingClientRect(), vh = window.innerHeight;
        var p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1);
        var k = p * (n + 5);
        ws.forEach(function (w, i) { w.style.setProperty("--o", (0.14 + 0.86 * clamp((k - i) / 4, 0, 1)).toFixed(3)); });
      });
    });
  }

  /* -------------------------------------------------------------- ring -- */
  function initRing() {
    var sec = $("[data-ring]"); if (!sec) return;
    var view = $(".ring__view", sec), track = $("[data-ring-track]", sec), cards = $$(".rcard", track), now = $("[data-ring-now]", sec);
    var N = cards.length, step = 360 / N, R = 500;
    track.style.setProperty("--step", step + "deg");
    cards.forEach(function (c, i) { c.style.setProperty("--i", i); });
    function size() { R = (track.offsetWidth / 2) / Math.tan(Math.PI / N) * 1.12; track.style.setProperty("--R", R.toFixed(1) + "px"); }
    size(); window.addEventListener("resize", size);

    var scrollAng = 0, drag = 0, vel = 0, cur = 0, tilt = 0, tiltT = 0, dragging = false, sx = 0, moved = 0, visible = false, front = -1;
    function fromScroll() {
      var r = sec.getBoundingClientRect(), travel = r.height - window.innerHeight;
      var p = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;
      scrollAng = -p * step * (N - 1);
    }
    onScroll(fromScroll);
    view.addEventListener("pointerdown", function (e) { dragging = true; sx = e.clientX; moved = 0; vel = 0; });
    window.addEventListener("pointermove", function (e) {
      if (dragging) { var dx = e.clientX - sx; sx = e.clientX; moved += Math.abs(dx); drag += dx * 0.22; vel = dx * 0.22; }
      if (fine && visible) tiltT = (e.clientY / window.innerHeight - 0.5) * -10;
    }, { passive: true });
    window.addEventListener("pointerup", function () { dragging = false; });
    view.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    view.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { drag -= step; e.preventDefault(); }
      if (e.key === "ArrowLeft") { drag += step; e.preventDefault(); }
    });
    inView(sec, function (v) { visible = v; if (v) loop(); });
    var raf = 0;
    function loop() { if (!raf) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0; if (!visible) return;
      if (!dragging) { drag += vel; vel *= 0.92; }
      var target = scrollAng + drag;
      cur += (target - cur) * (reduce ? 1 : 0.1);
      tilt += (tiltT - tilt) * 0.06;
      track.style.setProperty("--ry", cur.toFixed(2) + "deg");
      track.style.setProperty("--tx", (tilt - 4).toFixed(2) + "deg");
      var best = 0, bi = 0;
      cards.forEach(function (c, i) {
        var a = ((i * step + cur) % 360 + 540) % 360 - 180;
        var f = Math.max(0, Math.cos(a * Math.PI / 180)); f = f * f;
        c.style.setProperty("--f", f.toFixed(3));
        c.setAttribute("aria-hidden", f < 0.5 ? "true" : "false");
        if (f > best) { best = f; bi = i; }
      });
      if (bi !== front && now) { front = bi; now.textContent = cards[bi].getAttribute("data-name"); }
      loop();
    }
  }

  /* -------------------------------------------------------------- lens -- */
  function initLens() {
    $$("[data-lens]").forEach(function (lens) {
      var tog = $("[data-lens-toggle]", lens.parentNode);
      var x = 52, y = 42, tx = 52, ty = 42, rad = 0, radT = 0, last = -1e9, full = false, visible = false, t0 = performance.now();
      function base() { return lens.offsetWidth * 0.27; }
      function set(e) {
        var r = lens.getBoundingClientRect();
        tx = clamp((e.clientX - r.left) / r.width * 100, 0, 100); ty = clamp((e.clientY - r.top) / r.height * 100, 0, 100);
        last = performance.now(); loop();
      }
      lens.addEventListener("pointermove", function (e) { if (fine || e.buttons) set(e); });
      lens.addEventListener("pointerdown", set);
      lens.addEventListener("pointerenter", function () { if (fine && window.DPA.cursor) window.DPA.cursor(null); });
      lens.addEventListener("keydown", function (e) {
        var d = e.shiftKey ? 10 : 4, k = e.key;
        if (k === "ArrowLeft") tx -= d; else if (k === "ArrowRight") tx += d; else if (k === "ArrowUp") ty -= d; else if (k === "ArrowDown") ty += d; else return;
        e.preventDefault(); tx = clamp(tx, 0, 100); ty = clamp(ty, 0, 100); last = performance.now(); loop();
      });
      if (tog) tog.addEventListener("click", function () {
        full = !full; lens.classList.toggle("is-full", full);
        tog.setAttribute("aria-pressed", String(full)); tog.textContent = full ? "Back to the lens" : "Show the full result";
        loop();
      });
      inView(lens, function (v) { visible = v; if (v) loop(); });
      var raf = 0;
      function loop() { if (!raf) raf = requestAnimationFrame(frame); }
      function frame(now) {
        raf = 0; if (!visible) return;
        var idle = now - last > 2600;
        if (idle && !reduce) {
          var t = (now - t0) / 1000;
          tx = 50 + Math.sin(t * 0.45) * 20; ty = 40 + Math.sin(t * 0.7 + 1) * 17;
        }
        radT = full ? Math.hypot(lens.offsetWidth, lens.offsetHeight) : base();
        var k = reduce ? 1 : 0.12;
        x += (tx - x) * k; y += (ty - y) * k; rad += (radT - rad) * (reduce ? 1 : 0.08);
        lens.style.setProperty("--x", x.toFixed(2) + "%");
        lens.style.setProperty("--y", y.toFixed(2) + "%");
        lens.style.setProperty("--rad", rad.toFixed(1) + "px");
        if (!reduce || Math.abs(rad - radT) > 0.5 || Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) loop();
      }
    });
  }

  /* ------------------------------------------------- slice slideshow ---- */
  function initSlices() {
    $$("[data-slices]").forEach(function (el) {
      var imgs = $$("img", el);
      var items = imgs.map(function (im) { return { src: im.getAttribute("src"), cap: im.getAttribute("data-cap") || im.alt, w: 0, h: 0 }; });
      if (items.length < 2) return;
      items.forEach(function (it) { var im = new Image(); im.onload = function () { it.w = im.naturalWidth; it.h = im.naturalHeight; }; im.src = it.src; });
      imgs.forEach(function (im) { im.remove(); });
      var ms = Number(el.getAttribute("data-interval") || 5200);
      el.style.setProperty("--ms", ms + "ms");
      var baseEl = document.createElement("div"); baseEl.className = "slices__base"; el.appendChild(baseEl);
      var label = document.createElement("p"); label.className = "vh"; label.setAttribute("aria-live", "polite"); el.appendChild(label);
      el.insertAdjacentHTML("beforeend",
        '<div class="slices__dots" aria-hidden="true">' + items.map(function () { return "<i></i>"; }).join("") + "</div>" +
        '<div class="slices__cap"><p data-cap></p><div class="slices__btns"><button type="button" data-prev aria-label="Previous photo">' + ICON.prev + '</button><button type="button" data-next aria-label="Next photo">' + ICON.next + "</button></div></div>");
      var cap = $("[data-cap]", el), dots = $$(".slices__dots i", el);
      var i = 0, busy = false, timer = null, visible = false, hover = false;
      function paint() {
        baseEl.style.backgroundImage = "url(" + items[i].src + ")";
        cap.textContent = items[i].cap; label.textContent = "Photo " + (i + 1) + " of " + items.length + ": " + items[i].cap;
        dots.forEach(function (d, k) { d.classList.remove("is-on"); d.classList.toggle("is-done", k < i); void d.offsetWidth; if (k === i) d.classList.add("is-on"); });
      }
      function cover(it, W, H) {
        var iw = it.w || W, ih = it.h || H, s = Math.max(W / iw, H / ih);
        return { bw: iw * s, bh: ih * s, ox: (W - iw * s) / 2, oy: (H - ih * s) / 2 };
      }
      function go(n) {
        if (busy) return;
        var next = (n + items.length) % items.length; if (next === i) return;
        if (reduce) { i = next; paint(); schedule(); return; }
        busy = true;
        var W = el.offsetWidth, H = el.offsetHeight, K = W < 500 ? 5 : 7, sw = W / K;
        var a = cover(items[i], W, H), b = cover(items[next], W, H), strips = [];
        for (var k = 0; k < K; k++) {
          var s = document.createElement("div"); s.className = "strip";
          var left = Math.round(k * sw);
          s.style.left = left + "px"; s.style.width = Math.ceil(sw) + 1 + "px";
          s.style.transitionDelay = k * 70 + "ms";
          s.innerHTML = "<i></i><i></i>";
          var f = s.children[0], bk = s.children[1];
          f.style.backgroundImage = "url(" + items[i].src + ")"; f.style.backgroundSize = a.bw + "px " + a.bh + "px"; f.style.backgroundPosition = (a.ox - left) + "px " + a.oy + "px";
          bk.style.backgroundImage = "url(" + items[next].src + ")"; bk.style.backgroundSize = b.bw + "px " + b.bh + "px"; bk.style.backgroundPosition = (b.ox - left) + "px " + b.oy + "px";
          el.insertBefore(s, el.querySelector(".slices__dots")); strips.push(s);
        }
        void el.offsetWidth;
        strips.forEach(function (s) { s.style.transform = "rotateY(180deg)"; });
        i = next; cap.textContent = items[i].cap;
        setTimeout(function () { paint(); strips.forEach(function (s) { s.remove(); }); busy = false; schedule(); }, 1150 + K * 70 + 40);
      }
      function schedule() {
        clearTimeout(timer);
        var run = visible && !hover && !reduce && !document.hidden;
        el.classList.toggle("is-paused", !run);
        if (run) timer = setTimeout(function () { go(i + 1); }, ms);
      }
      $("[data-prev]", el).addEventListener("click", function (e) { e.stopPropagation(); go(i - 1); });
      $("[data-next]", el).addEventListener("click", function (e) { e.stopPropagation(); go(i + 1); });
      el.addEventListener("click", function (e) { if (!e.target.closest("button")) go(i + 1); });
      el.addEventListener("mouseenter", function () { hover = true; schedule(); });
      el.addEventListener("mouseleave", function () { hover = false; schedule(); });
      var tsx = null;
      el.addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; }, { passive: true });
      el.addEventListener("touchend", function (e) { if (tsx === null) return; var dx = e.changedTouches[0].clientX - tsx; tsx = null; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); });
      document.addEventListener("visibilitychange", schedule);
      inView(el, function (v) { visible = v; schedule(); });
      paint();
    });
  }

  /* -------------------------------------------------------------- tilt -- */
  function initTilt() {
    if (!fine || reduce) return;
    $$("[data-tilt]").forEach(function (el) {
      var inner = el.firstElementChild, max = Number(el.getAttribute("data-tilt") || 8);
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
        inner.style.setProperty("--ry", ((fx - 0.5) * max * 2).toFixed(2) + "deg");
        inner.style.setProperty("--rx", ((0.5 - fy) * max * 1.5).toFixed(2) + "deg");
        inner.style.setProperty("--gx", (fx * 100).toFixed(1) + "%");
        inner.style.setProperty("--gy", (fy * 100).toFixed(1) + "%");
        inner.style.setProperty("--ga", (fx * 180).toFixed(0));
      });
      el.addEventListener("pointerleave", function () { inner.style.setProperty("--rx", "0deg"); inner.style.setProperty("--ry", "0deg"); });
    });
    $$("[data-fan]").forEach(function (el) {
      window.addEventListener("pointermove", function (e) {
        el.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
        el.style.setProperty("--my", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
      }, { passive: true });
    });
  }

  /* ------------------------------------------------- review spotlight -- */
  function initSpot() {
    $$("[data-spot]").forEach(function (el) {
      var q = $("blockquote", el), last = -1e9, visible = false, t0 = performance.now();
      el.addEventListener("pointermove", function (e) {
        var r = q.getBoundingClientRect();
        q.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        q.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
        last = performance.now();
      });
      if (reduce) { q.style.setProperty("--mx", "50%"); q.style.setProperty("--my", "50%"); q.style.background = "none"; q.style.color = "#ecebe8"; return; }
      inView(el, function (v) { visible = v; if (v) requestAnimationFrame(frame); });
      function frame(now) {
        if (!visible) return;
        if (now - last > 1800) {
          var t = (now - t0) / 1000;
          q.style.setProperty("--mx", (50 + Math.sin(t * 0.5) * 42).toFixed(1) + "%");
          q.style.setProperty("--my", (50 + Math.sin(t * 0.9) * 40).toFixed(1) + "%");
        }
        requestAnimationFrame(frame);
      }
    });
  }

  /* ------------------------------------------------ consultation card -- */
  function initConsult() {
    $$("[data-consult]").forEach(function (form) {
      var card = document.getElementById(form.getAttribute("data-card"));
      function val(n) {
        var el = form.elements[n]; if (!el) return "";
        if (el.length !== undefined && !el.tagName) { for (var i = 0; i < el.length; i++) if (el[i].checked) return el[i].value; return ""; }
        if (el.type === "radio") return el.checked ? el.value : "";
        return (el.value || "").trim();
      }
      function paint() {
        if (!card) return;
        $$("[data-k]", card).forEach(function (dd) {
          var keys = dd.getAttribute("data-k").split(","), out = keys.map(val).filter(Boolean).join(", ");
          dd.textContent = out || dd.getAttribute("data-empty");
          dd.classList.toggle("is-empty", !out);
        });
      }
      // a treatment chosen on another page arrives as ?t=
      var t = new URLSearchParams(location.search).get("t");
      if (t && form.elements.concern) {
        var c = form.elements.concern;
        if (c.tagName === "SELECT") { for (var k = 0; k < c.options.length; k++) if (c.options[k].text === t) c.selectedIndex = k; }
        else Array.prototype.forEach.call(c, function (r) { if (r.value === t) r.checked = true; });
      }
      form.addEventListener("input", paint); form.addEventListener("change", paint); paint();
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true, first = null;
        $$("[data-req]", form).forEach(function (f) {
          var input = $("input, select, textarea", f), bad = !input.value.trim();
          if (bad) { ok = false; f.setAttribute("aria-invalid", "true"); if (!first) first = input; } else f.removeAttribute("aria-invalid");
        });
        if (!ok) { first.focus(); return; }
        var L = ["Hello Dr. Polina Aesthetics, I would like to request an appointment.", ""];
        [["name", "Name"], ["phone", "Phone"], ["clinic", "Clinic"], ["skin", "Skin type"], ["concern", "Treatment"], ["date", "Preferred date"], ["time", "Preferred time"], ["notes", "Notes"]].forEach(function (f) {
          var v = val(f[0]); if (v) L.push(f[1] + ": " + v);
        });
        L.push("", "Please confirm a time that suits. Thank you.");
        window.open(wa(L.join("\n")), "_blank", "noopener");
        var c = $("[data-confirm]", form); if (c) c.classList.add("is-on");
      });
    });
  }

  /* ------------------------------------------------------ footer name -- */
  function initMark() {
    $$("[data-mark]").forEach(function (el) {
      var text = el.textContent; el.textContent = "";
      var spans = text.split("").map(function (ch) { var s = document.createElement("span"); s.textContent = ch === " " ? " " : ch; el.appendChild(s); return s; });
      var px = -1e4, visible = false, t0 = performance.now(), last = -1e9;
      var foot = el.closest("footer") || el;
      if (fine) foot.addEventListener("pointermove", function (e) { px = e.clientX; last = performance.now(); });
      foot.addEventListener("pointerleave", function () { px = -1e4; });
      if (reduce) return;
      inView(el, function (v) { visible = v; if (v) requestAnimationFrame(frame); });
      function frame(now) {
        if (!visible) return;
        var x = px;
        if (now - last > 2200) { var t = (now - t0) / 1000; x = window.innerWidth * (0.5 + Math.sin(t * 0.6) * 0.45); }
        spans.forEach(function (s) {
          var r = s.getBoundingClientRect(), c = r.left + r.width / 2;
          var inf = Math.max(0, 1 - Math.abs(x - c) / (window.innerWidth * 0.16));
          inf = inf * inf * (3 - 2 * inf);
          s.style.setProperty("--w", Math.round(400 + inf * 500));
          s.style.setProperty("--lift", (inf * 14).toFixed(1));
          s.classList.toggle("is-it", inf > 0.82);
        });
        requestAnimationFrame(frame);
      }
    });
  }

  /* ------------------------------------------ treatment index preview -- */
  function initFloaty() {
    if (!fine) return;
    var f = $(".floaty"), img = $("img", f), x = 0, y = 0, cx = 0, cy = 0, on = false, raf = 0;
    $$("[data-img]").forEach(function (li) {
      li.addEventListener("pointerenter", function () { img.src = li.getAttribute("data-img"); f.classList.add("is-on"); on = true; loop(); });
      li.addEventListener("pointerleave", function () { f.classList.remove("is-on"); on = false; });
    });
    window.addEventListener("pointermove", function (e) { x = e.clientX; y = e.clientY; if (on) loop(); }, { passive: true });
    function loop() { if (!raf) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      var dx = x - cx; cx += dx * 0.14; cy += (y - cy) * 0.14;
      f.style.transform = "translate(" + (cx + 40) + "px," + (cy - 140) + "px) rotate(" + clamp(dx * 0.06, -12, 12).toFixed(2) + "deg) scale(" + (on ? 1 : 0.6) + ")";
      if (on || Math.abs(dx) > 0.5) loop();
    }
  }

  /* -------------------------------------------------------------- boot -- */
  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    initVeil(); initHeader(); initMenu(); initCursor(); initBag(); initWa();
    renderProducts();
    initReveal(); initMagnet();
    initHeroCues(); initWords(); initRing(); initLens(); initSlices(); initTilt(); initSpot();
    initConsult(); initMark(); initFloaty();
    // clear a field's error as soon as it has a value again
    document.addEventListener("input", function (e) {
      var f = e.target.closest && e.target.closest('[aria-invalid="true"]');
      if (f && e.target.value.trim()) f.removeAttribute("aria-invalid");
    });
    $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
  });
})();
