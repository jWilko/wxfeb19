"use strict";

const testBase = {};

testBase.sinon = require('sinon');
testBase.proxyquire = require('proxyQuire');
testBase.expect = require('chai').expect;
testBase.Stubs = require('./Stubs.js');

module.exports = testBase;
