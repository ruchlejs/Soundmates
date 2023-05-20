const Sequelize = require("sequelize");
const db = require("./database.js");

//TODO rename to user without 's' if we find the time
const users = db.define(
  "users",
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(128),
      validate: {
        is: /^[a-z\-'\s]{1,128}$/i,
      },
      unique: true,
      allowNull: false
    },
    hashedPassword: {
      type: Sequelize.STRING(256),
      validate: {
        //check if its a valid sha256 output
        is: /^[a-f0-9]{64}$/i,
      },
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(128),
      validate: {
        is: /^[a-z\-'\s]{1,128}$/i,
      },
      allowNull: false
    },
    sexe: {
      type: Sequelize.STRING(1),
      validate: {
        //is M or F
        is: /^[MF]{1}$/i,
      },
      allowNull: false
    },
    age: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
        min: 18,
        max: 120,
      },
      allowNull: false
    },
    latitude: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

users.belongsToMany(users, {
  through: 'UnreviewedUsers',
  as: 'UnreviewedProfiles',
  foreignKey: 'reviewedId'
});

users.belongsToMany(users, {
  through: 'LikedUsers',
  as: 'LikedProfiles',
  foreignKey: 'likedId'
});

users.belongsToMany(users, {
  through: 'DislikedUsers',
  as: 'DislikedProfiles',
  foreignKey: 'dislikedId'
});

users.belongsToMany(users, {
  through: 'MatchedUsers',
  as: 'MatchedProfiles',
  foreignKey: 'matchedId'
});


module.exports = users;
