import jwt from 'jsonwebtoken'
import entorno from '../../config/entorno.js'
import prisma from '../../config/prisma.js'

export const LARGO_MINIMO_CLAVE = 6

export const normalizarEmail = (email) => String(email || '').trim().toLowerCase()
export const esEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Busca por email sin importar mayúsculas (hay cuentas viejas guardadas con mayúsculas)
export const buscarPorEmail = (email) =>
  prisma.usuario.findFirst({ where: { email: { equals: normalizarEmail(email), mode: 'insensitive' } } })

// Lo que recibe el sitio al entrar: el token de sesión y los datos básicos
export function respuestaDeSesion(usuario) {
  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, entorno.jwtSecret, { expiresIn: '7d' })
  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } }
}
