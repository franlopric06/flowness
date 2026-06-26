const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const {
  getCursos,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  activarCurso,
  getClases,
  actualizarClase,
  activarClase,
  getAvisos,
  crearAviso,
  eliminarAviso
} = require('../controllers/admin.controller')

router.use(verificarToken)
router.use(verificarAdmin)

// Cursos
router.get('/cursos', getCursos)
router.post('/cursos', crearCurso)
router.put('/cursos/:id', actualizarCurso)
router.delete('/cursos/:id', eliminarCurso)
router.patch('/cursos/:id/activar', activarCurso)

// Clases
router.get('/clases', getClases)
router.put('/clases/:id', actualizarClase)
router.patch('/clases/:id/activar', activarClase)

// Avisos
router.get('/avisos', getAvisos)
router.post('/avisos', crearAviso)
router.delete('/avisos/:id', eliminarAviso)

module.exports = router