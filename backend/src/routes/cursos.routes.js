const express = require('express')
const router = express.Router()
const { getCursos, getCursoById } = require('../controllers/cursos.controller')

router.get('/', getCursos)
router.get('/:id', getCursoById)

module.exports = router