var proxy = require('../proxy');
var talent = require('express').Router();
var config = require('../../config');
Object.keys(config.serviceUrls.corp.talent).forEach(function (key) {
    talent.post('/' + key, proxy.proxyBPlus({
        path: '/corp/talent/' + key,
        method: 'POST'
    }));
});

module.exports = talent;
