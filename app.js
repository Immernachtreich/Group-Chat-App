// Package Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// .env Imports and config
const dotenv = require('dotenv');
dotenv.config();

// MySQL Database import (Local Import)
const sequelize = require('./util/database.js'); 

// Routes Import
const userRoutes = require('./routes/user.js');

// Initializing the backend
const app = express();

// Initializing Middleware
app.use(cors({ origin: '*' })); 
app.use(bodyParser.json({ extended: false }));

// Routes
app.use('/user', userRoutes);

// Error Routes
app.use((req, res) => {
    res.status(404).send(`<h1> Page Not Found </h1>`);
});

// Initializing database and listening to port
sequelize.sync()
    .then((result) => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });