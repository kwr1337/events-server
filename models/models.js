const seq = require('../db')
const {DataTypes} = require('sequelize')

const Direction = seq.define("direction", {
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
    img: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

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
    location: {
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
    directionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'directions',
            key: 'id'
        }
    }
});

const SocialProject = seq.define("social_project", {
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
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const ActivityDirection = seq.define('activity_direction', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    description2: {type: DataTypes.TEXT, allowNull: true},
    mainImage: {type: DataTypes.STRING, allowNull: false},
    images: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
    schedule: {
        type: DataTypes.JSON, 
        defaultValue: {
            "monday": [],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": [],
            "saturday": [],
            "sunday": []
        },
        comment: 'JSON формат с расписанием по дням недели. Каждый интервал имеет start, end и необязательное title.'
    },
    videoLink: {type: DataTypes.STRING}
})

// Устанавливаем связи
Direction.hasMany(Events)
Events.belongsTo(Direction)

module.exports = {
    Direction,
    Events,
    SocialProject,
    ActivityDirection
}