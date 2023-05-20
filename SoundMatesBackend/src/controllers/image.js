const status = require("http-status")
const CodeError = require("../util/CodeError.js")

require("mandatoryenv").load(["TOKENSECRET"])


const imageModel = require("../models/image.js")

const mimeTypes = ['image/png', 'image/jpeg']

module.exports = {
    async getImages(req,res){
        const user = req.user
        // const images = await imageModel.findAll({ where: {userId:user.id} })
        const images = await user.getImages()

        res.setHeader('Content-Type', 'application/json');
        res.status(status.OK).json({images})
        //res.send(image)
        //res.json({ status: true, message: 'returning ' + user.username + "'s images", image })
    },

    async newImage(req, res) {
        const user = req.user
        // Récupérer les informations de l'image téléchargée
        const { originalname, mimetype, buffer } = req.file

        // Verification de l'extension de l'image
        if(!mimeTypes.includes(mimetype)) throw new CodeError("Image's extension type forbidden",status.BAD_REQUEST)

        // Enregistrer les informations de l'image dans la base de données
        // const image = await imageModel.create({
        //     filename: originalname,
        //     originalname: originalname,
        //     mimetype: mimetype,
        //     size: buffer.length,
        //     buffer: buffer,
        //     userId: user.id,
        // })
        await user.createImage({
                filename: originalname,
                originalname: originalname,
                mimetype: mimetype,
                size: buffer.length,
                buffer: buffer,
                userId: user.id,
            })
        res.status(status.CREATED).json({status: true,message :'image Added to ' + user.username})
    },

    async getImageById(req, res) {
        // const user = req.user
        const image = req.image[0]
        
        res.setHeader('Content-Type', image.mimetype)
        console.log('mimetype',image.mimetype)
        console.log('buffer',image.buffer)
        res.status(status.OK).send(image.buffer)
        //res.json({ status: true, message: 'Returning image', image.buffer })
    },

    async updateImageById(req,res){
        const user = req.user
        const image = req.image
        // Récupérer les informations de l'image téléchargée
        const { originalname, mimetype, buffer } = req.file

        // Verification de l'extension de l'image
        if(!mimeTypes.includes(mimetype)) throw new CodeError("Image's extension type forbidden",status.BAD_REQUEST)

        // await imageModel.update({
        //     filename: originalname,
        //     originalname: originalname,
        //     mimetype: mimetype,
        //     size: buffer.length,
        //     buffer: buffer,
        //     userId: user.id,
        // },{ where: {id : id}})


        await image[0].update({
            filename: originalname,
            originalname: originalname,
            mimetype: mimetype,
            size: buffer.length,
            buffer: buffer,
            userId: user.id,
        })

        res.status(status.OK).json({status: true, message :'Image updated'})
    },

    async deleteImageById(req,res){
        //TODO: gerer le numéro d'id
        const user = req.user

        await imageModel.destroy({ where: { id: req.params.id, userId: user.id } })
        res.status(status.CREATED).json({ status: true, message: 'Image deleted' })
    }
}
