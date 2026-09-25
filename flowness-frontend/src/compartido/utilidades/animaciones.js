// ============================================
// Librería de animaciones reutilizables
// Proyecto: Flowness (reutilizada de San Roque Servicios Sociales)
// Uso: import { fadeUp, fadeIn, ... } from '../../compartido/utilidades/animaciones'
//      <motion.div {...fadeUp}> ... </motion.div>
// ============================================

// FADE UP — aparece desde abajo hacia arriba
// Usar en: contenedores principales, cards, secciones
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

// FADE UP con delay personalizado — para elementos en secuencia
// Usar en: múltiples secciones que aparecen una después de la otra
// Ejemplo: fadeUpDelay(0.2) → aparece 0.2 segundos después
export const fadeUpDelay = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay }
})

// FADE IN — solo aparece sin movimiento
// Usar en: overlays, modales, fondos
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
}

// SCALE IN — aparece con zoom suave
// Usar en: cards de login, modales, popups
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
}

// SLIDE FROM LEFT — aparece deslizándose desde la izquierda
// Usar en: filtros, menús laterales, elementos de navegación
export const slideFromLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
}

// SLIDE FROM LEFT ON SCROLL — desliza desde la izquierda al entrar en el viewport
// Usar en: filtros, tabs, elementos que vienen de la izquierda en páginas largas
export const slideFromLeftScroll = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.3 }
}

// SLIDE FROM RIGHT — aparece deslizándose desde la derecha
// Usar en: paneles, drawers, elementos que vienen de la derecha
export const slideFromRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
}

// SLIDE FROM LEFT con delay — para elementos en secuencia desde la izquierda
// Ejemplo: slideFromLeftDelay(0.1) → aparece 0.1 segundos después
export const slideFromLeftDelay = (delay = 0) => ({
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, delay }
})

// LIST ITEM — para items de listas que aparecen al hacer scroll
// Usar en: listas de clases, lecciones, fotos, etc.
// Ejemplo: <motion.div {...listItem(i)}> donde i es el índice del map
// Cada item aparece con un pequeño delay según su posición en la lista
export const listItem = (index = 0) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.15, delay: index * 0.03 }
})


// FADE UP ON SCROLL — aparece al entrar en el viewport
// Usar en: cualquier sección o card de página larga
export const fadeUpScroll = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.3 }
}

// FADE UP ON SCROLL con delay
// Ejemplo: fadeUpScrollDelay(0.1) → aparece 0.1 segundos después de entrar al viewport
export const fadeUpScrollDelay = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.3, delay }
})

// MODAL SLIDE UP — para modales que aparecen deslizándose desde abajo
// Usar en: todos los modales del sistema
export const modalSlideUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}


// FADE UP MODAL — para elementos dentro de modales
// Usar en: secciones, botones y listas dentro de modales
export const fadeUpModal = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, delay }
})

// SLIDE CHANGE — para grillas o contenido que cambia al navegar (año, mes, página)
// Usar en: grilla de meses del selector, cualquier contenido que se reemplaza
// Importante: usar key={valor} en el elemento para que React dispare la animación al cambiar
export const slideChange = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.2 }
}


// DROPDOWN — para menús desplegables que aparecen y desaparecen
// Requiere AnimatePresence de framer-motion para animar la salida
// Usar en: selects, dropdowns, menús
export const dropdown = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4 }
}

// TAB CONTENT — para contenido de tabs que cambia con animación
// Requiere AnimatePresence de framer-motion
export const tabContent = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}