/* =================================================================
   Un regalo speciale all'Isola d'Elba
   -----------------------------------------------------------------
   ► PERSONALIZZAZIONE: modifica SOLO l'oggetto qui sotto.
     Da qui cambi nome del festeggiato, auguri, messaggio finale,
     firma e link all'esperienza. Nient'altro va toccato.
   ================================================================= */
const birthdayGift = {
  // Nome che compare sul biglietto iniziale
  recipientName: "Marco!!",

  // Chi fa il regalo (biglietto + firma finale)
  senderNames: "Tommaso e Zoe",

  // Titolo del messaggio di auguri finale
  initialGreeting: "Buon compleanno!",

  // Messaggio finale, sincero e semplice
  finalMessage:
    "Per ringraziarti di essere stato cosí gentile da offrirci il soggiorno con voi (e perché ero a corto di idee ) abbiamo deciso di regalarti un'esperienza da vivere tutti insieme quando saremo lá!!",

  // Link ai dettagli dell'esperienza (si apre in una nuova scheda)
  experienceUrl:
    "https://freedome.it/attivita/tour-motonave-sant-andrea-isola-elba/",
};

/* =================================================================
   Da qui in poi: logica. Normalmente non serve modificare nulla.
   ================================================================= */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* --- 1. Applica i contenuti configurabili --------------------- */
  function applyContent() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      if (key in birthdayGift && birthdayGift[key]) {
        el.textContent = birthdayGift[key];
      }
    });
    const link = document.getElementById("experienceLink");
    if (link && birthdayGift.experienceUrl) {
      link.href = birthdayGift.experienceUrl;
    }
  }

  /* --- 2. Apertura del biglietto -------------------------------- */
  function setupCover() {
    const cover = document.getElementById("cover");
    const openBtn = document.getElementById("openBtn");
    const main = document.getElementById("main");
    if (!cover || !openBtn) return;

    // blocca lo scroll finché il biglietto è chiuso
    document.body.classList.add("is-locked");

    function open() {
      openBtn.disabled = true;
      document.body.classList.remove("is-locked");

      if (prefersReducedMotion) {
        cover.classList.add("is-open");
        finish();
        return;
      }

      cover.classList.add("is-opening");
      // dopo l'animazione della busta, svela la pagina
      window.setTimeout(() => {
        cover.classList.add("is-open");
      }, 620);
      window.setTimeout(finish, 1200);
    }

    function finish() {
      cover.setAttribute("hidden", "");
      // porta il focus sul contenuto per chi naviga da tastiera/screen reader
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    openBtn.addEventListener("click", open);
  }

  /* --- 3. Comparsa progressiva delle sezioni -------------------- */
  function setupReveals() {
    const items = document.querySelectorAll(".reveal-on-scroll");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
  }

  /* --- 4. Rotta che si disegna durante lo scroll ---------------- */
  function setupRoute() {
    const route = document.getElementById("route");
    const path = document.getElementById("routePath");
    if (!route || !path) return;

    if (prefersReducedMotion) {
      path.style.strokeDashoffset = "0";
      return;
    }

    const len = path.getTotalLength();
    path.style.setProperty("--len", len);
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    let ticking = false;
    function update() {
      ticking = false;
      const rect = route.getBoundingClientRect();
      const vh = window.innerHeight;
      // progresso: da quando la sezione entra a quando esce
      const total = rect.height + vh * 0.6;
      const seen = Math.min(Math.max(vh * 0.85 - rect.top, 0), total);
      const progress = Math.min(seen / total, 1);
      path.style.strokeDashoffset = String(len * (1 - progress));
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* --- 5. Barra di avanzamento + parallasse leggera del sole ---- */
  function setupScrollFX() {
    const bar = document.getElementById("progressBar");
    const sun = document.querySelector(".hero__sun");
    let ticking = false;

    function update() {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (bar) bar.style.width = p + "%";
      if (sun && !prefersReducedMotion) {
        sun.style.transform =
          "translateX(-50%) translateY(" + window.scrollY * 0.15 + "px)";
      }
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  /* --- Avvio ---------------------------------------------------- */
  function init() {
    applyContent();
    setupCover();
    setupReveals();
    setupRoute();
    setupScrollFX();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
