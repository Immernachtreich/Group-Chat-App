// Package Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CronJob = require('cron').CronJob;

// .env Imports and config
const dotenv = require('dotenv');
dotenv.config();

// MySQL Database import (Local Import)
const sequelize = require('./util/database.js'); 

//Node Imports
const path = require('path');

// Model Imports
const Users = require('./models/users.js');
const Messages = require('./models/messages.js');
const Groups = require('./models/group.js');
const UserGroups = require('./models/userGroups.js');

// Routes Import
const userRoutes = require('./routes/user.js');
const messageRoutes = require('./routes/message.js');
const groupRoutes = require('./routes/group.js');

// Initializing the backend
const app = express();

// Initializing Middleware
app.use(cors({ origin: '*' })); 
app.use(bodyParser.json({ extended: false }));

// Routes
app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);

//Deployment Route
app.use((req, res, next) => {

    res.sendFile(path.join(__dirname, `frontend/${req.url}`));
});

// Error Routes
app.use((req, res) => {
    res.status(404).send(`<h1> Page Not Found </h1>`);
});


/* 
* Defining Relationships
*/

// One To Many Users 1<---->M Messages
Messages.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' });
Users.hasMany(Messages);

// One To Many Groups 1<---->M Messages
Messages.belongsTo(Groups, { constraints: true, onDelete: 'CASCADE' });
Groups.hasMany(Messages);

// Many To Many Users M<---->M Groups
Users.belongsToMany(Groups, { through: UserGroups });
Groups.belongsToMany(Users, { through: UserGroups });

// Initializing database and listening to port
sequelize.sync()
    .then((result) => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });