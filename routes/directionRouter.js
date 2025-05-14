const Router = require('express')
const router = new Router()
const directionController = require('../controllers/directionController')
const jwtMiddleware = require('../middleware/jwtMiddleware')

// Публичные маршруты
router.get('/', directionController.getAll)
router.get('/:id', directionController.getOne)

// Защищенные маршруты (только для админов)
router.post('/', jwtMiddleware, directionController.create)
router.patch('/:id', jwtMiddleware, directionController.update)
router.delete('/:id', jwtMiddleware, directionController.delete)

module.exports = router 