/* ==========================================================================
   DATA.JS — sumber data produk (sementara, sebelum backend jadi)

   Nanti kalau backend sudah siap, cukup ganti isi App.data.products
   dengan hasil fetch dari API kamu. Struktur field-nya jangan diubah
   supaya semua halaman tetap jalan.

   Field:
     id       : kode unik (dipakai di URL produk.html?id=...)
     nama     : nama produk
     brand    : produsen / label
     kategori : harus salah satu dari App.data.categories
     harga    : angka rupiah (tanpa titik)
     hargaAsli: harga sebelum diskon (null = tidak diskon)
     status   : "ready" | "po" | "habis"
     skala    : teks bebas (mis. "1/7", "HG 1/144")
     rilis    : perkiraan rilis (untuk status "po")
     stok     : sisa stok
     terjual  : jumlah terjual (untuk sortir "terlaris")
     rating   : 0–5
     art      : bentuk siluet placeholder: "figure" | "gunpla" | "chibi" | "box"
     warna    : warna aksen kartu produk (hex)
     tag      : label kecil di kartu (null = tidak ada)
     deskripsi: paragraf untuk halaman detail
   ========================================================================== */

window.App = window.App || {};

App.data = (function () {
  "use strict";

  var categories = [
    { slug: "action-figure", nama: "Action Figures" },
    { slug: "gunpla", nama: "Plamo / Gunpla" },
    { slug: "chibi", nama: "Nendoroid & Chibi" },
    { slug: "scale", nama: "Scale Figure" },
    { slug: "blind-box", nama: "Blind Box" },
    { slug: "kartu", nama: "Trading Card" },
    { slug: "apparel", nama: "Apparel & Merch" },
    { slug: "tools", nama: "Tools & Paint" }
  ];

  var products = [
    {
      id: "sf-001", nama: "Scale Figure Ksatria Fajar 1/7", brand: "Aurum Studio",
      kategori: "scale", harga: 2450000, hargaAsli: 2850000, status: "po",
      skala: "1/7", rilis: "Q1 2027", stok: 24, terjual: 148, rating: 4.9,
      art: "figure", warna: "#E0B463", tag: "Pre-Order",
      deskripsi: "Figure skala 1/7 dengan pengecatan tangan dan base diorama batu. Produksi terbatas, dikunci lewat DP 30%."
    },
    {
      id: "sf-002", nama: "Scale Figure Penyihir Laut 1/7", brand: "Aurum Studio",
      kategori: "scale", harga: 2190000, hargaAsli: null, status: "po",
      skala: "1/7", rilis: "Q2 2027", stok: 40, terjual: 96, rating: 4.8,
      art: "figure", warna: "#2AA6C4", tag: "Pre-Order",
      deskripsi: "Detail kain transparan dengan efek air resin. Termasuk part wajah alternatif dan sertifikat nomor edisi."
    },
    {
      id: "sf-003", nama: "Scale Figure Ronin Senja 1/8", brand: "Nishikawa",
      kategori: "scale", harga: 1680000, hargaAsli: 1890000, status: "ready",
      skala: "1/8", rilis: "Tersedia", stok: 7, terjual: 212, rating: 4.7,
      art: "figure", warna: "#C9743F", tag: "Stok Terbatas",
      deskripsi: "Pose bertarung dinamis dengan katana logam die-cast. Base kayu asli dengan ukiran motif ombak."
    },
    {
      id: "af-001", nama: "Action Figure Pilot Baja 6 inci", brand: "Kaiten Toys",
      kategori: "action-figure", harga: 620000, hargaAsli: null, status: "ready",
      skala: "6 inci", rilis: "Tersedia", stok: 34, terjual: 421, rating: 4.6,
      art: "figure", warna: "#5E9FE8", tag: "Terlaris",
      deskripsi: "32 titik artikulasi, tiga pasang tangan lepas-pasang, dan efek tembakan translucent."
    },
    {
      id: "af-002", nama: "Action Figure Pendekar Bayangan", brand: "Kaiten Toys",
      kategori: "action-figure", harga: 545000, hargaAsli: 660000, status: "ready",
      skala: "6 inci", rilis: "Tersedia", stok: 52, terjual: 318, rating: 4.5,
      art: "figure", warna: "#6B7F97", tag: "Diskon",
      deskripsi: "Kain jubah asli berkawat supaya bisa dibentuk. Termasuk dua senjata dan stand bening."
    },
    {
      id: "af-003", nama: "Action Figure Kapten Armada", brand: "Orbit Line",
      kategori: "action-figure", harga: 780000, hargaAsli: null, status: "ready",
      skala: "7 inci", rilis: "Tersedia", stok: 19, terjual: 176, rating: 4.4,
      art: "figure", warna: "#46A171", tag: null,
      deskripsi: "Termasuk part kepala berekspresi, topi lepas-pasang, dan diorama dek kapal mini."
    },
    {
      id: "af-004", nama: "Action Figure Mekanik Rimba", brand: "Orbit Line",
      kategori: "action-figure", harga: 690000, hargaAsli: null, status: "habis",
      skala: "6 inci", rilis: "Restock menyusul", stok: 0, terjual: 502, rating: 4.8,
      art: "figure", warna: "#8E7CC3", tag: null,
      deskripsi: "Set lengkap dengan perkakas mini, drone pendamping, dan base pelat logam."
    },
    {
      id: "gp-001", nama: "Model Kit Rangka Petir HG 1/144", brand: "Katsu Model",
      kategori: "gunpla", harga: 285000, hargaAsli: null, status: "ready",
      skala: "HG 1/144", rilis: "Tersedia", stok: 88, terjual: 934, rating: 4.7,
      art: "gunpla", warna: "#2AA6C4", tag: "Terlaris",
      deskripsi: "Kit tanpa lem, snap-fit. Cocok untuk pemula. Termasuk stiker foil dan dua senjata jarak jauh."
    },
    {
      id: "gp-002", nama: "Model Kit Benteng Badai RG 1/144", brand: "Katsu Model",
      kategori: "gunpla", harga: 520000, hargaAsli: 585000, status: "ready",
      skala: "RG 1/144", rilis: "Tersedia", stok: 41, terjual: 617, rating: 4.9,
      art: "gunpla", warna: "#E0B463", tag: "Diskon",
      deskripsi: "Rangka dalam prefabrikasi, panel lining sudah tercetak, dan sendi ratchet yang lebih kokoh."
    },
    {
      id: "gp-003", nama: "Model Kit Raksasa Fajar MG 1/100", brand: "Zenta Kits",
      kategori: "gunpla", harga: 1180000, hargaAsli: null, status: "po",
      skala: "MG 1/100", rilis: "Nov 2026", stok: 30, terjual: 205, rating: 4.8,
      art: "gunpla", warna: "#DE9255", tag: "Pre-Order",
      deskripsi: "Lebih dari 900 part, LED unit opsional, dan panel dada yang bisa dibuka penuh."
    },
    {
      id: "gp-004", nama: "Model Kit Penjelajah Pasir 1/144", brand: "Zenta Kits",
      kategori: "gunpla", harga: 245000, hargaAsli: null, status: "ready",
      skala: "HG 1/144", rilis: "Tersedia", stok: 120, terjual: 388, rating: 4.3,
      art: "gunpla", warna: "#C9A227", tag: null,
      deskripsi: "Varian gurun dengan armor tambahan dan dua opsi kepala sensor."
    },
    {
      id: "ch-001", nama: "Chibi Figure Murid Kuil", brand: "Pocket Bloom",
      kategori: "chibi", harga: 465000, hargaAsli: null, status: "ready",
      skala: "10 cm", rilis: "Tersedia", stok: 63, terjual: 741, rating: 4.8,
      art: "chibi", warna: "#DF84A8", tag: "Terlaris",
      deskripsi: "Tiga part wajah bertukar, sapu bambu mini, dan stand penyangga bening."
    },
    {
      id: "ch-002", nama: "Chibi Figure Barista Kucing", brand: "Pocket Bloom",
      kategori: "chibi", harga: 425000, hargaAsli: 499000, status: "ready",
      skala: "10 cm", rilis: "Tersedia", stok: 45, terjual: 522, rating: 4.6,
      art: "chibi", warna: "#D5803B", tag: "Diskon",
      deskripsi: "Set lengkap dengan cangkir, nampan, dan papan menu mini yang bisa ditulis ulang."
    },
    {
      id: "ch-003", nama: "Chibi Figure Astronaut Mungil", brand: "Lumen Craft",
      kategori: "chibi", harga: 510000, hargaAsli: null, status: "po",
      skala: "11 cm", rilis: "Jan 2027", stok: 50, terjual: 133, rating: 4.7,
      art: "chibi", warna: "#5E9FE8", tag: "Pre-Order",
      deskripsi: "Helm transparan bisa dilepas, tali pengaman berkawat, dan base bulan bertekstur."
    },
    {
      id: "ch-004", nama: "Chibi Figure Penjaga Perpustakaan", brand: "Lumen Craft",
      kategori: "chibi", harga: 445000, hargaAsli: null, status: "ready",
      skala: "10 cm", rilis: "Tersedia", stok: 28, terjual: 264, rating: 4.5,
      art: "chibi", warna: "#72BC8F", tag: null,
      deskripsi: "Termasuk tumpukan buku mini, kacamata lepas-pasang, dan kucing pendamping."
    },
    {
      id: "bb-001", nama: "Blind Box Seri Musim Hujan", brand: "Kotak Rahasia",
      kategori: "blind-box", harga: 125000, hargaAsli: null, status: "ready",
      skala: "7 cm", rilis: "Tersedia", stok: 240, terjual: 1580, rating: 4.4,
      art: "box", warna: "#4FB9C9", tag: "Terlaris",
      deskripsi: "12 varian + 1 rahasia. Rare rate tercantum di kemasan, tanpa trik tersembunyi."
    },
    {
      id: "bb-002", nama: "Blind Box Seri Kedai Malam", brand: "Kotak Rahasia",
      kategori: "blind-box", harga: 135000, hargaAsli: null, status: "ready",
      skala: "7 cm", rilis: "Tersedia", stok: 180, terjual: 1120, rating: 4.5,
      art: "box", warna: "#BF8EDA", tag: null,
      deskripsi: "9 varian + 2 rahasia. Tiap figure punya gerobak mini yang bisa disambung."
    },
    {
      id: "bb-003", nama: "Blind Box Seri Hutan Kabut (Set 6)", brand: "Kotak Rahasia",
      kategori: "blind-box", harga: 690000, hargaAsli: 750000, status: "ready",
      skala: "Set isi 6", rilis: "Tersedia", stok: 36, terjual: 402, rating: 4.7,
      art: "box", warna: "#46A171", tag: "Set Lengkap",
      deskripsi: "Beli satu set langsung dapat 6 varian berbeda — dijamin tidak ada yang dobel."
    },
    {
      id: "tc-001", nama: "Booster Box Kartu Legenda Timur", brand: "Kartaverse",
      kategori: "kartu", harga: 1450000, hargaAsli: null, status: "po",
      skala: "36 pack", rilis: "Des 2026", stok: 60, terjual: 288, rating: 4.6,
      art: "box", warna: "#E0B463", tag: "Pre-Order",
      deskripsi: "Booster box tersegel resmi, 36 pack isi 11 kartu. Termasuk 1 kartu promo eksklusif."
    },
    {
      id: "tc-002", nama: "Starter Deck Penjaga Samudra", brand: "Kartaverse",
      kategori: "kartu", harga: 185000, hargaAsli: 215000, status: "ready",
      skala: "60 kartu", rilis: "Tersedia", stok: 95, terjual: 640, rating: 4.3,
      art: "box", warna: "#2AA6C4", tag: "Diskon",
      deskripsi: "Deck siap main untuk pemula, lengkap dengan playmat kertas dan buku aturan."
    },
    {
      id: "ap-001", nama: "Kaos Katun Motif Rasi Mekanik", brand: "Bengkel Kain",
      kategori: "apparel", harga: 195000, hargaAsli: null, status: "ready",
      skala: "S–XXL", rilis: "Tersedia", stok: 150, terjual: 870, rating: 4.5,
      art: "box", warna: "#33475F", tag: null,
      deskripsi: "Katun combed 24s, sablon plastisol tahan lama. Tersedia ukuran S sampai XXL."
    },
    {
      id: "ap-002", nama: "Hoodie Bordir Lambang Guild", brand: "Bengkel Kain",
      kategori: "apparel", harga: 385000, hargaAsli: 450000, status: "ready",
      skala: "M–XXL", rilis: "Tersedia", stok: 62, terjual: 318, rating: 4.7,
      art: "box", warna: "#12294A", tag: "Diskon",
      deskripsi: "Fleece 320 gsm dengan bordir dada dan tali hoodie berujung logam."
    },
    {
      id: "tl-001", nama: "Set Tang Potong & Amplas Presisi", brand: "Rakit Rapi",
      kategori: "tools", harga: 275000, hargaAsli: null, status: "ready",
      skala: "8 pcs", rilis: "Tersedia", stok: 74, terjual: 455, rating: 4.8,
      art: "box", warna: "#7D7A75", tag: "Wajib Punya",
      deskripsi: "Tang potong single-blade, cutter presisi, dan amplas 6 tingkat kekasaran."
    },
    {
      id: "tl-002", nama: "Set Cat Akrilik 12 Warna Dasar", brand: "Rakit Rapi",
      kategori: "tools", harga: 320000, hargaAsli: 365000, status: "ready",
      skala: "12 x 10ml", rilis: "Tersedia", stok: 58, terjual: 372, rating: 4.6,
      art: "box", warna: "#E56458", tag: "Diskon",
      deskripsi: "Cat akrilik berbasis air, aman tanpa ruang khusus. Bisa dipakai kuas maupun airbrush."
    }
  ];

  /* ------------------------------------------------------------------
     Fungsi bantu — dipakai semua halaman
     ------------------------------------------------------------------ */

  /* 2450000 → "Rp2.450.000" */
  function rupiah(angka) {
    return "Rp" + Number(angka || 0).toLocaleString("id-ID");
  }

  function byId(id) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) return products[i];
    }
    return null;
  }

  function namaKategori(slug) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].slug === slug) return categories[i].nama;
    }
    return slug;
  }

  /* Jumlah produk per kategori — untuk angka di chip & filter */
  function jumlahPerKategori(slug) {
    return products.filter(function (p) { return p.kategori === slug; }).length;
  }

  /* Persentase diskon, 0 kalau tidak diskon */
  function persenDiskon(p) {
    if (!p.hargaAsli || p.hargaAsli <= p.harga) return 0;
    return Math.round((1 - p.harga / p.hargaAsli) * 100);
  }

  /* Ambil sebagian produk secara acak tapi stabil (untuk "rekomendasi") */
  function terkait(p, jumlah) {
    return products
      .filter(function (x) { return x.id !== p.id && x.kategori === p.kategori; })
      .concat(products.filter(function (x) { return x.id !== p.id && x.kategori !== p.kategori; }))
      .slice(0, jumlah || 4);
  }

  return {
    categories: categories,
    products: products,
    rupiah: rupiah,
    byId: byId,
    namaKategori: namaKategori,
    jumlahPerKategori: jumlahPerKategori,
    persenDiskon: persenDiskon,
    terkait: terkait
  };
})();
