const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") next()
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return next(ApiError.forbidden('Нет доступа'))

        await jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) return next(ApiError.forbidden('Нет доступа'))
            req.user = decoded
            next()
        })
    }
    else{
        return next(ApiError.forbidden('Нет доступа'))
    }


}
