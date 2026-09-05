/* ==========================================================================
   CATALOG.JS — halaman katalog: filter, sortir, pencarian

   Semua filter dibaca dari URL, jadi hasil pencarian bisa di-bookmark
   atau dibagikan. Contoh:
     katalog.html?kategori=gunpla&status=ready&sort=murah
     katalog.html?q=nendoroid
     katalog.html?diskon=1
   ========================================================================== */

window.App = window.App || {};

App.catalog = (function () {
  "use strict";

  var state = {
    q: "",
    kategori: [],
    status: "semua",
    brand: [],
    min: null,
    max: null,
    diskon: false,
    sort: "relevan"
  };

  var el = {};

  /* ------------------------------------------------------------------
     URL ↔ state
     ------------------------------------------------------------------ */
  function bacaUrl() {
    var p = new URLSearchParams(window.location.search);
    state.q = p.get("q") || "";
    state.kategori = p.get("kategori") ? p.get("kategori").split(",") : [];
    state.brand = p.get("brand") ? p.get("brand").split(",") : [];
    state.status = p.get("status") || "semua";
    state.min = p.get("min") ? Number(p.get("min")) : null;
    state.max = p.get("max") ? Number(p.get("max")) : null;
    state.diskon = p.get("diskon") === "1";
    state.sort = p.get("sort") || "relevan";
  }

  function tulisUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.kategori.length) p.set("kategori", state.kategori.join(","));
    if (state.brand.length) p.set("brand", state.brand.join(","));
    if (state.status !== "semua") p.set("status", state.status);
    if (state.min) p.set("min", state.min);
    if (state.max) p.set("max", state.max);
    if (state.diskon) p.set("diskon", "1");
    if (state.sort !== "relevan") p.set("sort", state.sort);

    var tanya = p.toString();
    var url = window.location.pathname + (tanya ? "?" + tanya : "");
    window.history.replaceState(null, "", url);
  }

  /* ------------------------------------------------------------------
     Penyaringan
     ------------------------------------------------------------------ */
  function cocok(p) {
    if (state.q) {
      var kata = state.q.toLowerCase();
      var teks = (p.nama + " " + p.brand + " " + App.data.namaKategori(p.kategori) + " " + p.skala).toLowerCase();
      if (teks.indexOf(kata) === -1) return false;
    }
    if (state.kategori.length && state.kategori.indexOf(p.kategori) === -1) return false;
    if (state.brand.length && state.brand.indexOf(p.brand) === -1) return false;
    if (state.status !== "semua" && p.status !== state.status) return false;
    if (state.min !== null && p.harga < state.min) return false;
    if (state.max !== null && p.harga > state.max) return false;
    if (state.diskon && App.data.persenDiskon(p) === 0) return false;
    return true;
  }

  function urutkan(daftar) {
    var salinan = daftar.slice();
    if (state.sort === "murah") {
      salinan.sort(function (a, b) { return a.harga - b.harga; });
    } else if (state.sort === "mahal") {
      salinan.sort(function (a, b) { return b.harga - a.harga; });
    } else if (state.sort === "terlaris") {
      salinan.sort(function (a, b) { return b.terjual - a.terjual; });
    } else if (state.sort === "rating") {
      salinan.sort(function (a, b) { return b.rating - a.rating; });
    } else if (state.sort === "diskon") {
      salinan.sort(function (a, b) { return App.data.persenDiskon(b) - App.data.persenDiskon(a); });
    }
    /* "relevan" = urutan asli data */
    return salinan;
  }

  /* ------------------------------------------------------------------
     Render panel filter
     ------------------------------------------------------------------ */
  function daftarBrand() {
    var unik = [];
    App.data.products.forEach(function (p) {
      if (unik.indexOf(p.brand) === -1) unik.push(p.brand);
    });
    return unik.sort();
  }

  function renderFilter() {
    if (!el.filter) return;

    var kategori = App.data.categories.map(function (k) {
      var dicek = state.kategori.indexOf(k.slug) > -1 ? " checked" : "";
      return '<label class="pilihan">' +
        '<input type="checkbox" value="' + k.slug + '" data-f-kategori' + dicek + ">" +
        "<span>" + k.nama + "</span>" +
        '<span class="jml">' + App.data.jumlahPerKategori(k.slug) + "</span>" +
      "</label>";
    }).join("");

    var statusOpsi = [
      { v: "semua", l: "Semua" },
      { v: "ready", l: "Ready Stock" },
      { v: "po", l: "Pre-Order" },
      { v: "habis", l: "Stok Habis" }
    ].map(function (s) {
      var dicek = state.status === s.v ? " checked" : "";
      return '<label class="pilihan">' +
        '<input type="radio" name="status" value="' + s.v + '" data-f-status' + dicek + ">" +
        "<span>" + s.l + "</span>" +
      "</label>";
    }).join("");

    var brand = daftarBrand().map(function (b) {
      var dicek = state.brand.indexOf(b) > -1 ? " checked" : "";
      return '<label class="pilihan">' +
        '<input type="checkbox" value="' + b + '" data-f-brand' + dicek + ">" +
        "<span>" + b + "</span>" +
      "</label>";
    }).join("");

    el.filter.innerHTML =
      '<div class="filter-grup">' +
        "<h3>Kategori</h3>" + kategori +
      "</div>" +
      '<div class="filter-grup">' +
        "<h3>Ketersediaan</h3>" + statusOpsi +
      "</div>" +
      '<div class="filter-grup">' +
        "<h3>Rentang Harga</h3>" +
        '<div class="harga-range">' +
          '<input type="number" inputmode="numeric" placeholder="Min" aria-label="Harga minimum" ' +
            'value="' + (state.min || "") + '" data-f-min>' +
          "<span>–</span>" +
          '<input type="number" inputmode="numeric" placeholder="Maks" aria-label="Harga maksimum" ' +
            'value="' + (state.max || "") + '" data-f-max>' +
        "</div>" +
        '<label class="pilihan" style="margin-top:10px">' +
          '<input type="checkbox" data-f-diskon' + (state.diskon ? " checked" : "") + ">" +
          "<span>Sedang diskon</span>" +
        "</label>" +
      "</div>" +
      '<div class="filter-grup">' +
        "<h3>Brand</h3>" + brand +
      "</div>" +
      '<div class="filter-aksi">' +
        '<button class="btn btn-primary" type="button" data-f-terapkan>Terapkan</button>' +
        '<button class="btn btn-ghost" type="button" data-f-reset>Reset</button>' +
      "</div>";
  }

  /* ------------------------------------------------------------------
     Render chip filter aktif
     ------------------------------------------------------------------ */
  var SILANG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function renderChip() {
    if (!el.chip) return;
    var chips = [];

    if (state.q) chips.push({ tipe: "q", label: 'Cari: “' + state.q + '”' });
    state.kategori.forEach(function (k) {
      chips.push({ tipe: "kategori", nilai: k, label: App.data.namaKategori(k) });
    });
    state.brand.forEach(function (b) {
      chips.push({ tipe: "brand", nilai: b, label: b });
    });
    if (state.status !== "semua") {
      var nama = { ready: "Ready Stock", po: "Pre-Order", habis: "Stok Habis" };
      chips.push({ tipe: "status", label: nama[state.status] || state.status });
    }
    if (state.diskon) chips.push({ tipe: "diskon", label: "Sedang diskon" });
    if (state.min) chips.push({ tipe: "min", label: "Min " + App.data.rupiah(state.min) });
    if (state.max) chips.push({ tipe: "max", label: "Maks " + App.data.rupiah(state.max) });

    if (!chips.length) {
      el.chip.innerHTML = "";
      return;
    }

    el.chip.innerHTML = chips.map(function (c) {
      return '<button class="chip-hapus" type="button" data-hapus="' + c.tipe + '" ' +
        'data-nilai="' + (c.nilai || "") + '">' + c.label + SILANG + "</button>";
    }).join("") +
    '<button class="chip-hapus" type="button" data-hapus="semua">Hapus semua' + SILANG + "</button>";
  }

  /* ------------------------------------------------------------------
     Render hasil
     ------------------------------------------------------------------ */
  function render() {
    var hasil = urutkan(App.data.products.filter(cocok));

    if (el.jumlah) {
      el.jumlah.innerHTML = "Menampilkan <b>" + hasil.length + "</b> dari " +
        App.data.products.length + " produk";
    }

    if (el.hasil) {
      if (!hasil.length) {
        el.hasil.className = "";
        el.hasil.innerHTML =
          '<div class="kosong">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
              'stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/>' +
              '<path d="M16.5 16.5L21 21M8 11h6"/></svg>' +
            "<h3>Produk tidak ditemukan</h3>" +
            "<p>Coba longgarkan filternya atau pakai kata kunci yang lebih umum.</p>" +
            '<button class="btn btn-primary" type="button" data-f-reset>Reset semua filter</button>' +
          "</div>";
      } else {
        el.hasil.className = "grid-produk";
        el.hasil.innerHTML = App.ui.grid(hasil);
        App.ui.wishTandai();
      }
    }

    renderChip();
    if (el.sortir) el.sortir.value = state.sort;
    tulisUrl();
  }

  /* ------------------------------------------------------------------
     Kejadian
     ------------------------------------------------------------------ */
  function ambilCentang(selector) {
    return Array.prototype.slice
      .call(document.querySelectorAll(selector + ":checked"))
      .map(function (i) { return i.value; });
  }

  function terapkan() {
    state.kategori = ambilCentang("[data-f-kategori]");
    state.brand = ambilCentang("[data-f-brand]");

    var status = document.querySelector("[data-f-status]:checked");
    state.status = status ? status.value : "semua";

    var min = document.querySelector("[data-f-min]");
    var max = document.querySelector("[data-f-max]");
    state.min = min && min.value ? Number(min.value) : null;
    state.max = max && max.value ? Number(max.value) : null;

    var diskon = document.querySelector("[data-f-diskon]");
    state.diskon = !!(diskon && diskon.checked);

    render();
    tutupFilterMobile();
  }

  function reset() {
    state.q = "";
    state.kategori = [];
    state.brand = [];
    state.status = "semua";
    state.min = null;
    state.max = null;
    state.diskon = false;
    state.sort = "relevan";

    var input = document.querySelector("[data-search-input]");
    if (input) input.value = "";

    renderFilter();
    render();
  }

  function hapusSatu(tipe, nilai) {
    if (tipe === "semua") return reset();
    if (tipe === "q") {
      state.q = "";
      var input = document.querySelector("[data-search-input]");
      if (input) input.value = "";
    }
    if (tipe === "kategori") state.kategori = state.kategori.filter(function (k) { return k !== nilai; });
    if (tipe === "brand") state.brand = state.brand.filter(function (b) { return b !== nilai; });
    if (tipe === "status") state.status = "semua";
    if (tipe === "diskon") state.diskon = false;
    if (tipe === "min") state.min = null;
    if (tipe === "max") state.max = null;

    renderFilter();
    render();
  }

  function tutupFilterMobile() {
    if (el.filter) el.filter.removeAttribute("data-buka");
    var tombol = document.querySelector("[data-filter-toggle]");
    if (tombol) tombol.setAttribute("aria-expanded", "false");
  }

  function init() {
    el.filter = document.querySelector("[data-filter-panel]");
    el.hasil = document.querySelector("[data-hasil]");
    el.jumlah = document.querySelector("[data-hasil-jumlah]");
    el.chip = document.querySelector("[data-filter-aktif]");
    el.sortir = document.querySelector("[data-sortir]");

    if (!el.hasil) return; /* bukan halaman katalog */

    bacaUrl();
    renderFilter();
    render();

    /* Sortir */
    if (el.sortir) {
      el.sortir.addEventListener("change", function () {
        state.sort = el.sortir.value;
        render();
      });
    }

    /* Pencarian dari header — tanpa reload halaman */
    var form = document.querySelector("[data-search-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.querySelector("[data-search-input]");
        state.q = input ? input.value.trim() : "";
        render();
      });
    }

    /* Klik di dalam panel filter & chip */
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-f-terapkan]")) return terapkan();
      if (e.target.closest("[data-f-reset]")) return reset();

      var chip = e.target.closest("[data-hapus]");
      if (chip) return hapusSatu(chip.getAttribute("data-hapus"), chip.getAttribute("data-nilai"));

      var toggle = e.target.closest("[data-filter-toggle]");
      if (toggle && el.filter) {
        var buka = el.filter.hasAttribute("data-buka");
        if (buka) {
          tutupFilterMobile();
        } else {
          el.filter.setAttribute("data-buka", "true");
          toggle.setAttribute("aria-expanded", "true");
        }
      }
    });

    /* Enter di kolom harga = langsung terapkan */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      if (e.target.matches("[data-f-min], [data-f-max]")) {
        e.preventDefault();
        terapkan();
      }
    });
  }

  return { init: init, render: render, reset: reset };
})();
