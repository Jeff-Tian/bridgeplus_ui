var proxy = require('../proxy');
var jobapply = require('express').Router();
var config = require('../../config');
Object.keys(config.serviceUrls.corp.jobapply).forEach(function(key){
    jobapply.post('/' + key, proxy.proxyBPlus({
        path: '/corp/jobApply/' + key,
        method: 'POST'
    }));
});

module.exports = jobapply;
