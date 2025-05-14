const Router = require('express')
const router = new Router()
const eventsController = require('../controllers/eventsController')
const jwtMiddleware = require('../middleware/jwtMiddleware')

// Публичные маршруты
router.get('/', eventsController.getAll)
router.get('/:id', eventsController.getOne)

// Защищенные маршруты (только для админов)
router.post('/', jwtMiddleware, eventsController.createEvent)
router.patch('/:id', jwtMiddleware, eventsController.editEvent)
router.delete('/:id', jwtMiddleware, eventsController.deleteEvents)

module.exports = router