const express = require('express');

// Controllers
const messageController = require('../controllers/message.js');

// Middleware
const userAuthentication = require('../middleware/auth.js');

const router = express.Router();

router.post('/sendMessage', userAuthentication.authenticateUser, messageController.sendMessage);

router.get('/getMessages', messageController.getMessages);

module.exports = router;