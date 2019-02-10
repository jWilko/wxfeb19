"use strict";

const config = require('../resources/config.json');
const User = require('../models/User.model.js');

const controller = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.get = (req, res, next) => {
    const userProps = {
        name : config.username,
        token : config.token
    };
    res.locals.user = new User(userProps);
    return next();
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.respond = (req, res, next) => {
    res.status(200);
    return res.send(res.locals.user);
};

module.exports = controller;
