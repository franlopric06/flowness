const express = require('express')
const router = express.Router()
const { verificarToken } = require('../middlewares/auth.middleware')
const { crearPreferencia, webhook } = require('../controllers/pagos.controller')

router.post('/crear-preferencia', verificarToken, crearPreferencia)
router.post('/webhook', webhook)

module.exports = router