const express = require('express');

// Controllers
const groupController = require('../controllers/group.js');

// Middleware
const userAuthentication = require('../middleware/auth.js');

const router = express.Router();

router.post('/createGroup', userAuthentication.authenticateUser, groupController.createGroup);

router.get('/getGroups', userAuthentication.authenticateUser, groupController.getGroups);

router.post('/joinGroup', userAuthentication.authenticateUser, groupController.joinGroup);

module.exports = router;