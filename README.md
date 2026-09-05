# [Your Site Logo] — Figure & Hobby Store

Website e-commerce statis (HTML + CSS + JS murni, **tanpa framework, tanpa build step**).
Buka `index.html` langsung di browser dan langsung jalan.

---

## 📁 Struktur folder

```
otakuben-deployment-test-web/
├── index.html              ← struktur halaman (semua markup di sini)
├── 404.html                ← halaman error
├── favicon.svg             ← ikon tab browser
├── site.webmanifest        ← metadata PWA / install ke homescreen
├── robots.txt              ← untuk SEO (ganti domain di dalamnya)
├── README.md               ← file ini
└── assets/
    ├── css/
    │   ├── base.css        ← 🎨 WARNA & FONT (design token) + reset
    │   ├── header.css      ← header, search bar, ikon aksi, tombol login
    │   ├── components.css  ← card, tombol, pill, chip, toast
    │   ├── sections.css    ← layout hero, banner, kategori, explore, footer
    │   └── responsive.css  ← media query (WAJIB dimuat terakhir)
    ├── js/
    │   ├── auth.js         ← state login/logout + dropdown profil
    │   ├── search.js       ← shortcut Ctrl+K + submit pencarian
    │   ├── showroom.js     ← viewer 360° (ganti-ganti sudut foto)
    │   ├── categories.js   ← chip kategori aktif
    │   └── main.js         ← titik masuk, memanggil semua modul di atas
    └── img/                ← semua ilustrasi SVG (logo, banner, showroom)
```

---

## 🎨 Mau ganti warna? Cukup 1 file

Semua warna hidup di `:root` dalam **`assets/css/base.css`**. Ubah di situ, seluruh
site ikut berubah — nggak perlu cari-cari di file lain.

```css
:root{
  --navy-900:#08172B;   /* warna paling gelap (header, footer) */
  --navy-800:#0C2039;
  --gold:#E0B463;       /* highlight utama / tombol CTA */
  --cyan:#2AA6C4;       /* highlight sekunder */
  --canvas:#F7F7F5;     /* background halaman */
  --ink:#1B2733;        /* warna teks */
  --radius-lg:12px;     /* kelengkungan sudut card */
  --header-h:72px;      /* tinggi header */
  --shell:1180px;       /* lebar maksimal konten */
}
```

---

## ⚙️ Fungsi tiap file JS

| File | Isinya | Cara pakai |
|---|---|---|
| `auth.js` | Ganti state login | `App.auth.login("Muhamad")` → header jadi "Halo, Muhamad". `App.auth.logout()` → balik ke "Masuk / Daftar" |
| `search.js` | Pencarian | `Ctrl+K` / `Cmd+K` fokus ke kolom search. Ganti bagian `GANTI DI SINI` untuk redirect ke halaman hasil |
| `showroom.js` | Viewer 360° | Edit array `VIEWS` untuk pakai foto toko asli (`.jpg`/`.webp` juga bisa) |
| `categories.js` | Chip kategori | Ganti bagian `GANTI DI SINI` untuk memanggil API produk |
| `main.js` | Bootstrap | Menyalakan semua modul + `App.toast("pesan")` untuk notifikasi |

> Semua modul nempel di global `window.App`, **bukan** ES module — jadi tetap jalan
> walau file dibuka lewat `file://` tanpa server.

---

## 🚀 Jalankan lokal

Cara paling gampang — klik dua kali `index.html`. Kalau mau via server lokal:

```bash
git clone https://github.com/lordkizma/otakuben-deployment-test-web.git
cd otakuben-deployment-test-web
python3 -m http.server 8000
# buka http://localhost:8000
```

---

## 🌐 Cara launch

**GitHub Pages** (repo ini)
1. Settings → Pages → Source: `main` / `/ (root)`
2. Tunggu ~1 menit
3. Live di `https://lordkizma.github.io/otakuben-deployment-test-web/`

**Netlify** — buka [app.netlify.com/drop](https://app.netlify.com/drop), drag folder repo. Selesai.

**Vercel**
```bash
npm i -g vercel
vercel --prod
```

**Hosting biasa (cPanel/FTP)** — upload semua isi repo ke `public_html/`.

---

## ✅ Checklist sebelum launch

- [ ] Ganti `[Your Site Logo]` dengan nama brand kamu (di `index.html`, `404.html`, `site.webmanifest`)
- [ ] Ganti `assets/img/logo-mark.svg` + `favicon.svg` dengan logo asli
- [ ] Isi semua `href="#"` dengan URL halaman yang sebenarnya
- [ ] Ganti angka demo (jumlah produk, poin, tanggal event) dengan data asli
- [ ] Ganti domain di `robots.txt`
- [ ] Update `og:image` di `<head>` `index.html` supaya preview share bagus
- [ ] Hubungkan `search.js` dan `categories.js` ke backend/API kamu

---

## 📐 Catatan teknis

- Responsive di 3 breakpoint: **1080px**, **860px**, **720px**
- Mendukung `prefers-reduced-motion` (animasi mati otomatis)
- Kontras teks memenuhi **WCAG AA**, semua target sentuh minimal **44×44px**
- Markup semantik + `skip-link`, `aria-label`, dan `sr-only` untuk screen reader
- Ikon keranjang **sengaja tanpa badge angka** (state kosong)
- Semua ilustrasi berupa SVG buatan sendiri — ringan dan bebas dipakai
