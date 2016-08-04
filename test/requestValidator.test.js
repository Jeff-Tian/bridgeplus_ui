var validator = require('../serviceProxy/requestValidator');
var assert = require('assert');

describe('Decide if a request can continue', function () {
    it('should stop the request if validation failed', function () {
        assert.equal(false, validator.canContinueNextPipe({isSuccess: false, result: false}));
        assert.equal(false, validator.canContinueNextPipe({isSuccess: true, result: false}));
        assert.equal(false, validator.canContinueNextPipe({isSuccess: false, result: true}));
    });

    it('should continue the request if validation success', function () {
        assert.equal(true, validator.canContinueNextPipe({isSuccess: true, result: true}));
    });
});