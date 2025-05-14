const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const { ActivityDirection } = require('../models/models')
const ApiError = require('../error/ApiError')

class ActivityDirectionController {
    async create(req, res, next) {
        try {
            const {name, description, description2, schedule, videoLink} = req.body
            
            // Проверка наличия основного изображения
            if (!req.files || !req.files.mainImage) {
                return next(ApiError.badRequest('Необходимо основное изображение'))
            }

            // Обработка основного изображения
            const mainImage = req.files.mainImage
            const mainImageName = uuid.v4() + ".jpg"
            mainImage.mv(path.resolve(__dirname, '..', 'static', mainImageName))

            // Обработка дополнительных изображений
            let images = []
            if (req.files.images) {
                const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images]
                
                for (let img of imageFiles) {
                    const fileName = uuid.v4() + ".jpg"
                    img.mv(path.resolve(__dirname, '..', 'static', fileName))
                    images.push(fileName)
                }
            }

            // Обработка расписания
            let parsedSchedule
            try {
                parsedSchedule = schedule ? JSON.parse(schedule) : {
                    "monday": [],
                    "tuesday": [],
                    "wednesday": [],
                    "thursday": [],
                    "friday": [],
                    "saturday": [],
                    "sunday": []
                }
                
                // Проверяем и добавляем пустое название, если его нет
                Object.keys(parsedSchedule).forEach(day => {
                    if (Array.isArray(parsedSchedule[day])) {
                        parsedSchedule[day] = parsedSchedule[day].map(slot => {
                            return {
                                start: slot.start,
                                end: slot.end,
                                title: slot.title || ''
                            };
                        });
                    }
                });
            } catch (e) {
                return next(ApiError.badRequest('Неверный формат расписания. Должен быть JSON объект.'))
            }

            // Создание записи в БД
            const activityDirection = await ActivityDirection.create({
                name,
                description,
                description2,
                mainImage: mainImageName,
                images,
                schedule: parsedSchedule,
                videoLink
            })

            return res.json(activityDirection)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const activityDirections = await ActivityDirection.findAll()
        return res.json(activityDirections)
    }

    async getOne(req, res) {
        const {id} = req.params
        const activityDirection = await ActivityDirection.findOne({where: {id}})
        return res.json(activityDirection)
    }

    async update(req, res, next) {
        try {
            const id = req.params.id
            const {name, description, description2, schedule, videoLink, keepExistingImages} = req.body
            const activityDirection = await ActivityDirection.findOne({where: {id}})
            
            if (!activityDirection) {
                return next(ApiError.badRequest('Направление не найдено'))
            }

            // Обработка основного изображения
            let mainImageName = activityDirection.mainImage
            if (req.files && req.files.mainImage) {
                // Удаляем старое изображение
                fs.unlink(path.resolve(__dirname, '..', 'static', mainImageName), (err) => {
                    if (err) console.log('Ошибка при удалении файла:', err)
                })
                
                const mainImage = req.files.mainImage
                mainImageName = uuid.v4() + ".jpg"
                mainImage.mv(path.resolve(__dirname, '..', 'static', mainImageName))
            }

            // Обработка дополнительных изображений
            let images = activityDirection.images
            if (req.files && req.files.images) {
                const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images]
                
                // Если keepExistingImages не установлен в true, удаляем старые изображения
                if (keepExistingImages !== 'true') {
                    images.forEach(img => {
                        fs.unlink(path.resolve(__dirname, '..', 'static', img), (err) => {
                            if (err) console.log('Ошибка при удалении файла:', err)
                        })
                    })
                    images = []
                }
                
                // Добавляем новые изображения
                for (let img of imageFiles) {
                    const fileName = uuid.v4() + ".jpg"
                    img.mv(path.resolve(__dirname, '..', 'static', fileName))
                    images.push(fileName)
                }
            }

            // Обработка расписания
            let parsedSchedule = activityDirection.schedule
            if (schedule) {
                try {
                    parsedSchedule = JSON.parse(schedule)
                    
                    // Проверяем и добавляем пустое название, если его нет
                    Object.keys(parsedSchedule).forEach(day => {
                        if (Array.isArray(parsedSchedule[day])) {
                            parsedSchedule[day] = parsedSchedule[day].map(slot => {
                                return {
                                    start: slot.start,
                                    end: slot.end,
                                    title: slot.title || ''
                                };
                            });
                        }
                    });
                } catch (e) {
                    return next(ApiError.badRequest('Неверный формат расписания. Должен быть JSON объект.'))
                }
            }

            // Обновление записи
            await activityDirection.update({
                name: name || activityDirection.name,
                description: description || activityDirection.description,
                description2: description2 || activityDirection.description2,
                mainImage: mainImageName,
                images,
                schedule: parsedSchedule,
                videoLink: videoLink || activityDirection.videoLink
            })

            return res.json(activityDirection)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Метод для добавления новых изображений к существующим
    async addImages(req, res, next) {
        try {
            const {id} = req.params
            const activityDirection = await ActivityDirection.findOne({where: {id}})
            
            if (!activityDirection) {
                return next(ApiError.badRequest('Направление не найдено'))
            }

            if (!req.files || !req.files.images) {
                return next(ApiError.badRequest('Изображения не предоставлены'))
            }

            // Получаем текущие изображения
            let images = [...activityDirection.images]
            
            // Добавляем новые изображения
            const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images]
            
            for (let img of imageFiles) {
                const fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                images.push(fileName)
            }

            // Обновляем запись в БД
            await activityDirection.update({
                images
            })

            return res.json({
                message: 'Изображения успешно добавлены',
                updatedImages: images
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const activityDirection = await ActivityDirection.findOne({where: {id}})
            
            if (!activityDirection) {
                return next(ApiError.badRequest('Направление не найдено'))
            }

            // Удаление основного изображения
            fs.unlink(path.resolve(__dirname, '..', 'static', activityDirection.mainImage), (err) => {
                if (err) console.log('Ошибка при удалении файла:', err)
            })

            // Удаление дополнительных изображений
            activityDirection.images.forEach(img => {
                fs.unlink(path.resolve(__dirname, '..', 'static', img), (err) => {
                    if (err) console.log('Ошибка при удалении файла:', err)
                })
            })

            // Удаление записи из БД
            await activityDirection.destroy()

            return res.json({message: 'Направление успешно удалено'})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Метод для удаления конкретного изображения
    async deleteImage(req, res, next) {
        try {
            const {id} = req.params
            const {imageFileName} = req.body
            
            if (!imageFileName) {
                return next(ApiError.badRequest('Имя файла изображения не указано'))
            }

            const activityDirection = await ActivityDirection.findOne({where: {id}})
            
            if (!activityDirection) {
                return next(ApiError.badRequest('Направление не найдено'))
            }

            // Проверяем, есть ли изображение в массиве
            if (!activityDirection.images.includes(imageFileName)) {
                return next(ApiError.badRequest('Изображение не найдено'))
            }

            // Удаляем файл изображения
            fs.unlink(path.resolve(__dirname, '..', 'static', imageFileName), (err) => {
                if (err) console.log('Ошибка при удалении файла:', err)
            })

            // Обновляем массив изображений
            const updatedImages = activityDirection.images.filter(img => img !== imageFileName)
            
            // Обновляем запись в БД
            await activityDirection.update({
                images: updatedImages
            })

            return res.json({
                message: 'Изображение успешно удалено',
                updatedImages
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Метод для обновления только расписания
    async updateSchedule(req, res, next) {
        try {
            const {id} = req.params
            const {schedule} = req.body
            
            if (!schedule) {
                return next(ApiError.badRequest('Расписание не предоставлено'))
            }
            
            const activityDirection = await ActivityDirection.findOne({where: {id}})
            
            if (!activityDirection) {
                return next(ApiError.badRequest('Направление не найдено'))
            }
            
            let parsedSchedule
            try {
                parsedSchedule = JSON.parse(schedule)
                
                // Проверяем и добавляем пустое название, если его нет
                Object.keys(parsedSchedule).forEach(day => {
                    if (Array.isArray(parsedSchedule[day])) {
                        parsedSchedule[day] = parsedSchedule[day].map(slot => {
                            return {
                                start: slot.start,
                                end: slot.end,
                                title: slot.title || ''
                            };
                        });
                    }
                });
            } catch (e) {
                return next(ApiError.badRequest('Неверный формат расписания. Должен быть JSON объект.'))
            }
            
            // Обновляем только расписание
            await activityDirection.update({
                schedule: parsedSchedule
            })
            
            return res.json({
                message: 'Расписание успешно обновлено',
                schedule: parsedSchedule
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ActivityDirectionController() 