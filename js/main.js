/* ==========================================================================
   The Rest Place Church - CGMi | main.js
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Give page: amount selector ---------- */
  var amountBtns = document.querySelectorAll(".amount-btn");
  amountBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      amountBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
    });
  });

  /* ---------- Contact form (demo) ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.querySelector("[data-form-status]");
      if (status) {
        status.textContent =
          "Thank you! Your message has been received. We will get back to you shortly.";
        status.classList.add("form-note");
        status.style.color = "#0f766e";
      }
      form.reset();
    });
  }

  /* ---------- Live service countdown (events page) ---------- */
  var countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    var target;
    if (countdown.getAttribute("data-countdown") === "next-sunday") {
      target = new Date();
      var dow = target.getDay();
      var daysUntilSunday = (7 - dow) % 7;
      target.setDate(target.getDate() + daysUntilSunday);
      target.setHours(10, 0, 0, 0);
      if (target.getTime() < Date.now()) {
        target.setDate(target.getDate() + 7);
      }
    } else {
      target = new Date(countdown.getAttribute("data-countdown"));
      if (isNaN(target.getTime())) target = new Date(Date.now() + 6 * 86400000);
    }
    var targetDate = target.getTime();

    function tick() {
      var now = Date.now();
      var diff = Math.max(0, targetDate - now);
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);

      function pad(n) { return n < 10 ? "0" + n : "" + n; }

      var d = countdown.querySelector("[data-days]");
      var h = countdown.querySelector("[data-hours]");
      var m = countdown.querySelector("[data-mins]");
      var s = countdown.querySelector("[data-secs]");
      if (d) d.textContent = pad(days);
      if (h) h.textContent = pad(hours);
      if (m) m.textContent = pad(mins);
      if (s) s.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }
})();