"use strict";

const {Stubs, expect, proxyquire, sinon} = (require('../../test/helpers/testBase.js'));

describe('Data service', () => {
    let stubs;
    let target;
    let result;

    beforeEach(() => {
        result = null;
        stubs = new Stubs();
        stubs.models.Product = sinon.stub().returns({iam:'Product model instance'});
        stubs.libs.requestPromiseNative = sinon.stub();
        target = proxyquire(`${__dirname}/data.service.js`, {
            '../models/Product.model.js' : stubs.models.Product,
            'request-promise-native' : stubs.libs.requestPromiseNative
        });
    });


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('getAllProducts method', () => {

        it('should be a function', function () {
            expect(typeof target.getAllProducts).to.equal('function');
        });

        describe('when called', () => {
            beforeEach(async () => {
                const testRawProducts= [
                    {name: 'a', price: 1.23, quantity:0},
                    {name: 'b', price: 2.34, quantity:999},
                    {name: 'c', price: 3.45, quantity:31}
                ];
                stubs.libs.requestPromiseNative.returns(Promise.resolve(testRawProducts));
                result = await target.getAllProducts(stubs.req, stubs.res, stubs.next);
            });
            it('should return the result of the api call', function () {
                expect(result[0].iam).to.equal('Product model instance');
                expect(result[1].iam).to.equal('Product model instance');
                expect(result[2].iam).to.equal('Product model instance');
            });
        });

    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('getRecommendedProducts method', () => {

        it('should be a function', function () {
            expect(typeof target.getRecommendedProducts).to.equal('function');
        });

        describe('when called', () => {
            beforeEach(async () => {

                const testShopperHistory = [
                    {
                        "customerId": 123,
                        "products": [
                            { "name": "Test Product A", "price": 99.99, "quantity": 3 },
                            { "name": "Test Product B", "price": 101.99, "quantity": 1 },
                            { "name": "Test Product F", "price": 999999999999, "quantity": 1 }
                        ]
                    },
                    {
                        "customerId": 23,
                        "products": [
                            { "name": "Test Product A", "price": 99.99, "quantity": 2 },
                            { "name": "Test Product B", "price": 101.99, "quantity": 3 },
                            { "name": "Test Product F", "price": 999999999999, "quantity": 1 }
                        ]
                    },
                    {
                        "customerId": 23,
                        "products": [
                            { "name": "Test Product C", "price": 10.99, "quantity": 2 },
                            { "name": "Test Product F", "price": 999999999999, "quantity": 2 }
                        ]
                    },
                    {
                        "customerId": 23,
                        "products": [
                            { "name": "Test Product A", "price": 99.99, "quantity": 1 },
                            { "name": "Test Product B", "price": 101.99, "quantity": 1 },
                            { "name": "Test Product C", "price": 10.99, "quantity": 1 }
                        ]
                    }
                ];
                stubs.libs.requestPromiseNative.returns(Promise.resolve(testShopperHistory));
                result = await target.getRecommendedProducts(stubs.req, stubs.res, stubs.next);
            });
            it('should trigger creation of a Product instance for each distinct product type', function () {
                expect(stubs.models.Product.callCount).to.equal(4);
                expect(stubs.models.Product.args[0][0]).to.deep.equal( { "name": "Test Product A", "price": 99.99, "quantity": 6 });
                expect(stubs.models.Product.args[1][0]).to.deep.equal( { "name": "Test Product B", "price": 101.99, "quantity": 5 });
                expect(stubs.models.Product.args[2][0]).to.deep.equal( { "name": "Test Product F", "price": 999999999999, "quantity": 4 });
                expect(stubs.models.Product.args[3][0]).to.deep.equal( { "name": "Test Product C", "price": 10.99, "quantity": 3 });
            });
            it('should return Product instances for each distinct product ', function () {
                expect(result[0].iam).to.equal('Product model instance');
                expect(result[1].iam).to.equal('Product model instance');
                expect(result[2].iam).to.equal('Product model instance');
                expect(result[3].iam).to.equal('Product model instance');
            });
        });

    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('getTrolleyTotal method', () => {

        it('should be a function', function () {
            expect(typeof target.getTrolleyTotal).to.equal('function');
        });

        describe('when called', () => {
            beforeEach(async () => {
                stubs.libs.requestPromiseNative.returns(Promise.resolve(7.65));
                result = await target.getTrolleyTotal(stubs.req, stubs.res, stubs.next);
            });
            it('should return the result of the api call', function () {
                expect(result).to.equal(7.65);
            });
        });

    });

});
