var config = require('../config');
var proxyTo = require('./proxyTo');
var router = require('express').Router();

for (var r in config.serviceUrls.commerceCenter) {
    proxyTo.proxyPostToPost(router, config.serviceUrls.commerceCenter[r], config.commerce.inner);

    if (config.serviceUrls.commerceCenter[r].recent) {
        proxyTo.proxyPostToPost(router, config.serviceUrls.commerceCenter[r].recent, config.commerce.inner);
    }
}

module.exports = router;