/* ==========================================================================
   TITIPBELI.JS — halaman jasa titip beli dari Jepang (titip-beli.html)

   Menghitung estimasi biaya dari harga yen yang diisi user, lalu
   memvalidasi form permintaan. Masih front-end saja: permintaan hanya
   ditampilkan ulang sebagai konfirmasi, belum dikirim ke server.
   ========================================================================== */

window.App = window.App || {};

App.titipbeli = (function () {
  "use strict";

  /* GANTI DI SINI — kurs & skema biaya jasa */
  var KURS = 108;            /* rupiah per 1 yen */
  var FEE_PERSEN = 10;       /* jasa 10% dari harga barang */
  var FEE_MINIMUM = 25000;   /* jasa minimum */
  var ONGKIR_JEPANG = 85000; /* estimasi kirim Jepang → Indonesia per kg */

  function hitung(yen, qty, berat) {
    var hargaBarang = Math.round((Number(yen) || 0) * KURS * (Number(qty) || 1));
    var jasa = Math.max(FEE_MINIMUM, Math.round(hargaBarang * FEE_PERSEN / 100));
    var kirim = Math.round((Number(berat) || 1) * ONGKIR_JEPANG);
    return {
      barang: hargaBarang,
      jasa: jasa,
      kirim: kirim,
      total: hargaBarang + jasa + kirim
    };
  }

  function renderEstimasi() {
    var kotak = document.querySelector("[data-estimasi]");
    var form = document.querySelector("[data-form-titip]");
    if (!kotak || !form) return;

    var h = hitung(form.elements.yen.value, form.elements.jumlah.value, form.elements.berat.value);

    kotak.innerHTML =
      '<div class="ringkasan">' +
        "<h2>Estimasi Biaya</h2>" +
        '<div class="baris"><span>Harga barang (kurs ¥1 = Rp' + KURS + ")</span><b>" +
          App.data.rupiah(h.barang) + "</b></div>" +
        '<div class="baris"><span>Jasa titip (' + FEE_PERSEN + "%, min " +
          App.data.rupiah(FEE_MINIMUM) + ")</span><b>" + App.data.rupiah(h.jasa) + "</b></div>" +
        '<div class="baris"><span>Estimasi kirim Jepang → Indonesia</span><b>' +
          App.data.rupiah(h.kirim) + "</b></div>" +
        '<div class="total"><span>Perkiraan total</span><b>' + App.data.rupiah(h.total) + "</b></div>" +
        '<p class="aman">Angka ini perkiraan. Total final dikonfirmasi setelah barang ' +
          "berhasil dimenangkan/dibeli dan ditimbang.</p>" +
      "</div>";
  }

  /* ------------------------------------------------------------------
     Validasi
     ------------------------------------------------------------------ */
  function validasi(form) {
    var wajib = ["tautan", "barang", "yen", "nama", "kontak"];
    var galat = 0;

    wajib.forEach(function (nama) {
      var input = form.elements[nama];
      if (!input) return;

      var wadah = input.closest(".field");
      var pesan = wadah ? wadah.querySelector(".galat") : null;
      var isi = (input.value || "").trim();
      var salah = !isi;

      if (!salah && nama === "tautan") salah = isi.indexOf("http") !== 0;
      if (!salah && nama === "yen") salah = !(Number(isi) > 0);

      if (salah) {
        galat++;
        if (wadah) wadah.setAttribute("data-galat", "true");
        if (!pesan && wadah) {
          var s = document.createElement("span");
          s.className = "galat";
          s.textContent = nama === "tautan" && isi
            ? "Tempel link lengkap, mulai dari https://"
            : (isi ? "Isinya belum valid." : "Bagian ini wajib diisi.");
          wadah.appendChild(s);
        }
      } else {
        if (wadah) wadah.removeAttribute("data-galat");
        if (pesan) pesan.remove();
      }
    });

    return galat === 0;
  }

  function kodeRequest() {
    var t = new Date();
    return "REQ-" + String(t.getDate()).padStart(2, "0") +
      String(t.getMonth() + 1).padStart(2, "0") + "-" +
      Math.floor(Math.random() * 900 + 100);
  }

  function renderSukses(form) {
    var wrap = document.querySelector("[data-titip-wrap]");
    if (!wrap) return;

    var h = hitung(form.elements.yen.value, form.elements.jumlah.value, form.elements.berat.value);
    var kode = kodeRequest();

    wrap.innerHTML =
      '<div class="sukses">' +
        '<div class="ceklis">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' +
        "</div>" +
        "<h2>Permintaan titip beli tercatat</h2>" +
        "<p>Kami akan cek ketersediaan barang <b>" + form.elements.barang.value.trim() +
          "</b> dan mengabari kamu lewat kontak yang diisi. Perkiraan total: <b>" +
          App.data.rupiah(h.total) + "</b>.</p>" +
        '<span class="kode">' + kode + "</span>" +
        '<div class="baris-tombol">' +
          '<a class="btn btn-primary" href="katalog.html">Lihat Katalog</a>' +
          '<button class="btn btn-ghost" type="button" onclick="window.location.reload()">' +
            "Kirim Permintaan Lain</button>" +
        "</div>" +
        '<p style="margin-top:18px;font-size:12px;color:var(--slate-400)">' +
          "Catatan: form ini belum terhubung ke server. Nanti setelah backend aktif, " +
          "permintaan otomatis masuk ke dasbor admin.</p>" +
      "</div>";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    var form = document.querySelector("[data-form-titip]");
    if (!form) return;

    renderEstimasi();

    form.addEventListener("input", function (e) {
      if (["yen", "jumlah", "berat"].indexOf(e.target.name) > -1) renderEstimasi();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validasi(form)) {
        var pertama = form.querySelector('[data-galat="true"] .input');
        if (pertama) pertama.focus();
        if (App.toast) App.toast("Masih ada kolom yang perlu dibenahi.");
        return;
      }
      renderSukses(form);
    });
  }

  return { init: init, hitung: hitung };
})();
