/* ==========================================================================
   CATEGORIES.JS - bar kategori beranda

   Tugas file ini:
     1. Tandai chip yang sedang aktif berdasarkan ?kategori= di URL
     2. Default daftar chip cuma satu baris (pendek). Tombol "Lihat semua"
        memanjangkannya kembali seperti semula, tombolnya berubah jadi
        "Ringkas" untuk melipat lagi.
     3. Kalau semua chip sudah muat dalam satu baris, tombolnya disembunyikan
        supaya tidak jadi tombol kosong.

   Posisi menempel (sticky) saat scroll diurus CSS: .br-katbar
   ========================================================================== */
window.App = window.App || {};

App.categories = (function () {
  "use strict";

  var daftar = null;
  var tombol = null;
  var teks = null;

  /* ------------------------------------------------------------------
     Ambil ?kategori= dari URL (aman kalau URLSearchParams tidak ada)
     ------------------------------------------------------------------ */
  function paramKategori() {
    try {
      if (window.URLSearchParams) {
        return new window.URLSearchParams(window.location.search).get("kategori") || "";
      }
      var cocok = /[?&]kategori=([^&]+)/.exec(window.location.search);
      return cocok ? decodeURIComponent(cocok[1]) : "";
    } catch (e) {
      return "";
    }
  }

  /* ------------------------------------------------------------------
     Tandai chip aktif. Kalau tidak ada parameter, chip "Semua" yang aktif.
     ------------------------------------------------------------------ */
  function tandaiAktif() {
    var aktif = paramKategori();
    var chips = daftar.querySelectorAll(".chip");

    Array.prototype.forEach.call(chips, function (chip) {
      var href = chip.getAttribute("href") || "";
      var cocok = aktif
        ? href.indexOf("kategori=" + aktif) > -1
        : href === "katalog.html";

      if (cocok) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
  }

  /* ------------------------------------------------------------------
     Buka / lipat daftar chip
     ------------------------------------------------------------------ */
  function setBuka(buka) {
    if (!daftar) return;

    daftar.setAttribute("data-buka", buka ? "true" : "false");

    if (tombol) tombol.setAttribute("aria-expanded", buka ? "true" : "false");
    if (teks) teks.textContent = buka ? "Ringkas" : "Lihat semua";

    // Tinggi halaman berubah, kasih tahu ScrollTrigger/AOS
    if (App.motion && App.motion.segarkan) App.motion.segarkan();
  }

  /* ------------------------------------------------------------------
     Sembunyikan tombol kalau semua chip sudah muat dalam satu baris
     ------------------------------------------------------------------ */
  function cekPerluTombol() {
    if (!daftar || !tombol) return;

    if (daftar.getAttribute("data-buka") === "true") {
      tombol.hidden = false;
      return;
    }
    tombol.hidden = daftar.scrollHeight <= daftar.clientHeight + 2;
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    daftar = document.querySelector("[data-chips]");
    if (!daftar) return;

    tombol = document.querySelector("[data-kat-toggle]");
    teks = document.querySelector("[data-kat-teks]");

    tandaiAktif();
    setBuka(false);

    if (tombol) {
      tombol.addEventListener("click", function () {
        setBuka(daftar.getAttribute("data-buka") !== "true");
      });
    }

    window.addEventListener("resize", cekPerluTombol);

    // Tunggu font selesai dimuat dulu, baru ukur lebar chip
    window.setTimeout(cekPerluTombol, 120);
    window.addEventListener("load", cekPerluTombol);
  }

  return {
    init: init,
    buka: function () { setBuka(true); },
    lipat: function () { setBuka(false); }
  };
})();
