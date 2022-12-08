const jwt = require('jsonwebtoken');

const Users = require('../models/users.js');

exports.authenticateUser = async (req, res, next) => {

    try{

        const token = req.header('Authorization');

        const userDetails = jwt.verify(token, process.env.SECRET_KEY);

        const user = await Users.findByPk(userDetails.userId);

        req.user = user;

        next();

    } catch(err) {

        res.status(404).json({token: 'Doesnt Exists'});
        
        console.log(err);
    }
    

}