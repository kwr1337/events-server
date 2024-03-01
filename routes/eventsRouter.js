const express = require("express");
const Router = express.Router();

const EventsController = require('../controllers/eventsController')
const jwtMiddleware = require('../controllers/jwtMiddleware')

Router.get('/', EventsController.getAll)
Router.get('/:id', EventsController.getOne)
Router.post('/', jwtMiddleware,  EventsController.createEvent)
Router.patch('/', jwtMiddleware, EventsController.editEvent)
Router.delete('/:id', jwtMiddleware, EventsController.deleteEvents)

module.exports = Router;