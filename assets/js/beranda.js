/* ==========================================================================
   BERANDA.JS — baris produk di halaman depan (index.html)

   Mengisi dua baris kartu produk:
     [data-terlaris] → produk dengan angka terjual tertinggi
     [data-baru]     → produk berstatus pre-order (rilisan terbaru)

   Kartu produk dibuat oleh App.ui.kartuProduk, jadi tampilannya sama
   dengan katalog dan halaman detail.
   ========================================================================== */

window.App = window.App || {};

App.beranda = (function () {
  "use strict";

  function isi(selector, daftar) {
    var wadah = document.querySelector(selector);
    if (!wadah || !App.ui || !App.data) return;
    wadah.innerHTML = daftar.map(App.ui.kartuProduk).join("");
  }

  function init() {
    if (!document.querySelector("[data-terlaris], [data-baru]")) return;

    var semua = App.data.products.slice();

    /* Terlaris: urut dari angka terjual terbesar, ambil 4 */
    var terlaris = semua
      .filter(function (p) { return p.status !== "habis"; })
      .sort(function (a, b) { return b.terjual - a.terjual; })
      .slice(0, 4);

    /* Pre-order terbaru: ambil 4 item berstatus po */
    var preorder = semua
      .filter(function (p) { return p.status === "po"; })
      .slice(0, 4);

    isi("[data-terlaris]", terlaris);
    isi("[data-baru]", preorder);
  }

  return { init: init };
})();

/* Jalan sendiri supaya index.html tidak perlu urutan khusus */
document.addEventListener("DOMContentLoaded", function () {
  App.beranda.init();
});
