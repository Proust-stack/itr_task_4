const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    registryDate: {type: DataTypes.DATE},
    lastLoginDate: {type: DataTypes.DATE},
    userStatus: {type: DataTypes.STRING, defaultValue: "active"}
})

module.exports = {
    User
}