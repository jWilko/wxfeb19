"use strict";

const {Stubs, expect, sinon, proxyquire} = (require('../../test/helpers/testBase.js'));

describe('ResponseBody Model', () => {

    let target;
    let stubs;

    beforeEach(() => {
        stubs = new Stubs();
        target = proxyquire(`${__dirname}/ResponseBody.model.js`, {});
    });
    
    describe('When constructed', () => {
        let result;

        beforeEach(() => {
            result = new target('some error', 'some data');
        });
        it('should assign error property', function () {
            expect(result.error).to.equal('some error');
        });
        it('should assign data property', function () {
            expect(result.data).to.equal('some data');
        });
    });


});

