"use strict";

const router = require('express').Router();

const userController = require('../controllers/user.controller.js');
const sortController = require('../controllers/sort.controller.js');

router.get('/', (req, res, next) => {
    return res.redirect('/user');
});

router.get('/user', userController.get);

router.get('/sort',
    sortController.validateSortOption,
    sortController.getProducts,
    sortController.sort,
    sortController.respond
);

module.exports = router;
