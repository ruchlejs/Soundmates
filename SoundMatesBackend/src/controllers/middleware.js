const status = require('http-status')
const userModel = require('../models/users.js')
const CodeError = require('../util/CodeError.js')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

module.exports = {
    async userExist(req,res,next){
        // Vérifier que le token est dans x-access-token
        const token = req.headers['x-access-token']
        if(token === undefined) throw new CodeError('you must add the header : x-access-token',status.BAD_REQUEST)
        if(token == '') throw new CodeError('no token in x-access-token',status.BAD_REQUEST)
        
        // Verify jws
        if(!jws.verify(token,'HS256',TOKENSECRET)){
            throw new CodeError('Invalid Token',status.FORBIDDEN)
        }
        
        // Verifier que l'utilisateur existe dans la base de données
        let username = jws.decode(token).payload
        const userToken = await userModel.findOne({where:{username}})
        if(!userToken) {
            res.status(status.FORBIDDEN).json({status:false,message:'User not found'})
            throw new CodeError('User not found',status.FORBIDDEN)
        }

        // Vérifie que le user existe
        username = req.params.user
        const user = await userModel.findOne({ where: {username} })
        if(!user) throw new CodeError("This user doesn't exist",status.FORBIDDEN)

        // Vérifie cohérence token et user de l'URL
        if(userToken.username != user.username) throw new CodeError("the token doesn't match the user",status.FORBIDDEN)
        req.user = user
        next()
    },

    async tagExist(req,res,next){
        const user = req.user
        const id = req.params.tid
        const data = await user.getTags({where: {tid: id}})
        if(!data.length) throw new CodeError(user.username + ' ne possède pas le tag : ' + id,status.FORBIDDEN)
        
        req.data = data
        next()
    },

    async imageExist(req,res,next){
        const user = req.user
        const id = req.params.id
        //const image = await imageModel.findOne({ where: { [Op.and]: [{ id: req.params.id },{ userId: user.id }] } })
        const image = await user.getImages({ where: {id: id}})
        if(!image.length) throw new CodeError(user.username + " ne possède pas l'image : " + id,status.FORBIDDEN)
        
        req.image = image
        next()
    },

    async changeNameInId(req,res,next){
        const name = req.params.name

        // Vérifie que le user existe
        const username = req.params.user
        const user = await userModel.findOne({ where: {username} })
        if(!user) throw new CodeError("This user doesn't exist",status.FORBIDDEN)

        const tag = await user.getTags({where: {name:name}})
        if(!tag.length) throw new CodeError("This tag isn't associate to this user",status.FORBIDDEN)

        req.params.tid = tag[0].tid
        
        next()
    },

    async changeIdInUsername(req,res,next){
        const id = req.params.mainId

        // Vérifie que le user existe
        const user = await userModel.findOne({ where: {id}})
        if(!user) throw new CodeError("This user doesn't exist",status.FORBIDDEN)

        req.params.user = user.username
        
        next()
    },

    // Methode indiquant que cette action n'est pas autorisée
    async undefined(req,res){
        // #swagger.tags = ['Users']
        // #swagger.summary = "doesn't exist"
        res.status(status.METHOD_NOT_ALLOWED).json({status:false,message:'not a method'})
    }
}