// Importing Models
const Messages = require('../models/messages.js');
const Users = require('../models/users.js');

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

        const messages = await Messages.findAll({
        include: {
            model: Users,
            as: 'user',
            attributes: ['username']
        }
    });

        res.json({messages});

    } catch (err) {
        console.log(err);
    }
}