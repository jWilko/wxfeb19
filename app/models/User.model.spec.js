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
            const testProps = {
                name : 'some name',
                token : 'some token'
            };
            result = new target(testProps);
        });
        it('should assign name property', function () {
            expect(result.name).to.equal('some name');
        });
        it('should assign token property', function () {
            expect(result.token).to.equal('some token');
        });
    });

});

