const {SocialProject} = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require('path');
const fs = require('fs');

class SocialProjectController {
    async getAll(req, res, next) {
        try {
            const projects = await SocialProject.findAll();
            return res.json(projects);
        } catch (err) {
            return next(ApiError.internal(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const project = await SocialProject.findOne({where: {id}});
            
            if (!project) {
                return next(ApiError.badRequest('Проект не найден'));
            }

            return res.json(project);
        } catch (err) {
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
            
            const project = await SocialProject.create({
                name, 
                description, 
                img: fileName
            });
            
            return res.json(project);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, description} = req.body;
            
            const project = await SocialProject.findOne({where: {id}});
            if (!project) {
                return next(ApiError.badRequest('Проект не найден'));
            }
            
            // Обработка изображения
            let imgName = project.img;
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
            await project.update({
                name: name || project.name,
                description: description || project.description,
                img: imgName
            });
            
            return res.json(project);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            
            const project = await SocialProject.findOne({where: {id}});
            if (!project) {
                return next(ApiError.badRequest('Проект не найден'));
            }
            
            // Удаляем изображение
            fs.unlink(path.resolve(__dirname, '..', 'static', project.img), (err) => {
                if (err) console.log('Ошибка при удалении файла:', err);
            });
            
            // Удаляем запись
            await project.destroy();
            
            return res.json({message: 'Проект удален'});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new SocialProjectController(); 