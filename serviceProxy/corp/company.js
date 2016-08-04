var proxy = require('../proxy');
var company = require('express').Router();
var config = require('../../config');
Object.keys(config.serviceUrls.corp.company).forEach(function(key){
    company.post('/' + key, proxy.proxyBPlus({
        path: '/corp/company/' + key,
        method: 'POST'
    }));
});

module.exports = company;
