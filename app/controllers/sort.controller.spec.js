"use strict";

const {Stubs, expect, sinon, proxyquire} = (require('../../test/helpers/testBase.js'));

describe('Sort controller', () => {
    let target;
    let stubs;

    beforeEach(() => {
        stubs = new Stubs();
        stubs.models.Product = sinon.stub().returns({iam:'Product model instance'});
        target = proxyquire(`${__dirname}/sort.controller.js`, {
            '../models/Product.model.js' : stubs.models.Product
        });
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
                expect(stubs.next.args[0][0]).to.equal('Invalid sort option provided');
            });
        });

        describe('When called without a sort option', () => {
            beforeEach(() => {
                target.validateSortOption(stubs.req, stubs.res, stubs.next);
            });
            it('should call next with an error message', function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0][0]).to.equal('sortOption parameter must be provided');
            });
        });

    });


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('getProducts method', () => {

        it('should be a function', function () {
            expect(typeof target.getProducts).to.equal('function');
        });

        describe('When called', () => {
            beforeEach(() => {
                target.getProducts(stubs.req, stubs.res, stubs.next);
            });

            it('should call next with no params', function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0].length).to.equal(0);
            });
        });
    });



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    describe('sort method', () => {

        it('should be a function', function () {
            expect(typeof target.sort).to.equal('function');
        });

        describe('When called', () => {
            beforeEach(() => {
                target.sort(stubs.req, stubs.res, stubs.next);
            });

            it('should call next with no params', function () {
                expect(stubs.next.callCount).to.equal(1);
                expect(stubs.next.args[0].length).to.equal(0);
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
