const express = require('express')
const router = express.Router()
const { getClases, getClaseById } = require('../controllers/clases.controller')

router.get('/', getClases)
router.get('/:id', getClaseById)

module.exports = router