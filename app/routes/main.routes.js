"use strict";

const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Howdy. Thanks for visiting.');
});

module.exports = router;
