const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// Creating Messages Table
const Messages = sequelize.define('messages',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    }
    
})

module.exports = Messages;