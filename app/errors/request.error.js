"use strict";

const strings = require('../resources/strings.json');
const ResponseBody = require('../models/ResponseBody.model.js');

const requestError = (err, req, res, next) => {
    let errorMessage;
    let status;

    if(typeof err === 'string') {
        status = 400;
        errorMessage = err;
    } else {
        console.error('Exception caught : ', err);
        status = 500;
        errorMessage = strings.GENERIC_SERVER_EXCEPTION;
    }

    const responseBody = new ResponseBody(errorMessage);
    res.status(status);
    return res.send(responseBody);
};

module.exports = requestError;
