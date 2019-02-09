"use strict";

const router = require('express').Router();

const userController = require('../controllers/user.controller.js');

router.get('/', (req, res, next) => {
    return res.redirect('/user');
});

router.get('/user', userController.get);

module.exports = router;
