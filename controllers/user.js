// Model imports
const Users = require('../models/users.js');

// Package Imports
const bcrypt = require('bcrypt');
const Op = require('Sequelize').Op;
const jwt = require('jsonwebtoken');

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
        res.status(409).json({ success: false, message: 'User already exists' });
    }
}

exports.loginUser = async (req, res, next) => {

    const {email, password} = req.body;

    console.log(email);
    
    try {

        const user = await Users.findOne({ where: { email: email } });

        if(user) {

            const correctPassword = await bcrypt.compare(password, user.password);
            
            if(correctPassword) {

                res.json({
                    success: true,
                    token: generateToken(user.id, user.username)
                });

            } else {

                res.status(401).json({
                    success: false,
                    message: 'Wrong Password'
                });
            }

        } else {
            res.status(404).json({
                success: false,
                message: 'User Doesnt Exists'
            });
        }


    } catch(err) {

        console.log(err);
    }
}

function generateToken (id, username) {

    return jwt.sign({
        userId: id,
        username: username
    }, process.env.SECRET_KEY);
}