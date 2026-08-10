/* ===========================================================
   ESCENAS 3D CON THREE.JS
   1) Campo de partículas ambientales (fondo fijo de toda la página)
   2) Anillos dorados 3D girando en el hero
   =========================================================== */
(function () {
  if (typeof THREE === "undefined") {
    console.warn("Three.js no se cargó (sin conexión a internet). La invitación funciona igual, sin los efectos 3D.");
    return;
  }

  const prefiereMenosMovimiento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- textura circular suave para las partículas (efecto bokeh) ---------- */
  function crearTexturaParticula() {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  /* ---------- ESCENA 1: partículas ambientales de fondo (oro + celeste) ---------- */
  function iniciarFondoParticulas() {
    const contenedor = document.getElementById("webgl-bg");
    if (!contenedor) return;

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camara.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contenedor.appendChild(renderer.domElement);

    const cantidad = window.innerWidth < 700 ? 160 : 380;
    const posiciones = new Float32Array(cantidad * 3);
    const colores = new Float32Array(cantidad * 3);
    const colorOro = new THREE.Color(0xd8b877);
    const colorCeleste = new THREE.Color(0x6fc7ea);

    for (let i = 0; i < cantidad; i++) {
      posiciones[i * 3] = (Math.random() - 0.5) * 28;
      posiciones[i * 3 + 1] = (Math.random() - 0.5) * 28;
      posiciones[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = Math.random() > 0.55 ? colorOro : colorCeleste;
      colores[i * 3] = c.r;
      colores[i * 3 + 1] = c.g;
      colores[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(posiciones, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colores, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      map: crearTexturaParticula(),
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const puntos = new THREE.Points(geo, mat);
    escena.add(puntos);

    let mouseX = 0,
      mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });

    window.addEventListener("resize", () => {
      camara.aspect = window.innerWidth / window.innerHeight;
      camara.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animar() {
      requestAnimationFrame(animar);
      if (!prefiereMenosMovimiento) {
        puntos.rotation.y += 0.0006;
        puntos.rotation.x += 0.0002;
        camara.position.x += (mouseX * 1.4 - camara.position.x) * 0.02;
        camara.position.y += (-mouseY * 1.4 - camara.position.y) * 0.02;
        camara.lookAt(escena.position);
      }
      renderer.render(escena, camara);
    }
    animar();
  }

  /* ---------- ESCENA 2: anillos dorados 3D en el hero ---------- */
  function iniciarAnillos3D() {
    const contenedor = document.getElementById("rings-3d-mount");
    if (!contenedor || contenedor.dataset.iniciado) return;
    contenedor.dataset.iniciado = "1";

    const ancho = contenedor.clientWidth || 240;
    const alto = contenedor.clientHeight || 170;

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(45, ancho / alto, 0.1, 100);
    camara.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(ancho, alto);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contenedor.appendChild(renderer.domElement);

    const luzPrincipal = new THREE.PointLight(0xffffff, 1.5);
    luzPrincipal.position.set(4, 4, 6);
    escena.add(luzPrincipal);

    const luzCeleste = new THREE.PointLight(0x6fc7ea, 1.1, 20);
    luzCeleste.position.set(-4, -2, 4);
    escena.add(luzCeleste);

    escena.add(new THREE.AmbientLight(0x445566, 0.7));

    const materialOro = new THREE.MeshStandardMaterial({
      color: 0xd8b877,
      metalness: 0.9,
      roughness: 0.22,
    });

    const anilloA = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.075, 32, 100), materialOro);
    anilloA.position.x = -0.5;
    const anilloB = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.075, 32, 100), materialOro);
    anilloB.position.x = 0.5;
    anilloB.rotation.y = Math.PI / 2.4;

    const grupo = new THREE.Group();
    grupo.add(anilloA, anilloB);
    grupo.rotation.x = 0.35;
    escena.add(grupo);

    window.addEventListener("resize", () => {
      const w = contenedor.clientWidth || 240;
      const h = contenedor.clientHeight || 170;
      camara.aspect = w / h;
      camara.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    function animar() {
      requestAnimationFrame(animar);
      if (!prefiereMenosMovimiento) {
        grupo.rotation.y += 0.006;
      }
      renderer.render(escena, camara);
    }
    animar();
  }

  // el fondo de partículas puede iniciar de inmediato (siempre visible)
  document.addEventListener("DOMContentLoaded", iniciarFondoParticulas);

  // los anillos se inician cuando se abre la invitación (ver script.js)
  window.iniciarAnillos3D = iniciarAnillos3D;
})();
