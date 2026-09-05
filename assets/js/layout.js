/* ==========================================================================
   LAYOUT.JS — header & footer bersama untuk SEMUA halaman

   Kenapa lewat JS? Supaya kamu cukup edit SATU file ini kalau mau ganti
   nama brand, menu, atau isi footer — tidak perlu buka 8 file HTML.

   Cara pakai di halaman HTML:
     <div data-layout-header></div>   ← header disuntik ke sini
     <div data-layout-footer></div>   ← footer disuntik ke sini

   Halaman aktif ditandai lewat <body data-page="katalog">.

   Catatan: sengaja pakai template string (bukan fetch), supaya tetap jalan
   saat file dibuka langsung lewat file:// tanpa server.
   ========================================================================== */

window.App = window.App || {};

App.layout = (function () {
  "use strict";

  /* ------------------------------------------------------------------
     GANTI DI SINI — identitas brand & isi menu
     ------------------------------------------------------------------ */
  var BRAND = {
    nama: "Otakuben",
    tagline: "Figure &amp; Hobby",
    deskripsi: "Toko figure, gunpla, dan merchandise hobi. Pre-order resmi &amp; titip beli dari Jepang."
  };

  /* Menu strip kategori di bawah search bar */
  var NAV = [
    { label: "Semua Produk", href: "katalog.html", page: "katalog" },
    { label: "Action Figures", href: "katalog.html?kategori=action-figure" },
    { label: "Plamo / Gunpla", href: "katalog.html?kategori=gunpla" },
    { label: "Nendoroid &amp; Chibi", href: "katalog.html?kategori=chibi" },
    { label: "Blind Box", href: "katalog.html?kategori=blind-box" },
    { label: "Pre-Order", href: "katalog.html?status=po" },
    { label: "Titip Beli", href: "titip-beli.html", page: "titip-beli", tandai: true }
  ];

  var FOOTER = [
    {
      judul: "Belanja",
      tautan: [
        { label: "Semua Produk", href: "katalog.html" },
        { label: "Pre-Order", href: "katalog.html?status=po" },
        { label: "Ready Stock", href: "katalog.html?status=ready" },
        { label: "Sedang Diskon", href: "katalog.html?diskon=1" }
      ]
    },
    {
      judul: "Bantuan",
      tautan: [
        { label: "Cara Pesan", href: "bantuan.html" },
        { label: "Pengiriman", href: "bantuan.html#pengiriman" },
        { label: "Titip Beli", href: "titip-beli.html" },
        { label: "Lacak Pesanan", href: "akun.html#pesanan" }
      ]
    },
    {
      judul: "Akun",
      tautan: [
        { label: "Masuk / Daftar", href: "masuk.html" },
        { label: "Pesanan Saya", href: "akun.html#pesanan" },
        { label: "Poin &amp; Reward", href: "akun.html#poin" },
        { label: "Wishlist", href: "akun.html#wishlist" }
      ]
    }
  ];

  /* ------------------------------------------------------------------
     Ikon (inline SVG supaya tidak ada request tambahan)
     ------------------------------------------------------------------ */
  var ikon = {
    cari: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg>',
    keranjang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.2l2.4 10.6a1.6 1.6 0 0 0 1.6 1.25h8.5a1.6 1.6 0 0 0 1.56-1.2L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
    transaksi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5h13M13.5 5.5l3 3-3 3"/><path d="M20.5 15.5h-13M10.5 12.5l-3 3 3 3"/></svg>',
    riwayat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.6 12a8.4 8.4 0 1 0 2.6-6.1M3.4 4.6v4.2h4.2"/><path d="M12 8.2V12l3 1.8"/></svg>',
    orang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.2" r="3.6"/><path d="M4.8 20c.9-3.6 3.8-5.6 7.2-5.6s6.3 2 7.2 5.6"/></svg>',
    caret: '<svg class="caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9.5l6 6 6-6"/></svg>'
  };

  /* ------------------------------------------------------------------
     Markup header
     ------------------------------------------------------------------ */
  function header(halaman) {
    var menu = NAV.map(function (n) {
      var aktif = n.page && n.page === halaman ? ' aria-current="page"' : "";
      var kelas = "nav-link" + (n.tandai ? " nav-link-tandai" : "");
      return '<a class="' + kelas + '" href="' + n.href + '"' + aktif + ">" + n.label + "</a>";
    }).join("");

    return '' +
    '<header class="site-header">' +
      '<div class="shell header-inner">' +

        '<a class="logo" href="index.html" aria-label="' + BRAND.nama + ' — beranda">' +
          '<img class="logo-mark" src="assets/img/logo-mark.svg" alt="" width="38" height="38">' +
          '<span class="logo-text"><b>' + BRAND.nama + '</b><span>' + BRAND.tagline + '</span></span>' +
        '</a>' +

        '<form class="search" role="search" action="katalog.html" method="get" data-search-form>' +
          '<label class="sr-only" for="q">Cari produk</label>' +
          '<div class="search-field">' +
            '<input id="q" name="q" type="search" autocomplete="off" placeholder="Cari Action Figure, Merch, Gunpla..." data-search-input>' +
            '<span class="kbd" aria-hidden="true">Ctrl K</span>' +
            '<button class="search-submit" type="submit" aria-label="Cari">' + ikon.cari + '</button>' +
          '</div>' +
        '</form>' +

        '<nav class="actions" aria-label="Aksi cepat">' +
          '<a class="icon-btn" href="katalog.html#filter" aria-label="Filter dan pencarian lanjutan">' +
            ikon.filter + '<span class="tip">Filter &amp; Pencarian Lanjutan</span>' +
          '</a>' +

          '<a class="icon-btn" href="keranjang.html" aria-label="Keranjang, kosong" data-cart>' +
            ikon.keranjang +
            '<span class="cart-count" data-cart-count hidden></span>' +
            '<span class="tip">Keranjang</span>' +
          '</a>' +

          '<a class="icon-btn" href="akun.html#pesanan" aria-label="Transaksi berjalan">' +
            ikon.transaksi + '<span class="tip">Transaksi Berjalan</span>' +
          '</a>' +

          '<a class="icon-btn" href="akun.html#riwayat" aria-label="Riwayat pembelian">' +
            ikon.riwayat + '<span class="tip">Riwayat Pembelian</span>' +
          '</a>' +

          '<span class="header-divider" aria-hidden="true"></span>' +

          '<div class="auth">' +
            '<a class="btn-auth" href="masuk.html" data-login-trigger>' + ikon.orang + "Masuk / Daftar</a>" +

            '<button class="auth-user" type="button" aria-haspopup="true" aria-expanded="false" data-auth-toggle>' +
              '<span class="avatar" aria-hidden="true" data-auth-initial>N</span>' +
              '<span class="greet">Halo, <b data-auth-name>Nama User</b></span>' +
              ikon.caret +
            "</button>" +

            '<div class="auth-menu" data-auth-menu data-open="false" role="menu">' +
              '<a href="akun.html" role="menuitem">Profil Saya</a>' +
              '<a href="akun.html#pesanan" role="menuitem">Pesanan Saya</a>' +
              '<a href="akun.html#poin" role="menuitem">Poin &amp; Reward</a>' +
              '<a href="akun.html#wishlist" role="menuitem">Wishlist</a>' +
              "<hr>" +
              '<a class="danger" href="#" role="menuitem" data-logout>Keluar</a>' +
            "</div>" +
          "</div>" +
        "</nav>" +
      "</div>" +

      '<div class="nav-strip">' +
        '<nav class="shell nav-strip-inner" aria-label="Kategori">' + menu + "</nav>" +
      "</div>" +
    "</header>";
  }

  /* ------------------------------------------------------------------
     Markup footer
     ------------------------------------------------------------------ */
  function footer() {
    var kolom = FOOTER.map(function (k) {
      var li = k.tautan.map(function (t) {
        return '<li><a href="' + t.href + '">' + t.label + "</a></li>";
      }).join("");
      return '<div class="footer-col"><h4>' + k.judul + "</h4><ul>" + li + "</ul></div>";
    }).join("");

    return '' +
    '<footer class="site-footer">' +
      '<div class="shell">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="logo" href="index.html">' +
              '<img class="logo-mark" src="assets/img/logo-mark.svg" alt="" width="38" height="38">' +
              '<span class="logo-text"><b>' + BRAND.nama + '</b><span>' + BRAND.tagline + '</span></span>' +
            '</a>' +
            "<p>" + BRAND.deskripsi + "</p>" +
          "</div>" +
          kolom +
        "</div>" +

        '<div class="footer-bottom">' +
          '<span>&copy; <span data-year>2026</span> ' + BRAND.nama + ". Semua hak dilindungi.</span>" +
          '<a href="#atas">Kembali ke atas ↑</a>' +
        "</div>" +
      "</div>" +
    "</footer>";
  }

  /* ------------------------------------------------------------------
     Suntik ke halaman
     ------------------------------------------------------------------ */
  function init() {
    var halaman = document.body.getAttribute("data-page") || "";

    var slotHeader = document.querySelector("[data-layout-header]");
    if (slotHeader) slotHeader.outerHTML = header(halaman);

    var slotFooter = document.querySelector("[data-layout-footer]");
    if (slotFooter) slotFooter.outerHTML = footer();

    /* Isi ulang kolom search kalau halaman dibuka dengan ?q=... */
    var q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      var input = document.querySelector("[data-search-input]");
      if (input) input.value = q;
    }
  }

  return { init: init, header: header, footer: footer, BRAND: BRAND };
})();
