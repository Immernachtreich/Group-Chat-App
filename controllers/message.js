// Importing Models
const Messages = require('../models/messages.js');

exports.sendMessage = async (req, res, next) => {
    try {

        const message = req.body.message;
        const user = req.user;

        const response = await user.createMessage({message: message});

        res.json({ success: true, response });

    } catch (err) {
        console.log(err);
    }


}