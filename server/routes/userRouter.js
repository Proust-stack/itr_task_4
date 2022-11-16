const Router = require('express')
const router = new Router()
const userController = require('../controlers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/list', userController.getAll)
router.put('/block', userController.blockUser)
router.put('/unblock', userController.unblockUser)
router.delete('/delete', userController.deleteUser)

module.exports = router