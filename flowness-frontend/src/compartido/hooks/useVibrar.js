// La vibración ahora es general: está en src/main.jsx y hace vibrar
// cualquier botón, link o casilla que se toque en todo el sitio.
// Este hook se deja para no romper los componentes que todavía lo usan,
// pero ya no hace nada (así no vibra dos veces).
export const useVibrar = () => () => {}
