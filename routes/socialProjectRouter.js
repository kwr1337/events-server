const Router = require('express')
const router = new Router()
const socialProjectController = require('../controllers/socialProjectController')
const jwtMiddleware = require('../middleware/jwtMiddleware')

// Публичные маршруты
router.get('/', socialProjectController.getAll)
router.get('/:id', socialProjectController.getOne)

// Защищенные маршруты (только для админов)
router.post('/', jwtMiddleware, socialProjectController.create)
router.patch('/:id', jwtMiddleware, socialProjectController.update)
router.delete('/:id', jwtMiddleware, socialProjectController.delete)

module.exports = router 