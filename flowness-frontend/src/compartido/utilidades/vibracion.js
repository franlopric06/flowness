// Vibración general: cualquier cosa que se pueda tocar vibra un instante.
// Se activa una sola vez desde main.jsx. Solo funciona en celulares Android
// (iPhone no permite vibrar desde una página web).
const SELECTOR = 'button, a, [role="button"], [role="tab"], label, input[type="checkbox"], input[type="radio"], input[type="file"], select, summary'

export const activarVibracionGeneral = (duracion = 25) => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  document.addEventListener('click', (e) => {
    const elemento = e.target.closest?.(SELECTOR)
    if (elemento && !elemento.disabled) navigator.vibrate(duracion)
  }, { capture: true, passive: true })
}
