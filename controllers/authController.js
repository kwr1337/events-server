const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");
class AuthController{
    async login(req, res, next){
        const {login, password} = req.body
        if(login === 'admin' && password === 'BXC5uGylpj') {
            res.json(await jwt.sign({name: login, role : 'admin'}, process.env.SECRET_KEY, {expiresIn: "6h"}))
        }
        else{
            return next(ApiError.badRequest('Логин или пароль не верный'))
        }
    }
}

module.exports = new AuthController()