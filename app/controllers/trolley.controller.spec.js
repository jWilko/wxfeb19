"use strict";

const {Stubs, expect, sinon, proxyquire} = (require('../../test/helpers/testBase.js'));

describe('Trolley controller', () => {
    let stubs;
    let target;

    beforeEach(() => {
        stubs = new Stubs();
        target = require('./trolley.controller.js');
    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('validateTrolleyData method', () => {

        it('should be a function', function () {
            expect(typeof target.validateTrolleyData).to.equal('function');
        });

        describe('when called', () => {
            let validBody;

            beforeEach(() => {
                validBody = {
                    products: [
                        { name: "vegemite", price: 3.05 }
                    ],
                    specials: [
                        {
                            quantities: [
                                { name: "vegemite", quantity: 2 }
                            ],
                            total: 4.50
                        }
                    ],
                    quantities: [
                        { name: "vegemite", quantity: 2 }
                    ]
                };
            })

            describe('and top level properties are missing', () => {
                beforeEach(() => {
                    stubs.req.body = {};
                    target.validateTrolleyData(stubs.req, stubs.res, stubs.next);
                });
                it('should create an empty array for missing products property', function () {
                    expect(stubs.res.locals.trolleyData.products).to.deep.equal([]);
                });
                it('should create an empty array for missing specials property', function () {
                    expect(stubs.res.locals.trolleyData.specials).to.deep.equal([]);
                });
                it('should create an empty array for missing quantities property', function () {
                    expect(stubs.res.locals.trolleyData.quantities).to.deep.equal([]);
                });
                it('should call next with no params', function () {
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0].length).to.equal(0);
                });
            });

            describe('and there is no body', () => {
                it('should fail with appropriate message', function () {
                    stubs.req.body = null;
                    target.validateTrolleyData(stubs.req, stubs.res, stubs.next);
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0][0]).to.equal('Invalid request. Body data is required.');
                });
            });

            describe('with valid data', () => {
                beforeEach(() => {
                    stubs.req.body = validBody;
                    target.validateTrolleyData(stubs.req, stubs.res, stubs.next);
                });
                it('should pass on the valid object', function () {
                    expect(stubs.res.locals.trolleyData).to.deep.equal(validBody);
                });
                it('should call next with no params', function () {
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0].length).to.equal(0);
                });
            });

        });

    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('getTotal method', () => {

        it('should be a function', function () {
            expect(typeof target.getTotal).to.equal('function');
        });

        // TODO : Add tests
    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('respond method', () => {

        it('should be a function', function () {
            expect(typeof target.respond).to.equal('function');
        });

        describe('When called', () => {
            beforeEach(() => {
                stubs.res.locals.trolleyTotalPrice = 101.99;
                target.respond(stubs.req, stubs.res, stubs.next);
            });

            it('should set the response status to 200', function () {
                expect(stubs.res.status.callCount).to.equal(1);
                expect(stubs.res.status.args[0][0]).to.equal(200);
            });
            it('should send the existing sorted products list to the requester', function () {
                expect(stubs.res.send.callCount).to.equal(1);
                expect(stubs.res.send.args[0][0]).to.equal('101.99');
            });
        });
    });

});
