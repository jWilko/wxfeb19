"use strict";

const router = require('express').Router();

const userController = require('../controllers/user.controller.js');
const sortController = require('../controllers/sort.controller.js');
const trolleyController = require('../controllers/trolley.controller.js');

router.get('/', (req, res, next) => {
    return res.redirect('/user');
});

router.get('/user',
    userController.get,
    userController.respond
);

router.get('/sort',
    sortController.validateSortOption,
    sortController.getData,
    sortController.sort,
    sortController.respond
);

router.post('/trolleyTotal',
    trolleyController.validateTrolleyData,
    trolleyController.getTotal,
    trolleyController.respond
);

router.post('/localTrolleyTotal',
    trolleyController.validateTrolleyData,
    trolleyController.calcTotal,
    trolleyController.respond
);

module.exports = router;
