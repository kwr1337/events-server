const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");

module.exports = async function (req, res, next) {
    try {
        if (req.method === "OPTIONS") {
            return next();
        }

        if (!req.headers.authorization) {
            return next(ApiError.forbidden('Нет доступа - отсутствует токен'));
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(ApiError.forbidden('Нет доступа - неверный формат токена'));
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(ApiError.forbidden('Нет доступа - недействительный токен'));
        }
        return next(ApiError.internal('Ошибка при проверке токена'));
    }
}
