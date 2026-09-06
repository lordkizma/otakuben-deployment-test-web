# Otakuben - Front-End Toko Figure & Hobi

Situs statis (HTML + CSS + JS vanilla, tanpa build step) untuk toko figure, gunpla,
merchandise hobi, dan jasa titip beli dari Jepang. Back-end belum ada: semua data
masih dari `assets/js/data.js` dan state disimpan di `localStorage`.

## Versi 3 - lapisan animasi

Beranda dirombak total dengan konsep sendiri ("rak kaca" + "kotak bento koleksi").
Header dan footer sengaja dibiarkan sama seperti versi sebelumnya.

Seksi beranda:

1. **Vault** - hero dengan lemari kaca 3D (three.js) yang ikut gerak mengikuti kursor.
2. **Kotak Bento Koleksi** - grid kategori dengan tutup kotak yang tergeser saat scroll.
3. **Rak Berjalan** - 5 bay produk yang digeser ke samping (tombol, drag, swipe, panah keyboard); scroll halaman tidak dibajak.
4. **Gacha Kapsul** - kapsul 3D bisa diseret, dibuka, keluar hadiah + kode promo (maks 3x per sesi).
5. **Jalur Produksi** - timeline pre-order yang terisi mengikuti scroll.
6. **Meja Kerja** - kartu titip beli (marquee sumber) + kartu poin kolektor.
7. **Suara Kolektor** - dua baris marquee testimoni berlawanan arah.
8. **Explore By Category** - chip kategori.

### Library animasi (semua via CDN)

| Library | Versi | Dipakai untuk |
| --- | --- | --- |
| GSAP + ScrollTrigger | 3.12.5 | reveal, scrub, marquee, kursor, progres geser rak |
| anime.js | 3.2.2 | pop kartu, goyang kapsul, counter angka |
| AOS | 2.3.4 | reveal sederhana pada stasiun jalur & kartu meja |
| Lenis | 1.0.42 | smooth scroll |
| SplitType | 0.3.4 | pecah judul hero jadi per-huruf |
| three.js | 0.149.0 (build UMD) | lemari kaca hero + kapsul gacha |
| canvas-confetti | 1.9.3 | ledakan confetti saat kapsul terbuka |

### Kontrak fallback `.libs-on`

Semua state "disembunyikan dulu" (opacity 0, tutup kotak, dll) ditulis di bawah
selector `html.libs-on`. Class itu **hanya** ditambahkan oleh `assets/js/motion.js`
setelah library CDN terbukti ada. Efeknya:

- CDN gagal / offline -> situs tetap tampil penuh sebagai situs statis biasa.
- `prefers-reduced-motion: reduce` -> `html.motion-off`, animasi berat dimatikan.
- WebGL tidak tersedia -> canvas dilewati, gambar cadangan (`.vault-fallback`,
  `.gacha-fallback`) yang tampil.

## Struktur

```
index.html          beranda (konsep v3)
katalog.html        daftar produk + filter
produk.html         detail produk (?id=sf-001)
keranjang.html      keranjang + promo
checkout.html       alamat, kurir, pembayaran
akun.html           profil, transaksi, wishlist, poin
masuk.html          masuk / daftar
titip-beli.html      estimasi titip beli Jepang
bantuan.html        FAQ & kebijakan
404.html            halaman tidak ditemukan
assets/css/         base, header, components, sections, shop, home, motion, responsive
assets/js/          data, ui, cart, layout, auth, search, + modul per halaman
assets/img/         ilustrasi & pattern SVG
```

### Urutan CSS (penting)

`base -> header -> components -> sections -> shop -> home -> (aos.css) -> motion -> responsive`

### Urutan JS (semua `defer`)

Library CDN -> `data` -> `ui` -> `cart` -> `layout` -> `auth` -> `search` ->
`categories` -> `motion` -> `home3d` -> `home` -> `main`.

`main.js` selalu terakhir karena dia yang memanggil `init()` semua modul, dan tiap
pemanggilan dijaga `if (App.x)` sehingga halaman yang tidak memuat modul tertentu
tetap aman.

## Penyimpanan lokal

| Key | Isi |
| --- | --- |
| `otaku_cart_v1` | isi keranjang |
| `otaku_wish_v1` | wishlist |
| `otaku_promo_v1` | kode promo aktif |
| `otaku_orders_v1` | riwayat pesanan contoh |
| `otaku_intro_v1` | penanda intro sudah tampil (sessionStorage) |
| `otaku_gacha_v1` | jumlah tarikan gacha terpakai (sessionStorage, maks 3) |

## Cara jalanin lokal

```bash
python3 -m http.server 8080
# buka http://localhost:8080
```

Animasi butuh koneksi internet karena library-nya dari CDN. Tanpa internet,
situs tetap terbuka tapi versi statis.

## Deploy (GitHub Pages)

Settings -> Pages -> Source: `Deploy from a branch` -> Branch `main` / folder `/ (root)`.

## Next step (back-end)

- Autentikasi asli (`auth.js` sekarang cuma toggle `data-auth`).
- Katalog & stok dari database, bukan `data.js`.
- Pembayaran (VA / e-wallet / QRIS) + webhook status.
- Ongkir real-time dan pelacakan resi.
- Hadiah gacha + poin kolektor dicatat di server biar tidak bisa dicurangi.
