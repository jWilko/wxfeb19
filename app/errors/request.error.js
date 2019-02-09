"use strict";

const strings = require('../resources/strings.json');
const ResponseBody = require('../models/ResponseBody.model.js');

const requestError = (err, req, res, next) => {
    console.error('Exception caught : ', err);

    const responseBody = new ResponseBody(strings.GENERIC_SERVER_EXCEPTION);
    res.status(500);
    return res.send(responseBody);
};

module.exports = requestError;
