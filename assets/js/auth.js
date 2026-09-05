/* ==========================================================================
   AUTH.JS — state login/logout + dropdown profil

   Default halaman = BELUM login (body[data-auth="out"]) → tombol "Masuk / Daftar".
   Untuk simulasi/integrasi backend:
     App.auth.login("Muhamad")   // jadi "Halo, Muhamad" + avatar dropdown
     App.auth.logout()           // balik ke tombol "Masuk / Daftar"
     App.auth.isLoggedIn()       // true / false
   ========================================================================== */

window.App = window.App || {};

App.auth = (function () {
  "use strict";

  var body, toggleBtn, menu, nameEl, initialEl, loginTrigger, logoutLink;

  /* Buka / tutup dropdown profil */
  function setMenu(open) {
    if (!menu || !toggleBtn) return;
    menu.dataset.open = open ? "true" : "false";
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function toggleMenu() {
    setMenu(menu.dataset.open !== "true");
  }

  /* Aktifkan state "sudah login" */
  function login(name) {
    var displayName = (name || "Nama User").trim();
    if (nameEl) nameEl.textContent = displayName;
    if (initialEl) initialEl.textContent = displayName.charAt(0).toUpperCase();
    body.dataset.auth = "in";
    setMenu(false);
  }

  /* Balik ke state default */
  function logout() {
    body.dataset.auth = "out";
    setMenu(false);
  }

  function isLoggedIn() {
    return body.dataset.auth === "in";
  }

  function init() {
    body = document.body;
    toggleBtn = document.querySelector("[data-auth-toggle]");
    menu = document.querySelector("[data-auth-menu]");
    nameEl = document.querySelector("[data-auth-name]");
    initialEl = document.querySelector("[data-auth-initial]");
    loginTrigger = document.querySelector("[data-login-trigger]");
    logoutLink = document.querySelector("[data-logout]");

    /* Klik tombol profil → buka dropdown */
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleMenu();
      });
    }

    /* Tombol "Masuk / Daftar".
       GANTI baris di dalam if() ini dengan redirect ke halaman login kamu,
       misal: window.location.href = "login.html";
       Sekarang dipakai untuk demo state login. */
    if (loginTrigger) {
      loginTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        if (App.toast) App.toast("Demo: state login diaktifkan.");
        login("Nama User");
      });
    }

    if (logoutLink) {
      logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        logout();
        if (App.toast) App.toast("Kamu sudah keluar.");
      });
    }

    /* Tutup dropdown saat klik di luar */
    document.addEventListener("click", function (e) {
      if (!menu || menu.dataset.open !== "true") return;
      if (e.target.closest("[data-auth-menu]") || e.target.closest("[data-auth-toggle]")) return;
      setMenu(false);
    });

    /* Tutup dropdown dengan tombol Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  return { init: init, login: login, logout: logout, isLoggedIn: isLoggedIn };
})();
