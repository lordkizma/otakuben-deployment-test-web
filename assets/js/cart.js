/* ==========================================================================
   CART.JS — keranjang belanja (disimpan di localStorage browser)

   Belum butuh backend. Data bertahan walau tab ditutup.
   Kalau backend sudah jalan, ganti simpan()/muat() jadi panggilan API.

   Pemakaian:
     App.cart.add("sf-001", 1)      → tambah ke keranjang
     App.cart.setQty("sf-001", 3)   → ubah jumlah
     App.cart.remove("sf-001")      → hapus satu baris
     App.cart.clear()               → kosongkan
     App.cart.lines()               → [{ produk, qty, total }]
     App.cart.count()               → total jumlah barang
     App.cart.subtotal()            → total harga

   Setiap perubahan memancarkan event "cart:change" di document,
   jadi halaman bisa render ulang otomatis.
   ========================================================================== */

window.App = window.App || {};

App.cart = (function () {
  "use strict";

  var KEY = "otaku_cart_v1";
  var items = [];

  /* ------------------------------------------------------------------
     Simpan & muat
     ------------------------------------------------------------------ */
  function muat() {
    try {
      var raw = window.localStorage.getItem(KEY);
      items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(items)) items = [];
    } catch (e) {
      /* localStorage diblokir (mode privat) — jalan tanpa simpan permanen */
      items = [];
    }
  }

  function simpan() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) { /* diamkan saja */ }
    kabari();
  }

  function kabari() {
    perbaruiBadge();
    document.dispatchEvent(new CustomEvent("cart:change"));
  }

  /* ------------------------------------------------------------------
     Operasi keranjang
     ------------------------------------------------------------------ */
  function cari(id) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  function add(id, qty) {
    var jumlah = Math.max(1, parseInt(qty, 10) || 1);
    var baris = cari(id);
    if (baris) {
      baris.qty += jumlah;
    } else {
      items.push({ id: id, qty: jumlah });
    }
    simpan();
  }

  function setQty(id, qty) {
    var jumlah = parseInt(qty, 10) || 0;
    if (jumlah < 1) return remove(id);
    var baris = cari(id);
    if (baris) baris.qty = jumlah;
    simpan();
  }

  function remove(id) {
    items = items.filter(function (b) { return b.id !== id; });
    simpan();
  }

  function clear() {
    items = [];
    simpan();
  }

  /* ------------------------------------------------------------------
     Turunan data
     ------------------------------------------------------------------ */

  /* Gabungkan isi keranjang dengan detail produk dari data.js */
  function lines() {
    if (!App.data) return [];
    return items
      .map(function (b) {
        var p = App.data.byId(b.id);
        if (!p) return null;
        return { produk: p, qty: b.qty, total: p.harga * b.qty };
      })
      .filter(Boolean);
  }

  function count() {
    return items.reduce(function (n, b) { return n + b.qty; }, 0);
  }

  function subtotal() {
    return lines().reduce(function (n, l) { return n + l.total; }, 0);
  }

  /* Total hemat dari produk yang sedang diskon */
  function hemat() {
    return lines().reduce(function (n, l) {
      if (!l.produk.hargaAsli) return n;
      return n + (l.produk.hargaAsli - l.produk.harga) * l.qty;
    }, 0);
  }

  /* ------------------------------------------------------------------
     Badge angka di ikon keranjang.
     PENTING: badge hanya muncul kalau keranjang benar-benar berisi.
     Saat kosong, elemen disembunyikan total — bukan menampilkan "0".
     ------------------------------------------------------------------ */
  function perbaruiBadge() {
    var n = count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      if (n > 0) {
        el.textContent = n > 99 ? "99+" : String(n);
        el.hidden = false;
      } else {
        el.textContent = "";
        el.hidden = true;
      }
    });

    document.querySelectorAll("[data-cart]").forEach(function (el) {
      el.setAttribute("aria-label", n > 0 ? "Keranjang, " + n + " barang" : "Keranjang, kosong");
    });
  }

  /* ------------------------------------------------------------------
     Tombol "tambah ke keranjang" di mana pun (pakai [data-add-to-cart])
     ------------------------------------------------------------------ */
  function pasangTombol() {
    document.addEventListener("click", function (e) {
      var tombol = e.target.closest("[data-add-to-cart]");
      if (!tombol) return;

      e.preventDefault();
      var id = tombol.getAttribute("data-add-to-cart");
      var p = App.data && App.data.byId(id);
      if (!p) return;

      if (p.status === "habis") {
        if (App.toast) App.toast("Stok " + p.nama + " sedang habis.");
        return;
      }

      /* Ambil jumlah dari input [data-qty-input] kalau ada di halaman */
      var input = document.querySelector("[data-qty-input]");
      var qty = input ? parseInt(input.value, 10) || 1 : 1;

      add(id, qty);
      if (App.toast) App.toast(p.nama + " masuk keranjang (" + qty + ").");
    });
  }

  function init() {
    muat();
    perbaruiBadge();
    pasangTombol();

    /* Sinkron antar tab browser */
    window.addEventListener("storage", function (e) {
      if (e.key !== KEY) return;
      muat();
      kabari();
    });
  }

  return {
    init: init,
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    lines: lines,
    count: count,
    subtotal: subtotal,
    hemat: hemat
  };
})();
