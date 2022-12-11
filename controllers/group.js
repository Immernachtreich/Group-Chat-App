// Package Imports
const { v4: uuidv4 } = require('uuid');

// Importing Models
const Groups = require('../models/group.js');
const UserGroups = require('../models/userGroups.js');
const Users = require('../models/users.js');

const {Op} = require('sequelize');

exports.createGroup = async (req, res, next) => {

    const userId = req.user.id;
    const groupName = req.body.groupName;
    const groupUrl = groupName + '/' + uuidv4();

    const response = await Groups.create({
        name: groupName,
        groupUrl: groupUrl
    });

    await UserGroups.create({
        userId: userId,
        groupId: response.dataValues.id,
        isAdmin: true
    })

    res.json({success: true, user: req.user, group: response.dataValues});
}

exports.getGroups = async (req, res, next) => {

    try {

        const userId = req.user.id;

        const groups = await UserGroups.findAll({
            where: { userId: userId }
        });

        const groupIds = [];

        groups.forEach((group) => {
            groupIds.push(group.dataValues.groupId);
        })

        console.log(groupIds);

        const groupDetails = await Groups.findAll({
            where: { id: groupIds }
        });


        res.json({groupDetails: groupDetails});

    } catch(err) {
        console.log(err);
    }
}

exports.joinGroup = async (req, res, next) => {

    try {

        const group = await Groups.findOne({ where: { groupUrl: req.body.groupUrl } });

        if(!group) {
            res.status(404).json({message: 'group doesnt exists'});
            res.end();
        }

        await UserGroups.create({ 
            groupId: group.dataValues.id, 
            userId: req.user.id,
            isAdmin: false 
        });

        res.status(201).json({success: true, group});

    } catch(err) {
        
        console.log(err.name);
        if(err.name == 'SequelizeUniqueConstraintError') {
            res.status(409).json({ err: err });
        }
        
    }
}

exports.getGroupMembers = async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.query.groupId;

    const userGroups = await UserGroups.findAll({
        where: {
            groupId: groupId
        },
        order: [["userId", "ASC"]]
    });

    const userGroup = await UserGroups.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    });

    const userIds =[];

    userGroups.forEach((user) => {
        userIds.push(user.dataValues.userId);
    })

    // users will be an array
    const users = await Users.findAll({
        where: { id: userIds }
    });

    res.json({users, userGroups, currentUserGroup: userGroup});
}

exports.makeAdmin = async (req, res, next) => {
    const {userId, groupId} = req.body;

    await UserGroups.update({isAdmin: true},{
        where: {
            userId: userId,
            groupId: groupId
        }
    });

    res.json({success: true});
}

exports.removeUserFromGroup = async (req, res, next) => {
    try {

        const {userId, groupId} = req.body;
        console.log(userId, groupId)
        const user = await UserGroups.findOne({
            where: {
                userId: userId,
                groupId: groupId
            }
        });

        await user.destroy();

        res.json({success: true});

    } catch(err) {
        console.log(err);
    }
}