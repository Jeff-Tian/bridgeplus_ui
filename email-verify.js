var proxy = require('./serviceProxy/proxy.js');
var sso = require('./config').sso;

module.exports = function (req, res, next) {
    if (!req.query || !req.query.mailToken) {
        res.locals.result = 'MailTokenNotFound';
        res.render('email-verify');
    }

    proxy({
        host: sso.host,
        port: sso.port,
        path: '/member/mailValidation/validate',
        method: 'POST',
        dataMapper: function (d) {
            return {
                token: req.query.mailToken
            };
        },
        responseInterceptor: function (response, json) {
            if (typeof json.code !== 'undefined') {
                res.locals.result = 'service-' + json.code;
            } else if (json.isSuccess) {
                res.locals.result = 'EmailVerifiedSuccess';
            } else {
                res.locals.result = '发生未知错误';
            }

            res.render('email-verify');

            return true;
        }
    })(req, res, next);
};