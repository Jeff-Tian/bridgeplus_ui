var http = require('http');
var config = require('../config');
var productConfig = config.product.inner;
var proxy = require('./proxy');

function proxyProduct(config) {
    return proxy({
        host: productConfig.host,
        port: productConfig.port,
        path: config.path,
        dataMapper: function (d) {
            d.userId = d.member_id;

            return d;
        }
    });
}

module.exports = {
    getMyProductList: function (req, res, next) {
        proxyProduct({
            path: '/service/myproductstatus/'
        })(req, res, next);
    },

    getMyUnusedProducts: function (req, res, next) {
        proxyProduct({
            path: '/service/myproduct/list'
        })(req, res, next);
    },

    getMyUsedProducts: function (req, res, next) {
        proxyProduct({
            path: '/service/myproductHistory/list'
        })(req, res, next);
    }
};