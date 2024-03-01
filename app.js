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

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', Router)


app.use(error)

const start = async() => {
    try {
        await sequelize.authenticate()
        await sequelize.sync();
    }catch (e) {
        console.log(e)
    }

    app.listen(3000, ()=>`Server started on ${process.env.PORT} port`)
}


start()