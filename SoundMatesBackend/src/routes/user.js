const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')
const middleware = require('../controllers/middleware.js')

// Actions possible autour du jeton d'accès d'un utilisateur
router.get('/GetToken/:user', user.getToken)
router.post('/GetToken/:user', middleware.undefined)
router.put('/GetToken/:user', middleware.undefined)
router.delete('/GetToken/:user', middleware.undefined)

// Actions possible sur la table des users
router.get('/users', user.getUsers)
router.post('/users', user.newUser)
router.put('/users', middleware.undefined)
router.delete('/users', middleware.undefined)

// Actions possible sur un user  spécifque
router.get('/users/:id', user.getUserByID)
router.post('/users/:id', middleware.undefined)
router.put('/users/:id', user.updateUser)
router.delete('/users/:id', user.deleteUser)

// Actions permettant d'obtenir l'username à partir du token d'accès
router.get('/whoami',user.whoAmI)
router.post('/whoami',middleware.undefined)
router.put('/whoami',middleware.undefined)
router.delete('/whoami',middleware.undefined)

// Actions permettant de se connecter à l'appli
router.get('/login', middleware.undefined)
router.post('/login', user.loginUser)
router.put('/login', middleware.undefined)
router.delete('/login', middleware.undefined)

// Actions permettant de se creer un profil sur l'appli
router.get('/register', middleware.undefined)
router.post('/register', user.newUser)
router.put('/register', middleware.undefined)
router.delete('/register', middleware.undefined)

// Actions permettant de changer le nom d'user
router.get('/:user/settings/name', middleware.undefined)
router.post('/:user/settings/name', user.changeName)
router.put('/:user/settings/name', user.changeName)
router.delete('/:user/settings/name', middleware.undefined)

// Actions permettant de changer l'age d'un user
router.get('/:user/settings/age', middleware.undefined)
router.post('/:user/settings/age', user.changeAge)
router.put('/:user/settings/age', user.changeAge)
router.delete('/:user/settings/age', middleware.undefined)

//admin specific routes
router.delete('/user/:user', user.deleteUserByUsername)


module.exports = router
