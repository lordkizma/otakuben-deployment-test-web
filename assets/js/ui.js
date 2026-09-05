/* ==========================================================================
   UI.JS — komponen tampilan yang dipakai berulang di banyak halaman

   Isinya:
     App.ui.art(bentuk)        → siluet SVG placeholder gambar produk
     App.ui.gradasi(produk)    → style gradient sesuai warna produk
     App.ui.bintang(rating)    → deretan ikon bintang
     App.ui.kartuProduk(p)     → HTML satu kartu produk
     App.ui.grid(daftar)       → HTML beberapa kartu produk
     App.ui.thumb(p, kelas)    → kotak gambar kecil (keranjang, pesanan)

   CATATAN GAMBAR PRODUK:
   Gambar produk di sini masih PLACEHOLDER — blok gradasi + siluet.
   Kalau nanti sudah ada foto asli, tambahkan field `foto` di data.js lalu
   ubah fungsi art()/thumb() untuk memakai <img src="..."> sebagai gantinya.
   ========================================================================== */

window.App = window.App || {};

App.ui = (function () {
  "use strict";

  /* ------------------------------------------------------------------
     Siluet placeholder — 4 bentuk sesuai jenis barang
     ------------------------------------------------------------------ */
  var ART = {
    figure:
      '<svg viewBox="0 0 120 150" fill="none" aria-hidden="true">' +
        '<g fill="none" stroke="rgba(255,255,255,.82)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="60" cy="30" r="13"/>' +
          '<path d="M60 43v34"/>' +
          '<path d="M38 55c8-8 14-11 22-11s14 3 22 11"/>' +
          '<path d="M38 55l-9 25 7 5"/>' +
          '<path d="M82 55l11 21"/>' +
          '<path d="M60 77l-13 30 3 15"/>' +
          '<path d="M60 77l14 28-2 17"/>' +
          '<ellipse cx="60" cy="131" rx="33" ry="8"/>' +
        "</g>" +
        '<path d="M27 131a33 8 0 0 0 66 0" fill="rgba(255,255,255,.1)" stroke="none"/>' +
      "</svg>",

    gunpla:
      '<svg viewBox="0 0 120 150" fill="none" aria-hidden="true">' +
        '<g fill="none" stroke="rgba(255,255,255,.82)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M52 12l4 10h8l4-10"/>' +
          '<path d="M48 24h24v14H48z"/>' +
          '<path d="M43 42h34v26H43z"/>' +
          '<path d="M43 48H30l-4 18 9 4"/>' +
          '<path d="M77 48h13l4 18-9 4"/>' +
          '<path d="M49 68l-4 26 4 4"/>' +
          '<path d="M71 68l4 26-4 4"/>' +
          '<path d="M43 122h16v10H43z"/>' +
          '<path d="M61 122h16v10H61z"/>' +
          '<path d="M49 98h10v24H49z"/>' +
          '<path d="M61 98h10v24H61z"/>' +
        "</g>" +
        '<path d="M48 24h24v14H48z" fill="rgba(255,255,255,.12)" stroke="none"/>' +
      "</svg>",

    chibi:
      '<svg viewBox="0 0 120 150" fill="none" aria-hidden="true">' +
        '<g fill="none" stroke="rgba(255,255,255,.82)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="60" cy="52" r="31"/>' +
          '<path d="M40 30c6-9 14-13 20-13s14 4 20 13"/>' +
          '<path d="M60 83v10"/>' +
          '<path d="M45 96c5-3 10-4 15-4s10 1 15 4l4 22H41z"/>' +
          '<path d="M45 100l-9 12 6 5"/>' +
          '<path d="M75 100l9 12-6 5"/>' +
          '<ellipse cx="60" cy="128" rx="29" ry="7"/>' +
        "</g>" +
        '<circle cx="60" cy="52" r="31" fill="rgba(255,255,255,.1)" stroke="none"/>' +
      "</svg>",

    box:
      '<svg viewBox="0 0 120 150" fill="none" aria-hidden="true">' +
        '<g fill="none" stroke="rgba(255,255,255,.82)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M60 26l38 18v50L60 112 22 94V44z"/>' +
          '<path d="M22 44l38 18 38-18"/>' +
          '<path d="M60 62v50"/>' +
          '<path d="M41 35l38 18v18"/>' +
        "</g>" +
        '<path d="M60 62l38-18v50L60 112z" fill="rgba(255,255,255,.1)" stroke="none"/>' +
      "</svg>"
  };

  function art(bentuk) {
    return ART[bentuk] || ART.box;
  }

  /* Gradasi kotak gambar dari warna aksen produk */
  function gradasi(p) {
    return 'style="--thumb-a:' + (p.warna || "#12294A") + ';--thumb-b:#08172B"';
  }

  /* ------------------------------------------------------------------
     Bintang rating
     ------------------------------------------------------------------ */
  var BINTANG_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>' +
    "</svg>";

  function bintang(rating) {
    var penuh = Math.round(rating || 0);
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out += '<span style="opacity:' + (i <= penuh ? "1" : ".26") + '">' + BINTANG_SVG + "</span>";
    }
    return out;
  }

  /* ------------------------------------------------------------------
     Label status / diskon
     ------------------------------------------------------------------ */
  function badges(p) {
    var out = "";
    var diskon = App.data.persenDiskon(p);

    if (p.status === "habis") {
      out += '<span class="badge badge-habis">Stok Habis</span>';
    } else if (p.status === "po") {
      out += '<span class="badge badge-po">Pre-Order</span>';
    }
    if (diskon > 0 && p.status !== "habis") {
      out += '<span class="badge badge-diskon">-' + diskon + "%</span>";
    }
    if (p.tag && p.tag !== "Pre-Order" && p.tag !== "Diskon") {
      out += '<span class="badge badge-info">' + p.tag + "</span>";
    }
    return out;
  }

  var HATI_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20z"/>' +
    "</svg>";

  /* ------------------------------------------------------------------
     Kartu produk
     ------------------------------------------------------------------ */
  function kartuProduk(p) {
    var tautan = "produk.html?id=" + encodeURIComponent(p.id);
    var habis = p.status === "habis";
    var diskon = App.data.persenDiskon(p);

    var tombol = habis
      ? '<button class="btn btn-quiet" type="button" disabled>Stok Habis</button>'
      : '<button class="btn ' + (p.status === "po" ? "btn-cyan" : "btn-primary") + '" type="button" ' +
        'data-add-to-cart="' + p.id + '">' + (p.status === "po" ? "Pre-Order" : "+ Keranjang") + "</button>";

    return '' +
    '<article class="p-card' + (habis ? " is-habis" : "") + '">' +
      '<div class="p-badges">' + badges(p) + "</div>" +
      '<button class="p-wish" type="button" aria-pressed="false" aria-label="Simpan ke wishlist" ' +
        'data-wish="' + p.id + '">' + HATI_SVG + "</button>" +

      '<a class="p-thumb" href="' + tautan + '" ' + gradasi(p) + ' aria-label="' + p.nama + '">' +
        art(p.art) +
      "</a>" +

      '<div class="p-body">' +
        '<span class="p-brand">' + p.brand + "</span>" +
        '<h3 class="p-nama"><a href="' + tautan + '">' + p.nama + "</a></h3>" +
        '<div class="p-harga">' +
          "<b>" + App.data.rupiah(p.harga) + "</b>" +
          (diskon > 0 ? "<s>" + App.data.rupiah(p.hargaAsli) + "</s>" : "") +
        "</div>" +
        '<div class="p-meta">' +
          '<span class="bintang">' + BINTANG_SVG + p.rating.toFixed(1) + "</span>" +
          '<span class="titik">·</span>' +
          "<span>" + p.terjual + " terjual</span>" +
          '<span class="titik">·</span>' +
          "<span>" + p.skala + "</span>" +
        "</div>" +
      "</div>" +

      '<div class="p-aksi">' + tombol + "</div>" +
    "</article>";
  }

  function grid(daftar) {
    return daftar.map(kartuProduk).join("");
  }

  /* Kotak gambar kecil untuk baris keranjang / pesanan */
  function thumb(p, kelas) {
    return '<span class="' + (kelas || "k-thumb") + '" ' + gradasi(p) + ">" + art(p.art) + "</span>";
  }

  /* ------------------------------------------------------------------
     Wishlist — disimpan lokal, cukup untuk tahap front-end
     ------------------------------------------------------------------ */
  var WISH_KEY = "otaku_wish_v1";

  function wishAmbil() {
    try {
      return JSON.parse(window.localStorage.getItem(WISH_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function wishSimpan(daftar) {
    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(daftar));
    } catch (e) { /* diamkan */ }
  }

  function wishTandai() {
    var daftar = wishAmbil();
    document.querySelectorAll("[data-wish]").forEach(function (b) {
      b.setAttribute("aria-pressed", daftar.indexOf(b.getAttribute("data-wish")) > -1 ? "true" : "false");
    });
  }

  function init() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-wish]");
      if (!b) return;
      e.preventDefault();

      var id = b.getAttribute("data-wish");
      var daftar = wishAmbil();
      var posisi = daftar.indexOf(id);
      var p = App.data.byId(id);

      if (posisi > -1) {
        daftar.splice(posisi, 1);
        if (App.toast) App.toast("Dihapus dari wishlist.");
      } else {
        daftar.push(id);
        if (App.toast) App.toast((p ? p.nama : "Produk") + " masuk wishlist.");
      }

      wishSimpan(daftar);
      wishTandai();
    });

    wishTandai();
  }

  return {
    init: init,
    art: art,
    gradasi: gradasi,
    bintang: bintang,
    badges: badges,
    kartuProduk: kartuProduk,
    grid: grid,
    thumb: thumb,
    wishAmbil: wishAmbil,
    wishTandai: wishTandai
  };
})();
