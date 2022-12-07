const express = require('express');

const userController = require('../controllers/user.js')

const router = express.Router();

router.post('/signup', userController.signupUser);

module.exports = router;