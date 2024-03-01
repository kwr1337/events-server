const seq = require('../db')
const {DataTypes} = require('sequelize')

const Events = seq.define("events", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description2: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    place: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.STRING,
        allowNull: true
    },
    age_limit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ref_video: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ref_buy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true
    }

});

module.exports = Events