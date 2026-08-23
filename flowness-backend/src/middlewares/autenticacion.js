import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Token requerido' })

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = datos
    next()
  } catch {
    return res.status(403).json({ error: 'Token inválido' })
  }
}

export const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso solo para administradores' })
  }
  next()
}
