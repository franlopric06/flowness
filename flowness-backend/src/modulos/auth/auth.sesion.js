import bcrypt from 'bcryptjs'
import prisma from '../../config/prisma.js'
import { LARGO_MINIMO_CLAVE, normalizarEmail, esEmailValido, buscarPorEmail, respuestaDeSesion } from './auth.comun.js'

// POST /api/auth/registrar  body: { nombre, email, password }
export const registrar = async (req, res) => {
  const nombre = String(req.body.nombre || '').trim()
  const email = normalizarEmail(req.body.email)
  const password = String(req.body.password || '')

  if (!nombre) return res.status(400).json({ error: 'Escribí tu nombre' })
  if (!esEmailValido(email)) return res.status(400).json({ error: 'El email no es válido' })
  if (password.length < LARGO_MINIMO_CLAVE) return res.status(400).json({ error: `La contraseña tiene que tener al menos ${LARGO_MINIMO_CLAVE} caracteres` })

  try {
    if (await buscarPorEmail(email)) return res.status(400).json({ error: 'El email ya está registrado' })
    const usuario = await prisma.usuario.create({ data: { nombre, email, password: await bcrypt.hash(password, 10) } })
    res.json(respuestaDeSesion(usuario))
  } catch {
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

// POST /api/auth/iniciar-sesion  body: { email, password }
export const iniciarSesion = async (req, res) => {
  try {
    const usuario = await buscarPorEmail(req.body.email)
    const valido = usuario && (await bcrypt.compare(String(req.body.password || ''), usuario.password))
    if (!valido) return res.status(400).json({ error: 'Credenciales incorrectas' })
    res.json(respuestaDeSesion(usuario))
  } catch {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}
