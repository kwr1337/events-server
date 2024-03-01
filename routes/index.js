const express = require("express");
const Router = express.Router();

const eventsRouter = require('./eventsRouter')
const authController = require('../controllers/authController')

Router.use('/events', eventsRouter)
Router.post('/login', authController.login)

module.exports = Router;
