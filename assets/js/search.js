/* ==========================================================================
   SEARCH.JS — perilaku search bar
   - Ctrl+K / Cmd+K untuk fokus ke kolom pencarian
   - Escape untuk mengosongkan kolom
   - Submit form: sekarang hanya demo. Ganti bagian bertanda GANTI DI SINI
     dengan redirect ke halaman hasil pencarian kamu.
   ========================================================================== */

window.App = window.App || {};

App.search = (function () {
  "use strict";

  var form, input;

  function focusInput() {
    if (!input) return;
    input.focus();
    input.select();
  }

  function onSubmit(e) {
    e.preventDefault();
    var q = (input && input.value || "").trim();

    if (!q) {
      focusInput();
      if (App.toast) App.toast("Ketik dulu nama produknya ya.");
      return;
    }

    /* GANTI DI SINI — arahkan ke halaman hasil pencarian, contoh:
       window.location.href = "search.html?q=" + encodeURIComponent(q);
    */
    if (App.toast) App.toast('Mencari “' + q + '”…');
  }

  function init() {
    form = document.querySelector("[data-search-form]");
    input = document.querySelector("[data-search-input]");

    if (form) form.addEventListener("submit", onSubmit);

    document.addEventListener("keydown", function (e) {
      /* Shortcut Ctrl+K (Windows/Linux) atau Cmd+K (Mac) */
      if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === "k") {
        e.preventDefault();
        focusInput();
        return;
      }

      /* Escape mengosongkan kolom saat sedang fokus */
      if (e.key === "Escape" && document.activeElement === input) {
        input.value = "";
      }
    });
  }

  return { init: init, focus: focusInput };
})();
