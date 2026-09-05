/* ==========================================================================
   ACCOUNT.JS — halaman akun (akun.html)

   Menampilkan profil, pesanan berjalan, riwayat, poin reward, dan wishlist.
   Data pesanan diambil dari localStorage (hasil checkout) + beberapa contoh
   bawaan supaya halaman tidak kosong saat pertama dibuka.

   Panel dipilih lewat hash URL: akun.html#pesanan, #poin, #wishlist, #riwayat
   ========================================================================== */

window.App = window.App || {};

App.account = (function () {
  "use strict";

  var ORDER_KEY = "otaku_orders_v1";

  /* Contoh pesanan bawaan — hapus saja kalau backend sudah jalan */
  var CONTOH = [
    {
      kode: "INV-20260828-4471", tanggal: "2026-08-28T10:12:00", status: "kirim",
      total: 2472000, penerima: "Kamu",
      items: [{ id: "sf-001", nama: "Scale Figure Ksatria Fajar 1/7", qty: 1, total: 2450000 }]
    },
    {
      kode: "INV-20260814-2093", tanggal: "2026-08-14T16:40:00", status: "selesai",
      total: 827000, penerima: "Kamu",
      items: [{ id: "gp-002", nama: "Model Kit Benteng Badai RG 1/144", qty: 1, total: 520000 },
              { id: "tl-001", nama: "Set Tang Potong & Amplas Presisi", qty: 1, total: 275000 }]
    },
    {
      kode: "INV-20260731-1180", tanggal: "2026-07-31T09:05:00", status: "selesai",
      total: 447000, penerima: "Kamu",
      items: [{ id: "ch-001", nama: "Chibi Figure Murid Kuil", qty: 1, total: 465000 }]
    }
  ];

  var PANEL = ["profil", "pesanan", "riwayat", "poin", "wishlist"];

  var LABEL_STATUS = {
    proses: { kelas: "status-proses", teks: "Menunggu Pembayaran" },
    kirim: { kelas: "status-kirim", teks: "Sedang Dikirim" },
    selesai: { kelas: "status-selesai", teks: "Selesai" },
    po: { kelas: "status-po", teks: "Pre-Order Aktif" }
  };

  function pesananSemua() {
    var tersimpan = [];
    try {
      tersimpan = JSON.parse(window.localStorage.getItem(ORDER_KEY) || "[]");
    } catch (e) {
      tersimpan = [];
    }
    return tersimpan.concat(CONTOH);
  }

  function tanggalId(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }

  /* ------------------------------------------------------------------
     Kartu pesanan
     ------------------------------------------------------------------ */
  function kartuPesanan(o) {
    var s = LABEL_STATUS[o.status] || LABEL_STATUS.proses;

    var isi = o.items.map(function (it) {
      var p = App.data.byId(it.id);
      return '<div class="pesanan-body">' +
        (p ? App.ui.thumb(p) : "") +
        '<div class="isi"><b>' + it.nama + "</b><span>" + it.qty + " pcs · " +
          App.data.rupiah(it.total) + "</span></div>" +
        (p ? '<a class="btn btn-ghost" style="min-height:38px;font-size:13px" href="produk.html?id=' +
          p.id + '">Beli Lagi</a>' : "") +
      "</div>";
    }).join("");

    return '<div class="pesanan">' +
      '<div class="pesanan-head">' +
        '<div><span class="kode">' + o.kode + '</span> <span class="tgl">· ' + tanggalId(o.tanggal) + "</span></div>" +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<span class="status-pill ' + s.kelas + '">' + s.teks + "</span>" +
          '<span class="nilai" style="font-size:14px;font-weight:750">' + App.data.rupiah(o.total) + "</span>" +
        "</div>" +
      "</div>" +
      isi +
    "</div>";
  }

  /* ------------------------------------------------------------------
     Isi tiap panel
     ------------------------------------------------------------------ */
  function panelProfil() {
    var nama = (App.auth && App.auth.isLoggedIn && App.auth.isLoggedIn())
      ? (document.querySelector("[data-auth-name]") || {}).textContent || "Kolektor"
      : "Kolektor";

    return '<div class="panel">' +
      "<h2>Profil Saya</h2>" +
      '<div class="form-grid" style="margin-top:16px">' +
        '<div class="field"><label for="p-nama">Nama tampilan</label>' +
          '<input class="input" id="p-nama" type="text" value="' + nama + '"></div>' +
        '<div class="field"><label for="p-telp">Nomor WhatsApp</label>' +
          '<input class="input" id="p-telp" type="tel" placeholder="08xxxxxxxxxx"></div>' +
        '<div class="field penuh"><label for="p-email">Email</label>' +
          '<input class="input" id="p-email" type="email" placeholder="nama@email.com"></div>' +
        '<div class="field penuh"><label for="p-alamat">Alamat utama</label>' +
          '<textarea class="textarea" id="p-alamat" placeholder="Alamat pengiriman default"></textarea></div>' +
      "</div>" +
      '<button class="btn btn-primary" type="button" style="margin-top:18px;min-height:44px" ' +
        'data-simpan-profil>Simpan Perubahan</button>' +
      '<p style="margin-top:12px;font-size:12px;color:var(--slate-400)">' +
        "Perubahan belum tersimpan permanen — menunggu backend.</p>" +
    "</div>";
  }

  function panelPesanan() {
    var aktif = pesananSemua().filter(function (o) { return o.status !== "selesai"; });

    if (!aktif.length) {
      return '<div class="panel"><h2>Pesanan Berjalan</h2>' +
        '<div class="kosong" style="margin-top:16px;border:0;padding:36px 12px">' +
          "<h3>Tidak ada pesanan aktif</h3>" +
          "<p>Semua pesanan kamu sudah selesai.</p>" +
          '<a class="btn btn-primary" href="katalog.html">Belanja Lagi</a>' +
        "</div></div>";
    }

    return '<div class="panel">' +
      "<h2>Pesanan Berjalan</h2>" +
      '<p style="margin:6px 0 16px;font-size:13.5px;color:var(--ink-soft)">' +
        aktif.length + " pesanan sedang diproses atau dikirim.</p>" +
      aktif.map(kartuPesanan).join("") +
    "</div>";
  }

  function panelRiwayat() {
    var selesai = pesananSemua().filter(function (o) { return o.status === "selesai"; });

    return '<div class="panel">' +
      "<h2>Riwayat Pembelian</h2>" +
      '<p style="margin:6px 0 16px;font-size:13.5px;color:var(--ink-soft)">' +
        "Total " + selesai.length + " transaksi selesai.</p>" +
      (selesai.length ? selesai.map(kartuPesanan).join("")
        : '<div class="kosong" style="border:0"><h3>Belum ada riwayat</h3>' +
          "<p>Transaksi yang sudah selesai akan muncul di sini.</p></div>") +
    "</div>";
  }

  function panelPoin() {
    var poin = 1250;
    var target = 2000;
    var persen = Math.min(100, Math.round(poin / target * 100));

    return '<div class="kartu-poin">' +
        '<span class="eyebrow" style="color:#6A5527">Member Rewards</span>' +
        '<div class="jumlah"><b>' + poin.toLocaleString("id-ID") + "</b><span>poin tersedia</span></div>" +
        '<div class="bar"><i style="width:' + persen + '%"></i></div>' +
        '<p class="ket">' + (target - poin).toLocaleString("id-ID") +
          " poin lagi untuk naik ke tier Kolektor Emas.</p>" +
      "</div>" +

      '<div class="panel">' +
        "<h2>Cara Kumpulkan Poin</h2>" +
        '<div class="tabel-wrap" style="margin-top:14px">' +
          '<table class="tabel-biaya">' +
            "<thead><tr><th>Aktivitas</th><th>Poin</th></tr></thead>" +
            "<tbody>" +
              "<tr><td>Belanja setiap Rp10.000</td><td><b>+1 poin</b></td></tr>" +
              "<tr><td>Selesaikan pre-order</td><td><b>+150 poin</b></td></tr>" +
              "<tr><td>Ulasan produk dengan foto</td><td><b>+50 poin</b></td></tr>" +
              "<tr><td>Ulang tahun akun</td><td><b>+200 poin</b></td></tr>" +
            "</tbody>" +
          "</table>" +
        "</div>" +
        '<p style="margin-top:14px;font-size:12.5px;color:var(--slate-400)">' +
          "Angka poin di halaman ini masih contoh statis.</p>" +
      "</div>";
  }

  function panelWishlist() {
    var ids = App.ui.wishAmbil();
    var daftar = ids.map(function (id) { return App.data.byId(id); }).filter(Boolean);

    if (!daftar.length) {
      return '<div class="panel"><h2>Wishlist</h2>' +
        '<div class="kosong" style="margin-top:16px;border:0;padding:36px 12px">' +
          "<h3>Wishlist masih kosong</h3>" +
          "<p>Tekan ikon hati di kartu produk untuk menyimpannya di sini.</p>" +
          '<a class="btn btn-primary" href="katalog.html">Cari Barang</a>' +
        "</div></div>";
    }

    return '<div class="panel">' +
      "<h2>Wishlist (" + daftar.length + ")</h2>" +
      '<div class="grid-produk kolom-3" style="margin-top:16px">' + App.ui.grid(daftar) + "</div>" +
    "</div>";
  }

  /* ------------------------------------------------------------------
     Navigasi panel
     ------------------------------------------------------------------ */
  var IKON = {
    profil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.2" r="3.6"/><path d="M4.8 20c.9-3.6 3.8-5.6 7.2-5.6s6.3 2 7.2 5.6"/></svg>',
    pesanan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7l8-4 8 4v10l-8 4-8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg>',
    riwayat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.6 12a8.4 8.4 0 1 0 2.6-6.1M3.4 4.6v4.2h4.2"/><path d="M12 8.2V12l3 1.8"/></svg>',
    poin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10.5h5M9.5 13.5h5"/></svg>',
    wishlist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20z"/></svg>'
  };

  var NAMA_PANEL = {
    profil: "Profil Saya",
    pesanan: "Pesanan Berjalan",
    riwayat: "Riwayat Pembelian",
    poin: "Poin & Reward",
    wishlist: "Wishlist"
  };

  function renderNav(aktif) {
    var nav = document.querySelector("[data-akun-nav]");
    if (!nav) return;

    var namaUser = "Kolektor";
    var tautan = PANEL.map(function (k) {
      return '<a href="#' + k + '" aria-current="' + (k === aktif ? "true" : "false") + '">' +
        IKON[k] + NAMA_PANEL[k] + "</a>";
    }).join("");

    nav.innerHTML =
      '<div class="akun-profil">' +
        '<span class="avatar-besar" aria-hidden="true">' + namaUser.charAt(0) + "</span>" +
        "<div><b>" + namaUser + "</b><span>Member sejak 2026</span></div>" +
      "</div>" + tautan;
  }

  function render() {
    var hash = (window.location.hash || "").replace("#", "");
    var aktif = PANEL.indexOf(hash) > -1 ? hash : "pesanan";

    renderNav(aktif);

    var isi = document.querySelector("[data-akun-isi]");
    if (!isi) return;

    if (aktif === "profil") isi.innerHTML = panelProfil();
    else if (aktif === "pesanan") isi.innerHTML = panelPesanan();
    else if (aktif === "riwayat") isi.innerHTML = panelRiwayat();
    else if (aktif === "poin") isi.innerHTML = panelPoin();
    else if (aktif === "wishlist") isi.innerHTML = panelWishlist();

    App.ui.wishTandai();
  }

  function init() {
    if (!document.querySelector("[data-akun-isi]")) return;

    render();
    window.addEventListener("hashchange", render);

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-simpan-profil]")) {
        if (App.toast) App.toast("Perubahan profil disimpan sementara di browser.");
      }
    });
  }

  return { init: init };
})();
