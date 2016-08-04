var proxy = require('../proxy');
var resource = require('express').Router();
var config = require('../../config');
var lng = "zh-CN";

Object.keys(config.serviceUrls.corp.resource).forEach(function (key) {
    resource.get('/' + key, proxy.proxyBPlus({
        path: '/resource/load/' + key + '/' + lng,
        method: 'GET'
    }));
});

module.exports = resource;
