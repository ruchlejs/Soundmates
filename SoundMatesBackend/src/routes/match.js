const express = require('express')
const router = express.Router()
const middleware = require('../controllers/middleware.js')
const match = require('../controllers/match.js')

router.get('/liked/:mainId',middleware.changeIdInUsername,middleware.userExist,match.userOfUser)
router.post('/liked/:mainId',middleware.undefined)
router.put('/liked/:mainId',middleware.undefined)
router.delete('/liked/:mainId',middleware.undefined)

module.exports = router
