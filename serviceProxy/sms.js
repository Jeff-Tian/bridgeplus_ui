var http = require('http');
var sms = require('../config').sms;
var proxy = require('./proxy');
var validator = require('./requestValidator');

module.exports = {
    getVerificationCode: function (req, res, next) {
        proxy({
            host: sms.host,
            port: sms.port,
            path: '/service/sms/send',
            method: 'POST',
            dataMapper: function (d) {
                return {
                    phone: d.mobile,
                    code: sms.code
                }
            },
            responseInterceptor: function (res, json, req) {
                req.dualLogError('sms sending result: \r\n' + JSON.stringify(json) + '\r\npassed data:\r\n' + JSON.stringify(req.body));

                return false;
            }
        })(req, res, next);
    },

    validate: function (req, res, next) {
        proxy({
            host: sms.host,
            port: sms.port,
            path: '/service/sms/validate',
            dataMapper: function (d) {
                return {
                    phone: d.mobile,
                    value: d.verificationCode
                };
            },
            responseInterceptor: function (resStream, json, req) {
                req.dualLogError('sms validation result: \r\n' + JSON.stringify(json) + '\r\npassed data:\r\n' + JSON.stringify(req.body));

                return validator.canContinueNextPipe(json);
            }
        })(req, res, next);
    }
};