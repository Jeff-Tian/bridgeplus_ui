var assert = require('assert');
var path = require('path');

describe('config', function () {
    var originalEnv;
    var resource;
    var configPath = path.resolve(__dirname, '../config');

    before(function () {
        originalEnv = process.env.NODE_ENV;
        resource = 'bower/semantic-ui/dist/semantic.min.js';
    });

    beforeEach(function () {
        delete require.cache[require.resolve(configPath)];
    });

    afterEach(function () {
        delete require.cache[require.resolve(configPath)];
        process.env.NODE_ENV = originalEnv;
    });

    it('can cdnify a resource', function () {
        process.env.NODE_ENV = 'dev';
        var config = require(configPath);

        assert.equal(config.cdn.cdnify(resource), '/bower/semantic-ui/dist/semantic.min.js' + '?' + config.cdn.version);
    });

    it('can cdnify a resource on prd environment', function () {
        process.env.NODE_ENV = 'prd';
        config = require(configPath);

        assert.equal(config.cdn.cdnify(resource), '//cdn.bridgeplus.cn/bower/semantic-ui/dist/semantic.min.js' + '?' + config.cdn.version);
    });
});