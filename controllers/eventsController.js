const Events = require("../models/models");
const ApiError = require("../error/ApiError");
const EditDefault = require('./editDefault')
const uuid = require("uuid");
const path = require('path')
const fs = require('fs')

class EventsController {
    async getAll(req, res, next) {
        await Events.findAll().then(e => {
            return res.json(e);
        }).catch(err => {
            console.log(err)
            return next(ApiError.internal(err))
        });
    }
    async getOne(req, res, next) {
        const id = req.params.id
        console.log(id)
        await Events.findOne({where: {id : id}}).then(e => {
            return res.json(e);
        }).catch(err => {
            console.log(err)
            return next(ApiError.internal(err))
        });
    }

    async createEvent(req, res, next) {

        if (!req.files) return next(ApiError.badRequest('Не заполенено поле img'))

        const {name, description, description2, place, date, age_limit, ref_video, ref_buy, price} = req.body

        const {img} = req.files
        const fileName = uuid.v4() + ".jpg"


        await Events.create({
            name: name,
            description: description,
            description2: description2,
            place: place,
            date: date,
            age_limit: age_limit,
            ref_video: ref_video,
            ref_buy: ref_buy,
            price: price,
            img: fileName
        }).then(data => {
            img.mv(path.resolve(__dirname, '..', 'static', fileName)).catch(e => next(ApiError.internal(e)))
            return res.json({message: 'Мероприятие добавлено'})
        }).catch(e => {
            //console.log(e, 'оШИИИБКАКАБА БАБКБА КБ АБ')
            return next(ApiError.badRequest('Не заполенены все поля ' + e))
        })
    }

    async editEvent(req, res, next) {
        //
        // const arr = req.body
        // const img = req.files
        //
        // if (!arr['id']) return next(ApiError.badRequest('id не задан'))
        // if (img) {
        //     const fileName = uuid.v4() + '.jpg'
        //     arr['img'] = fileName
        //
        //     await Events.findOne({where: {id: arr['id']}}).then(async data => {
        //         console.log('Это дата', data)
        //         if (data) {
        //             console.log('Примерный path', `${__dirname}/../static/${data.img}`)
        //             await fs.unlink(`${__dirname}/events-server/static/${data.img}`, err => console.log('Ошибка удаления',err))
        //             await img.img.mv(path.resolve(__dirname, '..', 'static', fileName)).catch(e => {
        //                 return next(ApiError.internal())
        //             })
        //         } else return next(ApiError.badRequest('Нет ивента с таким id'))
        //     }).catch(e => {
        //         return next(ApiError.internal(e))
        //     })
        //
        //     return EditDefault(res, req, next, arr)
        // } else {
        //     return EditDefault(res, req, next, arr)
        // }

    }


    async deleteEvents(req, res, next) {
        const id = req.params.id
        await Events.findOne({where: {id: id}}).then(async stat => {
             await Events.destroy({where: {id: id}}).then(async data => {
                 await fs.unlink(`${__dirname}/../static/${stat.img}`, err => console.log(err))
                return res.json({message: `Мероприятие с номером ${id} удалено успешно`})
            })
        }).catch(err => {
            console.log(err)
            return next(ApiError.badRequest('Мероприятия с таким номером не существует'))
        })
    }
}

module.exports = new EventsController()