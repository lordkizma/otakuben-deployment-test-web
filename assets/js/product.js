/* ==========================================================================
   PRODUCT.JS — halaman detail produk (produk.html?id=xxx)

   Membaca id dari URL, lalu menyusun galeri, harga, spesifikasi,
   pengatur jumlah, dan produk terkait.
   ========================================================================== */

window.App = window.App || {};

App.product = (function () {
  "use strict";

  var produk = null;

  /* Sudut gradasi berbeda untuk tiap "foto" placeholder */
  var TAMPILAN = [
    { label: "Depan", sudut: "160deg" },
    { label: "Samping", sudut: "40deg" },
    { label: "Detail", sudut: "250deg" },
    { label: "Kemasan", sudut: "120deg", art: "box" }
  ];

  function gradasiSudut(p, sudut) {
    return "background:linear-gradient(" + sudut + "," + (p.warna || "#12294A") + ",#08172B)";
  }

  /* ------------------------------------------------------------------
     Galeri
     ------------------------------------------------------------------ */
  function renderGaleri(indeks) {
    var wadah = document.querySelector("[data-galeri]");
    if (!wadah) return;

    var aktif = TAMPILAN[indeks] || TAMPILAN[0];

    var mini = TAMPILAN.map(function (t, i) {
      return '<button class="galeri-mini" type="button" style="' + gradasiSudut(produk, t.sudut) + '" ' +
        'aria-current="' + (i === indeks ? "true" : "false") + '" aria-label="Lihat ' + t.label + '" ' +
        'data-galeri-pilih="' + i + '">' + App.ui.art(t.art || produk.art) + "</button>";
    }).join("");

    wadah.innerHTML =
      '<div class="galeri-utama" style="' + gradasiSudut(produk, aktif.sudut) + '">' +
        App.ui.art(aktif.art || produk.art) +
        '<span class="badge badge-info" style="position:absolute;bottom:14px;left:14px">' +
          "Placeholder · " + aktif.label +
        "</span>" +
      "</div>" +
      '<div class="galeri-strip">' + mini + "</div>";
  }

  /* ------------------------------------------------------------------
     Kolom informasi
     ------------------------------------------------------------------ */
  function statusInfo(p) {
    if (p.status === "habis") {
      return '<span class="stok-info stok-habis"><span class="dot"></span>Stok habis · ' + p.rilis + "</span>";
    }
    if (p.stok <= 10) {
      return '<span class="stok-info stok-tipis"><span class="dot"></span>Tinggal ' + p.stok + " pcs</span>";
    }
    return '<span class="stok-info stok-ada"><span class="dot"></span>Stok tersedia (' + p.stok + " pcs)</span>";
  }

  function renderInfo() {
    var wadah = document.querySelector("[data-info]");
    if (!wadah) return;

    var p = produk;
    var diskon = App.data.persenDiskon(p);
    var habis = p.status === "habis";
    var po = p.status === "po";

    var tombol = habis
      ? '<button class="btn btn-quiet" type="button" disabled>Stok Habis</button>' +
        '<button class="btn btn-ghost" type="button" data-wish="' + p.id + '" aria-pressed="false">Kabari kalau restock</button>'
      : '<button class="btn ' + (po ? "btn-cyan" : "btn-primary") + '" type="button" ' +
          'data-add-to-cart="' + p.id + '">' + (po ? "Kunci Slot Pre-Order" : "Tambah ke Keranjang") + "</button>" +
        '<button class="btn btn-ink" type="button" data-beli-langsung="' + p.id + '">Beli Sekarang</button>';

    wadah.innerHTML =
      '<p class="detail-brand">' + p.brand + "</p>" +
      "<h1>" + p.nama + "</h1>" +

      '<div class="detail-rating">' +
        '<span class="bintang">' + App.ui.bintang(p.rating) + "</span>" +
        "<span>" + p.rating.toFixed(1) + " · " + p.terjual + " terjual</span>" +
        '<span class="titik" aria-hidden="true">·</span>' +
        statusInfo(p) +
      "</div>" +

      '<div class="detail-harga">' +
        '<div class="baris">' +
          "<b>" + App.data.rupiah(p.harga) + "</b>" +
          (diskon ? "<s>" + App.data.rupiah(p.hargaAsli) + '</s><span class="badge badge-diskon">-' + diskon + "%</span>" : "") +
        "</div>" +
        (diskon ? '<p class="hemat">Kamu hemat ' + App.data.rupiah(p.hargaAsli - p.harga) + "</p>" : "") +
        (po
          ? '<p class="dp">Pre-order bisa dikunci dengan DP 30% = <b>' +
            App.data.rupiah(Math.round(p.harga * 0.3)) + "</b>. Sisanya dilunasi saat barang siap kirim.</p>"
          : '<p class="dp">Harga sudah termasuk pajak. Ongkir dihitung di halaman checkout.</p>') +
      "</div>" +

      '<dl class="spek">' +
        "<div><dt>Kategori</dt><dd>" + App.data.namaKategori(p.kategori) + "</dd></div>" +
        "<div><dt>Skala / Ukuran</dt><dd>" + p.skala + "</dd></div>" +
        "<div><dt>Brand</dt><dd>" + p.brand + "</dd></div>" +
        "<div><dt>" + (po ? "Estimasi Rilis" : "Ketersediaan") + "</dt><dd>" + p.rilis + "</dd></div>" +
        "<div><dt>Kode Produk</dt><dd>" + p.id.toUpperCase() + "</dd></div>" +
      "</dl>" +

      '<div class="beli-baris">' +
        (habis ? "" :
          '<div class="qty">' +
            '<button type="button" aria-label="Kurangi jumlah" data-qty-minus>−</button>' +
            '<input type="number" value="1" min="1" max="' + Math.max(1, p.stok) + '" ' +
              'aria-label="Jumlah" data-qty-input>' +
            '<button type="button" aria-label="Tambah jumlah" data-qty-plus>+</button>' +
          "</div>") +
        tombol +
      "</div>" +

      '<div class="catatan-kirim">' +
        "<b>Info pengiriman &amp; garansi</b>" +
        "<ul>" +
          "<li>Dikemas dengan bubble wrap berlapis + kardus tebal.</li>" +
          "<li>Garansi barang rusak saat kirim: ganti atau refund penuh.</li>" +
          (po ? "<li>Slot pre-order dibatasi; kelebihan pesanan otomatis masuk waiting list.</li>"
              : "<li>Pesanan sebelum jam 15.00 WIB dikirim di hari yang sama.</li>") +
        "</ul>" +
      "</div>";
  }

  function renderDeskripsi() {
    var wadah = document.querySelector("[data-deskripsi]");
    if (!wadah) return;

    wadah.innerHTML =
      "<h2>Deskripsi Produk</h2>" +
      "<p>" + produk.deskripsi + "</p>" +
      "<p>Setiap unit dicek satu per satu sebelum dikirim: kondisi kemasan, kelengkapan part, " +
      "dan nomor edisi (untuk item terbatas). Kalau ada bagian yang tidak sesuai, laporkan " +
      "dalam 3 hari setelah barang diterima.</p>";
  }

  function renderTerkait() {
    var wadah = document.querySelector("[data-terkait]");
    if (!wadah) return;
    wadah.innerHTML = App.ui.grid(App.data.terkait(produk, 4));
    App.ui.wishTandai();
  }

  /* ------------------------------------------------------------------
     Produk tidak ditemukan
     ------------------------------------------------------------------ */
  function renderKosong() {
    var wadah = document.querySelector("[data-produk-wrap]");
    if (!wadah) return;
    wadah.innerHTML =
      '<div class="kosong">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
          'stroke-linecap="round" aria-hidden="true"><path d="M4 7l8-4 8 4v10l-8 4-8-4z"/>' +
          '<path d="M4 7l8 4 8-4M12 11v10"/></svg>' +
        "<h3>Produk tidak ditemukan</h3>" +
        "<p>Link-nya mungkin salah atau produknya sudah tidak dijual.</p>" +
        '<a class="btn btn-primary" href="katalog.html">Lihat Katalog</a>' +
      "</div>";
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    if (!document.querySelector("[data-produk-wrap]")) return; /* bukan halaman produk */

    var id = new URLSearchParams(window.location.search).get("id");
    produk = id ? App.data.byId(id) : null;

    /* Kalau tidak ada id, tampilkan produk pertama sebagai contoh */
    if (!produk && !id) produk = App.data.products[0];

    if (!produk) return renderKosong();

    document.title = produk.nama + " · " + App.layout.BRAND.nama;

    var crumb = document.querySelector("[data-crumb-nama]");
    if (crumb) crumb.textContent = produk.nama;

    var crumbKat = document.querySelector("[data-crumb-kategori]");
    if (crumbKat) {
      crumbKat.textContent = App.data.namaKategori(produk.kategori);
      crumbKat.setAttribute("href", "katalog.html?kategori=" + produk.kategori);
    }

    renderGaleri(0);
    renderInfo();
    renderDeskripsi();
    renderTerkait();

    /* Kejadian khusus halaman ini */
    document.addEventListener("click", function (e) {
      var mini = e.target.closest("[data-galeri-pilih]");
      if (mini) return renderGaleri(Number(mini.getAttribute("data-galeri-pilih")));

      var input = document.querySelector("[data-qty-input]");
      if (e.target.closest("[data-qty-minus]") && input) {
        input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
      }
      if (e.target.closest("[data-qty-plus]") && input) {
        var maks = parseInt(input.getAttribute("max"), 10) || 99;
        input.value = Math.min(maks, (parseInt(input.value, 10) || 1) + 1);
      }

      var beli = e.target.closest("[data-beli-langsung]");
      if (beli) {
        var qty = input ? parseInt(input.value, 10) || 1 : 1;
        App.cart.add(beli.getAttribute("data-beli-langsung"), qty);
        window.location.href = "keranjang.html";
      }
    });
  }

  return { init: init };
})();
