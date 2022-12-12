// Importing Models
const Messages = require('../models/messages.js');
const Users = require('../models/users.js');
const {Op} = require('sequelize');

exports.sendMessage = async (req, res, next) => {
    try {

        const groupId = req.query.groupId;
        const message = req.body.message;
        const user = req.user;

        const response = await Messages.create({
            message: message,
            userId: user.id,
            groupId: groupId
        });

        res.json({ success: true, response, username: user.username });

    } catch (err) {
        console.log(err);
    }
}

exports.getMessages = async (req, res, next) => {

    try {
        const lastMessageId = parseInt(req.query.lastMessageId) || -1;
        const groupId = parseInt(req.query.groupId);

        const messages = await Messages.findAll({
            include: {
                model: Users,
                as: 'user',
                attributes: ['username']
            },
            where: {
                id: {
                    [Op.gt]: lastMessageId
                },
                groupId: groupId
            }
        });

        res.json({messages});

    } catch (err) {
        console.log(err);
    }
}

exports.sendMedia = async (req, res, next) => {
    console.log(req.file, req.body);
}