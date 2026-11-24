// ============================================================
//  js/script.js  →  Comportamiento general de la página
//  (menú móvil, animaciones al hacer scroll, galería, testimonios...)
// ============================================================

// Utilidad: crea un elemento HTML con clase y texto.
// Usamos textContent (no innerHTML) para que el texto nunca se interprete como código.
function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

// ---------- 1) Menú móvil ----------
const menu = document.getElementById("menu");
const botonMenu = document.getElementById("menu-boton");
const listaMenu = document.getElementById("menu-lista");

function cerrarMenu() {
  menu.classList.remove("menu--abierto");
  botonMenu.setAttribute("aria-expanded", "false");
}
botonMenu.addEventListener("click", () => {
  const abierto = menu.classList.toggle("menu--abierto");
  botonMenu.setAttribute("aria-expanded", String(abierto));
});
// Al tocar un enlace del menú, se cierra (útil en celular)
listaMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrarMenu));

// ---------- 2) Menú con fondo al bajar + botón "subir" ----------
const botonSubir = document.getElementById("subir");
function alHacerScroll() {
  menu.classList.toggle("menu--fondo", window.scrollY > 30);
  botonSubir.classList.toggle("subir--visible", window.scrollY > 600);
}
window.addEventListener("scroll", alHacerScroll, { passive: true });
alHacerScroll();

// ---------- 3) Resaltar en el menú la sección que estás viendo ----------
const enlaces = document.querySelectorAll(".menu__link");
const secciones = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          enlaces.forEach((l) => l.classList.toggle("activo", l.getAttribute("href") === "#" + e.target.id));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  secciones.forEach((s) => observador.observe(s));
}

// ---------- 4) Galería: se genera desde PROYECTOS (js/data.js) ----------
function crearTarjetaProyecto(p) {
  const tarjeta = crear("article", "proyecto aparecer");

  if (p.imagen) {
    const img = crear("img", "proyecto__img");
    img.src = p.imagen;
    img.alt = "Captura del proyecto " + p.nombre;
    img.loading = "lazy";
    tarjeta.appendChild(img);
  }

  const cuerpo = crear("div", "proyecto__cuerpo");
  cuerpo.appendChild(crear("h3", "", p.nombre));
  if (p.descripcion) cuerpo.appendChild(crear("p", "", p.descripcion));

  if (Array.isArray(p.tecnologias) && p.tecnologias.length) {
    const tags = crear("div", "etiquetas");
    p.tecnologias.forEach((t) => tags.appendChild(crear("span", "tag tag--violeta", t)));
    cuerpo.appendChild(tags);
  }

  // Los botones solo existen si hay un enlace real
  const acciones = crear("div", "proyecto__acciones");
  [["repo", "Ver repositorio"], ["demo", "Ver demostración"]].forEach(([clave, texto]) => {
    if (p[clave]) {
      const a = crear("a", "boton boton--secundario boton--chico", texto);
      a.href = p[clave];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      acciones.appendChild(a);
    }
  });
  if (acciones.children.length) cuerpo.appendChild(acciones);

  tarjeta.appendChild(cuerpo);
  return tarjeta;
}

function crearEspacioProyecto() {
  const t = crear("article", "proyecto proyecto--vacio aparecer");
  t.appendChild(crear("span", "vacio__icono", "+"));
  t.appendChild(crear("h3", "", "Próximo proyecto"));
  t.appendChild(crear("p", "", "Un espacio reservado para lo próximo que construya."));
  return t;
}

const galeriaGrid = document.getElementById("galeria-grid");
PROYECTOS.forEach((p) => galeriaGrid.appendChild(crearTarjetaProyecto(p)));
for (let i = PROYECTOS.length; i < GALERIA_MINIMO; i++) galeriaGrid.appendChild(crearEspacioProyecto());

// ---------- 5) Testimonios: se generan desde TESTIMONIOS (js/data.js) ----------
function crearTestimonio(t) {
  const tarjeta = crear("figure", "testimonio aparecer");
  tarjeta.appendChild(crear("span", "testimonio__comillas", "“"));
  tarjeta.appendChild(crear("blockquote", "", t.texto));

  const pie = crear("figcaption", "testimonio__autor");
  if (t.foto) {
    const img = crear("img", "testimonio__foto");
    img.src = t.foto;
    img.alt = "Foto de " + t.nombre;
    img.loading = "lazy";
    pie.appendChild(img);
  } else {
    // Sin foto: círculo con la inicial del nombre
    pie.appendChild(crear("span", "testimonio__inicial", (t.nombre || "?").charAt(0).toUpperCase()));
  }
  const datos = crear("div");
  datos.appendChild(crear("strong", "", t.nombre));
  datos.appendChild(crear("span", "", t.relacion || ""));
  pie.appendChild(datos);

  tarjeta.appendChild(pie);
  return tarjeta;
}

function crearEspacioTestimonio() {
  const tarjeta = crear("figure", "testimonio testimonio--vacio aparecer");
  tarjeta.appendChild(crear("span", "testimonio__comillas", "“"));
  tarjeta.appendChild(crear("blockquote", "", "Aquí irá el testimonio real de un compañero o docente."));
  const pie = crear("figcaption", "testimonio__autor");
  pie.appendChild(crear("span", "testimonio__inicial", "?"));
  const datos = crear("div");
  datos.appendChild(crear("strong", "", "Próximamente"));
  datos.appendChild(crear("span", "", "Compañero o docente"));
  pie.appendChild(datos);
  tarjeta.appendChild(pie);
  return tarjeta;
}

const testimoniosGrid = document.getElementById("testimonios-grid");
TESTIMONIOS.forEach((t) => testimoniosGrid.appendChild(crearTestimonio(t)));
for (let i = TESTIMONIOS.length; i < TESTIMONIOS_MINIMO; i++) testimoniosGrid.appendChild(crearEspacioTestimonio());

// ---------- 6) Animaciones al aparecer (elementos con clase "aparecer") ----------
// Se activan solo si el usuario no pidió "reducir movimiento" en su sistema.
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const elementos = document.querySelectorAll(".aparecer");
if ("IntersectionObserver" in window && !sinMovimiento) {
  document.documentElement.classList.add("animaciones");
  const revelar = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  elementos.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + "ms"; // pequeño escalonado
    revelar.observe(el);
  });
}

// ---------- 7) Año del footer automático ----------
document.getElementById("anio").textContent = new Date().getFullYear();
