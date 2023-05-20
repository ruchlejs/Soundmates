const status = require("http-status")
const userModel = require("../models/users.js")
const has = require("has-keys")
const CodeError = require("../util/CodeError.js")
const jws = require("jws")
require("mandatoryenv").load(["TOKENSECRET"])
const { TOKENSECRET } = process.env

module.exports = {
  async getUsers(req, res) {
    const data = await userModel.findAll({
      attributes: [
        "id",
        "username",
        "hashedPassword",
        "name",
        "age",
        "latitude",
        "longitude",
        "sexe",
      ],
    })
    res.json({ status: true, message: "Returning users", data })
  },

  async newUser(req, res) {
    if (!has(req.body, ["data"]))
      throw new CodeError("You must specify the data", status.BAD_REQUEST)
    if (
      !has(JSON.parse(req.body.data), [
        "username",
        "hashedPassword",
        "name",
        "age",
        "sexe",
      ])
    )
      throw new CodeError(
        "You must specify a username, a hashedPassword, your name and your age and your coordinates",
        status.BAD_REQUEST
      )
    const parsedRequest = JSON.parse(req.body.data)
    const username = parsedRequest.username
    console.log(username)

    const hashedPassword = parsedRequest.hashedPassword

    const exist = await userModel.findOne({ where: { username } })
    if (exist) {
      res.status(status.FORBIDDEN).json({
        status: false,
        message: "User already exists",
      })
    } else {

      const allUsers = await userModel.findAll()

      const user = await userModel.create({
        username,
        hashedPassword,
        name: parsedRequest.name,
        sexe: parsedRequest.sexe,
        age: parsedRequest.age,
        latitude: parsedRequest.latitude,
        longitude: parsedRequest.longitude,
      })

      for (let i = 0; i < allUsers.length; i++) {
        await allUsers[i].addUnreviewedProfile(user);
      }

      for (let i = 0; i < allUsers.length; i++) {
        await user.addUnreviewedProfile(allUsers[i]);
      }

      const token = jws.sign({
        header: { alg: "HS256" },
        payload: username,
        secret: TOKENSECRET,
      })
      res.status(status.OK).json({
        status: true,
        message: "User created, token sent",
        user: user,
        token,
      })
    }
  },

  async getToken(req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get Token'
    const username = req.params.user
    const user = await userModel.findOne({ where: { username } })
    if (!user) {
      res
        .status(status.FORBIDDEN)
        .json({ status: false, message: "User not found" })
      throw new CodeError("User not found", status.FORBIDDEN)
    }
    const token = jws.sign({
      header: { alg: "HS256" },
      payload: username,
      secret: TOKENSECRET,
    })
    res.json({ status: true, message: "Token created", token })
  },

  async whoAmI(req, res) {
    res.status(status.OK).json({ status: true, message: "Token decoded", username })
  },

    async getUserByID(req,res){
      const id = req.params.id
      console.log(id)
      const user = await userModel.findOne({ where: {id: id}})
      res.json({status:true,message:'Returning user with the id : '+id,user})
    },

  async loginUser(req, res) {
    if (!has(req.body, ["data"]))
      throw new CodeError("You must specify the data", status.BAD_REQUEST)
    if (!has(JSON.parse(req.body.data), ["username", "hashedPassword"]))
      throw new CodeError(
        "You must specify a username and a hashedPassword",
        status.BAD_REQUEST
      )

    const parsedRequest = JSON.parse(req.body.data)
    const username = parsedRequest.username
    const hashedPassword = parsedRequest.hashedPassword

    const exist = await userModel.findOne({
      where: {
        username,
        hashedPassword,
      },
    })
    //fetch the user from the database
    if (exist) {
      const user = await userModel.findOne({
        where: {
          username,
          hashedPassword,
        },
        attributes: { exclude: ["hashedPassword"] },
      })
      const token = jws.sign({
        header: { alg: "HS256" },
        payload: username,
        secret: TOKENSECRET,
      })
      res.status(status.OK).json({
        status: true,
        message: "User found, token sent",
        user: user,
        token,
      })
    } else {
      res.status(status.FORBIDDEN).json({
        status: false,
        message: "No such user",
      })
    }
  },

  //functions related to the age of a user
  async changeName(req, res) {
    const username = req.params.user
    console.log(username)
    const parsedRequest = JSON.parse(req.body.data)
    const name = parsedRequest.name
    console.log(name)

    if (!name)
      throw new CodeError("You must specify a new name", status.BAD_REQUEST)

    const user = await userModel.findOne({ where: { username } })
    if (!user) {
      res
        .status(status.FORBIDDEN)
        .json({ status: false, message: "User not found" })
      throw new CodeError("User not found", status.FORBIDDEN)
    }
    //catch error if the validate in the database fails
    try {
      await userModel.update({ name: name }, { where: { username } })
      res.json({ status: true, message: "Username updated" })
    } catch (err) {
      res.json({ status: false, message: "Username is not valid" })
      throw new CodeError(err.message, status.BAD_REQUEST)
    }
  },

  async changeAge(req, res) {
    const username = req.params.user
    console.log(username)
    const parsedRequest = JSON.parse(req.body.data)
    const age = parsedRequest.age
    console.log(age)

    if (!age)
      throw new CodeError("You must specify a new age", status.BAD_REQUEST)

    const user = await userModel.findOne({ where: { username } })
    if (!user) {
      res
        .status(status.FORBIDDEN)
        .json({ status: false, message: "User not found" })
      throw new CodeError("User not found", status.FORBIDDEN)
    }

    try {
      await userModel.update({ age: age }, { where: { username } })
      res.json({ status: true, message: "Age updated" })
    } catch (err) {
      res.json({ status: false, message: "Age is not valid" })
      throw new CodeError(err.message, status.BAD_REQUEST)
    }
  },

  async deleteUserByUsername(req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete User By Username (admin only)'
    console.log(req.params.user)
    const token = req.headers["x-access-token"]
    if (!token) {
      throw new CodeError("No token specified", status.FORBIDDEN)
    }
    try {
      const decoded = jws.decode(token)
      console.log(decoded)
      if (decoded.payload !== "admin") {
        throw new CodeError(
          "You are not allowed to change this user",
          status.FORBIDDEN
        )
      }
      const username = req.params.user
      const deletedUser = await userModel.destroy({
        where: { username: username },
      })
      if (!deletedUser) {
        return res
          .status(status.NOT_FOUND)
          .json({ status: false, message: "User not found" })
      }
      res
        .status(status.OK)
        .json({ status: true, message: "User deleted successfully" })
    } catch (err) {
      console.error(err)
      return res
        .status(status.FORBIDDEN)
        .json({ status: false, message: "Invalid Token" })
    }
  }
}
