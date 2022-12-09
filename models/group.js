const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// Creating Groups Table
const Groups = sequelize.define('groups',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
    
})

module.exports = Groups;