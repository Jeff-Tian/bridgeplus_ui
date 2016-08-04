var proxy = require('../proxy');
var job = require('express').Router();
var config = require('../../config');
Object.keys(config.serviceUrls.corp.job).forEach(function(key){
    job.post('/' + key, proxy.proxyBPlus({
        path: '/corp/job/' + key,
        method: 'POST'
    }));
});

module.exports = job;
