const status = require("http-status")
const userModel = require("../models/users.js")
const tagModel = require("../models/tags.js")
const CodeError = require("../util/CodeError.js")
const jws = require("jws")
require("mandatoryenv").load(["TOKENSECRET"])
const { TOKENSECRET } = process.env
const { Op } = require("sequelize")

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

function getDistance(lat1, long1, lat2, long2) {
  const R = 6371 // Rayon de la Terre en km
  const dLat = toRadians(lat2 - lat1)
  const dLong = toRadians(long2 - long1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance en km
  return distance
}

async function printUserAndItsLists(user) {
  console.log("User: " + user.username)
  const unreviewedProfiles = await user.getUnreviewedProfiles()
  for (let i = 0; i < unreviewedProfiles.length; i++) {
    console.log("Unreviewed: " + unreviewedProfiles[i].username)
  }
  const likedProfiles = await user.getLikedProfiles()
  for (let i = 0; i < likedProfiles.length; i++) {
    console.log("Liked: " + likedProfiles[i].username)
  }
  const dislikedProfiles = await user.getDislikedProfiles()
  for (let i = 0; i < dislikedProfiles.length; i++) {
    console.log("Disliked: " + dislikedProfiles[i].username)
  }
}

async function compatibilityScore(user1, user2) {
  const tags1 = await user1.getTags()
  const tags2 = await user2.getTags()

  const commonTags = await tagModel.findAll({
    where: {
      [Op.and]: [
        { tid: { [Op.in]: tags1.map((tag) => tag.tid) } },
        { tid: { [Op.in]: tags2.map((tag) => tag.tid) } },
      ],
    },
    include: [{ model: userModel, as: "users" }],
  })

  const score = commonTags.length

  if (
    getDistance(
      user1.latitude,
      user1.longitude,
      user2.latitude,
      user2.longitude
    ) < 10
  ) {
    return score * 1.5
  }

  return score
}

module.exports = {
  async getNextProfile(req, res) {
    const unreviewedProfiles = await user.getUnreviewedProfiles()
    if (unreviewedProfiles.length == 0) {
      res.status(status.NO_CONTENT).json({ msg: "No more profiles to review" })
      return
    }
    let max_score = 0
    let nextProfile = unreviewedProfiles[0]
    for (let i = 0; i < unreviewedProfiles.length; i++) {
      const score = await compatibilityScore(user, unreviewedProfiles[i])
      if (score > max_score) {
        max_score = score
        nextProfile = unreviewedProfiles[i]
      }
    }

    const images = await nextProfile.getImages()
    const tags = await nextProfile.getTags()

    const distance = getDistance(
      user.latitude,
      user.longitude,
      nextProfile.latitude,
      nextProfile.longitude
    )

    res.status(status.OK).json({
      msg: "Next profile",
      id: nextProfile.id,
      name: nextProfile.name,
      age: nextProfile.age,
      sexe: nextProfile.sexe,
      distance: distance,
      images: images,
      tags: tags,
    })
  },

  async handleLikeOrDislike(req, res) {
    const username = jws.decode(token).payload

    const data = JSON.parse(req.body.data)

    const user = await userModel.findOne({ where: { username: username } })

    console.log("before sending handling the like")
    printUserAndItsLists(user)

    const unreviewedProfiles = await user.getUnreviewedProfiles()
    for (let i = 0; i < unreviewedProfiles.length; i++) {
      if (unreviewedProfiles[i].id == data.id) {
        const likedOrDislikedProfile = unreviewedProfiles[i]
        await user.removeUnreviewedProfile(likedOrDislikedProfile)
        if (data.likeOrDislike == "like") {
          await user.addLikedProfile(likedOrDislikedProfile)

          const likedProfiles = await likedOrDislikedProfile.getLikedProfiles()

          for (let j = 0; j < likedProfiles.length; j++) {
            if (likedProfiles[j].id == user.id) {
              //match
              await user.addMatchedProfile(likedOrDislikedProfile)
              await likedOrDislikedProfile.addMatchedProfile(user)
              //remove the profiles from the liked profiles
              await user.removeLikedProfile(likedOrDislikedProfile)
              await likedOrDislikedProfile.removeLikedProfile(user)
              res.status(status.OK).json({ msg: "Match" })
              return
            }
          }

          res.status(status.OK).json({ msg: "Profile liked or disliked" })
        } else if (data.likeOrDislike == "dislike") {
          await user.addDislikedProfile(likedOrDislikedProfile)
          //compare to see if there's a match

          res.status(status.OK).json({ msg: "Profile liked or disliked" })
        } else {
          throw new CodeError("Invalid likeOrDislike value", status.BAD_REQUEST)
        }
        break
      }
      res.status(status.NOT_FOUND).json({
        msg: "Profile ID not found in the unreviwed profiles for this account",
      })
    }
  },
}
