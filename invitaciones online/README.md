# Invitación de Boda — Jhelmy & Victor (plantilla)

Invitación digital de una sola página (HTML/CSS/JS), sin dependencias de servidor. Ábrela haciendo doble clic en `index.html`.

## Qué incluye (versión premium)

- Tema oscuro de lujo: azul marino profundo, celeste y dorado, con superficies de cristal (glassmorphism)
- **Fondo 3D en tiempo real hecho con Three.js**: partículas doradas/celestes flotando por toda la página, con parallax al mover el mouse
- **Anillos 3D dorados** girando en el hero, renderizados en WebGL (material metálico con iluminación real)
- Cursor premium personalizado (punto + resplandor dorado que sigue el mouse, solo en escritorio)
- Tarjetas con efecto "tilt" 3D al pasar el mouse (eventos, fotos, contador)
- Cristales cayendo en 3D con rotación en los ejes X e Y
- Divisores con línea dorada que se dibuja al hacer scroll (SVG animado)
- Textos con degradado dorado animado en los nombres
- Revelado en cascada al hacer scroll (cada elemento aparece con un pequeño retraso)
- Nombres, fecha y cuenta regresiva en tiempo real
- Personalización por invitado vía URL (`?nombre=...&pases=...`)
- Sección "Nuestra Historia" (timeline editable)
- Sección de Preguntas Frecuentes (acordeón)
- Sección de hashtag para compartir fotos
- Ceremonia y recepción con mapa de Google Maps embebido
- Itinerario, dress code con paleta de colores sugerida, sugerencia de regalos
- Botón "Agendar en Google Calendar" (genera el link automáticamente)
- Formulario de confirmación de asistencia (RSVP) que envía la respuesta por WhatsApp
- Música de fondo opcional con botón flotante
- 100% responsive (mobile-first) y respeta "reducir movimiento" para accesibilidad

## Sobre Spline

Me pediste armar la escena 3D en Spline (spline.design). No puedo operar su editor visual directamente (es una herramienta de diseño con mouse, no algo que se programe), así que en su lugar construí los efectos 3D directamente en código con **Three.js** — el motor que usa la mayoría de sitios "premium" por debajo. Ventajas frente a insertar un iframe de Spline: carga más rápido, no depende de un servicio externo, y es 100% editable en estos archivos.

Si de todas formas quieres una escena hecha en Spline (por ejemplo, un objeto 3D más elaborado tipo anillo con diamante, flores 3D, etc.):
1. Crea una cuenta gratis en spline.design
2. Diseña la escena (o parte de una plantilla de su comunidad)
3. Click en "Export" → "Code Export" → copia el `<iframe>` que te da
4. Pégalo donde quieras dentro de `index.html` (por ejemplo, reemplazando `#rings-3d-mount`)

Con gusto te ayudo a integrarlo cuando tengas el link del embed.

## Cómo personalizar

Todo el contenido de texto está en `index.html`. Busca y reemplaza:

- Nombres de la pareja ("Jhelmy", "Victor") — aparecen varias veces
- Fecha, iglesia, salón, direcciones
- Nombres de los padres
- Itinerario y horarios

En `script.js`, edita el bloque `CONFIG` al inicio:

```js
const CONFIG = {
  fechaBoda: "2026-11-14T16:00:00",   // fecha/hora real de la boda
  telefonoWhatsApp: "59177241359",     // tu número de WhatsApp (código país sin +)
  tituloEvento: "Boda de Jhelmy & Victor",
  lugarEvento: "Iglesia Nuestra Señora del Carmen",
};
```

## Fotos

Crea una carpeta `assets/` y coloca ahí las fotos reales de la pareja. Luego reemplaza los bloques `.foto-placeholder` en `index.html` (sección "Nosotros") por:

```html
<img src="assets/foto1.jpg" alt="Jhelmy y Victor" class="foto">
```

También puedes usar una foto como fondo del hero, agregándola en `style.css` dentro de `.hero-bg`.

## Música

1. Coloca tu canción en `assets/musica.mp3`
2. En `index.html`, descomenta esta línea dentro de `<audio>`:
   ```html
   <source src="assets/musica.mp3" type="audio/mpeg">
   ```

## Mapas

Reemplaza las URLs de Google Maps (`https://www.google.com/maps?q=...` y el `iframe` embebido) con la dirección real del evento. Para el iframe, ve a Google Maps → Compartir → Insertar un mapa → copia el link del `src`.

## Personalizar por invitado (links individuales)

Envía links distintos a cada invitado agregando parámetros a la URL:

```
tudominio.com/index.html?nombre=Familia%20Pérez&pases=4
```

El nombre y el número de pases se mostrarán automáticamente en la invitación.

## RSVP

El formulario no requiere backend: arma un mensaje de WhatsApp prellenado y lo envía al número que definas en `CONFIG.telefonoWhatsApp`. Si prefieres guardar las respuestas en una base de datos (Google Sheets, Airtable, etc.), se puede conectar el formulario a esos servicios — pídemelo y lo agrego.

## Publicar la invitación online

Para que cada invitado pueda abrirla desde su celular con un link, sube esta carpeta a un hosting gratuito:

- **Netlify** (arrastra la carpeta a netlify.com/drop) — el más simple
- **Vercel**
- **GitHub Pages**

Cualquiera de los tres te da un link público en minutos, sin costo.
