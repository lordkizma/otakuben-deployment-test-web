/* ==========================================================================
   SHOWROOM.JS — viewer 360° pada banner showroom
   Ganti daftar VIEWS di bawah dengan foto asli toko kamu
   (boleh .jpg/.webp, taruh di assets/img/).
   ========================================================================== */

window.App = window.App || {};

App.showroom = (function () {
  "use strict";

  /* Daftar sudut pandang — tambah/kurangi sesuka kamu */
  var VIEWS = [
    { src: "assets/img/showroom-01.svg", label: "Rak Utama" },
    { src: "assets/img/showroom-02.svg", label: "Zona Gunpla" },
    { src: "assets/img/showroom-03.svg", label: "Display Kaca" }
  ];

  var index = 0;
  var imageEl, labelEl;

  function render() {
    var view = VIEWS[index];
    if (!view || !imageEl) return;
    imageEl.src = view.src;
    imageEl.alt = "Showroom — " + view.label;
    if (labelEl) labelEl.textContent = view.label;
  }

  function go(step) {
    index = (index + step + VIEWS.length) % VIEWS.length;
    render();
  }

  function init() {
    var root = document.querySelector("[data-showroom]");
    if (!root) return;

    imageEl = root.querySelector("[data-showroom-image]");
    labelEl = root.querySelector("[data-showroom-label]");

    var prev = root.querySelector("[data-showroom-prev]");
    var next = root.querySelector("[data-showroom-next]");

    if (prev) prev.addEventListener("click", function (e) { e.preventDefault(); go(-1); });
    if (next) next.addEventListener("click", function (e) { e.preventDefault(); go(1); });

    /* Navigasi pakai panah kiri/kanan saat viewer di-fokus */
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    });

    render();
  }

  return { init: init, next: function () { go(1); }, prev: function () { go(-1); } };
})();
