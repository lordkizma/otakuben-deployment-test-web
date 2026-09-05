# Otakuben — Front-End Toko Figure & Hobby

Front-end statis (HTML + CSS + JavaScript murni) untuk toko action figure, gunpla,
nendoroid, blind box, trading card, apparel, dan jasa titip beli dari Jepang.
Belum ada back-end: semua data produk ada di `assets/js/data.js` dan status
keranjang/akun disimpan di `localStorage` browser.

**Live (GitHub Pages):** https://lordkizma.github.io/otakuben-deployment-test-web/

---

## Cara menjalankan

Cukup buka `index.html` di browser. Kalau mau mirip kondisi hosting:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

Deploy = upload semua isi folder ini apa adanya. Tidak butuh build step,
npm install, atau framework.

---

## Struktur folder

```
.
├── index.html            beranda: hero, banner, terlaris, pre-order, kategori
├── katalog.html          daftar produk + filter + sortir
├── produk.html           detail produk (?id=sf-001)
├── keranjang.html        keranjang + kode promo
├── checkout.html         data penerima, kurir, pembayaran, ringkasan
├── masuk.html            masuk / daftar (?mode=daftar)
├── akun.html             pesanan, riwayat, poin, wishlist (#pesanan, #poin, ...)
├── titip-beli.html       form jastip Jepang + estimasi biaya otomatis
├── bantuan.html          FAQ, cara pesan, rincian biaya
├── 404.html              halaman tidak ditemukan
├── favicon.svg  robots.txt  site.webmanifest
└── assets/
    ├── css/   base, components, header, sections, shop, responsive
    ├── js/    modul-modul kecil, satu file satu tanggung jawab
    └── img/   SVG dekoratif & logo
```

## Urutan CSS (jangan diacak)

`base` → `header` → `components` → `sections` → `shop` → `responsive`

`responsive.css` **harus paling akhir** karena isinya media query yang menimpa
aturan di atasnya.

## Urutan JavaScript

Semua file pakai `<script defer>` biasa (bukan ES module) dan menempel ke objek
global `window.App`. Aturan penting: **`main.js` selalu dimuat paling akhir**,
karena hanya `main.js` yang memanggil `init()` tiap modul.

| File | Tugas |
|---|---|
| `data.js` | 24 produk, 8 kategori, format rupiah, helper pencarian |
| `layout.js` | menyuntik header & footer ke `[data-layout-header]` / `[data-layout-footer]` |
| `ui.js` | kartu produk, gambar placeholder, badge, wishlist |
| `cart.js` | isi keranjang, jumlah, subtotal, event `cart:change` |
| `catalog.js` | filter kategori/harga/brand, sortir, hasil |
| `product.js` | galeri, spesifikasi, qty, produk terkait |
| `keranjang.js` | baris keranjang, promo, ringkasan |
| `checkout.js` | validasi form, ongkir, pembuatan nomor invoice |
| `account.js` | tab akun, pesanan, poin, wishlist |
| `titipbeli.js` | hitung estimasi jastip (kurs, fee, ongkir Jepang) |
| `masuk.js` | tab masuk/daftar + validasi |
| `beranda.js` | deret terlaris & pre-order di beranda |
| `auth.js` `search.js` `showroom.js` `categories.js` | header, pencarian, showroom, chip kategori |
| `main.js` | booting semua modul |

## Data tersimpan di browser

| Key `localStorage` | Isi |
|---|---|
| `otaku_cart_v1` | isi keranjang |
| `otaku_wish_v1` | wishlist |
| `otaku_promo_v1` | kode promo aktif |
| `otaku_orders_v1` | pesanan hasil checkout |

Kode promo contoh: `OTAKU10` (diskon 10%), `GRATISKIRIM` (ongkir 0),
`HOBI50K` (potong Rp50.000).

## Catatan gambar

Semua gambar produk digambar oleh kode (gradasi + siluet SVG), bukan foto asli,
supaya repo ringan dan bebas masalah hak cipta. Ganti dengan foto asli lewat
field gambar di `assets/js/data.js` saat produk sungguhan sudah ada.

## Langkah berikutnya (back-end)

1. Ganti `data.js` dengan panggilan API produk.
2. Pindahkan keranjang & pesanan dari `localStorage` ke database + sesi login.
3. Sambungkan pembayaran (Midtrans/Xendit) di `checkout.js`.
4. Buat panel admin untuk stok, harga, dan status pre-order.
