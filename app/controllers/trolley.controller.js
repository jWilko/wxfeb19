"use strict";

const strings = require('../resources/strings.json');
const dataService = require('../services/data.service.js');

const controller = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.validateTrolleyData = (req, res, next) => {

    if(!req.body) {
        return next(strings.TROLLEY_NO_BODY);
    }

    res.locals.trolleyData = req.body || {};
    res.locals.trolleyData.products = res.locals.trolleyData.products || [];
    res.locals.trolleyData.specials = res.locals.trolleyData.specials || [];
    res.locals.trolleyData.quantities = res.locals.trolleyData.quantities || [];

    // TODO: Enhance validation. Stop bad requests getting through to data API

    return next();
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.getTotal = async (req, res, next) => {
    try {
        res.locals.trolleyTotalPrice = await dataService.getTrolleyTotal(res.locals.trolleyData);
        return next();
    } catch (err) {
        err.appMessage = strings.TROLLEY_CALCULATION_FAILED;
        next(err);
    }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
controller.respond = (req, res, next) => {
    res.status(200);
    return res.send(res.locals.trolleyTotalPrice.toString());
};

module.exports = controller;
