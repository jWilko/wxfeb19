"use strict";

const {Stubs, expect, sinon, proxyquire} = (require('../../test/helpers/testBase.js'));

describe('User Model', () => {

    let target;
    let stubs;

    beforeEach(() => {
        stubs = new Stubs();
        target = proxyquire(`${__dirname}/User.model.js`, {});
    });
    
    describe('When constructed', () => {
        let result;

        beforeEach(() => {
            result = new target();
        });
        it('should assign name property', function () {
            expect(result.name).to.equal('test');
        });
        it('should assign token property', function () {
            expect(result.token).to.equal('1234-455662-22233333-3333');
        });
    });

});

