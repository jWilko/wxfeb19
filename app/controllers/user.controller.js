"use strict";

const User = require('../models/User.model.js');

const controller = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.get = (req, res, next) => {
    const userProps = {
        name : 'Hercules',
        token : '1234-455662-22233333-3333'
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
