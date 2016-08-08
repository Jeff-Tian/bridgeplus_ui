var config = require('../config');
var proxyTo = require('./proxyTo');
var router = require('express').Router();

for (var r in config.serviceUrls.commerceCenter) {
    var which = config.serviceUrls.commerceCenter[r];

    which.methodMapping = which.methodMapping
        || {
            frontEnd: 'post',
            upstream: 'post'
        };

    proxyTo.proxyTo(router, which, which.methodMapping.frontEnd, which.methodMapping.upstream, config.commerce.inner);

    if (which.recent) {
        proxyTo.proxyPostToPost(router, which.recent, config.commerce.inner);
    }
}

module.exports = router;