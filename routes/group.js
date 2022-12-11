const express = require('express');

// Controllers
const groupController = require('../controllers/group.js');

// Middleware
const userAuthentication = require('../middleware/auth.js');

const router = express.Router();

router.post('/createGroup', userAuthentication.authenticateUser, groupController.createGroup);

router.get('/getGroups', userAuthentication.authenticateUser, groupController.getGroups);

router.post('/joinGroup', userAuthentication.authenticateUser, groupController.joinGroup);

router.get('/getGroupMembers', userAuthentication.authenticateUser, groupController.getGroupMembers);

router.put('/makeAdmin', groupController.makeAdmin);

router.post('/removeUserFromGroup', groupController.removeUserFromGroup);

module.exports = router;