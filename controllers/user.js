// Model imports
const Users = require('../models/users.js');

// Package Imports
const bcrypt = require('bcrypt');
const Op = require('Sequelize').Op;

exports.signupUser = async (req, res, next) => {
    
    const {username, email, phoneNumber, password} = req.body;

    try {

        const user = await Users.findOne({
            where: {
                [Op.or]: [{ email: email },{ phoneNumber: phoneNumber }]
            }
        });

        if(user) {
            throw new Error();
        }

        const saltRounds = 10;

        const hash = await bcrypt.hash(password, saltRounds);

        await Users.create({
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            password: hash,
        });
        
        res.status(201).json({ success: true });

    } catch(err) {
        console.log(err);
        res.status(409).json({ success: false, message: 'User already exists' });
    }
}