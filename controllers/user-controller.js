const {validationResult} = require('express-validator');
const User = require('../models/user');
const HttpError = require('../models/http-error');


async function getUsers(req, res, next) {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        console.error(err);
        return next(new HttpError(`fetching users failed, please try later`, 500));
    }
    if(!users) {
        return next(new HttpError('could finds users', 404));
    } 
    res.json({users: users.map(user => user.toObject({getters: true}))});
}

async function login(req, res, next) {
    const {email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors.errors);
        return next(new HttpError('invalid inputs passed, please check your data', 422));
    }
    let user;
    try {
        user = await User.findOne({email: email});
    } catch (err) {
        console.error(err);
        
        return next(new HttpError(`login user failed, please try later`, 500));
    }

    if(!user || user.password !== password) {
        return next(new HttpError('could not identify user, credentials seems wrong', 401));
    } 
    res.json({...user.toObject({getters: true})});
}

async function signup(req, res, next) {
    const {name, email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors);
        return next(new HttpError('invalid inputs passed, please check your data', 422));
    }
    let  existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        return next(new HttpError(`sign up failed, please try later`, 500));
    }
        
    if(existingUser) {
        return next(new HttpError(`could not signup user, the email ${email} is already taken`, 401));
    }
    const user = new User({name, email, password, wordCards: []});
    try {
        await user.save();
    } catch (err) {
        return next(new HttpError(`sign up failed, please try later`, 500));
    }
    res.status(201).json({...user.toObject({getters: true})});
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;