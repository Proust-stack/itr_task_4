const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')
const { Op } = require("sequelize");

const generateJwt = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        { expiresIn: '700h' }
    )
}

class UserController {
    async registration(req, res, next) {
        const { email, password, name } = req.body
        if (!email || !password || !name) {
            return next(ApiError.badRequest('Incorrect data, refresh the page and try again'))
        }
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            return next(ApiError.badRequest('The user with this email already exists, check you spelling'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({
            email,
            userStatus: "active",
            password: hashPassword,
            registryDate: Date.now(),
            lastLoginDate: Date.now(),
            name
        })
        const token = generateJwt(user.id, user.email)
        return res.json({ token })
    }

    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('User is not found'))
        }
        if (user.userStatus === 'blocked') {
            return next(ApiError.internal('User is blocked'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Password is not correct'))
        }
        await user.update({lastLoginDate: Date.now()})
        const token = generateJwt(user.id, user.email)
        return res.json({ token })
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email)
        return res.json({ token })
    }

    async getAll(req, res) {
        const types = await User.findAll()
        return res.json(types)
    }
    async blockUser(req, res) {
        const { users } = req.body
        console.log(users);
        await User.update({
            userStatus: "blocked"
          }, {
            where: {
              id: {
                [Op.eq]: users
              }
            }
          })
        return res.status(200).json(users)
    }

    async unblockUser(req, res) {
        const { users } = req.body
        console.log(users);
        await User.update({ userStatus: "active" }, {
            where: {
              id: users
            }
          });
        return res.status(200).json(users)
    }
    async deleteUser(req, res) {
        const { users } = req.body
        console.log(users);
        await User.destroy({
            where: {
                id: users
              }
          });
        return res.status(200).json(users)
    }
}

module.exports = new UserController()