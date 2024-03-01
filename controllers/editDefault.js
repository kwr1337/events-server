const Events = require("../models/models");
const ApiError = require("../error/ApiError");

module.exports = async function (res, req, next, arr){
    const buff = []

    for (let item in arr) {
        if (item === 'name' || item === 'description' ||
            item === 'place' || item === 'date' ||
            item === 'ref_video' || item === 'ref_buy' ||
            item === 'price' || item === 'age_limit' || item === 'img' ) {
            await Events.update({[item]: arr[item]}, {where: {id: arr['id']}}).then(data =>{
                if(item !== 'img') buff.push({message : `Параметр ${item} обновлен на ${arr[item]}`})
                else buff.push({message : `Фото обновлено`})
            }).catch(err => {
                return next(ApiError.internal())
            })
        }
    }
    return res.json(buff)
}