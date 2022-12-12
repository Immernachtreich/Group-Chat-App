const express = require('express');
const multer  = require('multer')
const upload = multer();

// Controllers
const messageController = require('../controllers/message.js');

// Middleware
const userAuthentication = require('../middleware/auth.js');

const router = express.Router();

router.post('/sendMessage', userAuthentication.authenticateUser, messageController.sendMessage);

router.get('/getMessages', messageController.getMessages);

router.post('/sendMedia', upload.array() ,messageController.sendMedia);

module.exports = router;