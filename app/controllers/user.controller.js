"use strict";

const User = require('../models/User.model.js');

const controller = {};

controller.get = (req, res, next) => {
    const user = new User();
    res.status(200);
    return res.send(user);
};

module.exports = controller;
