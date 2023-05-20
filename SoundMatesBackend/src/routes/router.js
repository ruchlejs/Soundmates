const router = require("express").Router()

// Ensemble des routes utilisées
router.use(require("./user"))
router.use(require("./tag"))
router.use(require("./discovery"))
router.use(require("./image"))
router.use(require('./match'))

module.exports = router
