"use strict";

const {Stubs, expect} = (require('../../test/helpers/testBase.js'));

describe('Sort controller', () => {
    let stubs;
    let target;

    beforeEach(() => {
        stubs = new Stubs();
        target = require('./sort.controller.js');
    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('validateSortOption method', () => {

        it('should be a function', function () {
            expect(typeof target.validateSortOption).to.equal('function');
        });

        describe('When called with a valid sort option', () => {
            beforeEach(() => {
                stubs.req.query = { sortOption : 'High' };
                target.validateSortOption(stubs.req, stubs.res, stubs.next);
            });
            it('should set the sort option to the response scope', function () {
                expect(stubs.res.locals.sortOption).to.equal('High');
            });
            it('should call next with no params', function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0].length).to.equal(0);
            });
        });

        describe('When called with an invalid sort option', () => {
            beforeEach(() => {
                stubs.req.query = { sortOption : 'Date' };
                target.validateSortOption(stubs.req, stubs.res, stubs.next);
            });
            it('should call next with an error message', function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0][0]).to.equal('Invalid sort option provided.');
            });
        });

        describe('When called without a sort option', () => {
            beforeEach(() => {
                target.validateSortOption(stubs.req, stubs.res, stubs.next);
            });
            it('should call next with an error message', function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0][0]).to.equal('sortOption parameter must be provided.');
            });
        });

    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('getData method', () => {

        it('should be a function', function () {
            expect(typeof target.getData).to.equal('function');
        });

        // TODO : Add tests
    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('sort method', () => {

        it('should be a function', function () {
            expect(typeof target.sort).to.equal('function');
        });

        describe('When called', () => {
            let testProducts;

            beforeEach(() => {
                testProducts = {
                    a : { name: 'Blurry eyes serum', price: 45, quantity: 8 },
                    b : { name: 'Early adopter blade', price: 12, quantity: 78 },
                    c : { name: 'Dangerous brain', price: 3, quantity: 5 },
                    d : { name: 'Articulated chicken wing', price: 29, quantity: 2023 },
                    e : { name: 'Carry on carrot', price: 15, quantity: 0 },
                    f : { name: 'Articulated chicken wing', price: 41, quantity: 16 }
                };
                stubs.res.locals.products = Object.values(testProducts);
            });

            describe('and the sort order is Low', () => {
                beforeEach(() => {
                    stubs.res.locals.sortOption = 'Low';
                    target.sort(stubs.req, stubs.res, stubs.next);
                });
                it('should order by Low to High Price', function () {
                    expect(stubs.res.locals.sortedProducts[0]).to.deep.equal(testProducts.c);
                    expect(stubs.res.locals.sortedProducts[1]).to.deep.equal(testProducts.b);
                    expect(stubs.res.locals.sortedProducts[2]).to.deep.equal(testProducts.e);
                    expect(stubs.res.locals.sortedProducts[3]).to.deep.equal(testProducts.d);
                    expect(stubs.res.locals.sortedProducts[4]).to.deep.equal(testProducts.f);
                    expect(stubs.res.locals.sortedProducts[5]).to.deep.equal(testProducts.a);
                });
                it('should call next with no params', function () {
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0].length).to.equal(0);
                });
            });
            describe('and the sort order is High', () => {
                beforeEach(() => {
                    stubs.res.locals.sortOption = 'High';
                    target.sort(stubs.req, stubs.res, stubs.next);
                });
                it('should order by High to Low Price', function () {
                    expect(stubs.res.locals.sortedProducts[0]).to.deep.equal(testProducts.a);
                    expect(stubs.res.locals.sortedProducts[1]).to.deep.equal(testProducts.f);
                    expect(stubs.res.locals.sortedProducts[2]).to.deep.equal(testProducts.d);
                    expect(stubs.res.locals.sortedProducts[3]).to.deep.equal(testProducts.e);
                    expect(stubs.res.locals.sortedProducts[4]).to.deep.equal(testProducts.b);
                    expect(stubs.res.locals.sortedProducts[5]).to.deep.equal(testProducts.c);
                });
                it('should call next with no params', function () {
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0].length).to.equal(0);
                });
            });
            describe('and the sort order is Ascending', () => {
                beforeEach(() => {
                    stubs.res.locals.sortOption = 'Ascending';
                    target.sort(stubs.req, stubs.res, stubs.next);
                });
                it('should order by A to Z on name', function () {
                    expect(stubs.res.locals.sortedProducts[0]).to.deep.equal(testProducts.d);
                    expect(stubs.res.locals.sortedProducts[1]).to.deep.equal(testProducts.f);
                    expect(stubs.res.locals.sortedProducts[2]).to.deep.equal(testProducts.a);
                    expect(stubs.res.locals.sortedProducts[3]).to.deep.equal(testProducts.e);
                    expect(stubs.res.locals.sortedProducts[4]).to.deep.equal(testProducts.c);
                    expect(stubs.res.locals.sortedProducts[5]).to.deep.equal(testProducts.b);
                });
                it('should call next with no params', function () {
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0].length).to.equal(0);
                });
            });
            describe('and the sort order is Descending', () => {
                beforeEach(() => {
                    stubs.res.locals.sortOption = 'Descending';
                    target.sort(stubs.req, stubs.res, stubs.next);
                });
                it('should order by Z to A on name', function () {
                    expect(stubs.res.locals.sortedProducts[0]).to.deep.equal(testProducts.b);
                    expect(stubs.res.locals.sortedProducts[1]).to.deep.equal(testProducts.c);
                    expect(stubs.res.locals.sortedProducts[2]).to.deep.equal(testProducts.e);
                    expect(stubs.res.locals.sortedProducts[3]).to.deep.equal(testProducts.a);
                    expect(stubs.res.locals.sortedProducts[4]).to.deep.equal(testProducts.d);
                    expect(stubs.res.locals.sortedProducts[5]).to.deep.equal(testProducts.f);
                });
                it('should call next with no params', function () {
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0].length).to.equal(0);
                });
            });
            describe('and the sort order is Recommended', () => {
                beforeEach(() => {
                    stubs.res.locals.sortOption = 'Recommended';
                    target.sort(stubs.req, stubs.res, stubs.next);
                });
                it('should order by high to low popularity', function () {
                    expect(stubs.res.locals.sortedProducts[0]).to.deep.equal(testProducts.d);
                    expect(stubs.res.locals.sortedProducts[1]).to.deep.equal(testProducts.b);
                    expect(stubs.res.locals.sortedProducts[2]).to.deep.equal(testProducts.f);
                    expect(stubs.res.locals.sortedProducts[3]).to.deep.equal(testProducts.a);
                    expect(stubs.res.locals.sortedProducts[4]).to.deep.equal(testProducts.c);
                    expect(stubs.res.locals.sortedProducts[5]).to.deep.equal(testProducts.e);
                });
                it('should call next with no params', function () {
                    expect(stubs.next.callCount).to.equal(1);
                    expect(stubs.next.args[0].length).to.equal(0);
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
                stubs.res.locals.sortedProducts = 'some sorted products';
                target.respond(stubs.req, stubs.res, stubs.next);
            });

            it('should set the response status to 200', function () {
                expect(stubs.res.status.callCount).to.equal(1);
                expect(stubs.res.status.args[0][0]).to.equal(200);
            });
            it('should send the existing sorted products list to the requester', function () {
                expect(stubs.res.send.callCount).to.equal(1);
                expect(stubs.res.send.args[0][0]).to.equal('some sorted products');
            });
        });
    });

});
