import { plantilla, boton, escapar } from './plantilla.js'

// Email con el link para crear una contraseña nueva
export function emailRecuperarClave({ nombre, link, minutos }) {
  const primerNombre = String(nombre || '').trim().split(/\s+/)[0]
  const saludo = primerNombre ? `Hola, ${escapar(primerNombre)}:` : 'Hola:'
  const contenido = `
    <p style="margin:0 0 12px">${saludo}</p>
    <p style="margin:0 0 12px">Recibimos un pedido para cambiar la contraseña de tu cuenta de Flowness. Tocá el botón para crear una nueva:</p>
    ${boton('Crear contraseña nueva', link)}
    <p style="margin:0 0 12px;font-size:13px;color:#8A8A83">El link sirve una sola vez y vence en ${minutos} minutos.</p>
    <p style="margin:0 0 12px;font-size:13px;color:#8A8A83">Si no fuiste vos, ignorá este email: tu contraseña no cambia.</p>
    <p style="margin:18px 0 0;font-size:12px;color:#8A8A83;word-break:break-all">Si el botón no funciona, copiá este link en el navegador:<br>${escapar(link)}</p>`

  return {
    asunto: 'Creá tu contraseña nueva de Flowness',
    html: plantilla({ titulo: 'Recuperá tu contraseña', contenido, preaviso: 'El link vence en 1 hora.' }),
    texto: `${saludo}\n\nPara crear una contraseña nueva de Flowness entrá a este link (vence en ${minutos} minutos y sirve una sola vez):\n${link}\n\nSi no fuiste vos, ignorá este email.`,
  }
}
