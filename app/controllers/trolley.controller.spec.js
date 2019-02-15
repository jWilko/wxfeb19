"use strict";

const {Stubs, expect, proxyquire, sinon} = (require('../../test/helpers/testBase.js'));

describe('Trolley controller', () => {
    let stubs;
    let target;

    beforeEach(() => {
        stubs = new Stubs();
        stubs.services.data = {
            getTrolleyTotal : sinon.stub()
        };
        target = proxyquire(`${__dirname}/trolley.controller.js`, {
            '../services/data.service.js' : stubs.services.data
        });
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
            });

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


            describe('when there are quantities for absent products', () => {
                it('should fail with appropriate message', function () {
                    stubs.req.body = validBody;
                    stubs.req.body.products[0].name = 'jam';
                    target.validateTrolleyData(stubs.req, stubs.res, stubs.next);
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0][0]).to.equal('Invalid request. Product details missing for specified quantity.');
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

        describe('when there are no errors', () => {
            beforeEach(async () => {
                stubs.services.data.getTrolleyTotal.returns(Promise.resolve('some price'));
                await target.getTotal(stubs.req, stubs.res, stubs.next);
            });
            it('should capture the calculated trolley total',  function () {
                expect(stubs.res.locals.trolleyTotalPrice).to.equal('some price');
            });
            it('should call next with no params',  function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0].length).to.equal(0);
            });
        });

        describe('when there are errors', () => {
            beforeEach(async () => {
                stubs.services.data.getTrolleyTotal.returns(Promise.reject({message:'some error'}));
                await target.getTotal(stubs.req, stubs.res, stubs.next);
            });
            it('should not capture the calculated trolley total',  function () {
                expect(stubs.res.locals.trolleyTotalPrice).to.equal(undefined);
            });
            it('should call next with the error object and a custom appMessage',  function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0][0].message).to.equal('some error');
                expect(stubs.next.args[0][0].appMessage).to.contain('Trolley Total calculation was unsuccessful');
            });
        });

    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('calcTotal method', () => {
        let validBody;

        beforeEach(() => {
            validBody = {
                products: [
                    { name: "vegemite", price: 10 },
                    { name: "jam", price: 5 }
                ],
                specials: [],
                quantities: []
            };
        });

        it('should be a function', function () {
            expect(typeof target.calcTotal).to.equal('function');
        });

        describe('when there are no quantities', () => {
            it('should set the total price to 0', function () {
                stubs.req.body = validBody;
                target.calcTotal(stubs.req, stubs.res, stubs.next);
                expect(stubs.res.locals.trolleyTotalPrice).to.equal(0);
            });
        });

        describe('where there are quantities', () => {
            let quantity1;
            let quantity2;
            let special1;
            let special2;


            beforeEach(() => {
                quantity1 = { name: 'vegemite', quantity: '7' };
                quantity2 = { name: 'jam', quantity: '4' };
                validBody.quantities.push(quantity1);
                validBody.quantities.push(quantity2);
            });

            describe('and no specials', () => {
                it('should do a simple calculation', function () {
                    stubs.req.body = validBody;
                    target.calcTotal(stubs.req, stubs.res, stubs.next);
                    // calc-1 = ($10 x 7) + ($5 x 4) = 90
                    expect(stubs.res.locals.trolleyTotalPrice).to.equal(90);
                });
            });

            describe('and simple specials', () => {
                beforeEach(() => {
                    special1 = {
                        quantities: [
                            { name: "apple juice", quantity: 2 }
                        ],
                        total: 15
                    };
                    special2 = {
                        quantities: [
                            { name: "jam", quantity: 12 }
                        ],
                        total: 12
                    };
                });

                describe('when none match', () => {
                    beforeEach(() => {
                        validBody.quantities.push(special1);  // no match on product name
                        validBody.quantities.push(special2);  // no match on quantity
                    });

                    it('should ignore the specials', function () {
                        stubs.req.body = validBody;
                        target.calcTotal(stubs.req, stubs.res, stubs.next);
                        // calc-1 = ($10 x 7) + ($5 x 4) = 90
                        expect(stubs.res.locals.trolleyTotalPrice).to.equal(90);
                    });
                });

                describe('when some match', () => {
                    beforeEach(() => {
                        special1.quantities[0].name = 'vegemite';
                        validBody.quantities.push(special1);  // match
                        validBody.quantities.push(special2);  // no match on quantity
                    });

                    it('should calculate the matching special and reflect in total', function () {
                        stubs.req.body = validBody;
                        target.calcTotal(stubs.req, stubs.res, stubs.next);
                        // calc-1 = ($10 x 7) + ($5 x 4) = 90
                        // calc-2 = ($15 x 3) + ($10 x 1) + ($5 x 4) = 75
                        expect(stubs.res.locals.trolleyTotalPrice).to.equal(75);
                    });
                });

                describe('when all match', () => {
                    beforeEach(() => {
                        special1.quantities[0].name = 'vegemite';
                        special2.quantities[0].quantity = 3;
                        validBody.quantities.push(special1);  // match
                        validBody.quantities.push(special2);  // match
                    });

                    it('should calculate the matching special and reflect in total', function () {
                        stubs.req.body = validBody;
                        target.calcTotal(stubs.req, stubs.res, stubs.next);
                        // calc-1 = ($10 x 7) + ($5 x 4) = 90
                        // calc-2 = ($15 x 3) + ($10 x 1) + ($12 x 1) + ($5 x 1) = 72
                        expect(stubs.res.locals.trolleyTotalPrice).to.equal(72);
                    });
                });

                describe('when specials do not save money', () => {
                    beforeEach(() => {
                        special1.quantities[0].name = 'vegemite';
                        special2.quantities[0].quantity = 3;
                        special2.total = 50;
                        validBody.quantities.push(special1);  // match
                        validBody.quantities.push(special2);  // match
                    });

                    it('should calculate the specials but only return the best price', function () {
                        stubs.req.body = validBody;
                        target.calcTotal(stubs.req, stubs.res, stubs.next);
                        // calc-1 = ($10 x 7) + ($5 x 4) = 90
                        // calc-2 = ($15 x 3) + ($10 x 1) + ($5 x 4) = 75
                        // calc-3 = ($10 x 7) + ($50 x 1) + ($5 x 1) = 125
                        // calc-4 = ($15 x 3) + ($10 x 1) + ($50 x 1) + ($5 x 1) = 110
                        expect(stubs.res.locals.trolleyTotalPrice).to.equal(75);
                    });
                });
            });

            describe('and complex specials', () => {
                beforeEach(() => {
                    special1 = {
                        quantities: [
                            { name: "apple juice", quantity: 2 },
                            { name: "bread", quantity: 2 }
                        ],
                        total: 18
                    };
                    special2 = {
                        quantities: [
                            { name: "vegemite", quantity: 3 },
                            { name: "jam", quantity: 2 }
                        ],
                        total: 25
                    };
                });
                it('should calculate the price correctly', function () {
                    stubs.req.body = validBody;
                    target.calcTotal(stubs.req, stubs.res, stubs.next);
                    // calc-1 = ($10 x 7) + ($5 x 4) = 90
                    // calc-2 = ($25 x 2) + ($10 x 1) + ($5 x 0) = 60
                    expect(stubs.res.locals.trolleyTotalPrice).to.equal(60);
                });
            });

            describe('and multiple specials on the same products', () => {
                beforeEach(() => {
                    special1 = {
                        quantities: [
                            { name: "vegemite", quantity: 5 },
                            { name: "jam", quantity: 1 }
                        ],
                        total: 28
                    };
                    special2 = {
                        quantities: [
                            { name: "vegemite", quantity: 3 },
                            { name: "jam", quantity: 2 }
                        ],
                        total: 25
                    };
                });
                it('should calculate the price correctly', function () {
                    stubs.req.body = validBody;
                    target.calcTotal(stubs.req, stubs.res, stubs.next);
                    // calc-1 = ($10 x 7) + ($5 x 4) = 90
                    // calc-2 = ($28 x 1) + ($10 x 2) + ($5 x 3) = 58
                    // calc-2 = ($25 x 2) + ($10 x 1) + ($5 x 0) = 60
                    expect(stubs.res.locals.trolleyTotalPrice).to.equal(58);
                });
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
                stubs.res.locals.trolleyTotalPrice = 101.99;
                target.respond(stubs.req, stubs.res, stubs.next);
            });

            it('should set the response status to 200', function () {
                expect(stubs.res.status.callCount).to.equal(1);
                expect(stubs.res.status.args[0][0]).to.equal(200);
            });
            it('should send the trolley total to the requester as a string', function () {
                expect(stubs.res.send.callCount).to.equal(1);
                expect(stubs.res.send.args[0][0]).to.equal('101.99');
            });
        });
    });

});
