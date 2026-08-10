/* ===========================================================
   INVITACIÓN DE BODA — LÓGICA
   =========================================================== */

// ---------- CONFIGURACIÓN (edita aquí) ----------
const CONFIG = {
  fechaBoda: "2026-11-14T16:00:00",       // fecha y hora de la ceremonia
  telefonoWhatsApp: "59177241359",         // número de WhatsApp para RSVP (código país + número, sin +)
  tituloEvento: "Boda de Jhelmy & Victor",
  lugarEvento: "Iglesia Nuestra Señora del Carmen",
};

// ---------- PERSONALIZACIÓN POR URL (?nombre=Julio&pases=2) ----------
(function personalizar(){
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre");
  const pases = params.get("pases");

  if (nombre) {
    const elNombre = document.getElementById("nombreInvitado");
    if (elNombre) elNombre.textContent = decodeURIComponent(nombre);
    const rsvpNombre = document.getElementById("rsvpNombre");
    if (rsvpNombre) rsvpNombre.value = decodeURIComponent(nombre);
  }
  if (pases) {
    const elPases = document.getElementById("numPases");
    if (elPases) elPases.textContent = pases;
  }
})();

// ---------- ABRIR INVITACIÓN (sello) ----------
const btnAbrir = document.getElementById("btnAbrir");
const portada = document.getElementById("portada");
const invitacion = document.getElementById("invitacion");

btnAbrir.addEventListener("click", () => {
  portada.style.transition = "opacity .6s ease";
  portada.style.opacity = "0";
  setTimeout(() => {
    portada.style.display = "none";
    invitacion.classList.remove("oculto");
    iniciarRevelado();
    intentarReproducirMusica();
    if (window.iniciarAnillos3D) window.iniciarAnillos3D();
  }, 600);
});

// ---------- CONTADOR REGRESIVO ----------
function actualizarContador(){
  const objetivo = new Date(CONFIG.fechaBoda).getTime();
  const ahora = new Date().getTime();
  const diff = objetivo - ahora;

  const dias = document.getElementById("dias");
  const horas = document.getElementById("horas");
  const minutos = document.getElementById("minutos");
  const segundos = document.getElementById("segundos");
  if (!dias) return;

  if (diff <= 0) {
    dias.textContent = horas.textContent = minutos.textContent = segundos.textContent = "00";
    return;
  }
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const m = Math.floor((diff % (1000*60*60)) / (1000*60));
  const s = Math.floor((diff % (1000*60)) / 1000);

  dias.textContent = String(d).padStart(2,"0");
  horas.textContent = String(h).padStart(2,"0");
  minutos.textContent = String(m).padStart(2,"0");
  segundos.textContent = String(s).padStart(2,"0");
}
setInterval(actualizarContador, 1000);
actualizarContador();

// ---------- AGENDAR EN GOOGLE CALENDAR ----------
(function generarLinkCalendario(){
  const btn = document.getElementById("btnCalendario");
  if (!btn) return;
  const inicio = new Date(CONFIG.fechaBoda);
  const fin = new Date(inicio.getTime() + 5*60*60*1000); // +5 horas de duración estimada

  const formato = (f) => f.toISOString().replace(/[-:]/g,"").split(".")[0] + "Z";

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", CONFIG.tituloEvento);
  url.searchParams.set("dates", `${formato(inicio)}/${formato(fin)}`);
  url.searchParams.set("location", CONFIG.lugarEvento);
  url.searchParams.set("details", "¡Nos encantaría contar contigo en nuestra boda!");

  btn.href = url.toString();
  btn.target = "_blank";
  btn.rel = "noopener";
})();

// ---------- REVELADO AL HACER SCROLL (con efecto cascada) ----------
function iniciarRevelado(){
  const elementos = document.querySelectorAll(".reveal");
  const contadorPorPadre = new Map();

  elementos.forEach(el => {
    const padre = el.parentElement;
    const n = contadorPorPadre.get(padre) || 0;
    contadorPorPadre.set(padre, n + 1);
    el.style.transitionDelay = Math.min(n * 90, 450) + "ms";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elementos.forEach(el => observer.observe(el));
}

// ---------- CRISTALES 3D CAYENDO ----------
function crearPetalo(){
  const cont = document.getElementById("petals-container");
  if (!cont) return;
  const petalo = document.createElement("div");
  petalo.className = "petal";
  const tam = 8 + Math.random()*10;
  petalo.style.left = Math.random() * 100 + "vw";
  petalo.style.width = tam + "px";
  petalo.style.height = tam + "px";
  petalo.style.animationDuration = (7 + Math.random()*6) + "s";
  petalo.style.setProperty("--giro-x", (Math.random()*360) + "deg");
  petalo.style.setProperty("--giro-y", (Math.random()*360) + "deg");
  cont.appendChild(petalo);
  setTimeout(() => petalo.remove(), 14000);
}
setInterval(crearPetalo, 1800);

// ---------- TARJETAS CON EFECTO 3D (tilt al mover el mouse) ----------
function iniciarTilt3D(){
  const tarjetas = document.querySelectorAll(".tilt-3d");
  tarjetas.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateY(0) rotateX(0) translateZ(0)";
    });
  });
}
iniciarTilt3D();

// ---------- CURSOR PREMIUM (solo escritorio) ----------
(function cursorPremium(){
  const esDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!esDesktop) return;

  const punto = document.querySelector(".cursor-punto");
  const brillo = document.querySelector(".cursor-brillo");
  if (!punto || !brillo) return;

  document.body.classList.add("cursor-custom-activo");

  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let bx = tx, by = ty;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    punto.style.left = tx + "px";
    punto.style.top = ty + "px";
  });

  function animarBrillo(){
    bx += (tx - bx) * 0.08;
    by += (ty - by) * 0.08;
    brillo.style.left = bx + "px";
    brillo.style.top = by + "px";
    requestAnimationFrame(animarBrillo);
  }
  animarBrillo();
})();

// ---------- MÚSICA DE FONDO ----------
const btnMusica = document.getElementById("btnMusica");
const audio = document.getElementById("audioFondo");
let sonando = false;

const INICIO_CANCION = 16; // segundos — la canción arranca desde aquí

// hace que el "loop" también vuelva al segundo 16 (no al inicio de la pista)
audio.addEventListener("ended", () => {
  audio.currentTime = INICIO_CANCION;
  audio.play();
});

function irAlInicioDeseado(){
  try {
    if (audio.readyState >= 1) {
      audio.currentTime = INICIO_CANCION;
    } else {
      audio.addEventListener("loadedmetadata", () => { audio.currentTime = INICIO_CANCION; }, { once: true });
    }
  } catch (err) { /* algunos navegadores tardan en permitirlo, no pasa nada */ }
}

function intentarReproducirMusica(){
  if (!audio || !audio.querySelector("source")) return; // no hay pista cargada
  irAlInicioDeseado();
  audio.play().then(() => {
    sonando = true;
    btnMusica.classList.add("sonando");
  }).catch(() => { /* autoplay bloqueado, se activa al tocar el botón */ });
}

btnMusica.addEventListener("click", () => {
  if (!audio.querySelector("source")) {
    alert("Agrega tu canción en assets/musica.mp3 y descomenta la línea <source> en index.html");
    return;
  }
  if (sonando) {
    audio.pause();
    btnMusica.classList.remove("sonando");
  } else {
    if (audio.currentTime === 0) irAlInicioDeseado();
    audio.play();
    btnMusica.classList.add("sonando");
  }
  sonando = !sonando;
});

// ---------- FORMULARIO RSVP → WHATSAPP ----------
const formRSVP = document.getElementById("formRSVP");
if (formRSVP) {
  formRSVP.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("rsvpNombre").value.trim();
    const asistencia = document.getElementById("rsvpAsistencia").value;
    const acompanantes = document.getElementById("rsvpAcompanantes").value;
    const mensaje = document.getElementById("rsvpMensaje").value.trim();

    let texto = `Hola! Soy *${nombre}* y quiero confirmar mi asistencia a la boda de Jhelmy & Victor.\n\n`;
    texto += `Asistencia: ${asistencia}\n`;
    texto += `Acompañantes: ${acompanantes}\n`;
    if (mensaje) texto += `Mensaje: ${mensaje}\n`;

    const url = `https://wa.me/${CONFIG.telefonoWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  });
}
