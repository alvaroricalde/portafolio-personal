// ============================================================
//  js/formulario.js  →  Formulario de contacto (solo frontend)
//  El formulario se envía de forma normal (POST a /validar, como en el laboratorio).
//  Este archivo SOLO hace dos cosas ANTES de enviar:
//    1) Valida los campos y muestra mensajes claros.
//    2) Bloquea el botón para que no se envíe dos veces por accidente.
//  Qué pasa con los datos (guardar en la base) lo decide index.js, no este archivo.
// ============================================================
const form = document.getElementById("form-contacto");
const botonEnviar = document.getElementById("btn-enviar");
const estado = document.getElementById("estado-form");
const textoMensaje = document.getElementById("comentarios");
const contador = document.getElementById("contador");

// Reglas de cada campo (los "name" son los mismos que usa index.js)
const REGLAS = {
  nombres:     { min: 2,  max: 100,  etiqueta: "Los nombres" },
  apellidos:   { min: 2,  max: 100,  etiqueta: "Los apellidos" },
  asunto:      { min: 3,  max: 150,  etiqueta: "El asunto" },
  comentarios: { min: 10, max: 2000, etiqueta: "El mensaje" },
};
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_CELULAR = /^[+()\d\s-]{6,20}$/;

let enviando = false; // candado contra envíos repetidos

function validar(d) {
  const errores = {};
  for (const [campo, r] of Object.entries(REGLAS)) {
    const v = d[campo];
    if (!v) errores[campo] = `${r.etiqueta} es obligatorio.`;
    else if (v.length < r.min) errores[campo] = `${r.etiqueta} es muy corto (mínimo ${r.min} caracteres).`;
    else if (v.length > r.max) errores[campo] = `${r.etiqueta} es muy largo (máximo ${r.max} caracteres).`;
  }
  if (!d.correo) errores.correo = "El correo es obligatorio.";
  else if (!REGEX_CORREO.test(d.correo)) errores.correo = "Escribe un correo válido (ej: nombre@correo.com).";
  // El celular es opcional: solo se revisa si lo escribieron
  if (d.celular && !REGEX_CELULAR.test(d.celular))
    errores.celular = "El celular solo puede tener números, espacios, + y guiones.";
  return errores;
}

function mostrarErrores(errores) {
  form.querySelectorAll("[data-error-de]").forEach((el) => {
    const campo = el.dataset.errorDe;
    const msg = errores[campo] || "";
    el.textContent = msg;
    const input = form.elements[campo];
    if (input) input.classList.toggle("invalido", Boolean(msg));
  });
}

function mostrarEstado(texto, tipo) {
  estado.textContent = texto;
  estado.className = "formulario__estado " + (tipo ? "formulario__estado--" + tipo : "");
}

function ponerCargando(si) {
  enviando = si;
  botonEnviar.disabled = si;
  botonEnviar.classList.toggle("cargando", si);
  botonEnviar.querySelector(".btn__texto").textContent = si ? "Enviando..." : "Enviar mensaje";
}

// Contador de caracteres del mensaje
textoMensaje.addEventListener("input", () => (contador.textContent = textoMensaje.value.length));

// Quita el error de un campo apenas la persona vuelve a escribir en él
form.addEventListener("input", (e) => {
  const aviso = form.querySelector(`[data-error-de="${e.target.name}"]`);
  if (aviso) { aviso.textContent = ""; e.target.classList.remove("invalido"); }
});

form.addEventListener("submit", (e) => {
  if (enviando) { e.preventDefault(); return; } // ya se está enviando: ignora el clic

  // Recoger y limpiar datos
  const datos = {};
  new FormData(form).forEach((valor, clave) => (datos[clave] = String(valor).trim()));

  const errores = validar(datos);
  mostrarErrores(errores);

  if (Object.keys(errores).length > 0) {
    e.preventDefault(); // hay errores: NO se envía
    mostrarEstado("Revisa los campos marcados en rojo.", "error");
    const primero = form.querySelector(".invalido");
    if (primero) primero.focus();
    return;
  }

  // Todo bien: se deja que el navegador envíe el formulario a /validar
  mostrarEstado("", "");
  ponerCargando(true);
});

// Si la persona vuelve atrás (por ejemplo tras un error del servidor), se reactiva el botón
window.addEventListener("pageshow", () => ponerCargando(false));
