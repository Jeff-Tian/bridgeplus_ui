var leaveTrimmer = require('../utils/leaveTrimmer.js');
var assert = require('assert');

describe('Leave Trimmer', function () {
    it('should trim leaves', function () {
        var tree = {
            a: 'service-proxy/a',
            b: {
                c: 'service-proxy/c',
                d: 'service-proxy/d'
            },
            c: {
                d: {
                    e: 'service-proxy/e'
                }
            },
            d: 'service-proxy/dd'
        };

        var trimmed = {
            a: 'a',
            b: {
                c: 'c',
                d: 'd'
            },
            c: {
                d: {
                    e: 'e'
                }
            },
            d: 'dd'
        };

        assert.deepStrictEqual(trimmed, leaveTrimmer.trim(tree, 'service-proxy/'));
    });
});