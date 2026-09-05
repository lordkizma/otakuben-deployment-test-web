/* ==========================================================================
   MAIN.JS — titik masuk aplikasi.

   File ini dimuat PALING AKHIR di setiap halaman, karena tugasnya
   menyalakan semua modul yang sudah dimuat sebelumnya.

   Urutan penting:
     1. layout  → menyuntik header & footer dulu, supaya modul lain
                  (auth, search, cart) bisa menemukan elemennya
     2. tahun   → isi <span data-year> di footer yang baru disuntik
     3. modul global (ui, cart, auth, search)
     4. modul per halaman (showroom, categories, catalog, product, dst)

   Semua pemanggilan dijaga dengan if (App.x), jadi halaman yang tidak
   memuat modul tertentu tetap aman.
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

    /* 1. Kerangka halaman (header + footer) */
    if (App.layout) App.layout.init();

    /* 2. Isi tahun setelah footer ada */
    setYear();

    /* 3. Modul global */
    if (App.ui) App.ui.init();
    if (App.cart) App.cart.init();
    if (App.auth) App.auth.init();
    if (App.search) App.search.init();

    /* 3b. Lapisan animasi global (GSAP + ScrollTrigger, Lenis, anime.js,
       AOS, SplitType) lalu adegan three.js beranda. Keduanya aman kalau
       library CDN gagal dimuat: fungsinya dilewati. */
    if (App.motion) App.motion.init();
    if (App.home3d) App.home3d.init();

    /* 4. Modul per halaman */
    if (App.showroom) App.showroom.init();
    if (App.categories) App.categories.init();
    if (App.beranda) App.beranda.init();
    if (App.home) App.home.init();
    if (App.catalog) App.catalog.init();
    if (App.product) App.product.init();
    if (App.keranjang) App.keranjang.init();
    if (App.checkout) App.checkout.init();
    if (App.account) App.account.init();
    if (App.titipbeli) App.titipbeli.init();
    if (App.masuk) App.masuk.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
