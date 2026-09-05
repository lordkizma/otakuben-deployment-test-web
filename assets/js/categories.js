/* ==========================================================================
   CATEGORIES.JS — chip "Explore By Category"
   Klik chip → chip aktif berpindah (aria-current).
   Kalau nanti mau filter produk asli, isi bagian GANTI DI SINI.
   ========================================================================== */

window.App = window.App || {};

App.categories = (function () {
  "use strict";

  var wrap;

  function setActive(chip) {
    if (!wrap || !chip) return;

    wrap.querySelectorAll(".chip").forEach(function (el) {
      el.removeAttribute("aria-current");
    });
    chip.setAttribute("aria-current", "true");

    /* Nama kategori tanpa angka jumlah produk */
    var count = chip.querySelector(".count");
    var label = chip.textContent.replace(count ? count.textContent : "", "").trim();

    /* GANTI DI SINI — panggil API / filter grid produk kamu, contoh:
       loadProducts({ category: label });
    */
    if (App.toast) App.toast("Kategori: " + label);
  }

  function init() {
    wrap = document.querySelector("[data-chips]");
    if (!wrap) return;

    wrap.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      e.preventDefault();
      setActive(chip);
    });
  }

  return { init: init, setActive: setActive };
})();
