import entorno from '../../config/entorno.js'

// Diseño común de todos los emails de Flowness (colores del manual de marca).
// Hecho con tablas y estilos en línea porque así lo leen bien Gmail, Outlook y el celular.
const COLORES = { verde: '#7B9B77', verdeOscuro: '#5F7C5B', crema: '#F5F0EB', texto: '#4A4A45', piedra: '#8A8A83', terracota: '#D8A48F' }

// Evita que un nombre con símbolos rompa el HTML
export const escapar = (texto = '') =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Botón grande para el link principal del email
export const boton = (texto, url) => `
  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px auto">
    <tr><td style="border-radius:999px;background:${COLORES.verde}">
      <a href="${url}" style="display:inline-block;padding:14px 30px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:1px;color:#ffffff;text-decoration:none;text-transform:uppercase">${escapar(texto)}</a>
    </td></tr>
  </table>`

// Arma el email completo: encabezado con la marca, el contenido y el pie
export function plantilla({ titulo, contenido, preaviso = '' }) {
  const logo = `${entorno.frontendUrl}/logo-blanco.png`
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapar(titulo)}</title></head>
<body style="margin:0;padding:0;background:${COLORES.crema}">
  <span style="display:none;max-height:0;overflow:hidden">${escapar(preaviso)}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORES.crema};padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:${COLORES.verde};padding:26px;text-align:center">
          <img src="${logo}" width="52" height="52" alt="" style="display:block;margin:0 auto 8px">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;letter-spacing:3px;color:#ffffff">FLOWNESS</p>
        </td></tr>
        <tr><td style="padding:32px 30px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:${COLORES.texto}">
          <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:${COLORES.verdeOscuro}">${escapar(titulo)}</h1>
          ${contenido}
        </td></tr>
        <tr><td style="padding:18px 30px;border-top:1px solid ${COLORES.crema};font-family:Arial,sans-serif;font-size:12px;color:${COLORES.piedra};text-align:center">
          Flowness · Movilidad, flexibilidad y mindfulness<br>
          <a href="${entorno.frontendUrl}" style="color:${COLORES.verdeOscuro}">${entorno.frontendUrl.replace(/^https?:\/\//, '')}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
