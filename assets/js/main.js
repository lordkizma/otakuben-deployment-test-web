/* ==========================================================================
   MAIN.JS — titik masuk aplikasi.
   Memuat semua modul (auth, search, showroom, categories) + utilitas kecil.
   File ini dimuat PALING AKHIR di index.html.
   ========================================================================== */

window.App = window.App || {};

(function () {
  "use strict";

  var toastEl, toastTimer;

  /* ------------------------------------------------------------------
     Toast notifikasi kecil — dipakai modul lain via App.toast("pesan")
     ------------------------------------------------------------------ */
  App.toast = function (message, duration) {
    if (!toastEl) toastEl = document.querySelector("[data-toast]");
    if (!toastEl) return;

    toastEl.textContent = message;
    toastEl.dataset.open = "true";

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.dataset.open = "false";
    }, duration || 2600);
  };

  /* ------------------------------------------------------------------
     Tahun berjalan di footer — biar copyright nggak pernah basi
     ------------------------------------------------------------------ */
  function setYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------------
     Bootstrap
     ------------------------------------------------------------------ */
  function boot() {
    document.documentElement.classList.add("js");

    setYear();

    if (App.auth) App.auth.init();
    if (App.search) App.search.init();
    if (App.showroom) App.showroom.init();
    if (App.categories) App.categories.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
