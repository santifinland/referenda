const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../config.js');


exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 6 * 3600
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                const err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        const err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

exports.verifyAdmin = function (req, res, next) {

    if (!req.decoded) {
        const err = new Error('Your are not authorized to perform that');
        err.status = 403;
        return next(err);
    } else {
        if (!req.decoded.admin) {
            const err = new Error('You are not authorized admin');
            err.status = 403;
            return next(err);
        } else
            next();
    }
};