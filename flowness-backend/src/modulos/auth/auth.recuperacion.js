import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import prisma from '../../config/prisma.js'
import entorno from '../../config/entorno.js'
import { enviarEmail, emailConfigurado } from '../../compartido/email/enviarEmail.js'
import { emailRecuperarClave } from '../../compartido/email/emailRecuperarClave.js'
import { LARGO_MINIMO_CLAVE, buscarPorEmail, respuestaDeSesion } from './auth.comun.js'

// ─────────────────────────────────────────────
// Recuperar la contraseña:
// 1. La persona pone su email. Si existe, le llega un link con un código al azar.
//    En la base se guarda solo el hash del código (si alguien viera la base,
//    no podría usar los links). La respuesta es SIEMPRE la misma, exista o no
//    la cuenta, para que nadie pueda averiguar qué emails están registrados.
// 2. Con el link elige una contraseña nueva. El link vence y sirve una sola vez.
// ─────────────────────────────────────────────

const MINUTOS_VALIDEZ = 60
const PEDIDOS_POR_HORA = 3
const MENSAJE_ENVIADO = 'Si ese email tiene una cuenta, te mandamos un link para crear una contraseña nueva. Revisá también la carpeta de spam.'

const hashDe = (codigo) => crypto.createHash('sha256').update(codigo).digest('hex')

// GET /api/auth/recuperacion — si el envío de emails está listo (para mostrar el link en el sitio)
export const estadoRecuperacion = (req, res) => res.json({ disponible: emailConfigurado() })

// POST /api/auth/olvide-clave  body: { email }
export const pedirRecuperacion = async (req, res) => {
  if (!emailConfigurado()) return res.status(503).json({ error: 'Por ahora no se puede recuperar la contraseña. Escribinos por WhatsApp.' })
  try {
    const usuario = await buscarPorEmail(req.body.email)
    if (!usuario || !usuario.activo) return res.json({ mensaje: MENSAJE_ENVIADO })

    // Límite para que no se puedan mandar emails sin parar a la misma persona
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000)
    const recientes = await prisma.recuperacionClave.count({ where: { usuarioId: usuario.id, creadoEn: { gte: haceUnaHora } } })
    if (recientes >= PEDIDOS_POR_HORA) return res.json({ mensaje: MENSAJE_ENVIADO })

    const codigo = crypto.randomBytes(32).toString('hex')
    await prisma.recuperacionClave.create({
      data: { usuarioId: usuario.id, tokenHash: hashDe(codigo), expira: new Date(Date.now() + MINUTOS_VALIDEZ * 60 * 1000) },
    })

    const link = `${entorno.frontendUrl}/restablecer-clave?codigo=${codigo}`
    const email = emailRecuperarClave({ nombre: usuario.nombre, link, minutos: MINUTOS_VALIDEZ })
    await enviarEmail({ para: usuario.email, nombre: usuario.nombre, ...email })

    res.json({ mensaje: MENSAJE_ENVIADO })
  } catch (err) {
    console.error('Error al pedir recuperación:', err?.message || err)
    res.status(500).json({ error: 'No se pudo procesar el pedido. Probá de nuevo en un rato.' })
  }
}

// POST /api/auth/restablecer-clave  body: { codigo, password }
// Si sale bien, deja la sesión iniciada (devuelve el token como al ingresar)
export const restablecerClave = async (req, res) => {
  const codigo = String(req.body.codigo || '')
  const password = String(req.body.password || '')
  if (!/^[a-f0-9]{64}$/.test(codigo)) return res.status(400).json({ error: 'El link no es válido. Pedí uno nuevo.' })
  if (password.length < LARGO_MINIMO_CLAVE) return res.status(400).json({ error: `La contraseña tiene que tener al menos ${LARGO_MINIMO_CLAVE} caracteres` })

  try {
    const pedido = await prisma.recuperacionClave.findUnique({ where: { tokenHash: hashDe(codigo) }, include: { usuario: true } })
    if (!pedido || pedido.usadoEn || pedido.expira < new Date() || !pedido.usuario.activo) {
      return res.status(400).json({ error: 'El link venció o ya se usó. Pedí uno nuevo.' })
    }

    const hash = await bcrypt.hash(password, 10)
    await prisma.$transaction([
      prisma.usuario.update({ where: { id: pedido.usuarioId }, data: { password: hash } }),
      prisma.recuperacionClave.update({ where: { id: pedido.id }, data: { usadoEn: new Date() } }),
      // Los otros links que haya pedido dejan de servir
      prisma.recuperacionClave.deleteMany({ where: { usuarioId: pedido.usuarioId, id: { not: pedido.id } } }),
    ])

    res.json({ mensaje: 'Listo, tu contraseña cambió.', ...respuestaDeSesion(pedido.usuario) })
  } catch (err) {
    console.error('Error al restablecer contraseña:', err?.message || err)
    res.status(500).json({ error: 'No se pudo cambiar la contraseña. Probá de nuevo.' })
  }
}
