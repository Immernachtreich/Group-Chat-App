const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// Creating UserGroups Table
const UserGroups = sequelize.define('userGroups',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull:false
    }
});

module.exports = UserGroups;