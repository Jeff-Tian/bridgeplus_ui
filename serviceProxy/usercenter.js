var http = require('http');
var config = require('../config');
var usercenterConfig = config.usercenter.inner;
var proxy = require('./proxy');
var bplusService = config.bplusService;

function proxyUsercenter(config) {
    return proxy({
        host: usercenterConfig.host,
        port: usercenterConfig.port,
        path: config.path,
        dataMapper: function (d) {
            d.userId = d.member_id;
            return d;
        }
    });
}
var usercenter = {
    bbcoinBalance: function (req, res, next) {
        proxyUsercenter({
            path: '/service/bbcoin/load'
        })(req, res, next);
    },

    bbcoinExchange: function (req, res, next) {
        proxyUsercenter({
            path: '/service/bbcoin/exchange'
        })(req, res, next);
    }
};

module.exports = usercenter;