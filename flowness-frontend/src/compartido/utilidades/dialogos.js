// ─────────────────────────────────────────────
// Ventanas de confirmación y de texto, con el estilo del sitio
// (reemplazan a los confirm() y prompt() del navegador).
// Uso:
//   if (!(await confirmar('¿Eliminar esta foto?'))) return
//   const texto = await pedirTexto('Descripción de la foto', valorActual)
//   (pedirTexto devuelve null si la persona cancela)
// El componente <Dialogo /> (en App) las muestra.
// ─────────────────────────────────────────────
const EVENTO = 'flowness:dialogo'

const abrir = (opciones) =>
  new Promise((resolver) => {
    window.dispatchEvent(new CustomEvent(EVENTO, { detail: { ...opciones, resolver } }))
  })

export const confirmar = (mensaje, { textoConfirmar = 'Sí, continuar', peligro = true } = {}) =>
  abrir({ tipo: 'confirmar', mensaje, textoConfirmar, peligro })

export const pedirTexto = (mensaje, valorInicial = '') =>
  abrir({ tipo: 'texto', mensaje, valorInicial, textoConfirmar: 'Guardar' })

export const escucharDialogos = (alRecibir) => {
  const manejar = (e) => alRecibir(e.detail)
  window.addEventListener(EVENTO, manejar)
  return () => window.removeEventListener(EVENTO, manejar)
}
