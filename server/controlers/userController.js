const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')

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
            return next(ApiError.badRequest('The user with this email already exists'))
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
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
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
        const { id } = req.body
        const candidate = await User.findByPk(id)
        await candidate.update({ userStatus: "blocked" })
        return res.status(200).json(id)
    }
    async blockAll(req, res) {
        const types = await User.findAll({})
        await types.update({ userStatus: "blocked" })
        return res.status(200)
    }
    async unblockUser(req, res) {
        const { id } = req.body
        const candidate = await User.findByPk(id)
        await candidate.update({ userStatus: "active" })
        return res.status(200).json(id)
    }
    async deleteUser(req, res) {
        const { id } = req.body
        const candidate = await User.findByPk(id)
        await candidate.destroy();
        return res.status(200)
    }
}

module.exports = new UserController()