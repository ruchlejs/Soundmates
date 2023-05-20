const express = require('express')
const router = express.Router()
const image = require('../controllers/image.js')
const multer = require('multer')

// Fichier où sont stocké les fonctions de validation middleware
const middleware = require('../controllers/middleware.js')


// Indique que les images seront stockées en mémoire dans un buffer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

// Action sur la table des images d'un user
router.get('/:user/images',middleware.userExist,image.getImages)
router.post('/:user/images',middleware.userExist,upload.single('image'),image.newImage)
router.put('/:user/images',middleware.undefined)
router.delete('/:user/images',middleware.undefined)

// Action spécifique à une image d'un user
router.get('/:user/images/:id',middleware.userExist,middleware.imageExist,image.getImageById)
router.post('/:user/images/:id',middleware.undefined)
router.put('/:user/images/:id',middleware.userExist,middleware.imageExist,upload.single('image'),image.updateImageById)
router.delete('/:user/images/:id',middleware.userExist,middleware.imageExist,image.deleteImageById)

module.exports = router