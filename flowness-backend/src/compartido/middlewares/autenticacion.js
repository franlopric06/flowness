import jwt from 'jsonwebtoken'
import entorno from '../../config/entorno.js'

const leerToken = (req) => {
  const authHeader = req.headers['authorization']
  return authHeader && authHeader.split(' ')[1]
}

// Exige un token válido. Si no hay o está vencido, corta la petición.
export const verificarToken = (req, res, next) => {
  const token = leerToken(req)
  if (!token) return res.status(401).json({ error: 'Token requerido' })

  try {
    req.usuario = jwt.verify(token, entorno.jwtSecret)
    next()
  } catch {
    return res.status(403).json({ error: 'Token inválido' })
  }
}

// Para rutas públicas que muestran algo distinto si el usuario inició sesión
// (por ejemplo, el catálogo de clases). Si hay token válido carga req.usuario;
// si no hay o es inválido, sigue igual como visitante.
export const autenticacionOpcional = (req, res, next) => {
  const token = leerToken(req)
  if (token) {
    try {
      req.usuario = jwt.verify(token, entorno.jwtSecret)
    } catch {
      // token vencido o inválido: se trata como visitante
    }
  }
  next()
}

export const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso solo para administradores' })
  }
  next()
}
