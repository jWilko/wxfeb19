"use strict";

const sinon = require('sinon');


class Stubs {

    constructor() {
        this.models = {};
        this.req = sinon.stub();
        this.res = {
            send: sinon.stub(),
            status: sinon.stub()
        };
        this.next = sinon.stub();
    }

}

module.exports = Stubs;