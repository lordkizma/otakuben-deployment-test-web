/* ==========================================================================
   HOME.JS — logika seksi khas beranda Otakuben

   Seksi yang diurus file ini:
     1. BENTO        : tutup kotak yang tergeser saat scroll (GSAP scrub)
     2. RAK BERJALAN : scroll horizontal yang di-pin (GSAP ScrollTrigger)
     3. GACHA        : tarik kapsul → hadiah acak (three.js + anime.js + confetti)
     4. JALUR        : garis produksi yang terisi saat scroll
     5. SUARA        : marquee testimoni dua baris

   Semua bagian punya jalur cadangan kalau library-nya tidak ada.
   ========================================================================== */
window.App = window.App || {};

App.home = (function () {
  "use strict";

  var kurangGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function G() { return window.gsap; }
  function ST() { return window.ScrollTrigger; }

  /* ==================================================================
     1. BENTO — tutup kotak terbuka saat scroll
     ================================================================== */
  function bento() {
    var tutup = document.querySelector("[data-tutup]");
    if (!tutup) return;

    if (!G() || !ST() || kurangGerak) {
      tutup.style.display = "none";
      return;
    }

    G().to(tutup, {
      yPercent: -104,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-bento]",
        start: "top 78%",
        end: "top 22%",
        scrub: 0.6
      }
    });

    // Isi kotak naik sedikit setelah tutupnya lepas
    G().from("[data-bento] .kotak", {
      y: 42,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: "[data-bento]", start: "top 46%", once: true }
    });
  }

  /* ==================================================================
     2. RAK BERJALAN
     ================================================================== */
  var BAY = [
    {
      no: "01",
      label: "Rak Depan",
      judul: "Baru Turun dari Kardus",
      teks: "Barang yang baru selesai dicek kondisinya dan langsung naik rak minggu ini.",
      tautan: "katalog.html",
      pilih: function (semua) {
        return semua.filter(function (p) { return p.status === "ready"; }).slice(0, 2);
      }
    },
    {
      no: "02",
      label: "Rak Favorit",
      judul: "Paling Banyak Dibawa Pulang",
      teks: "Diurut dari yang paling sering masuk keranjang kolektor.",
      tautan: "katalog.html?sort=terlaris",
      pilih: function (semua) {
        return semua.slice().sort(function (a, b) {
          return (b.terjual || 0) - (a.terjual || 0);
        }).slice(0, 2);
      }
    },
    {
      no: "03",
      label: "Rak Kunci",
      judul: "Pre-Order Sedang Dibuka",
      teks: "Slot dibatasi pabrik. Kunci sekarang dengan DP 30% sebelum kuota tutup.",
      tautan: "katalog.html?status=po",
      pilih: function (semua) {
        return semua.filter(function (p) { return p.status === "po"; }).slice(0, 2);
      }
    },
    {
      no: "04",
      label: "Rak Potongan",
      judul: "Turun Harga Pekan Ini",
      teks: "Barang segel yang harganya sedang dipangkas, stok apa adanya.",
      tautan: "katalog.html?diskon=1",
      pilih: function (semua) {
        return semua.filter(function (p) {
          return App.data.persenDiskon(p) > 0;
        }).sort(function (a, b) {
          return App.data.persenDiskon(b) - App.data.persenDiskon(a);
        }).slice(0, 2);
      }
    },
    {
      no: "05",
      label: "Rak Belakang",
      judul: "Sisa Stok Menipis",
      teks: "Kurang dari sepuluh unit di gudang. Kalau sudah habis, tunggu batch berikutnya.",
      tautan: "katalog.html",
      pilih: function (semua) {
        return semua.filter(function (p) {
          return p.status !== "habis" && p.stok <= 10;
        }).slice(0, 2);
      }
    }
  ];

  var PANAH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12h13M12.5 6l6 6-6 6"/></svg>';

  function isiRak() {
    var track = document.querySelector("[data-rak-track]");
    if (!track || !App.data || !App.ui) return;

    var semua = App.data.products;

    track.innerHTML = BAY.map(function (b) {
      var produk = b.pilih(semua);
      var kartu = produk.map(function (p) { return App.ui.kartuProduk(p); }).join("");
      return '' +
        '<article class="bay">' +
          '<span class="ghost" aria-hidden="true">' + b.no + '</span>' +
          '<span class="label">' + b.label + '</span>' +
          '<h3>' + b.judul + '</h3>' +
          '<p>' + b.teks + '</p>' +
          '<div class="isi-bay">' + kartu + '</div>' +
          '<a class="lanjut" href="' + b.tautan + '">Lihat semua di rak ini ' + PANAH + '</a>' +
        '</article>';
    }).join("");
  }

  function rakBerjalan() {
    var viewport = document.querySelector("[data-rak-viewport]");
    var track = document.querySelector("[data-rak-track]");
    var bar = document.querySelector("[data-rak-bar]");
    if (!viewport || !track) return;

    // Tanpa GSAP: cukup scroll horizontal biasa (tetap bisa dipakai)
    if (!G() || !ST() || kurangGerak) {
      if (bar) bar.style.width = "100%";
      return;
    }

    ST().matchMedia({
      // Desktop: seksi di-pin, track bergeser mengikuti scroll
      "(min-width: 861px)": function () {
        var jarak = function () {
          return Math.max(0, track.scrollWidth - window.innerWidth);
        };

        var tween = G().to(track, {
          x: function () { return -jarak(); },
          ease: "none",
          scrollTrigger: {
            trigger: "[data-rak]",
            start: "top top",
            end: function () { return "+=" + (jarak() + window.innerHeight * 0.6); },
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (diri) {
              if (bar) bar.style.width = (8 + diri.progress * 92) + "%";
            }
          }
        });

        return function () {
          if (tween.scrollTrigger) tween.scrollTrigger.kill();
          tween.kill();
          G().set(track, { x: 0 });
        };
      },

      // Mobile: geser pakai jempol, progres ikut posisi scroll
      "(max-width: 860px)": function () {
        function perbarui() {
          var maks = track.scrollWidth - viewport.clientWidth;
          var maju = maks > 0 ? viewport.scrollLeft / maks : 1;
          if (bar) bar.style.width = (8 + maju * 92) + "%";
        }
        viewport.addEventListener("scroll", perbarui, { passive: true });
        perbarui();
        return function () {
          viewport.removeEventListener("scroll", perbarui);
        };
      }
    });
  }

  /* ==================================================================
     3. GACHA KAPSUL
     ================================================================== */
  var KUNCI_GACHA = "otaku_gacha_v1";
  var MAKS_TARIK = 3;

  var TIER = [
    { nama: "Umum", peluang: 60, kode: "GACHA5", potong: "5%", warna: ["#C3CEDA", "#6B7F97"],
      saring: function (p) { return p.harga < 500000; } },
    { nama: "Langka", peluang: 27.5, kode: "GACHA10", potong: "10%", warna: ["#2AA6C4", "#127E9B"],
      saring: function (p) { return p.harga >= 500000 && p.harga < 1500000; } },
    { nama: "Epik", peluang: 10, kode: "GACHA15", potong: "15%", warna: ["#E0B463", "#F6ECD8"],
      saring: function (p) { return p.harga >= 1500000 && p.status !== "po"; } },
    { nama: "Legendaris", peluang: 2.5, kode: "GACHAJP", potong: "gratis ongkir Jepang",
      warna: ["#E0B463", "#2AA6C4", "#FFFFFF"],
      saring: function (p) { return p.harga >= 1500000 && p.status === "po"; } }
  ];

  function sisaTarik() {
    var pakai = 0;
    try { pakai = parseInt(window.sessionStorage.getItem(KUNCI_GACHA) || "0", 10); } catch (e) { pakai = 0; }
    if (isNaN(pakai)) pakai = 0;
    return Math.max(0, MAKS_TARIK - pakai);
  }

  function catatTarik() {
    try {
      var pakai = parseInt(window.sessionStorage.getItem(KUNCI_GACHA) || "0", 10) || 0;
      window.sessionStorage.setItem(KUNCI_GACHA, String(pakai + 1));
    } catch (e) {}
  }

  function tulisSisa() {
    var el = document.querySelector("[data-pull-sisa]");
    if (el) el.textContent = "Sisa tarikan sesi ini: " + sisaTarik() + " / " + MAKS_TARIK;
  }

  function pilihTier() {
    var undi = Math.random() * 100;
    var batas = 0;
    for (var i = 0; i < TIER.length; i++) {
      batas += TIER[i].peluang;
      if (undi <= batas) return TIER[i];
    }
    return TIER[0];
  }

  function pilihHadiah() {
    var tier = pilihTier();
    var kolam = App.data.products.filter(tier.saring);
    if (!kolam.length) {
      tier = TIER[0];
      kolam = App.data.products.filter(tier.saring);
    }
    if (!kolam.length) kolam = App.data.products;
    return {
      tier: tier,
      produk: kolam[Math.floor(Math.random() * kolam.length)]
    };
  }

  function pestaConfetti(warna) {
    if (typeof window.confetti !== "function" || kurangGerak) return;
    var kotak = document.querySelector("[data-gacha-stage]");
    var x = 0.5, y = 0.5;
    if (kotak) {
      var r = kotak.getBoundingClientRect();
      x = (r.left + r.width / 2) / window.innerWidth;
      y = (r.top + r.height / 2) / window.innerHeight;
    }
    window.confetti({
      particleCount: 90,
      spread: 78,
      startVelocity: 34,
      scalar: 0.9,
      origin: { x: x, y: y },
      colors: warna
    });
    window.setTimeout(function () {
      window.confetti({
        particleCount: 45,
        spread: 120,
        startVelocity: 22,
        origin: { x: x, y: y },
        colors: warna
      });
    }, 220);
  }

  function tampilkanHadiah(hasil) {
    var panel = document.querySelector("[data-gacha-hasil]");
    if (!panel) return;
    var p = hasil.produk;

    panel.innerHTML = '' +
      '<span class="judul">' + hasil.tier.nama + ' · kamu dapat</span>' +
      '<div class="nama">' + p.nama + '</div>' +
      '<div class="harga">' + App.data.rupiah(p.harga) + ' · ' + p.brand + '</div>' +
      '<span class="kode">' + hasil.tier.kode + '</span>' +
      '<a class="tautan" href="produk.html?id=' + encodeURIComponent(p.id) + '">Lihat barangnya →</a>' +
      '<p style="margin-top:12px;font-size:12px;color:rgba(255,255,255,.6)">' +
        'Potongan ' + hasil.tier.potong + ', pakai kodenya di halaman keranjang.' +
      '</p>';

    panel.setAttribute("data-tampil", "true");

    if (window.anime && !kurangGerak) {
      window.anime({
        targets: panel,
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 620,
        easing: "easeOutCubic"
      });
      window.anime({
        targets: panel.querySelector(".kode"),
        scale: [0.7, 1.12, 1],
        duration: 720,
        delay: 180,
        easing: "easeOutElastic(1, .5)"
      });
    }

    if (App.toast) App.toast("Kapsul terbuka: " + hasil.tier.nama + "! Kode " + hasil.tier.kode + " aktif.");
  }

  function gacha() {
    var tombol = document.querySelector("[data-gacha-tarik]");
    var ulang = document.querySelector("[data-gacha-ulang]");
    if (!tombol) return;

    tulisSisa();

    var sedang = false;

    tombol.addEventListener("click", function () {
      if (sedang) return;

      if (sisaTarik() <= 0) {
        if (App.motion) App.motion.goyang(tombol);
        if (App.toast) App.toast("Tarikan sesi ini sudah habis. Muat ulang halaman buat main lagi.");
        return;
      }

      sedang = true;
      tombol.disabled = true;
      catatTarik();
      tulisSisa();

      var hasil = pilihHadiah();

      function selesai() {
        pestaConfetti(hasil.tier.warna);
        tampilkanHadiah(hasil);
        sedang = false;
        tombol.disabled = false;
        if (ulang) ulang.hidden = false;
      }

      if (App.home3d && App.home3d.siapKapsul) {
        App.home3d.bukaKapsul(selesai);
      } else {
        // Tanpa three.js: kasih efek getar di panggung lalu langsung tampilkan
        var panggung = document.querySelector("[data-gacha-stage]");
        if (App.motion) App.motion.goyang(panggung);
        window.setTimeout(selesai, 420);
      }
    });

    if (ulang) {
      ulang.addEventListener("click", function () {
        var panel = document.querySelector("[data-gacha-hasil]");
        if (panel) panel.setAttribute("data-tampil", "false");
        if (App.home3d) App.home3d.tutupKapsul();
        ulang.hidden = true;
      });
    }

    // Bar peluang terisi saat seksi terlihat
    var bar = document.querySelectorAll("[data-rate-bar]");
    if (!bar.length) return;

    function isiBar() {
      Array.prototype.forEach.call(bar, function (b) {
        b.style.width = (b.getAttribute("data-rate-bar") || "0") + "%";
      });
    }

    if (G() && ST() && !kurangGerak) {
      ST().create({
        trigger: ".rate",
        start: "top 90%",
        once: true,
        onEnter: function () {
          G().to(bar, {
            width: function (i, el) { return el.getAttribute("data-rate-bar") + "%"; },
            duration: 1.1,
            stagger: 0.1,
            ease: "power3.out"
          });
        }
      });
    } else {
      isiBar();
    }
  }

  /* ==================================================================
     4. JALUR PRODUKSI
     ================================================================== */
  function jalur() {
    var isi = document.querySelector("[data-jalur-isi]");
    var stasiun = document.querySelectorAll("[data-stasiun]");
    if (!isi || !stasiun.length) return;

    if (!G() || !ST() || kurangGerak) {
      isi.style.transform = "scaleY(1)";
      Array.prototype.forEach.call(stasiun, function (s) { s.classList.add("on"); });
      return;
    }

    G().to(isi, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-jalur]",
        start: "top 72%",
        end: "bottom 78%",
        scrub: 0.5
      }
    });

    Array.prototype.forEach.call(stasiun, function (s) {
      ST().create({
        trigger: s,
        start: "top 76%",
        once: true,
        onEnter: function () {
          s.classList.add("on");
          if (window.anime) {
            window.anime({
              targets: s.querySelector(".titik"),
              scale: [0.72, 1.1, 1],
              rotate: [-8, 0],
              duration: 700,
              easing: "easeOutElastic(1, .6)"
            });
          }
        }
      });
    });
  }

  /* ==================================================================
     5. SUARA KOLEKTOR
     ================================================================== */
  var QUOTE = [
    { teks: "Packing-nya lebay dan gw suka. Box figure 1/7 gw sampai tanpa penyok sedikit pun.",
      nama: "Raka W.", kota: "Bandung" },
    { teks: "Titip beli dari Mercari cuma 9 hari sampai rumah. Update fotonya rajin tiap tahap.",
      nama: "Dinda P.", kota: "Surabaya" },
    { teks: "Pre-order gw mundur sebulan, tapi dikabari duluan. Jarang toko sejujur ini.",
      nama: "Bagas S.", kota: "Jakarta" },
    { teks: "Gunpla RG-nya segel, plus dikasih bonus amplas. Langsung repeat order.",
      nama: "Yosi A.", kota: "Semarang" },
    { teks: "Fitur kapsulnya jahat, gw nyangkut setengah jam dan akhirnya checkout.",
      nama: "Fahri N.", kota: "Medan" },
    { teks: "Poin membernya beneran kepakai, dapat potongan buat blind box bulan lalu.",
      nama: "Cindy L.", kota: "Denpasar" }
  ];

  var BINTANG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z"/></svg>';

  function kartuQuote(q) {
    return '' +
      '<blockquote class="quote">' +
        '<div class="bintang" aria-label="5 dari 5">' + BINTANG + BINTANG + BINTANG + BINTANG + BINTANG + '</div>' +
        '<p>“' + q.teks + '”</p>' +
        '<div class="who">' +
          '<span class="av" aria-hidden="true">' + q.nama.charAt(0) + '</span>' +
          '<span><b>' + q.nama + '</b><small>' + q.kota + '</small></span>' +
        '</div>' +
      '</blockquote>';
  }

  function suara() {
    var baris = document.querySelectorAll("[data-suara-baris]");
    if (!baris.length) return;

    Array.prototype.forEach.call(baris, function (track, urut) {
      var daftar = urut === 0 ? QUOTE : QUOTE.slice().reverse();
      track.innerHTML = daftar.map(kartuQuote).join("");
    });

    if (App.motion && App.motion.marquee) {
      App.motion.marquee(baris[0], 52, false);
      if (baris[1]) App.motion.marquee(baris[1], 44, true);
    }
  }

  /* ==================================================================
     6. SUMBER TITIP BELI (marquee kecil di seksi meja)
     ================================================================== */
  var SUMBER = ["Mercari", "Amazon JP", "Surugaya", "Animate", "Yahoo Auction",
    "Rakuten", "Mandarake", "AmiAmi", "Hobby Search"];

  function sumber() {
    var track = document.querySelector("[data-sumber-track]");
    if (!track) return;

    track.innerHTML = SUMBER.map(function (s) {
      return '<span class="item"><span class="dot" aria-hidden="true"></span>' + s + '</span>';
    }).join("");

    if (App.motion && App.motion.marquee) App.motion.marquee(track, 40, false);
  }

  /* ==================================================================
     INIT
     ================================================================== */
  function init() {
    if (document.body.getAttribute("data-page") !== "beranda") return;

    isiRak();
    sumber();
    suara();

    bento();
    rakBerjalan();
    gacha();
    jalur();

    if (App.motion) App.motion.segarkan();
  }

  return {
    init: init,
    sisaTarik: sisaTarik,
    TIER: TIER
  };
})();
