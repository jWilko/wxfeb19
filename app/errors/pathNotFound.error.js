"use strict";

const strings = require('../resources/strings.json');
const ResponseBody = require('../models/ResponseBody.model.js');

const pathNotFound = (req, res, next) => {
    const responseBody = new ResponseBody(strings.PATH_NOT_FOUND);
    res.status(404);
    return res.send(responseBody);
};

module.exports = pathNotFound;
