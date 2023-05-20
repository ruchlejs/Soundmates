const express = require('express')
const router = express.Router()
const discovery = require('../controllers/discovery.js')

// Fichier où sont stocké les fonctions de validation middleware
const middleware = require('../controllers/middleware.js')

router.get('/discovery', discovery.getNextProfile)
router.post('/discovery', discovery.handleLikeOrDislike)
router.put('/discovery', middleware.undefined)
router.delete('/discovery', middleware.undefined)


module.exports = router