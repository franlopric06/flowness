// ─────────────────────────────────────────────
// Avisos (toasts) para todo el sitio
// Uso desde cualquier archivo:
//   import { avisar } from '../../compartido/utilidades/avisos'
//   avisar('Clase guardada')              → verde (éxito)
//   avisar('No se pudo guardar', 'error') → rojo
//   avisar('Revisá el precio', 'alerta')  → naranja
//   avisar('Tu pago se está procesando', 'info')
// El componente <Avisos /> (en App) los muestra.
// ─────────────────────────────────────────────
const EVENTO = 'flowness:aviso'
let ultimo = { texto: '', momento: 0 }

export const avisar = (texto, tipo = 'exito') => {
  if (!texto) return
  // Evita mostrar el mismo aviso dos veces seguidas
  const ahora = Date.now()
  if (ultimo.texto === texto && ahora - ultimo.momento < 1500) return
  ultimo = { texto, momento: ahora }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { texto: String(texto), tipo } }))
}

export const escucharAvisos = (alRecibir) => {
  const manejar = (e) => alRecibir(e.detail)
  window.addEventListener(EVENTO, manejar)
  return () => window.removeEventListener(EVENTO, manejar)
}
