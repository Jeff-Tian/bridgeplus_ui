var http = require('http');
var config = require('../config');
var commerceConfig = config.commerce.inner;
var newCommerceConfig = config.newCommerce.inner;
var paymentConfig = config.payment.inner;
var gameConfig = config.games;
var proxy = require('./proxy');
var wechat = require('./wechat');
var qs = require('querystring');
var bplusService = config.bplusService;

function injectRedemptionGeneration(res, json, req, next) {
    if (json.isSuccess) {
        proxy({
            host: newCommerceConfig.host,
            port: newCommerceConfig.port,
            path: '/service/redemption/generate',
            dataMapper: function (d) {
                d.userId = d.member_id;
                d.productTypeId = gameConfig['national-2015'].productTypeId;

                return d;
            },
            responseInterceptor: function (res, json2, req) {
                req.dualLog('generated redemption result;');
                req.dualLog(json2);

                if (json2.isSuccess) {
                    json.result = json.result || {};
                    json.result.generatedRedemption = json2;

                    // Save generated redemption code to member extension
                    proxy({
                        host: bplusService.host,
                        port: bplusService.port,
                        path: '/profile/membersetting/save',
                        dataMapper: function (d) {
                            d.code = 'redemption-code';
                            d.value = json2.result;

                            return d;
                        },
                        responseInterceptor: function (res, jsonOfSaving, req) {
                            if (!jsonOfSaving.isSuccess) {
                                req.dualLogError('Failed to save the redemption code "' + json2.result + '" for member "' + req.body.member_id + '" in this request: "' + (req.headers['origin'] + req.originalUrl) + '" ! Data passed:\r\n' + req.body + '\r\nResponse:\r\n' + jsonOfSaving);
                            }

                            return undefined;
                        }
                    })(req, res, next);
                } else {
                    req.dualLogError('Failed to generate redemption code for "' + req.body.member_id + '"!\r\n Passed Data:\r\n' + req.body + '\r\nServer response: \r\n' + JSON.stringify(json2));
                }

                res.send(json);

                return undefined;
            }
        })(req, res, next);

        return undefined;
    } else {
        req.dualLogError('Service Response Error for "' + (req.headers['origin'] + req.originalUrl) + '"! Passed Data: \r\n' + JSON.stringify(req.body) + '\r\nResponse:\r\n' + JSON.stringify(json));

        return false;
    }
}

function checkUserAccessFor(req, res, next) {
    return function (option) {
        proxy({
            host: newCommerceConfig.host,
            port: newCommerceConfig.port,
            path: '/service/useraccess/hasApply',
            dataMapper: function (d) {
                d.userId = d.member_id;
                d.productTypeId = gameConfig[option].productTypeId;

                return d;
            },
            responseInterceptor: function (res, json) {
                req.dualLogError('check has right reuslt:\r\n' + JSON.stringify(json) + '\r\nPassed Data: \r\n ' + JSON.stringify(req.body));

                if (json.result && (json.result.hasRight === false)) {
                    req.body.offerId = json.result.productType.offerId;
                    req.body.productId = json.result.productType.productId;
                    req.body.productTypeId = json.result.productType.productTypeId;

                    return true;
                } else {
                    return false;
                }
            }
        })(req, res, next);
    };
}

function handleUserAccessCheckResult(res, json, req, next) {
    if (!json.isSuccess) {
        req.dualLogError('check user access failed: \r\n' + JSON.stringify(json));
        res.send(json);

        return undefined;
    }

    if (json.result && json.result.hasRight === false) {
        req.body.offerId = json.result.productType.offerId;
        req.body.productId = json.result.productType.productId;
        req.body.productTypeId = json.result.productType.productTypeId;

        return true;
    } else {
        return injectRedemptionGeneration(res, json, req, next);
    }
}

function proxyCommerce(config) {
    return proxy({
        host: commerceConfig.host,
        port: commerceConfig.port,
        path: config.path,
        dataMapper: function (d) {
            d.userId = d.member_id;

            return d;
        }
    });
}
function proxyNewCommerce(config) {
    return proxy({
        host: newCommerceConfig.host,
        port: newCommerceConfig.port,
        path: config.path,
        dataMapper: function (d) {
            console.log("d", d);
            d.userId = d.member_id;

            return d;
        }
    });
}

module.exports = {
    createUpSellOrderByRedemptionCode: proxy({
        host: newCommerceConfig.host,
        port: newCommerceConfig.port,
        path: '/service/redemption/redeem',
        dataMapper: function (d) {
            d.userId = d.member_id;
            if (!d.productTypeId) {
                d.productTypeId = gameConfig['repechages-2015-economy'].productTypeId;
            }

            return d;
        },
        responseInterceptor: injectRedemptionGeneration
    }),

    createStoreOrderAndPayByRedemptionCode: proxy({
        host: newCommerceConfig.host,
        port: newCommerceConfig.port,
        path: '/service/redemption/redeem',
        dataMapper: function (d) {
            d.userId = d.member_id;
            delete d.member_id;

            return d;
        },
        responseInterceptor: injectRedemptionGeneration
    }),

    checkUserAccessForNationalGame2015: function (req, res, next) {
        checkUserAccessFor(req, res, next)('national-2015');
    },

    checkUserAccessForNationalGame2015Middle: function (req, res, next) {
        checkUserAccessFor(req, res, next)('national-2015-middle');
    },

    checkUserAccessForNationalGame2015Economy: function (req, res, next) {
        checkUserAccessFor(req, res, next)('national-2015-economy');
    },

    checkUserAccessForRepechages2015: function (req, res, next) {
        checkUserAccessFor(req, res, next)('repechages-2015');
    },

    checkUserAccessForRepechages2015Middle: function (req, res, next) {
        checkUserAccessFor(req, res, next)('repechages-2015-middle');
    },

    checkUserAccessForRepechages2015Economy: function (req, res, next) {
        checkUserAccessFor(req, res, next)('repechages-2015-economy');
    },

    checkUserAccessForNationalGame2015AndGenerateRedemptionCodeIfHasRight: function (req, res, next) {
        proxy({
            host: newCommerceConfig.host,
            port: newCommerceConfig.port,
            path: '/service/useraccess/hasApply',
            dataMapper: function (d) {
                d.userId = d.member_id;
                d.productTypeId = gameConfig['national-' + req.params.option].productTypeId;

                return d;
            },
            responseInterceptor: handleUserAccessCheckResult
        })(req, res, next);
    },

    checkUserAccessAndGenerateRedemptionCodeIfHasRight: function (req, res, next) {
        var option = req.params.option.toString().toLowerCase();

        req.dualLogError('check user access with option is ' + option);

        proxy({
            host: newCommerceConfig.host,
            port: newCommerceConfig.port,
            path: '/service/useraccess/hasApply',
            dataMapper: function (d) {
                d.userId = d.member_id;
                d.productTypeId = gameConfig[option].productTypeId;

                return d;
            },
            responseInterceptor: handleUserAccessCheckResult
        })(req, res, next);
    },

    createOrder: proxy({
        host: newCommerceConfig.host,
        port: newCommerceConfig.port,
        path: '/service/order/create',
        dataMapper: function (d) {
            d.userId = d.member_id;

            // TODO: Delete it
            if (d.payment === 'b_alipaymobile') {
                d.payment = 'alipaymobile';
            }

            return d;
        }
    }),

    createOrderByWechat: function (req, res, next) {
        if (!req.query.openid) {
            var returnUrl = req.query.returnUrl || req.body.returnUrl;

            if (returnUrl) {
                req.query.returnUrl = returnUrl;
            }
            return wechat.getOpenId(req, res, next);
        } else {
            req.dualLog('open id got: ');
            req.dualLog(req.query.openid);
        }

        proxy({
            host: newCommerceConfig.host,
            port: newCommerceConfig.port,
            path: '/service/order/create',
            dataMapper: function (d) {
                d.userId = d.member_id;

                return d;
            },
            responseInterceptor: function (res, json, req) {
                if (json.isSuccess) {
                    var ip = req.headers['x-forwarded-for'];

                    if (ip && ip.indexOf(',') >= 0) {
                        ip = ip.split(',')[0];
                    }

                    if (!ip) {
                        ip = req.ip || req._remoteAddress ||
                            (req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress)));
                    }

                    req.dualLogError('creating order from ip: ' + ip);

                    console.log('original url config: ');
                    console.log(req.originalUrl);

                    var wechatConfig = {
                        orderId: json.result.orderId,
                        returnUrl: req.body.requestFrom || req.originalUrl,
                        payType: 'JSAPI',
                        openId: req.query.openid,
                        ip: ip.replace(/[^0-9\.]/g, '')
                    };

                    console.log('stringified config:');
                    console.log(qs.stringify(wechatConfig));

                    proxy({
                        host: paymentConfig.host,
                        port: paymentConfig.port,
                        path: '/service/payment/b_wechat/pay?' + qs.stringify(wechatConfig),
                        method: 'GET',
                        responseInterceptor: function (res, json, req) {
                            console.log('got wechat pay response:');
                            console.log(json);

                            return false;
                        }
                    })(req, res, next);

                    return undefined;
                } else {
                    return false;
                }
            }
        })(req, res, next);
    },

    getMyOrderList: function (req, res, next) {
        proxyNewCommerce({
            path: '/service/orderList',
            dataMapper: function (d) {
                d.userId = d.member_id;

                return d;
            }
        })(req, res, next);
    },

    getOrderDetail: function (req, res, next) {
        proxyNewCommerce({
            path: '/service/orderDetail/' + res.locals.hcd_user.member_id + '/' + req.params.orderId
        })(req, res, next);
    },

    getOfferInfo: function (req, res, next) {
        proxyNewCommerce({
            path: '/service/offer/getOffer'
        })(req, res, next);
    },

    searchOffer: function (req, res, next) {
        proxyNewCommerce({
            path: '/service/offer/search'
        })(req, res, next);
    }
};