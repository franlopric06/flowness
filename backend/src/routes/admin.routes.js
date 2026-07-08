const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const { upload } = require('../config/cloudinary')
const {
  getCursos, crearCurso, actualizarCurso, eliminarCurso, activarCurso,
  getClases, crearClase, actualizarClase, activarClase, desactivarClase,
  getAvisos, crearAviso, eliminarAviso,
  getFases, crearFase, actualizarFase, eliminarFase,
  getNiveles, crearNivel, actualizarNivel, eliminarNivel,
  getSobreMi, actualizarSobreMi, eliminarSobreMi,
  getHorarios, crearHorario, eliminarHorario
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
router.post('/clases', crearClase)
router.put('/clases/:id', actualizarClase)
router.patch('/clases/:id/activar', activarClase)
router.delete('/clases/:id', desactivarClase)

// Horarios
router.get('/horarios/:claseId', getHorarios)
router.post('/horarios', crearHorario)
router.delete('/horarios/:id', eliminarHorario)

// Avisos
router.get('/avisos', getAvisos)
router.post('/avisos', crearAviso)
router.delete('/avisos/:id', eliminarAviso)

// Fases
router.get('/fases', getFases)
router.post('/fases', crearFase)
router.put('/fases/:id', actualizarFase)
router.delete('/fases/:id', eliminarFase)

// Niveles
router.get('/niveles', getNiveles)
router.post('/niveles', crearNivel)
router.put('/niveles/:id', actualizarNivel)
router.delete('/niveles/:id', eliminarNivel)

// Sobre mi
router.get('/sobre-mi', getSobreMi)
router.post('/sobre-mi', upload.single('foto'), actualizarSobreMi)
router.delete('/sobre-mi', eliminarSobreMi)

module.exports = router