var proxy = require('../proxy');
var cv = require('express').Router();
var config = require('../../config');
Object.keys(config.serviceUrls.corp.recommend).forEach(function(key){
    cv.post('/' + key, proxy.proxyBPlus({
        path: '/corp/recommend/' + key,
        method: 'POST'
    }));
});

module.exports = cv;
