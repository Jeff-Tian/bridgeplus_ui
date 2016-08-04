var proxy = require('../proxy');
var candidate = require('express').Router();
var config = require('../../config');
Object.keys(config.serviceUrls.corp.candidate).forEach(function (key) {
    candidate.post('/' + key, proxy.proxyBPlus({
        path: '/corp/candidate/' + key,
        method: 'POST'
    }));
});

module.exports = candidate;
