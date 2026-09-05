/* ==========================================================================
   HOME3D.JS — dua adegan three.js khas Otakuben

   1. VAULT   : "kotak kaca" berisi figure low-poly + debu emas (hero)
   2. KAPSUL  : kapsul gacha yang bisa diputar pakai drag, lalu terbuka

   Aman kalau three.js / WebGL tidak tersedia: canvas disembunyikan dan
   gambar SVG cadangan (.vault-fallback / .gacha-fallback) tetap tampil.
   ========================================================================== */
window.App = window.App || {};

(function () {
  "use strict";

  var kurangGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function adaThree() {
    return typeof window.THREE !== "undefined";
  }

  function bisaWebgl() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  function buatRenderer(canvas) {
    var r = new window.THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    return r;
  }

  /* ==================================================================
     1. VAULT — hero beranda
     ================================================================== */
  var vault = { aktif: false };

  function mulaiVault() {
    var canvas = document.querySelector("[data-vault-canvas]");
    if (!canvas) return;
    var cadangan = document.querySelector(".vault-fallback");

    if (!adaThree() || !bisaWebgl()) {
      canvas.style.display = "none";
      return;
    }

    var T = window.THREE;
    var induk = canvas.parentElement;
    var lebar = induk.clientWidth || 1200;
    var tinggi = induk.clientHeight || 620;

    var renderer;
    try {
      renderer = buatRenderer(canvas);
    } catch (e) {
      canvas.style.display = "none";
      return;
    }
    renderer.setSize(lebar, tinggi, false);

    var scene = new T.Scene();
    var kamera = new T.PerspectiveCamera(42, lebar / tinggi, 0.1, 100);
    kamera.position.set(0, 0.6, 9.2);

    // Kelompok utama biar gampang diputar
    var panggung = new T.Group();
    panggung.position.x = 2.35;
    scene.add(panggung);

    /* --- Kotak kaca (rangka emas + kaca tipis) --- */
    var sisiKaca = new T.Mesh(
      new T.BoxGeometry(3.5, 4.4, 3.5),
      new T.MeshPhysicalMaterial({
        color: 0x2aa6c4,
        transparent: true,
        opacity: 0.08,
        roughness: 0.12,
        metalness: 0
      })
    );
    panggung.add(sisiKaca);

    var rangka = new T.LineSegments(
      new T.EdgesGeometry(new T.BoxGeometry(3.52, 4.42, 3.52)),
      new T.LineBasicMaterial({ color: 0xe0b463, transparent: true, opacity: 0.85 })
    );
    panggung.add(rangka);

    /* --- Alas kotak --- */
    var alas = new T.Mesh(
      new T.CylinderGeometry(1.5, 1.72, 0.34, 36),
      new T.MeshStandardMaterial({ color: 0x0c2039, roughness: 0.55, metalness: 0.35 })
    );
    alas.position.y = -2.05;
    panggung.add(alas);

    /* --- "Figure" low-poly: badan + kepala + jubah --- */
    var figur = new T.Group();
    figur.position.y = -0.35;
    panggung.add(figur);

    var bahanFigur = new T.MeshStandardMaterial({
      color: 0xe0b463,
      roughness: 0.32,
      metalness: 0.62,
      flatShading: true
    });

    var badan = new T.Mesh(new T.ConeGeometry(0.95, 2.3, 7), bahanFigur);
    badan.position.y = -0.35;
    figur.add(badan);

    var kepala = new T.Mesh(new T.IcosahedronGeometry(0.52, 0), bahanFigur);
    kepala.position.y = 1.12;
    figur.add(kepala);

    var jubah = new T.Mesh(
      new T.TorusGeometry(1.15, 0.09, 3, 26),
      new T.MeshStandardMaterial({ color: 0x2aa6c4, roughness: 0.3, metalness: 0.7, flatShading: true })
    );
    jubah.rotation.x = Math.PI / 2.1;
    jubah.position.y = 0.2;
    figur.add(jubah);

    var senjata = new T.Mesh(
      new T.CylinderGeometry(0.045, 0.045, 2.6, 6),
      new T.MeshStandardMaterial({ color: 0xc3ceda, roughness: 0.25, metalness: 0.85 })
    );
    senjata.position.set(0.95, 0.05, 0.1);
    senjata.rotation.z = -0.28;
    figur.add(senjata);

    /* --- Debu emas --- */
    var jumlahDebu = window.innerWidth < 720 ? 220 : 520;
    var posisi = new Float32Array(jumlahDebu * 3);
    for (var i = 0; i < jumlahDebu; i++) {
      posisi[i * 3] = (Math.random() - 0.5) * 16;
      posisi[i * 3 + 1] = (Math.random() - 0.5) * 11;
      posisi[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    var geoDebu = new T.BufferGeometry();
    geoDebu.setAttribute("position", new T.BufferAttribute(posisi, 3));
    var debu = new T.Points(
      geoDebu,
      new T.PointsMaterial({
        color: 0xe0b463,
        size: 0.045,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      })
    );
    scene.add(debu);

    /* --- Cahaya --- */
    scene.add(new T.AmbientLight(0x8fb0d6, 0.75));
    var lampuEmas = new T.PointLight(0xe0b463, 2.4, 26);
    lampuEmas.position.set(4, 5, 5);
    scene.add(lampuEmas);
    var lampuCyan = new T.PointLight(0x2aa6c4, 1.9, 24);
    lampuCyan.position.set(-5, -2, 4);
    scene.add(lampuCyan);

    if (cadangan) cadangan.style.display = "none";
    vault.aktif = true;

    /* --- Interaksi kursor --- */
    var tikusX = 0, tikusY = 0, targetX = 0, targetY = 0;
    if (!kurangGerak) {
      window.addEventListener("mousemove", function (ev) {
        targetX = (ev.clientX / window.innerWidth - 0.5) * 0.85;
        targetY = (ev.clientY / window.innerHeight - 0.5) * 0.5;
      }, { passive: true });
    }

    /* --- Kemiringan mengikuti scroll (GSAP kalau ada) --- */
    if (window.gsap && window.ScrollTrigger && !kurangGerak) {
      window.gsap.to(panggung.rotation, {
        z: 0.24,
        ease: "none",
        scrollTrigger: {
          trigger: ".vault",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      window.gsap.from(panggung.scale, {
        x: 0.55, y: 0.55, z: 0.55,
        duration: 1.6,
        ease: "power3.out"
      });
    }

    /* --- Loop render --- */
    var jalan = true;
    var jam = 0;

    function gambar() {
      if (!jalan) return;
      window.requestAnimationFrame(gambar);
      jam += 0.01;

      tikusX += (targetX - tikusX) * 0.05;
      tikusY += (targetY - tikusY) * 0.05;

      panggung.rotation.y = jam * 0.35 + tikusX;
      panggung.rotation.x = tikusY * 0.4;
      figur.rotation.y = -jam * 0.5;
      figur.position.y = -0.35 + Math.sin(jam * 1.6) * 0.12;
      jubah.rotation.z = jam * 0.7;
      debu.rotation.y = jam * 0.06;
      debu.rotation.x = jam * 0.02;

      renderer.render(scene, kamera);
    }
    gambar();

    // Hemat baterai: berhenti kalau hero tidak kelihatan
    if ("IntersectionObserver" in window) {
      new window.IntersectionObserver(function (entri) {
        var terlihat = entri[0].isIntersecting;
        if (terlihat && !jalan) { jalan = true; gambar(); }
        else if (!terlihat) { jalan = false; }
      }, { threshold: 0.02 }).observe(canvas);
    }

    /* --- Resize --- */
    var jedaResize;
    window.addEventListener("resize", function () {
      window.clearTimeout(jedaResize);
      jedaResize = window.setTimeout(function () {
        var l = induk.clientWidth || 1200;
        var t = induk.clientHeight || 620;
        kamera.aspect = l / t;
        kamera.updateProjectionMatrix();
        renderer.setSize(l, t, false);
      }, 160);
    });
  }

  /* ==================================================================
     2. KAPSUL GACHA
     ================================================================== */
  var kapsul = { aktif: false, atas: null, bawah: null, grup: null, isi: null };

  function mulaiKapsul() {
    var canvas = document.querySelector("[data-gacha-canvas]");
    if (!canvas) return;
    var cadangan = document.querySelector(".gacha-fallback");

    if (!adaThree() || !bisaWebgl()) {
      canvas.style.display = "none";
      return;
    }

    var T = window.THREE;
    var induk = canvas.parentElement;
    var sisi = induk.clientWidth || 440;

    var renderer;
    try {
      renderer = buatRenderer(canvas);
    } catch (e) {
      canvas.style.display = "none";
      return;
    }
    renderer.setSize(sisi, sisi, false);

    var scene = new T.Scene();
    var kamera = new T.PerspectiveCamera(38, 1, 0.1, 60);
    kamera.position.set(0, 0.4, 7.4);

    var grup = new T.Group();
    scene.add(grup);

    // Belahan atas: emas metalik
    var atas = new T.Mesh(
      new T.SphereGeometry(1.62, 44, 24, 0, Math.PI * 2, 0, Math.PI / 2),
      new T.MeshStandardMaterial({
        color: 0xe0b463,
        roughness: 0.22,
        metalness: 0.82,
        side: T.DoubleSide
      })
    );
    grup.add(atas);

    // Belahan bawah: kaca cyan
    var bawah = new T.Mesh(
      new T.SphereGeometry(1.62, 44, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      new T.MeshPhysicalMaterial({
        color: 0x2aa6c4,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.42,
        side: T.DoubleSide
      })
    );
    grup.add(bawah);

    // Cincin pemisah
    var cincin = new T.Mesh(
      new T.TorusGeometry(1.63, 0.055, 10, 60),
      new T.MeshStandardMaterial({ color: 0xf6ecd8, roughness: 0.3, metalness: 0.7 })
    );
    cincin.rotation.x = Math.PI / 2;
    grup.add(cincin);

    // Isi kapsul (kejutan) — disembunyikan dulu
    var isi = new T.Mesh(
      new T.IcosahedronGeometry(0.72, 0),
      new T.MeshStandardMaterial({
        color: 0xf6ecd8,
        roughness: 0.25,
        metalness: 0.5,
        flatShading: true,
        emissive: 0xe0b463,
        emissiveIntensity: 0.35
      })
    );
    isi.scale.set(0.001, 0.001, 0.001);
    grup.add(isi);

    // Dudukan
    var dudukan = new T.Mesh(
      new T.CylinderGeometry(1.25, 1.5, 0.28, 34),
      new T.MeshStandardMaterial({ color: 0x0c2039, roughness: 0.5, metalness: 0.4 })
    );
    dudukan.position.y = -1.95;
    scene.add(dudukan);

    scene.add(new T.AmbientLight(0x9db8d8, 0.8));
    var l1 = new T.PointLight(0xffffff, 2.1, 22);
    l1.position.set(3.4, 4, 5);
    scene.add(l1);
    var l2 = new T.PointLight(0x2aa6c4, 1.5, 20);
    l2.position.set(-4, -1.5, 3);
    scene.add(l2);

    if (cadangan) cadangan.style.display = "none";

    kapsul.aktif = true;
    kapsul.atas = atas;
    kapsul.bawah = bawah;
    kapsul.grup = grup;
    kapsul.isi = isi;

    /* --- Drag untuk memutar --- */
    var seret = false, mulaiX = 0, mulaiRot = 0, putarSendiri = 0.006;

    function turun(x) { seret = true; mulaiX = x; mulaiRot = grup.rotation.y; }
    function geser(x) {
      if (!seret) return;
      grup.rotation.y = mulaiRot + (x - mulaiX) * 0.011;
    }
    function naik() { seret = false; }

    induk.addEventListener("mousedown", function (e) { turun(e.clientX); });
    window.addEventListener("mousemove", function (e) { geser(e.clientX); });
    window.addEventListener("mouseup", naik);
    induk.addEventListener("touchstart", function (e) {
      turun(e.touches[0].clientX);
    }, { passive: true });
    induk.addEventListener("touchmove", function (e) {
      geser(e.touches[0].clientX);
    }, { passive: true });
    induk.addEventListener("touchend", naik);

    /* --- Loop render --- */
    var jalan = true, jam = 0;

    function gambar() {
      if (!jalan) return;
      window.requestAnimationFrame(gambar);
      jam += 0.016;
      if (!seret) grup.rotation.y += putarSendiri;
      grup.position.y = Math.sin(jam) * 0.12;
      isi.rotation.y += 0.02;
      isi.rotation.x += 0.01;
      renderer.render(scene, kamera);
    }
    gambar();

    if ("IntersectionObserver" in window) {
      new window.IntersectionObserver(function (entri) {
        var terlihat = entri[0].isIntersecting;
        if (terlihat && !jalan) { jalan = true; gambar(); }
        else if (!terlihat) { jalan = false; }
      }, { threshold: 0.05 }).observe(canvas);
    }

    var jedaResize;
    window.addEventListener("resize", function () {
      window.clearTimeout(jedaResize);
      jedaResize = window.setTimeout(function () {
        var s = induk.clientWidth || 440;
        renderer.setSize(s, s, false);
      }, 160);
    });
  }

  /* --- Animasi buka kapsul (dipanggil home.js) --- */
  function bukaKapsul(selesai) {
    if (!kapsul.aktif) {
      if (selesai) selesai();
      return;
    }
    var A = window.anime;

    // Tanpa anime.js: langsung geser posisinya
    if (!A || kurangGerak) {
      kapsul.atas.position.y = 1.5;
      kapsul.bawah.position.y = -0.6;
      kapsul.isi.scale.set(1, 1, 1);
      if (selesai) selesai();
      return;
    }

    // Getar dulu, lalu terbelah
    A({
      targets: kapsul.grup.rotation,
      z: [0, 0.16, -0.16, 0.1, 0],
      duration: 620,
      easing: "easeInOutSine",
      complete: function () {
        A({
          targets: kapsul.atas.position,
          y: 1.9,
          duration: 700,
          easing: "easeOutCubic"
        });
        A({
          targets: kapsul.bawah.position,
          y: -0.75,
          duration: 700,
          easing: "easeOutCubic"
        });
        A({
          targets: kapsul.isi.scale,
          x: 1, y: 1, z: 1,
          duration: 760,
          delay: 140,
          easing: "easeOutElastic(1, .55)",
          complete: function () { if (selesai) selesai(); }
        });
      }
    });
  }

  /* --- Kembalikan kapsul ke posisi tertutup --- */
  function tutupKapsul() {
    if (!kapsul.aktif) return;
    var A = window.anime;
    if (!A || kurangGerak) {
      kapsul.atas.position.y = 0;
      kapsul.bawah.position.y = 0;
      kapsul.isi.scale.set(0.001, 0.001, 0.001);
      return;
    }
    A({ targets: kapsul.atas.position, y: 0, duration: 520, easing: "easeInOutCubic" });
    A({ targets: kapsul.bawah.position, y: 0, duration: 520, easing: "easeInOutCubic" });
    A({
      targets: kapsul.isi.scale,
      x: 0.001, y: 0.001, z: 0.001,
      duration: 360,
      easing: "easeInCubic"
    });
  }

  function init() {
    try { mulaiVault(); } catch (e) { /* hero tetap pakai gambar cadangan */ }
    try { mulaiKapsul(); } catch (e) { /* kapsul tetap pakai gambar cadangan */ }
  }

  App.home3d = {
    init: init,
    bukaKapsul: bukaKapsul,
    tutupKapsul: tutupKapsul,
    get siapVault() { return vault.aktif; },
    get siapKapsul() { return kapsul.aktif; }
  };
})();
