// Importing Models
const Messages = require('../models/messages.js');
const Users = require('../models/users.js');
const {Op} = require('sequelize');

exports.sendMessage = async (req, res, next) => {
    try {

        const message = req.body.message;
        const user = req.user;

        const response = await user.createMessage({message: message});

        res.json({ success: true, response, username: user.username });

    } catch (err) {
        console.log(err);
    }


}

exports.getMessages = async (req, res, next) => {

    try {
        const lastMessageId = parseInt(req.query.lastMessageId) || -1;

        const messages = await Messages.findAll({
            include: {
                model: Users,
                as: 'user',
                attributes: ['username']
            },
            where: {
                id: {
                    [Op.gt]: lastMessageId
                }
            }
        });

        res.json({messages});

    } catch (err) {
        console.log(err);
    }
}
