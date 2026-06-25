const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const {
  getCursos,
  crearCurso,
  actualizarCurso,
  eliminarCurso
} = require('../controllers/admin.controller')

// Todas las rutas del admin requieren token y rol admin
router.use(verificarToken)
router.use(verificarAdmin)

// Cursos
router.get('/cursos', getCursos)
router.post('/cursos', crearCurso)
router.put('/cursos/:id', actualizarCurso)
router.delete('/cursos/:id', eliminarCurso)

module.exports = router