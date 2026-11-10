/* Dr. Polina Aesthetics — shared site behaviour */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "264813688846"; // +264 81 368 8846, international format, no "+" or spaces

  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ---- Mobile nav toggle ---- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.classList.toggle("is-open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  /* ---- Scroll reveal ---- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---- WhatsApp floating chat widget ---- */
  function initWhatsAppWidget() {
    var launcher = document.querySelector(".wa-launcher");
    var panel = document.querySelector(".wa-panel");
    var closeBtn = document.querySelector(".wa-panel-close");
    if (!launcher || !panel) return;

    function openPanel() { panel.classList.add("open"); launcher.setAttribute("aria-expanded", "true"); }
    function closePanel() { panel.classList.remove("open"); launcher.setAttribute("aria-expanded", "false"); }

    launcher.addEventListener("click", function () {
      panel.classList.contains("open") ? closePanel() : openPanel();
    });
    if (closeBtn) closeBtn.addEventListener("click", closePanel);

    panel.querySelectorAll(".wa-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var message = btn.getAttribute("data-message") || "Hi Dr. Polina Aesthetics, I'd like some help.";
        window.open(waLink(message), "_blank", "noopener");
      });
    });
  }

  /* ---- Booking form -> WhatsApp handoff ---- */
  function initBookingForm() {
    var form = document.getElementById("booking-form");
    if (!form) return;
    var confirmBox = document.getElementById("booking-confirm");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var location = form.location.value;
      var service = form.service.value;
      var date = form.date.value;
      var time = form.time.value;
      var notes = form.notes.value.trim();

      var lines = [
        "Hi Dr. Polina Aesthetics, I'd like to request an appointment.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Location: " + location,
        "Service: " + service
      ];
      if (date) lines.push("Preferred date: " + date);
      if (time) lines.push("Preferred time: " + time);
      if (notes) lines.push("Notes: " + notes);

      var message = lines.join("\n");
      window.open(waLink(message), "_blank", "noopener");

      if (confirmBox) confirmBox.classList.add("show");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initWhatsAppWidget();
    initBookingForm();

    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  });
})();
