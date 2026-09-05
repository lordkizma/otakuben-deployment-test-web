/* ==========================================================================
   MOTION.JS — lapisan animasi global Otakuben

   Library yang dipakai (semua lewat CDN, lihat tag <script> di HTML):
   - GSAP + ScrollTrigger : reveal, pin, scrub, marquee, magnet, parallax
   - Lenis                : smooth scroll
   - anime.js             : counter angka, micro-interaction, pop
   - AOS                  : reveal sederhana pakai atribut data-aos
   - SplitType            : pecah judul jadi per huruf

   PRINSIP: kalau satu library gagal load, fungsinya dilewati.
   Situs tetap tampil normal karena semua state "sembunyi" ada di
   assets/css/motion.css di bawah selector .libs-on.
   ========================================================================== */
window.App = window.App || {};

(function () {
  "use strict";

  var akar = document.documentElement;
  var kurangGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var layarSentuh = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // Catatan library yang berhasil dimuat
  var ada = {
    gsap: false,
    scrollTrigger: false,
    lenis: false,
    anime: false,
    aos: false,
    split: false,
    three: false,
    confetti: false
  };

  function cekLibrary() {
    ada.gsap = typeof window.gsap !== "undefined";
    ada.scrollTrigger = ada.gsap && typeof window.ScrollTrigger !== "undefined";
    ada.lenis = typeof window.Lenis !== "undefined";
    ada.anime = typeof window.anime !== "undefined";
    ada.aos = typeof window.AOS !== "undefined";
    ada.split = typeof window.SplitType !== "undefined";
    ada.three = typeof window.THREE !== "undefined";
    ada.confetti = typeof window.confetti !== "undefined";
    return ada;
  }

  /* ------------------------------------------------------------------
     1. SMOOTH SCROLL (Lenis) + jembatan ke ScrollTrigger
     ------------------------------------------------------------------ */
  var lenis = null;

  function siapkanLenis() {
    if (!ada.lenis || !ada.gsap || kurangGerak) return;
    try {
      lenis = new window.Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6
      });

      if (ada.scrollTrigger) {
        lenis.on("scroll", window.ScrollTrigger.update);
      }
      window.gsap.ticker.add(function (waktu) {
        lenis.raf(waktu * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);

      // Semua link #anchor ikut smooth
      document.addEventListener("click", function (ev) {
        var a = ev.target.closest('a[href^="#"]');
        if (!a) return;
        var id = a.getAttribute("href");
        if (!id || id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        ev.preventDefault();
        lenis.scrollTo(target, { offset: -110, duration: 1.1 });
      });
    } catch (e) {
      lenis = null;
    }
  }

  /* ------------------------------------------------------------------
     2. PROGRESS BAR BACA
     ------------------------------------------------------------------ */
  function siapkanProgress() {
    if (!ada.gsap || !ada.scrollTrigger) return;
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    window.gsap.to(bar, {
      width: "100%",
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
    });
  }

  /* ------------------------------------------------------------------
     3. KURSOR SOROT + TOMBOL MAGNET
     ------------------------------------------------------------------ */
  function siapkanKursor() {
    if (!ada.gsap || kurangGerak || layarSentuh) return;

    var sorot = document.createElement("div");
    sorot.className = "spot";
    document.body.appendChild(sorot);

    var keX = window.gsap.quickTo(sorot, "x", { duration: 0.35, ease: "power3.out" });
    var keY = window.gsap.quickTo(sorot, "y", { duration: 0.35, ease: "power3.out" });

    window.addEventListener("mousemove", function (ev) {
      sorot.classList.add("hidup");
      keX(ev.clientX);
      keY(ev.clientY);
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
      sorot.classList.remove("hidup");
    });

    // Membesar saat lewat elemen yang bisa diklik
    var pemicu = "a, button, .kotak, .p-card, .chip, .quote, .gacha-stage";
    document.addEventListener("mouseover", function (ev) {
      if (ev.target.closest(pemicu)) sorot.classList.add("besar");
    });
    document.addEventListener("mouseout", function (ev) {
      if (ev.target.closest(pemicu)) sorot.classList.remove("besar");
    });
  }

  function siapkanMagnet() {
    if (!ada.gsap || kurangGerak || layarSentuh) return;
    var daftar = document.querySelectorAll(".magnet");
    Array.prototype.forEach.call(daftar, function (el) {
      var ke = {
        x: window.gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }),
        y: window.gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" })
      };
      el.addEventListener("mousemove", function (ev) {
        var kotak = el.getBoundingClientRect();
        ke.x((ev.clientX - kotak.left - kotak.width / 2) * 0.28);
        ke.y((ev.clientY - kotak.top - kotak.height / 2) * 0.34);
      });
      el.addEventListener("mouseleave", function () {
        ke.x(0);
        ke.y(0);
      });
    });
  }

  /* ------------------------------------------------------------------
     4. REVEAL SAAT SCROLL
     data-reveal="naik|samping|skala|tirai"  data-reveal-delay="0.1"
     ------------------------------------------------------------------ */
  var AWAL = {
    naik: { y: 46, opacity: 0 },
    samping: { x: -40, opacity: 0 },
    skala: { scale: 0.92, opacity: 0 },
    tirai: { y: 70, opacity: 0, rotateX: -12 }
  };

  function tandaiOtomatis() {
    // Halaman non-beranda ikut dapat reveal tanpa perlu ubah HTML-nya
    var target = document.querySelectorAll(
      ".page-head, .panel, .p-card, .langkah-kartu, .section-head, " +
      ".baris-keranjang, .akun-nav, .faq, .tabel-wrap, .detail-info, .filter-panel"
    );
    Array.prototype.forEach.call(target, function (el) {
      if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "naik");
    });
  }

  function siapkanReveal() {
    if (!ada.gsap || !ada.scrollTrigger) return;
    if (kurangGerak) return;

    var daftar = document.querySelectorAll("[data-reveal]");
    Array.prototype.forEach.call(daftar, function (el) {
      var jenis = el.getAttribute("data-reveal") || "naik";
      var awal = AWAL[jenis] || AWAL.naik;
      var tunda = parseFloat(el.getAttribute("data-reveal-delay") || "0");

      window.gsap.fromTo(el, awal, {
        y: 0,
        x: 0,
        scale: 1,
        rotateX: 0,
        opacity: 1,
        duration: 0.85,
        delay: tunda,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    // Grup yang muncul berurutan
    var grup = document.querySelectorAll("[data-stagger]");
    Array.prototype.forEach.call(grup, function (wadah) {
      var anak = wadah.children;
      if (!anak.length) return;
      window.gsap.fromTo(anak, { y: 34, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: wadah, start: "top 86%", once: true }
      });
    });
  }

  /* ------------------------------------------------------------------
     5. JUDUL DIPECAH PER HURUF (SplitType + GSAP)
     ------------------------------------------------------------------ */
  function siapkanSplit() {
    if (!ada.split || !ada.gsap || kurangGerak) return;
    var daftar = document.querySelectorAll("[data-split]");
    Array.prototype.forEach.call(daftar, function (el) {
      try {
        var pecah = new window.SplitType(el, { types: "chars,words" });
        el.classList.add("split");
        window.gsap.from(pecah.chars, {
          yPercent: 118,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.018,
          delay: parseFloat(el.getAttribute("data-split-delay") || "0.15")
        });
      } catch (e) { /* judul tetap tampil apa adanya */ }
    });
  }

  /* ------------------------------------------------------------------
     6. COUNTER ANGKA (anime.js)
     <b data-hitung="1482" data-hitung-akhir="+">0</b>
     ------------------------------------------------------------------ */
  function hitungAngka(el) {
    var tujuan = parseFloat(el.getAttribute("data-hitung") || "0");
    var akhiran = el.getAttribute("data-hitung-akhir") || "";
    var desimal = parseInt(el.getAttribute("data-hitung-desimal") || "0", 10);

    if (!ada.anime || kurangGerak) {
      el.textContent = tujuan.toLocaleString("id-ID") + akhiran;
      return;
    }
    var obj = { n: 0 };
    window.anime({
      targets: obj,
      n: tujuan,
      duration: 1500,
      easing: "easeOutExpo",
      round: desimal ? Math.pow(10, desimal) : 1,
      update: function () {
        el.textContent = Number(obj.n).toLocaleString("id-ID") + akhiran;
      }
    });
  }

  function siapkanCounter() {
    var daftar = document.querySelectorAll("[data-hitung]");
    if (!daftar.length) return;

    if (!ada.scrollTrigger || !ada.gsap) {
      Array.prototype.forEach.call(daftar, hitungAngka);
      return;
    }
    Array.prototype.forEach.call(daftar, function (el) {
      window.ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: function () { hitungAngka(el); }
      });
    });
  }

  /* ------------------------------------------------------------------
     7. MARQUEE TAK BERUJUNG (GSAP)
     ------------------------------------------------------------------ */
  function marquee(track, kecepatan, arahKanan) {
    if (!track) return;
    if (!ada.gsap || kurangGerak) return;

    // Duplikat isi biar sambungannya mulus
    var asli = track.innerHTML;
    track.innerHTML = asli + asli;

    var jarak = track.scrollWidth / 2;
    if (!jarak) return;

    var tl = window.gsap.to(track, {
      x: arahKanan ? jarak : -jarak,
      duration: jarak / (kecepatan || 55),
      ease: "none",
      repeat: -1,
      modifiers: {
        x: function (nilai) {
          var v = parseFloat(nilai);
          return (arahKanan ? v - jarak : v % jarak) + "px";
        }
      }
    });

    if (arahKanan) window.gsap.set(track, { x: -jarak });

    track.parentElement.addEventListener("mouseenter", function () { tl.timeScale(0.18); });
    track.parentElement.addEventListener("mouseleave", function () { tl.timeScale(1); });
  }

  function siapkanMarquee() {
    var daftar = document.querySelectorAll("[data-marquee]");
    Array.prototype.forEach.call(daftar, function (track) {
      marquee(
        track,
        parseFloat(track.getAttribute("data-marquee-speed") || "55"),
        track.getAttribute("data-marquee-arah") === "kanan"
      );
    });
  }

  /* ------------------------------------------------------------------
     8. PARALLAX RINGAN
     ------------------------------------------------------------------ */
  function siapkanParallax() {
    if (!ada.gsap || !ada.scrollTrigger || kurangGerak) return;
    var daftar = document.querySelectorAll("[data-parallax]");
    Array.prototype.forEach.call(daftar, function (el) {
      var kuat = parseFloat(el.getAttribute("data-parallax") || "0.15");
      window.gsap.to(el, {
        yPercent: kuat * 100,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ------------------------------------------------------------------
     9. INTRO "TUTUP KOTAK BENTO" (sekali per sesi)
     ------------------------------------------------------------------ */
  var KUNCI_INTRO = "otaku_intro_v1";

  function siapkanIntro() {
    var intro = document.querySelector("[data-intro]");
    if (!intro) return;
    if (!ada.gsap || kurangGerak) return;

    var pernah = false;
    try { pernah = window.sessionStorage.getItem(KUNCI_INTRO) === "1"; } catch (e) { pernah = false; }
    if (pernah) return;

    intro.setAttribute("data-aktif", "true");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();

    var tl = window.gsap.timeline({
      onComplete: function () {
        intro.setAttribute("data-aktif", "false");
        document.body.style.overflow = "";
        if (lenis) lenis.start();
        try { window.sessionStorage.setItem(KUNCI_INTRO, "1"); } catch (e) {}
        if (ada.scrollTrigger) window.ScrollTrigger.refresh();
      }
    });

    tl.from(intro.querySelectorAll(".intro-teks"), {
      opacity: 0,
      y: 14,
      duration: 0.45,
      stagger: 0.06,
      ease: "power2.out"
    })
      .to(intro.querySelectorAll(".intro-teks"), {
        opacity: 0,
        duration: 0.3,
        delay: 0.35,
        ease: "power1.in"
      })
      .to(intro.querySelector(".intro-lid.atas"), {
        yPercent: -100,
        duration: 0.75,
        ease: "power4.inOut"
      }, "buka")
      .to(intro.querySelector(".intro-lid.bawah"), {
        yPercent: 100,
        duration: 0.75,
        ease: "power4.inOut"
      }, "buka");
  }

  /* ------------------------------------------------------------------
     10. HELPER UNTUK MODUL LAIN
     ------------------------------------------------------------------ */
  function pop(el, skala) {
    if (!el) return;
    if (!ada.anime || kurangGerak) return;
    window.anime.remove(el);
    window.anime({
      targets: el,
      scale: [1, skala || 1.22, 1],
      duration: 520,
      easing: "easeOutElastic(1, .6)"
    });
  }

  function goyang(el) {
    if (!el || !ada.anime || kurangGerak) return;
    window.anime.remove(el);
    window.anime({
      targets: el,
      translateX: [0, -7, 7, -5, 5, 0],
      duration: 460,
      easing: "easeInOutSine"
    });
  }

  function segarkan() {
    if (ada.scrollTrigger) window.ScrollTrigger.refresh();
    if (ada.aos && window.AOS.refresh) window.AOS.refresh();
  }

  /* ------------------------------------------------------------------
     11. INIT
     ------------------------------------------------------------------ */
  function init() {
    cekLibrary();

    // Tidak ada library sama sekali -> biarkan situs statis, tanpa .libs-on
    if (!ada.gsap && !ada.anime && !ada.aos) return;

    akar.classList.add("libs-on");
    if (kurangGerak) akar.classList.add("motion-off");

    if (ada.scrollTrigger) {
      try { window.gsap.registerPlugin(window.ScrollTrigger); } catch (e) {}
    }

    siapkanLenis();
    siapkanProgress();
    siapkanKursor();
    siapkanMagnet();
    tandaiOtomatis();
    siapkanReveal();
    siapkanSplit();
    siapkanCounter();
    siapkanMarquee();
    siapkanParallax();
    siapkanIntro();

    if (ada.aos) {
      try {
        window.AOS.init({
          duration: 700,
          easing: "ease-out-cubic",
          once: true,
          offset: 60,
          disable: kurangGerak
        });
      } catch (e) {}
    }

    // Kalau keranjang berubah, ikon keranjang ikut memantul
    document.addEventListener("cart:change", function () {
      var ikon = document.querySelector("[data-cart]");
      if (ikon) pop(ikon, 1.16);
    });

    window.addEventListener("load", segarkan);
  }

  App.motion = {
    init: init,
    ada: ada,
    cekLibrary: cekLibrary,
    pop: pop,
    goyang: goyang,
    marquee: marquee,
    hitungAngka: hitungAngka,
    segarkan: segarkan,
    kurangGerak: kurangGerak,
    get lenis() { return lenis; }
  };
})();
