const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')

const tags = db.define('tags', {
  tid: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    validate: {
      is: /^[a-z\-'\s]{1,128}$/i
    },
    unique: true,
    allowNull : false
  }
}
, { timestamps: false })

users.belongsToMany(tags, { through: 'UserTag' });
tags.belongsToMany(users, { through: 'UserTag' });

module.exports = tags
