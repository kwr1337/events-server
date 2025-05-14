const Router = require('express')
const router = new Router()
const directionRouter = require('./directionRouter')
const eventsRouter = require('./eventsRouter')
const socialProjectRouter = require('./socialProjectRouter')
const activityDirectionRouter = require('./activityDirectionRouter')
const authController = require('../controllers/authController')

router.use('/directions', directionRouter)
router.use('/events', eventsRouter)
router.use('/social-projects', socialProjectRouter)
router.use('/activity-directions', activityDirectionRouter)
router.post('/login', authController.login)

module.exports = router
