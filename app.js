require('dotenv').config()
const express = require('express')
const sequelize = require("./db");
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const Router = require("./routes/index");
const models = require('./models/models')
const error = require('./error/ErrorHandlerMiddleware')
const app = express()

// Middleware
const allowedOrigins = ['http://31.130.149.154', 'http://localhost:8080'];
app.use(cors({
    origin: function(origin, callback){
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

// Routes
app.use('/api', Router)

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(error)

const start = async() => {
    try {
        // Подключение к БД
        await sequelize.authenticate()
        console.log('Database connection established successfully')
        
        // Синхронизация моделей с БД
        await sequelize.sync();
        console.log('Database models synchronized successfully')

        // Запуск сервера
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (e) {
        console.error('Error starting server:', e)
    }
}

start()