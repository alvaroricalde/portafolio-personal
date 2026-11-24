// ============================================================
//  js/data.js  →  AQUÍ EDITAS TUS PROYECTOS Y TESTIMONIOS
//  No necesitas tocar el HTML: las tarjetas se generan solas.
// ============================================================

// ---------- GALERÍA: proyectos ----------
// Para agregar un proyecto, quita los "//" del ejemplo, copia el bloque
// y pon tus datos reales. Todos los campos son opcionales excepto "nombre".
// Si "repo" o "demo" están vacíos, el botón no aparece (no hay botones falsos).
const PROYECTOS = [
  // {
  //   nombre: "Nombre del proyecto",
  //   descripcion: "Qué hace y qué aprendiste con él.",
  //   imagen: "img/mi-proyecto.png",          // guarda la imagen en la carpeta img/
  //   tecnologias: ["Java", "MySQL"],
  //   repo: "https://github.com/alvaroricalde/mi-proyecto",
  //   demo: ""                                 // enlace a la demo, si existe
  // },
];

// ---------- TESTIMONIOS ----------
// SOLO testimonios reales, con permiso de la persona. Quita los "//" y rellena.
// Si hay menos de 3, los espacios que faltan se muestran como "próximamente".
const TESTIMONIOS = [
  {
    nombre: "Miguel Huarsaya",
    relacion: "Compañero de clase",          // o "Docente", etc.
    texto: "Tuve la oportunidad de trabajar con Álvaro y puedo decir que fue una experiencia bastante positiva. Destaco principalmente su capacidad para expresarse y relacionarse con los demás, así como su compromiso con cada actividad o tarea que realiza. Es una persona con la que resulta fácil trabajar y que siempre busca aportar al equipo.",
    foto: "img/gato.jpeg"                                  // opcional: "img/persona.jpg"
  },
  {
    nombre: "Dan Bustinza",
    relacion: "Compañero de clase",
    texto: "Me ayudo con la explicacion de la arquitectura del trabajo de la escuela, aprendi a modelar y a organizar un proyecto de web gracias a él.",
    foto:"img/correcamina.jpg"
  },

];

// Cantidad mínima de tarjetas que se muestran en Testimonios (rellena con espacios vacíos)
const TESTIMONIOS_MINIMO = 3;
// Cantidad mínima de tarjetas en la galería (rellena con espacios "próximo proyecto")
const GALERIA_MINIMO = 3;
