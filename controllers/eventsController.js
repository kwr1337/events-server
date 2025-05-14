const {Events, Direction} = require("../models/models");
const ApiError = require("../error/ApiError");
const EditDefault = require('./editDefault')
const uuid = require("uuid");
const path = require('path')
const fs = require('fs')

class EventsController {
    async getAll(req, res, next) {
        try {
            const events = await Events.findAll({
                include: [{
                    model: Direction,
                    as: 'direction'
                }]
            })
            return res.json(events)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const event = await Events.findOne({
                where: {id},
                include: [{
                    model: Direction,
                    as: 'direction'
                }]
            })
            
            if (!event) {
                return next(ApiError.badRequest('Событие не найдено'))
            }
            
            return res.json(event)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createEvent(req, res, next) {
        try {
            const {name, description, description2, date, location, directionId, age_limit, ref_video} = req.body
            
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Изображение обязательно'))
            }
            
            const {img} = req.files
            const fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            
            const event = await Events.create({
                name,
                description,
                description2,
                date,
                location,
                age_limit,
                ref_video,
                img: fileName,
                directionId
            })
            
            return res.json(event)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async editEvent(req, res, next) {
        try {
            const {id} = req.params
            const {name, description, description2, date, location, directionId, age_limit, ref_video} = req.body
            
            const event = await Events.findOne({where: {id}})
            if (!event) {
                return next(ApiError.badRequest('Событие не найдено'))
            }
            
            // Обработка изображения
            let imgName = event.img
            if (req.files && req.files.img) {
                // Удаляем старое изображение
                fs.unlink(path.resolve(__dirname, '..', 'static', imgName), (err) => {
                    if (err) console.log('Ошибка при удалении файла:', err)
                })
                
                const img = req.files.img
                imgName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', imgName))
            }
            
            // Обновляем запись
            await event.update({
                name: name || event.name,
                description: description || event.description,
                description2: description2 || event.description2,
                date: date || event.date,
                location: location || event.location,
                age_limit: age_limit || event.age_limit,
                ref_video: ref_video || event.ref_video,
                img: imgName,
                directionId: directionId || event.directionId
            })
            
            return res.json(event)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteEvents(req, res, next) {
        try {
            const {id} = req.params
            
            const event = await Events.findOne({where: {id}})
            if (!event) {
                return next(ApiError.badRequest('Событие не найдено'))
            }
            
            // Удаляем изображение
            fs.unlink(path.resolve(__dirname, '..', 'static', event.img), (err) => {
                if (err) console.log('Ошибка при удалении файла:', err)
            })
            
            // Удаляем запись
            await event.destroy()
            
            return res.json({message: 'Событие удалено'})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new EventsController()