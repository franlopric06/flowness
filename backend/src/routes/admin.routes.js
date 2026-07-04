const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const {
  getCursos, crearCurso, actualizarCurso, eliminarCurso, activarCurso,
  getClases, actualizarClase, activarClase, desactivarClase,
  getAvisos, crearAviso, eliminarAviso,
  getFases, crearFase, actualizarFase, eliminarFase
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
router.delete('/clases/:id', desactivarClase)

// Avisos
router.get('/avisos', getAvisos)
router.post('/avisos', crearAviso)
router.delete('/avisos/:id', eliminarAviso)

// Fases
router.get('/fases', getFases)
router.post('/fases', crearFase)
router.put('/fases/:id', actualizarFase)
router.delete('/fases/:id', eliminarFase)

module.exports = router