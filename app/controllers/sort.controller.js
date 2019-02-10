"use strict";

const config = require('../resources/config.json');
const strings = require('../resources/strings.json');
const dataService = require('../services/data.service.js');

const controller = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.getData = async (req, res, next) => {
    try {
        if(res.locals.sortOption === 'Recommended') {
            res.locals.products = await dataService.getRecommendedProducts();
        } else {
            res.locals.products = await dataService.getAllProducts(req, res);
        }
        return next();
    } catch (err) {
        next(err);
    }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.sort = (req, res, next) => {

    function alphaSort(a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    }

    res.locals.sortedProducts = res.locals.products.sort( (a,b) => {
        switch (res.locals.sortOption) {
            case 'Low' :
                return a.price - b.price;
            case 'High' :
                return b.price - a.price;
            case 'Ascending' :
                return alphaSort(a.name, b.name);
            case 'Descending' :
                return alphaSort(b.name, a.name);
            case 'Recommended' :
                return b.quantity - a.quantity;
        }
    });
    return next();
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.respond = (req, res, next) => {
    res.status(200);
    return res.send(res.locals.sortedProducts);
};

module.exports = controller;
