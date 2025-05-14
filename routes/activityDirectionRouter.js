const Router = require('express')
const router = new Router()
const activityDirectionController = require('../controllers/activityDirectionController')
const jwtMiddleware = require('../middleware/jwtMiddleware')

// Публичные маршруты
router.get('/', activityDirectionController.getAll)
router.get('/:id', activityDirectionController.getOne)

// Защищенные маршруты (только для админов)
router.post('/', jwtMiddleware, activityDirectionController.create)
router.patch('/:id', jwtMiddleware, activityDirectionController.update)
router.delete('/:id', jwtMiddleware, activityDirectionController.delete)
router.delete('/:id/image', jwtMiddleware, activityDirectionController.deleteImage)
router.post('/:id/images', jwtMiddleware, activityDirectionController.addImages)
router.patch('/:id/schedule', jwtMiddleware, activityDirectionController.updateSchedule)

module.exports = router 