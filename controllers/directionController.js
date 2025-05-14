const {Direction, Events} = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require('path');
const fs = require('fs');

class DirectionController {
    async getAll(req, res, next) {
        try {
            console.log('Fetching all directions...');
            const directions = await Direction.findAll({
                include: [Events]
            });
            console.log(`Found ${directions.length} directions`);
            return res.json(directions);
        } catch (err) {
            console.error('Error in getAll directions:', err);
            return next(ApiError.internal(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const id = req.params.id;
            console.log(`Fetching direction with id: ${id}`);
            const direction = await Direction.findOne({
                where: {id},
                include: [Events]
            });
            
            if (!direction) {
                console.log(`Direction with id ${id} not found`);
                return next(ApiError.badRequest('Направление не найдено'));
            }

            console.log(`Found direction: ${direction.name}`);
            return res.json(direction);
        } catch (err) {
            console.error('Error in getOne direction:', err);
            return next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {name, description} = req.body;
            
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Изображение обязательно'));
            }
            
            const {img} = req.files;
            const fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            
            const direction = await Direction.create({name, description, img: fileName});
            return res.json(direction);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, description} = req.body;
            
            const direction = await Direction.findOne({where: {id}});
            if (!direction) {
                return next(ApiError.badRequest('Направление не найдено'));
            }
            
            // Обработка изображения
            let imgName = direction.img;
            if (req.files && req.files.img) {
                // Удаляем старое изображение
                fs.unlink(path.resolve(__dirname, '..', 'static', imgName), (err) => {
                    if (err) console.log('Ошибка при удалении файла:', err);
                });
                
                const img = req.files.img;
                imgName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', 'static', imgName));
            }
            
            // Обновляем запись
            await direction.update({
                name: name || direction.name,
                description: description || direction.description,
                img: imgName
            });
            
            return res.json(direction);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            
            const direction = await Direction.findOne({where: {id}});
            if (!direction) {
                return next(ApiError.badRequest('Направление не найдено'));
            }
            
            // Удаляем изображение
            fs.unlink(path.resolve(__dirname, '..', 'static', direction.img), (err) => {
                if (err) console.log('Ошибка при удалении файла:', err);
            });
            
            // Удаляем запись
            await direction.destroy();
            
            return res.json({message: 'Направление удалено'});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new DirectionController(); 