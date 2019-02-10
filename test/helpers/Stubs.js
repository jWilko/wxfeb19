"use strict";

const sinon = require('sinon');


class Stubs {

    constructor() {
        this.models = {};
        this.services = {};
        this.req = {
            query : {}
        };
        this.res = {
            locals : {},
            send: sinon.stub(),
            status: sinon.stub()
        };
        this.next = sinon.stub();
    }

}

module.exports = Stubs;