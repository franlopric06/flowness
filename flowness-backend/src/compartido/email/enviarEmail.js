import entorno from '../../config/entorno.js'

const API_BREVO = 'https://api.brevo.com/v3/smtp/email'

// ¿Está todo cargado para mandar emails? (clave de Brevo y remitente verificado)
export const emailConfigurado = () => Boolean(entorno.email.brevoApiKey && entorno.email.remitente)

// Manda un email con Brevo. Nunca corta el flujo: si falla, lo deja en los logs
// de Railway y devuelve { enviado: false }.
export async function enviarEmail({ para, nombre, asunto, html, texto }) {
  if (!emailConfigurado()) {
    console.warn(`Email no enviado (falta BREVO_API_KEY o EMAIL_REMITENTE): "${asunto}"`)
    return { enviado: false }
  }
  try {
    const respuesta = await fetch(API_BREVO, {
      method: 'POST',
      headers: { 'api-key': entorno.email.brevoApiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { email: entorno.email.remitente, name: entorno.email.nombreRemitente },
        to: [{ email: para, ...(nombre ? { name: nombre } : {}) }],
        subject: asunto,
        htmlContent: html,
        textContent: texto,
      }),
    })
    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => '')
      console.error(`Brevo rechazó el email "${asunto}" (${respuesta.status}):`, detalle.slice(0, 300))
      return { enviado: false }
    }
    return { enviado: true }
  } catch (err) {
    console.error(`No se pudo conectar con Brevo para "${asunto}":`, err?.message || err)
    return { enviado: false }
  }
}
