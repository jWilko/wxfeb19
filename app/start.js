"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const config = require('./resources/config.json');
const routes = require('./routes/main.routes.js');
const pathNotFound = require('./errors/pathNotFound.error.js');
const requestError = require('./errors/request.error.js');

const app = express();

// Security
app.use(helmet());

// Handle inbound json data
app.use(bodyParser.json());

// Valid request Routing
app.use('/', routes);

// Error handling
app.use(pathNotFound);
app.use(requestError);

// Start listening
const listener = app.listen(config.port, () => {
    const actualPort = listener.address().port;
    console.log(`Express server started. Listening on port ${actualPort}\n\n`);
});
