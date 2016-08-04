var config = require('../config');
var proxy = require('node-service-proxy');
var router = require('express').Router();

router.get(config.serviceUrls.cmsService.getContentByKey.abbr, function (req, res, next) {
    proxy(req, res, next, {
        host: config.cmsService.inner.host,
        port: config.cmsService.inner.port,
        path: config.serviceUrls.cmsService.getContentByKey.upstream.replace(':key', req.params.key)
    });
});

module.exports = router;