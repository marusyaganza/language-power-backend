const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

function checkAuth (req, res, next) {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Auth failed');
        }
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.userData = {userId: decoded.userId};
        next()
    } catch(err) {
        console.error(err);
        return next(new HttpError('Auth failed', 401));
    }
}

module.exports = checkAuth;