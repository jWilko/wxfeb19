"use strict";

const User = require('../models/User.model.js');

const controller = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.get = (req, res, next) => {
    res.locals.user = new User();
    return next();
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.respond = (req, res, next) => {
    res.status(200);
    return res.send(res.locals.user);
};

module.exports = controller;
