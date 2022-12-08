// Package Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// .env Imports and config
const dotenv = require('dotenv');
dotenv.config();

// MySQL Database import (Local Import)
const sequelize = require('./util/database.js'); 

// Model Imports
const Users = require('./models/users.js');
const Messages = require('./models/messages.js');

// Routes Import
const userRoutes = require('./routes/user.js');
const MessageRoutes = require('./routes/message.js');

// Initializing the backend
const app = express();

// Initializing Middleware
app.use(cors({ origin: '*' })); 
app.use(bodyParser.json({ extended: false }));

// Routes
app.use('/user', userRoutes);
app.use('/message', MessageRoutes);

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

// Initializing database and listening to port
sequelize.sync()
    .then((result) => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });