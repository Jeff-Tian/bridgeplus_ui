var http = require('http'),
    config = require('../config'),
    sso = config.sso,
    proxy = require('./proxy'),
    localeHelper = require('../locales/localeHelper');

module.exports = function(req, res, next) {
    var type = req.params.type;
    var target = req.params.target;
    var count = req.params.count;
    var options = {
        path: '/' + type + '/' + target + "/" + count,
        host: config.info.ranking.host,
        port: config.info.ranking.port,
        responseInterceptor: function(res, chunks, req, next) {
            chunks["type"] = type;
            chunks["target"] = target;
            return false;
        }
    };
    return proxy(options)(req, res, next);
};