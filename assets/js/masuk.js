/* ==========================================================================
   MASUK.JS — halaman masuk & daftar (masuk.html)

   Belum ada autentikasi nyata. Validasi hanya di sisi browser, lalu
   status login disimpan lewat App.auth.login(nama) supaya header berubah
   jadi "Halo, [Nama]".

   Kalau backend sudah siap:
     ganti bagian sukses() dengan fetch("/api/login", {...}) lalu
     lanjutkan App.auth.login(namaDariServer).
   ========================================================================== */

window.App = window.App || {};

App.masuk = (function () {
  "use strict";

  /* ------------------------------------------------------------------
     Pindah tab
     ------------------------------------------------------------------ */
  function pilihTab(nama) {
    document.querySelectorAll("[data-tab]").forEach(function (t) {
      t.setAttribute("aria-selected", t.getAttribute("data-tab") === nama ? "true" : "false");
    });
    document.querySelectorAll("[data-panel]").forEach(function (p) {
      p.hidden = p.getAttribute("data-panel") !== nama;
    });
  }

  /* ------------------------------------------------------------------
     Validasi
     ------------------------------------------------------------------ */
  function tandai(input, pesan) {
    var wadah = input.closest(".field");
    if (!wadah) return;
    var lama = wadah.querySelector(".galat");

    if (pesan) {
      wadah.setAttribute("data-galat", "true");
      if (!lama) {
        var s = document.createElement("span");
        s.className = "galat";
        s.textContent = pesan;
        wadah.appendChild(s);
      } else {
        lama.textContent = pesan;
      }
    } else {
      wadah.removeAttribute("data-galat");
      if (lama) lama.remove();
    }
  }

  function validasi(form, mode) {
    var galat = 0;

    var email = form.elements.email;
    var isiEmail = (email.value || "").trim();
    if (!isiEmail) { tandai(email, "Email wajib diisi."); galat++; }
    else if (isiEmail.indexOf("@") < 1 || isiEmail.indexOf(".") < 0) {
      tandai(email, "Format email belum benar."); galat++;
    } else tandai(email, null);

    var sandi = form.elements.sandi;
    var isiSandi = sandi.value || "";
    if (!isiSandi) { tandai(sandi, "Kata sandi wajib diisi."); galat++; }
    else if (isiSandi.length < 6) { tandai(sandi, "Minimal 6 karakter."); galat++; }
    else tandai(sandi, null);

    if (mode === "daftar") {
      var nama = form.elements.nama;
      if (!(nama.value || "").trim()) { tandai(nama, "Nama wajib diisi."); galat++; }
      else tandai(nama, null);

      var ulang = form.elements.ulang;
      if ((ulang.value || "") !== isiSandi) {
        tandai(ulang, "Kata sandi tidak sama."); galat++;
      } else tandai(ulang, null);

      if (!form.elements.setuju.checked) {
        galat++;
        if (App.toast) App.toast("Centang dulu persetujuan syarat & ketentuan.");
      }
    }

    return galat === 0;
  }

  /* ------------------------------------------------------------------
     Sukses → aktifkan status login lalu kembali ke beranda
     ------------------------------------------------------------------ */
  function sukses(namaUser) {
    if (App.auth && App.auth.login) App.auth.login(namaUser);
    if (App.toast) App.toast("Berhasil masuk. Selamat datang, " + namaUser + "!");

    window.setTimeout(function () {
      var tujuan = new URLSearchParams(window.location.search).get("next");
      window.location.href = tujuan || "index.html";
    }, 900);
  }

  /* Ambil nama tampilan dari email, mis. "budi.santoso@mail.com" → "Budi" */
  function namaDariEmail(email) {
    var depan = (email.split("@")[0] || "Kolektor").split(/[._-]/)[0];
    return depan.charAt(0).toUpperCase() + depan.slice(1);
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    if (!document.querySelector("[data-panel]")) return; /* bukan halaman masuk */

    /* Buka tab sesuai URL: masuk.html?mode=daftar */
    var mode = new URLSearchParams(window.location.search).get("mode");
    pilihTab(mode === "daftar" ? "daftar" : "masuk");

    document.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-tab]");
      if (tab) {
        e.preventDefault();
        pilihTab(tab.getAttribute("data-tab"));
      }

      var pindah = e.target.closest("[data-pindah-tab]");
      if (pindah) {
        e.preventDefault();
        pilihTab(pindah.getAttribute("data-pindah-tab"));
      }

      if (e.target.closest("[data-sosial]")) {
        e.preventDefault();
        if (App.toast) App.toast("Login pihak ketiga menyusul setelah backend aktif.");
      }
    });

    /* Form masuk */
    var formMasuk = document.querySelector("[data-form-masuk]");
    if (formMasuk) {
      formMasuk.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validasi(formMasuk, "masuk")) return;
        sukses(namaDariEmail(formMasuk.elements.email.value.trim()));
      });
    }

    /* Form daftar */
    var formDaftar = document.querySelector("[data-form-daftar]");
    if (formDaftar) {
      formDaftar.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validasi(formDaftar, "daftar")) return;
        sukses(formDaftar.elements.nama.value.trim().split(" ")[0]);
      });
    }
  }

  return { init: init, pilihTab: pilihTab };
})();
