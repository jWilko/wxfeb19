"use strict";

const {Stubs, expect, sinon, proxyquire} = (require('../../test/helpers/testBase.js'));

describe('Request error', () => {
    let target;
    let stubs;

    beforeEach(() => {
        stubs = new Stubs();
        stubs.models.ResponseBody = sinon.stub().returns({iam:'ResponseBody model instance'});
        target = proxyquire(`${__dirname}/request.error.js`, {
            '../models/ResponseBody.model.js' : stubs.models.ResponseBody
        });
    });

    it('should be a function', function () {
        expect(typeof target).to.equal('function');
    });

    describe('when called', function () {
        describe('when the err is a string', function () {
            beforeEach(() => {
                target('some error', stubs.req, stubs.res, stubs.next);
            });
            it('should create a RespoonsBody object', function () {
                expect(stubs.models.ResponseBody.callCount).to.equal(1);
                expect(stubs.models.ResponseBody.args[0][0]).to.equal('some error');
            });
            it('should set the response status to 400', function () {
                expect(stubs.res.status.callCount).to.equal(1);
                expect(stubs.res.status.args[0][0]).to.equal(400);
            });
            it('should send the ResponseBody instance to the requester', function () {
                expect(stubs.res.send.callCount).to.equal(1);
                expect(stubs.res.send.args[0][0].iam).to.equal('ResponseBody model instance');
            });
        });
        describe('when the err is not a string', function () {
            beforeEach(() => {
                target({}, stubs.req, stubs.res, stubs.next);
            });
            it('should create a RespoonsBody object', function () {
                expect(stubs.models.ResponseBody.callCount).to.equal(1);
                expect(stubs.models.ResponseBody.args[0][0]).to.contain('Something went wrong');
            });
            it('should set the response status to 500', function () {
                expect(stubs.res.status.callCount).to.equal(1);
                expect(stubs.res.status.args[0][0]).to.equal(500);
            });
            it('should send the ResponseBody instance to the requester', function () {
                expect(stubs.res.send.callCount).to.equal(1);
                expect(stubs.res.send.args[0][0].iam).to.equal('ResponseBody model instance');
            });
        });
    });

});



