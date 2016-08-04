var proxy = require('node-service-proxy');

function proxyTo(router, which, fromMethod, toMethod, upstreamConfig) {
    return router[fromMethod](which.abbr, function (req, res, next) {
        proxy(req, res, next, {
            host: upstreamConfig.host,
            port: upstreamConfig.port,
            path: which.upstream,
            dataMapper: function (d) {
                [which, upstreamConfig].map(function (m) {
                    if (typeof m.dataMapper === 'function') {
                        d = m.dataMapper(d);
                    }
                });
                
                return d;
            },
            method: toMethod
        })
    });
}

function proxyGetToPost(router, which, upstreamConfig) {
    return proxyTo(router, which, 'get', 'post', upstreamConfig);
}

function proxyPostToPost(router, which, upstreamConfig) {
    return proxyTo(router, which, 'post', 'post', upstreamConfig);
}

module.exports = {
    proxyTo: proxyTo,
    proxyGetToPost: proxyGetToPost,
    proxyPostToPost: proxyPostToPost
};