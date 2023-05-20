const sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')



const image = db.define('image', {
  filename: {
    type: sequelize.STRING,
    allowNull: false
  },
  originalname: {
    type: sequelize.STRING,
    allowNull: false
  },
  mimetype: {
    type: sequelize.STRING,
    allowNull: false
  },
  size: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  buffer: {
    type: sequelize.BLOB('long'),
    allowNull: false
  },
  // userId: {
  //   type: sequelize.INTEGER,
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  //   references: {
  //     model: users,
  //     key: 'id'
  //   }
  // }
}, { timestamps: false })

// image.belongsTo(users, { foreignKey : 'userId'})
// users.hasMany(image, { foreignKey : 'userId'})

image.belongsTo(users)
users.hasMany(image)

module.exports = image
