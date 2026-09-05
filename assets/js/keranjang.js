/* ==========================================================================
   KERANJANG.JS — halaman keranjang belanja (keranjang.html)

   Menampilkan isi App.cart, mengatur jumlah, hapus item, kode promo,
   dan ringkasan biaya. Semua masih di sisi browser (belum ada backend).
   ========================================================================== */

window.App = window.App || {};

App.keranjang = (function () {
  "use strict";

  /* GANTI DI SINI — daftar kode promo sementara.
     Nanti validasinya dipindah ke backend. */
  var PROMO = {
    OTAKU10: { tipe: "persen", nilai: 10, label: "Diskon 10%" },
    GRATISKIRIM: { tipe: "ongkir", nilai: 0, label: "Gratis ongkir" },
    HOBI50K: { tipe: "potong", nilai: 50000, label: "Potongan Rp50.000" }
  };

  var PROMO_KEY = "otaku_promo_v1";
  var ONGKIR_DASAR = 22000;

  var TONG_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>' +
    "</svg>";

  /* ------------------------------------------------------------------
     Promo
     ------------------------------------------------------------------ */
  function promoAktif() {
    try {
      var kode = window.localStorage.getItem(PROMO_KEY);
      return kode && PROMO[kode] ? { kode: kode, data: PROMO[kode] } : null;
    } catch (e) {
      return null;
    }
  }

  function promoSimpan(kode) {
    try {
      if (kode) window.localStorage.setItem(PROMO_KEY, kode);
      else window.localStorage.removeItem(PROMO_KEY);
    } catch (e) { /* diamkan */ }
  }

  /* Hitung semua angka biaya sekali, dipakai juga oleh checkout.js */
  function hitung() {
    var subtotal = App.cart.subtotal();
    var promo = promoAktif();
    var potongan = 0;
    var ongkir = subtotal > 0 ? ONGKIR_DASAR : 0;

    if (promo) {
      if (promo.data.tipe === "persen") potongan = Math.round(subtotal * promo.data.nilai / 100);
      if (promo.data.tipe === "potong") potongan = Math.min(subtotal, promo.data.nilai);
      if (promo.data.tipe === "ongkir") ongkir = 0;
    }

    return {
      subtotal: subtotal,
      hemat: App.cart.hemat(),
      potongan: potongan,
      ongkir: ongkir,
      promo: promo,
      total: Math.max(0, subtotal - potongan) + ongkir
    };
  }

  /* ------------------------------------------------------------------
     Baris item
     ------------------------------------------------------------------ */
  function baris(l) {
    var p = l.produk;
    var tautan = "produk.html?id=" + encodeURIComponent(p.id);

    return '' +
    '<div class="baris-keranjang">' +
      "<a href=" + '"' + tautan + '"' + ">" + App.ui.thumb(p) + "</a>" +

      '<div class="k-info">' +
        '<p class="k-brand">' + p.brand + "</p>" +
        '<h3><a href="' + tautan + '">' + p.nama + "</a></h3>" +
        '<p class="k-satuan">' + App.data.rupiah(p.harga) + " / pcs · " +
          (p.status === "po" ? "Pre-order · " + p.rilis : "Ready stock") + "</p>" +

        '<div class="k-kontrol">' +
          '<div class="qty">' +
            '<button type="button" aria-label="Kurangi jumlah" data-turun="' + p.id + '">−</button>' +
            '<input type="number" value="' + l.qty + '" min="1" aria-label="Jumlah " ' +
              'data-ubah-qty="' + p.id + '">' +
            '<button type="button" aria-label="Tambah jumlah" data-naik="' + p.id + '">+</button>' +
          "</div>" +
          '<button class="k-hapus" type="button" data-hapus-item="' + p.id + '">' +
            TONG_SVG + "Hapus</button>" +
        "</div>" +
      "</div>" +

      '<div class="k-total">' + App.data.rupiah(l.total) + "</div>" +
    "</div>";
  }

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  function render() {
    var wadah = document.querySelector("[data-keranjang-isi]");
    var sisi = document.querySelector("[data-keranjang-ringkasan]");
    if (!wadah) return;

    var lines = App.cart.lines();

    if (!lines.length) {
      wadah.innerHTML =
        '<div class="kosong">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M3 5h2l2.2 9.6A1.5 1.5 0 0 0 8.7 16h8.6a1.5 1.5 0 0 0 1.45-1.1L21 8H6"/>' +
            '<circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>' +
          "<h3>Keranjang masih kosong</h3>" +
          "<p>Belum ada barang di sini. Mulai dari katalog atau lihat item pre-order terbaru.</p>" +
          '<a class="btn btn-primary" href="katalog.html">Mulai Belanja</a>' +
        "</div>";
      if (sisi) sisi.innerHTML = "";
      return;
    }

    wadah.innerHTML =
      '<div class="panel">' +
        '<h2 style="margin-bottom:6px">Keranjang (' + App.cart.count() + " barang)</h2>" +
        lines.map(baris).join("") +
      "</div>" +
      '<div class="panel">' +
        "<h3>Punya kode promo?</h3>" +
        '<form class="harga-range" style="margin-top:12px" data-promo-form>' +
          '<input class="input" type="text" name="kode" placeholder="Masukkan kode promo" ' +
            'aria-label="Kode promo" style="flex:1 1 auto">' +
          '<button class="btn btn-ink" type="submit" style="min-height:40px">Pakai</button>' +
        "</form>" +
        '<p class="bantu" style="margin-top:10px;font-size:12px;color:var(--slate-400)">' +
          "Coba: OTAKU10 · GRATISKIRIM · HOBI50K" +
        "</p>" +
      "</div>";

    if (sisi) renderRingkasan(sisi);
  }

  function renderRingkasan(sisi) {
    var h = hitung();

    sisi.innerHTML =
      '<div class="ringkasan">' +
        "<h2>Ringkasan Belanja</h2>" +
        '<div class="baris"><span>Subtotal (' + App.cart.count() + " barang)</span><b>" +
          App.data.rupiah(h.subtotal) + "</b></div>" +
        (h.hemat ? '<div class="baris hemat"><span>Hemat dari diskon</span><b>−' +
          App.data.rupiah(h.hemat) + "</b></div>" : "") +
        (h.promo
          ? '<div class="baris hemat"><span>Promo ' + h.promo.kode +
            ' <button type="button" data-hapus-promo style="color:var(--slate-400);text-decoration:underline">hapus</button></span>' +
            "<b>" + (h.potongan ? "−" + App.data.rupiah(h.potongan) : h.promo.data.label) + "</b></div>"
          : "") +
        '<div class="baris"><span>Estimasi ongkir</span><b>' +
          (h.ongkir ? App.data.rupiah(h.ongkir) : "Gratis") + "</b></div>" +

        '<div class="total"><span>Total bayar</span><b>' + App.data.rupiah(h.total) + "</b></div>" +

        '<a class="btn btn-primary" href="checkout.html">Lanjut ke Checkout</a>' +
        '<p class="aman">Ongkir final dihitung setelah alamat diisi.<br>Belum ada pembayaran yang diproses di tahap ini.</p>' +
      "</div>";
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    if (!document.querySelector("[data-keranjang-isi]")) return;

    render();
    document.addEventListener("cart:change", render);

    document.addEventListener("click", function (e) {
      var naik = e.target.closest("[data-naik]");
      if (naik) {
        var idN = naik.getAttribute("data-naik");
        var barisN = App.cart.lines().filter(function (l) { return l.produk.id === idN; })[0];
        if (barisN) App.cart.setQty(idN, barisN.qty + 1);
        return;
      }

      var turun = e.target.closest("[data-turun]");
      if (turun) {
        var idT = turun.getAttribute("data-turun");
        var barisT = App.cart.lines().filter(function (l) { return l.produk.id === idT; })[0];
        if (barisT) App.cart.setQty(idT, barisT.qty - 1);
        return;
      }

      var hapus = e.target.closest("[data-hapus-item]");
      if (hapus) {
        var p = App.data.byId(hapus.getAttribute("data-hapus-item"));
        App.cart.remove(hapus.getAttribute("data-hapus-item"));
        if (App.toast && p) App.toast(p.nama + " dihapus dari keranjang.");
        return;
      }

      if (e.target.closest("[data-hapus-promo]")) {
        promoSimpan(null);
        render();
        if (App.toast) App.toast("Promo dilepas.");
      }
    });

    /* Ubah jumlah lewat input angka */
    document.addEventListener("change", function (e) {
      var input = e.target.closest("[data-ubah-qty]");
      if (!input) return;
      App.cart.setQty(input.getAttribute("data-ubah-qty"), input.value);
    });

    /* Kode promo */
    document.addEventListener("submit", function (e) {
      var form = e.target.closest("[data-promo-form]");
      if (!form) return;
      e.preventDefault();

      var kode = (form.kode.value || "").trim().toUpperCase();
      if (!kode) return;

      if (PROMO[kode]) {
        promoSimpan(kode);
        render();
        if (App.toast) App.toast("Promo " + kode + " dipakai — " + PROMO[kode].label + ".");
      } else {
        if (App.toast) App.toast("Kode " + kode + " tidak dikenali.");
      }
    });
  }

  return { init: init, hitung: hitung, promoAktif: promoAktif, promoSimpan: promoSimpan };
})();
