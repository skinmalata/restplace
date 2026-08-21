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

  /* ---------- PWA: service worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {
        /* Service workers require https or localhost — fail silently */
      });
    });
  }

  /* ---------- PWA: standalone (installed app) detection ---------- */
  var isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  /* ---------- In-app splash screen (installed app launches) ----------
     Skipped on iOS: the system already displays the identical startup
     image natively — a second copy here would flash the same artwork twice.
     Skipped on Android: Chrome draws its own native splash from the
     manifest before any page code runs; stacking ours after it would
      mean two splashes back to back. (The APK has a full custom splash.) */
  var IS_IOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var IS_ANDROID = /Android/.test(navigator.userAgent || "");

  if (isStandalone && !IS_IOS && !IS_ANDROID && !document.querySelector(".app-splash")) {
    var splashEl = document.createElement("div");
    splashEl.className = "app-splash";
    splashEl.innerHTML = '<img src="splash.png" alt="The Rest Place Church">';
    document.body.appendChild(splashEl);

    var splashDone = false;
    function hideSplash() {
      if (splashDone) return;
      splashDone = true;
      setTimeout(function () {
        splashEl.classList.add("is-fading");
        setTimeout(function () {
          if (splashEl.parentNode) splashEl.parentNode.removeChild(splashEl);
        }, 550);
      }, 700);
    }
    if (document.readyState === "complete") hideSplash();
    else window.addEventListener("load", hideSplash);
    setTimeout(hideSplash, 4000); /* safety net */
  }

  /* ---------- Inside the installed app: swap Download App -> Read the Bible ---------- */
  if (isStandalone) {
    document.querySelectorAll("[data-install-app]").forEach(function (btn) {
      btn.removeAttribute("data-install-app");
      btn.removeAttribute("aria-haspopup");
      btn.setAttribute("href", "bible.html");
      var label = btn.querySelector("span");
      if (label) label.textContent = "Read the Bible";
      var icon = btn.querySelector(".btn-icon");
      if (icon) {
        icon.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
      }
    });
  }

  /* ---------- PWA: install app button + instructions modal ---------- */
  var deferredPrompt = null;
  var overlay = null;
  var APK_URL = "the-rest-place.apk";

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;

    /* Auto-offer the install prompt to new visitors shortly after they
       arrive — at most once every 7 days, never inside the installed app. */
    var AUTO_PROMPT_KEY = "trp-auto-install-prompt";
    var REPROMPT_AFTER = 7 * 24 * 60 * 60 * 1000;
    var seenRecently = false;
    try {
      var last = parseInt(localStorage.getItem(AUTO_PROMPT_KEY), 10);
      seenRecently = !isNaN(last) && Date.now() - last < REPROMPT_AFTER;
    } catch (err) { /* private mode */ }

    if (!seenRecently) {
      setTimeout(function () {
        if (!deferredPrompt || isStandalone) return;
        try {
          localStorage.setItem(AUTO_PROMPT_KEY, String(Date.now()));
        } catch (err) { /* ignore */ }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
        });
      }, 3500);
    }
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    closeInstallModal();
  });

  function platformSteps() {
    var ua = navigator.userAgent || "";
    var isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/.test(ua);

    if (isIOS) {
      return [
        "Open this site in <strong>Safari</strong>.",
        "Tap the <strong>Share</strong> icon <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='vertical-align:-2px'><path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'/><path d='M16 6l-4-4-4 4M12 2v13'/></svg> at the bottom of the screen.",
        "Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>."
      ];
    }
    if (isAndroid) {
      return [
        "Tap the <strong>&#8942;</strong> menu icon at the top right of your browser.",
        "Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).",
        "Confirm by tapping <strong>Install</strong> — the app appears on your home screen."
      ];
    }
    return [
      "Look for the <strong>install icon</strong> <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='vertical-align:-2px'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3'/></svg> on the right side of your browser address bar and click it.",
      "Click <strong>Install</strong> in the popup that appears.",
      "The Rest Place app opens in its own window, just like a native app."
    ];
  }

  function buildInstallModal() {
    overlay = document.createElement("div");
    overlay.className = "install-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Download The Rest Place app");

    var stepsHtml = platformSteps()
      .map(function (step) { return "<li><span>" + step + "</span></li>"; })
      .join("");

    overlay.innerHTML =
      '<div class="install-modal">' +
      '<button type="button" class="install-modal__close" aria-label="Close">&times;</button>' +
      '<img class="install-modal__icon" src="icon-192.png" alt="The Rest Place Church app icon">' +
      "<h3>Get The Rest Place App</h3>" +
      "<p>Sermons, events, giving and the <strong>complete Holy Bible</strong> — installed on your device and available offline.</p>" +
      '<ol class="install-steps">' + stepsHtml + "</ol>" +
      (IS_ANDROID
        ? '<a href="the-rest-place.apk" download class="btn btn--primary">Download Android App (.apk)</a>'
        : '<a href="bible.html" class="btn btn--primary">Read the Bible Now</a>') +
      '<p style="margin-top:1rem;font-size:.82rem;color:var(--clr-ink-faint)">Tip: in Chrome, the one-tap Install option appears automatically after visiting this site once or twice.</p>' +
      "</div>";

    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.closest(".install-modal__close")) {
        closeInstallModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeInstallModal();
    });
  }

  function openInstallModal() {
    if (!overlay) buildInstallModal();
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeInstallModal() {
    if (overlay) {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll("[data-install-app]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (IS_ANDROID) {
        /* Android: always deliver the real app package */
        window.location.href = APK_URL;
      } else if (deferredPrompt) {
        /* Native install dialog — the app installs directly */
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
        });
      } else {
        openInstallModal();
      }
    });
  });
})();