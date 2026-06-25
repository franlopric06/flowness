const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const {
  getCursos,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  getClases,
  actualizarClase
} = require('../controllers/admin.controller')

router.use(verificarToken)
router.use(verificarAdmin)

// Cursos
router.get('/cursos', getCursos)
router.post('/cursos', crearCurso)
router.put('/cursos/:id', actualizarCurso)
router.delete('/cursos/:id', eliminarCurso)

// Clases
router.get('/clases', getClases)
router.put('/clases/:id', actualizarClase)

module.exports = router