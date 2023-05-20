const status = require("http-status")
const userModel = require("../models/users.js")
require("mandatoryenv").load(["TOKENSECRET"])


module.exports = {
async userOfUser(req,res){
    const mainUser = await userModel.findOne({where: {id: req.params.mainId}})

    const MatchedProfiles = await mainUser.getMatchedProfiles({attributes: [
      "id",
      "name",
      "sexe",
      "age",
    ],})

    if(!MatchedProfiles.length){
      res.status(status.OK).json({message: "Vous n'avez pas de match"})
    }
    else{
      let images = new Array(MatchedProfiles.length)
      let tags = new Array(MatchedProfiles.length)
      for(let i =0; i < MatchedProfiles.length; i++){
        images[i] = await MatchedProfiles[i].getImages()
        tags[i] = await MatchedProfiles[i].getTags()
      }
  
      res.status(status.OK).json({message: "retourne les users liked de " + mainUser.name,MatchedProfiles,images,tags})
    }

  }
}