/* ==========================================================================
   CHECKOUT.JS — halaman checkout (checkout.html)

   PENTING: ini masih front-end saja. Tidak ada pembayaran nyata dan
   tidak ada data yang dikirim ke server. Pesanan cuma disimpan di
   localStorage supaya bisa muncul di halaman Akun.

   Kalau backend sudah siap, ganti bagian kirimPesanan() dengan
   fetch("/api/orders", { method:"POST", body: JSON.stringify(pesanan) }).
   ========================================================================== */

window.App = window.App || {};

App.checkout = (function () {
  "use strict";

  var ORDER_KEY = "otaku_orders_v1";

  /* GANTI DI SINI — opsi kurir & biayanya */
  var KURIR = [
    { id: "reguler", nama: "Reguler", ket: "3–5 hari kerja", biaya: 22000 },
    { id: "kilat", nama: "Kilat", ket: "1–2 hari kerja", biaya: 38000 },
    { id: "kargo", nama: "Kargo (barang besar)", ket: "5–8 hari kerja", biaya: 16000 },
    { id: "ambil", nama: "Ambil di showroom", ket: "Siap dalam 1 hari", biaya: 0 }
  ];

  /* GANTI DI SINI — metode pembayaran */
  var BAYAR = [
    { id: "va", nama: "Virtual Account Bank", ket: "BCA, Mandiri, BNI, BRI" },
    { id: "ewallet", nama: "E-Wallet", ket: "Verifikasi instan" },
    { id: "qris", nama: "QRIS", ket: "Scan dari aplikasi apa pun" },
    { id: "cod", nama: "Bayar di showroom", ket: "Khusus ambil sendiri" }
  ];

  var pilihan = { kurir: "reguler", bayar: "va" };

  function biayaKurir() {
    var k = KURIR.filter(function (x) { return x.id === pilihan.kurir; })[0];
    return k ? k.biaya : 0;
  }

  /* ------------------------------------------------------------------
     Ringkasan biaya
     ------------------------------------------------------------------ */
  function hitung() {
    var dasar = App.keranjang.hitung();
    var ongkir = biayaKurir();
    if (dasar.promo && dasar.promo.data.tipe === "ongkir") ongkir = 0;

    return {
      subtotal: dasar.subtotal,
      potongan: dasar.potongan,
      promo: dasar.promo,
      ongkir: ongkir,
      total: Math.max(0, dasar.subtotal - dasar.potongan) + ongkir
    };
  }

  function renderRingkasan() {
    var sisi = document.querySelector("[data-checkout-ringkasan]");
    if (!sisi) return;

    var h = hitung();
    var lines = App.cart.lines();

    var daftar = lines.map(function (l) {
      return '<div class="baris"><span>' + l.produk.nama + " ×" + l.qty + "</span><b>" +
        App.data.rupiah(l.total) + "</b></div>";
    }).join("");

    sisi.innerHTML =
      '<div class="ringkasan">' +
        "<h2>Ringkasan Pesanan</h2>" +
        daftar +
        '<div class="baris" style="border-top:1px solid var(--border);margin-top:6px;padding-top:12px">' +
          "<span>Subtotal</span><b>" + App.data.rupiah(h.subtotal) + "</b></div>" +
        (h.promo
          ? '<div class="baris hemat"><span>Promo ' + h.promo.kode + "</span><b>" +
            (h.potongan ? "−" + App.data.rupiah(h.potongan) : h.promo.data.label) + "</b></div>"
          : "") +
        '<div class="baris"><span>Pengiriman</span><b>' +
          (h.ongkir ? App.data.rupiah(h.ongkir) : "Gratis") + "</b></div>" +
        '<div class="total"><span>Total bayar</span><b>' + App.data.rupiah(h.total) + "</b></div>" +
        '<p class="aman">Tahap ini belum memproses pembayaran apa pun.<br>Backend pembayaran menyusul.</p>' +
      "</div>";
  }

  /* ------------------------------------------------------------------
     Form
     ------------------------------------------------------------------ */
  function renderForm() {
    var wadah = document.querySelector("[data-checkout-form]");
    if (!wadah) return;

    var kurir = KURIR.map(function (k) {
      return '<label class="opsi">' +
        '<input type="radio" name="kurir" value="' + k.id + '"' +
          (pilihan.kurir === k.id ? " checked" : "") + ">" +
        '<span class="isi"><b>' + k.nama + "</b><span>" + k.ket + "</span></span>" +
        '<span class="harga">' + (k.biaya ? App.data.rupiah(k.biaya) : "Gratis") + "</span>" +
      "</label>";
    }).join("");

    var bayar = BAYAR.map(function (b) {
      return '<label class="opsi">' +
        '<input type="radio" name="bayar" value="' + b.id + '"' +
          (pilihan.bayar === b.id ? " checked" : "") + ">" +
        '<span class="isi"><b>' + b.nama + "</b><span>" + b.ket + "</span></span>" +
      "</label>";
    }).join("");

    wadah.innerHTML =
      '<form id="form-checkout" novalidate data-form-pesanan>' +

        '<div class="panel">' +
          "<h2>Data Penerima</h2>" +
          '<div class="form-grid" style="margin-top:16px">' +
            field("nama", "Nama lengkap", "text", "Nama sesuai identitas", true) +
            field("telepon", "Nomor WhatsApp", "tel", "08xxxxxxxxxx", true) +
            field("email", "Email", "email", "nama@email.com", true, "penuh") +
            '<div class="field penuh">' +
              '<label for="alamat">Alamat lengkap</label>' +
              '<textarea class="textarea" id="alamat" name="alamat" ' +
                'placeholder="Nama jalan, nomor rumah, RT/RW, patokan"></textarea>' +
              '<span class="bantu">Tulis sedetail mungkin biar kurir tidak nyasar.</span>' +
            "</div>" +
            field("kota", "Kota / Kabupaten", "text", "Contoh: Bandung", true) +
            field("pos", "Kode pos", "text", "40123", true) +
          "</div>" +
        "</div>" +

        '<div class="panel">' +
          "<h2>Metode Pengiriman</h2>" +
          '<div class="opsi-kartu" style="margin-top:16px">' + kurir + "</div>" +
        "</div>" +

        '<div class="panel">' +
          "<h2>Metode Pembayaran</h2>" +
          '<div class="opsi-kartu" style="margin-top:16px">' + bayar + "</div>" +
        "</div>" +

        '<div class="panel">' +
          '<div class="field">' +
            '<label for="catatan">Catatan untuk penjual (opsional)</label>' +
            '<textarea class="textarea" id="catatan" name="catatan" ' +
              'placeholder="Contoh: tolong bubble wrap dobel, jangan pakai kardus bekas"></textarea>' +
          "</div>" +
          '<label class="pilihan" style="margin-top:14px">' +
            '<input type="checkbox" name="setuju">' +
            "<span>Saya setuju dengan syarat pembelian dan kebijakan pre-order.</span>" +
          "</label>" +
          '<button class="btn btn-primary" type="submit" ' +
            'style="width:100%;min-height:50px;margin-top:18px">Buat Pesanan</button>' +
        "</div>" +
      "</form>";
  }

  function field(nama, label, tipe, placeholder, wajib, kelas) {
    return '<div class="field' + (kelas ? " " + kelas : "") + '">' +
      '<label for="' + nama + '">' + label + (wajib ? "" : " (opsional)") + "</label>" +
      '<input class="input" id="' + nama + '" name="' + nama + '" type="' + tipe + '" ' +
        'placeholder="' + placeholder + '">' +
    "</div>";
  }

  /* ------------------------------------------------------------------
     Validasi sederhana
     ------------------------------------------------------------------ */
  function validasi(form) {
    var wajib = ["nama", "telepon", "email", "alamat", "kota", "pos"];
    var galat = 0;

    wajib.forEach(function (nama) {
      var input = form.elements[nama];
      if (!input) return;
      var wadah = input.closest(".field");
      var pesan = wadah ? wadah.querySelector(".galat") : null;
      var isi = (input.value || "").trim();
      var salah = !isi;

      if (!salah && nama === "email") salah = isi.indexOf("@") < 1 || isi.indexOf(".") < 0;
      if (!salah && nama === "telepon") salah = isi.replace(/\D/g, "").length < 9;

      if (salah) {
        galat++;
        if (wadah) wadah.setAttribute("data-galat", "true");
        if (!pesan && wadah) {
          var s = document.createElement("span");
          s.className = "galat";
          s.textContent = isi ? "Formatnya belum benar." : "Bagian ini wajib diisi.";
          wadah.appendChild(s);
        }
      } else {
        if (wadah) wadah.removeAttribute("data-galat");
        if (pesan) pesan.remove();
      }
    });

    if (!form.elements.setuju.checked) {
      galat++;
      if (App.toast) App.toast("Centang dulu persetujuan syarat pembelian.");
    }

    return galat === 0;
  }

  /* ------------------------------------------------------------------
     Simpan pesanan (sementara: localStorage)
     ------------------------------------------------------------------ */
  function kodePesanan() {
    var t = new Date();
    var acak = Math.floor(Math.random() * 9000 + 1000);
    return "INV-" + t.getFullYear() + String(t.getMonth() + 1).padStart(2, "0") +
      String(t.getDate()).padStart(2, "0") + "-" + acak;
  }

  function kirimPesanan(form) {
    var h = hitung();
    var kode = kodePesanan();

    var pesanan = {
      kode: kode,
      tanggal: new Date().toISOString(),
      status: App.cart.lines().some(function (l) { return l.produk.status === "po"; }) ? "po" : "proses",
      total: h.total,
      ongkir: h.ongkir,
      kurir: pilihan.kurir,
      bayar: pilihan.bayar,
      penerima: form.elements.nama.value.trim(),
      items: App.cart.lines().map(function (l) {
        return { id: l.produk.id, nama: l.produk.nama, qty: l.qty, total: l.total };
      })
    };

    try {
      var lama = JSON.parse(window.localStorage.getItem(ORDER_KEY) || "[]");
      lama.unshift(pesanan);
      window.localStorage.setItem(ORDER_KEY, JSON.stringify(lama));
    } catch (e) { /* diamkan */ }

    App.cart.clear();
    App.keranjang.promoSimpan(null);

    return pesanan;
  }

  function renderSukses(pesanan) {
    var wrap = document.querySelector("[data-checkout-wrap]");
    if (!wrap) return;

    wrap.innerHTML =
      '<div class="sukses">' +
        '<div class="ceklis">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' +
        "</div>" +
        "<h2>Pesanan berhasil dibuat</h2>" +
        "<p>Terima kasih, " + pesanan.penerima + ". Pesanan kamu sudah tercatat. " +
          "Instruksi pembayaran akan dikirim setelah backend aktif — untuk sekarang " +
          "pesanan ini tersimpan di halaman Akun kamu.</p>" +
        '<span class="kode">' + pesanan.kode + "</span>" +
        '<div class="baris-tombol">' +
          '<a class="btn btn-primary" href="akun.html#pesanan">Lihat Pesanan Saya</a>' +
          '<a class="btn btn-ghost" href="katalog.html">Lanjut Belanja</a>' +
        "</div>" +
      "</div>";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderKosong() {
    var wrap = document.querySelector("[data-checkout-wrap]");
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="kosong">' +
        "<h3>Belum ada yang bisa di-checkout</h3>" +
        "<p>Keranjang kamu masih kosong. Pilih barang dulu, baru balik ke sini.</p>" +
        '<a class="btn btn-primary" href="katalog.html">Lihat Katalog</a>' +
      "</div>";
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    if (!document.querySelector("[data-checkout-wrap]")) return;

    if (!App.cart.lines().length) return renderKosong();

    renderForm();
    renderRingkasan();

    document.addEventListener("change", function (e) {
      if (e.target.name === "kurir") {
        pilihan.kurir = e.target.value;
        renderRingkasan();
      }
      if (e.target.name === "bayar") pilihan.bayar = e.target.value;
    });

    document.addEventListener("submit", function (e) {
      var form = e.target.closest("[data-form-pesanan]");
      if (!form) return;
      e.preventDefault();

      if (!validasi(form)) {
        var pertama = form.querySelector('[data-galat="true"] .input, [data-galat="true"] .textarea');
        if (pertama) pertama.focus();
        return;
      }

      renderSukses(kirimPesanan(form));
    });
  }

  return { init: init };
})();
