"use strict";

const {Stubs, expect, sinon, proxyquire} = (require('../../test/helpers/testBase.js'));

describe('Product Model', () => {

    let target;
    let stubs;

    beforeEach(() => {
        stubs = new Stubs();
        target = proxyquire(`${__dirname}/Product.model.js`, {});
    });
    
    describe('When constructed', () => {
        let result;

        beforeEach(() => {
            const testProps = {
                name: 'some name',
                price: 'some price',
                quantity: 'some quantity'
            };
            result = new target(testProps);
        });
        it('should assign name property', function () {
            expect(result.name).to.equal('some name');
        });
        it('should assign price property', function () {
            expect(result.price).to.equal('some price');
        });
        it('should assign quantity property', function () {
            expect(result.quantity).to.equal('some quantity');
        });
    });


});

