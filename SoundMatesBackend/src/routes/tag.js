const express = require('express')
const router = express.Router()
const tag = require('../controllers/tag.js')

// Fichier où sont stocké les fonctions de validation middleware
const middleware = require('../controllers/middleware.js')

// Action sur la table des tags d'un user
router.get('/:user/tags',middleware.userExist,tag.getTags)
router.post('/:user/tags',middleware.userExist,tag.newTag)
router.put('/:user/tags',middleware.undefined)
router.delete('/:user/tags',middleware.undefined)

// Action spécifique à un tag d'un user
router.get('/:user/tags/:tid',middleware.userExist,middleware.tagExist,tag.getTagsById)
router.post('/:user/tags/:tid',middleware.undefined)
router.put('/:user/tags/:tid',middleware.userExist,middleware.tagExist,tag.updateTag)
router.delete('/:user/tags/:name',middleware.changeNameInId,middleware.userExist,middleware.tagExist,tag.deleteTag)

// Action sur l'ensemble des tags
router.get('/tags',tag.getAllTags)
router.post('/tags',middleware.undefined)
router.put('/tags',middleware.undefined)
router.delete('/tags',middleware.undefined)

module.exports = router