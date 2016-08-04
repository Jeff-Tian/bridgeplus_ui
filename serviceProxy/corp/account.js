var proxy = require('../proxy');
var account = require('express').Router();
var config = require('../../config');
Object.keys(config.serviceUrls.corp.account).forEach(function(key){
    account.post('/' + key, proxy.proxyBPlus({
        path: '/corp/account/' + key,
        method: 'POST'
    }));
});

module.exports = account;
