"use strict";

const config = require('../resources/config.json');
const strings = require('../resources/strings.json');

const controller = {};

controller.validateSortOption = (req, res, next) => {
    const providedValue = req.query.sortOption;

    if(!providedValue) {
        return next( strings.SORT_OPTION_REQUIRED );
    } else if( ! config.validSortOptions.includes(providedValue) ) {
        return next( strings.SORT_OPTIONS_INVALID );
    }

    res.locals.sortOption = providedValue;
    return next();
};

controller.getProducts = (req, res, next) => {
    return next();
};

controller.sort = (req, res, next) => {
    res.locals.sortedProducts = null;
    return next();
};

controller.respond = (req, res, next) => {
    res.status(200);
    return res.send(res.locals.sortedProducts);
};

module.exports = controller;
