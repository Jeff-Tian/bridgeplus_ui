var http = require('http');
var mail = require('../config').mail;
var proxy = require('./proxy');

function appendMailToken(link, token) {
    var s = '?';

    if (link.indexOf('?') >= 0) {
        s = '&';
    }

    return link + s + 'mailToken=' + token;
}

var sendingMailFailed = {
    isSuccess: false,
    code: 'B+FailedToGetMailToken',
    message: 'Failed to get mail token.'
};

// 设置邮件模板:      http://submail.cn/chs
// username :       jinwyp@163.com
// password:        jinwyp2011
function mailProxy(options) {
    options.host = mail.host;
    options.port = mail.port;

    return proxy(options);
}

module.exports = {
    tokenCheck: function (req, res, next) {
        if (!res.locals.mailToken) {
            res
                .status(503)
                .send(sendingMailFailed)
                .end()
            ;
        } else {
            next();
        }
    },

    send: function (req, res, next) {
        mailProxy({
            path: '/service/mail/send',
            dataMapper: function (d) {
                return {
                    code: mail.code,
                    to: d.to,
                    subject: d.subject,
                    links: [{
                        code: 'link',
                        value: appendMailToken(d.linkPasswordReset, res.locals.mailToken)
                    }],
                    vars: [{
                        code: 'link',
                        value: appendMailToken(d.linkPasswordReset, res.locals.mailToken)
                    }, {
                        code: 'username',
                        value: d.displayName
                    }]
                };
            }
        })(req, res, next);
    },

    sendVerification: function (req, res, next) {
        mailProxy({
            path: '/service/mail/send',
            dataMapper: function (d) {
                return {
                    code: mail.verificationCode,
                    to: d.to,
                    subject: d.subject,
                    links: [{
                        code: 'link',
                        value: appendMailToken(d.linkVerification, res.locals.mailToken)
                    }],
                    vars: [{
                        code: 'link',
                        value: appendMailToken(d.linkVerification, res.locals.mailToken)
                    }, {
                        code: 'username',
                        value: d.displayName
                    }]
                };
            }
        })(req, res, next);
    }
};