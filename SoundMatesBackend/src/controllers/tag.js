const status = require('http-status')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
require('mandatoryenv').load(['TOKENSECRET'])

const tagModel = require('../models/tags.js')

module.exports = {
    // TODO: Swagger for the functions

    async getAllTags(req,res){
        const data = await tagModel.findAll()
        res.status(status.OK).json({status: true, message: 'returning all tags :', data})
    },

    async getTags(req,res){
        const user = req.user
        const data = await user.getTags()
        res.status(status.OK).json({ status: true, message: 'returning ' + user.username + "'s tags", data })
    },

    async newTag(req,res){
        const user = req.user
        //Verification de la structure du tag
        if (!has(req.body, ['data'])) throw new CodeError('You must specify the data', status.BAD_REQUEST)
        if (!has(JSON.parse(req.body.data),['name']))throw new CodeError('You must specify the name', status.BAD_REQUEST)

        //Vérification de l'existence de avant création de ce tag
        const name = JSON.parse(req.body.data).name
        const exist = await tagModel.findOne({where:{name}})
        if(!exist)
        {
            res.status(status.NOT_MODIFIED).json({status: false,message: "tag doesn't exist"})
        }
        else{
            //Ajout du tag avec création
            // const data = await tagModel.create(JSON.parse(req.body.data))
            // await user.addTag(data)

            //Ajout du tag sans création
            await user.addTag(exist)

            res.status(status.CREATED).json({status: true,message :'tag Added to ' + user.username})
        }
    },

    async getTagsById (req,res){
        const user = req.user
        const data = req.data

        res.status(status.OK).json({ status: true, message: 'returning ' + user.username + "'s tag", data })
    },

    async updateTag (req,res){
        const data = req.data
        
        if (!has(req.body, ['data'])) throw new CodeError('You must specify the data', status.BAD_REQUEST)
        if (!has(JSON.parse(req.body.data),['name']))throw new CodeError('You must specify the name', status.BAD_REQUEST)
        
        const name = JSON.parse(req.body.data);
        await data[0].update(name);

        // Le tag a été mis à jour avec succès pour cet utilisateur.
        res.status(status.OK).json({status: true, message :'Tag updated'})
    },

    async deleteTag (req,res){
        //Le prochain id ne change pas
        const user = req.user
        const tid = req.params.tid

        await user.removeTag(tid)
        res.status(status.CREATED).json({ status: true, message: 'Tag deleted' })
    }
}
  