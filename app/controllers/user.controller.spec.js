"use strict";

const {Stubs, expect, sinon, proxyquire} = (require('../../test/helpers/testBase.js'));

describe('User controller', () => {
    let target;
    let stubs;

    beforeEach(() => {
        stubs = new Stubs();
        stubs.models.User = sinon.stub().returns({iam:'User model instance'});
        target = proxyquire(`${__dirname}/user.controller.js`, {
            '../models/User.model.js' : stubs.models.User
        });
    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('get method', () => {

        it('should be a function', function () {
            expect(typeof target.get).to.equal('function');
        });

        describe('When called', () => {
            beforeEach(() => {
                target.get(stubs.req, stubs.res, stubs.next);
            });

            it('should create a User object', function () {
                expect(stubs.models.User.callCount).to.equal(1);
            });
            it('should assign the user instance to the response scope', function () {
                expect(stubs.res.locals.user.iam).to.equal('User model instance');
            });
        });
    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('respond method', () => {

        it('should be a function', function () {
            expect(typeof target.respond).to.equal('function');
        });

        describe('When called', () => {
            beforeEach(() => {
                stubs.res.locals.user = 'some user';
                target.respond(stubs.req, stubs.res, stubs.next);
            });

            it('should set the response status to 200', function () {
                expect(stubs.res.status.callCount).to.equal(1);
                expect(stubs.res.status.args[0][0]).to.equal(200);
            });
            it('should send the user object to the requester', function () {
                expect(stubs.res.send.callCount).to.equal(1);
                expect(stubs.res.send.args[0][0]).to.equal('some user');
            });
        });
    });

});
