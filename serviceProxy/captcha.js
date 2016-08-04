var http = require('http');
var captchaConfig = require('../config').captchaInternal;
var proxy = require('./proxy');
var validator = require('./requestValidator');

var captcha = {};

captcha.validate = proxy(
    {
        host: captchaConfig.host,
        port: captchaConfig.port,
        path: '/captcha/validate',
        method: 'POST',
        dataMapper: function (d) {
            return {
                id: d.captchaId,
                value: d.captcha
            };
        },
        responseInterceptor: function (resStream, resJson, req) {
            req.dualLogError('captcha validation result: \r\n' + JSON.stringify(resJson) + '\r\npassed data:\r\n' + JSON.stringify(req.body));

            return validator.canContinueNextPipe(resJson);
        }
    }
);

module.exports = captcha;