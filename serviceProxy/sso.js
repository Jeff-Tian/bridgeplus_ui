var http = require('http');
var sso = require('../config').sso;
var config = require('../config');
var proxy = require('./proxy');
var localeHelper = require('../locales/localeHelper');
var membership = require('./membership');

function proxySSO(options) {
    options.host = sso.host;
    options.port = sso.port;
    if (!options.dataMapper) {
        options.dataMapper = function (d) {
            d.application_id = config.applicationId;
            return d;
        };
    }

    return proxy(options);
}

function setAuthToken(res, token, rememberMe, member_id) {
    var cookieOption = {
        expires: rememberMe ? new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)) : 0,
        path: '/',
        httpOnly: true
    };

    console.log('setting token = ' + token);
    res.cookie('token', token, cookieOption);

    if (member_id) {
        cookieOption.httpOnly = false;
        // This cookie serves only for tracking
        res.cookie('mid', member_id, cookieOption);
    }
}

function jumpToReturnUrl(req, res) {
    if (req.body.return_url) {
        if (!req.xhr) {
            res.redirect(decodeURIComponent(req.body.return_url));
        } else {
            res.json({
                code: 302,
                message: decodeURIComponent(req.body.return_url)
            });
        }

        return true;
    }

    return false;
}

function createLogoutProcessor(clearingJobs) {
    return function (req, res, next) {
        proxySSO({
            path: '/logon/logout', requestInterceptor: function (requestFrom, requestTo) {
                if (requestFrom.headers.cookie) {
                    var token = requestFrom.headers.cookie.match(/(?:^|;) *token=([^;]*)/)[1];

                    requestTo.write(JSON.stringify({token: token}));
                }
            },
            responseInterceptor: function (originalResponse, responseJson) {
                membership.unsetSensativeCookies(res);

                if (typeof clearingJobs === 'function') {
                    clearingJobs(req, res, next);
                }

                var locale = localeHelper.getLocale(req.url, req);
                if (!req.xhr) {
                    res.redirect(localeHelper.generateLocaleLink('/', locale));
                } else {
                    res.json({
                        isSuccess: false,
                        code: '302',
                        message: localeHelper.generateLocaleLink('/', locale)
                    });
                }

                return undefined;
            },
            method: 'POST'
        })(req, res, next);
    };
}

module.exports = {
    signUp: proxySSO({path: '/member/register'}),
    authenticate: function (req, res, next) {
        proxySSO({
            path: '/logon/authentication',
            responseInterceptor: function (originalResponse, responseJson) {
                var returnValue = false;

                if (responseJson.isSuccess) {
                    if (!req.body.wechat_token) {
                        // Log on directly
                        setAuthToken(res, responseJson.result.token, req.body.remember, responseJson.result.member_id);
                        if (jumpToReturnUrl(req, res)) {
                            return undefined;
                        }
                    } else {
                        // Bind wechat to mobile account:
                        proxySSO({
                            path: '/profile/update',
                            dataMapper: function (d) {
                                d.token = d.wechat_token;
                                d.member_id = responseJson.result.member_id;

                                return d;
                            },
                            responseInterceptor: function (theOriginalResponse, response2Json) {
                                // Then log on
                                if (response2Json.isSuccess) {
                                    setAuthToken(res, responseJson.result.token, true, responseJson.result.member_id);
                                    if (jumpToReturnUrl(req, res)) {
                                        return undefined;
                                    }
                                }

                                res.send(response2Json);
                            }
                        })(req, res, next);

                        returnValue = undefined;
                    }
                }

                return returnValue;
            }
        })(req, res, next);
    },
    delegateSetAuthToken: function (req, res, next) {
        setAuthToken(res, req.body.token, true);

        if (!jumpToReturnUrl(req, res)) {
            res.send(req.body.token);
        }

        next();
    },
    authenticateCurrentUser: function (req, res, next) {
        var options = {
            host: sso.host,
            port: sso.port,
            path: '/profile/load/' + res.locals.hcd_user.member_id,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': 'BridgePlus Web'
            }
        };

        var chunks = [];

        var request = http.request(options, function (response) {
            response.on('data', function (c) {
                chunks.push(c);
            });

            response.on('end', function () {
                chunks = Buffer.concat(chunks);

                try {
                    chunks = JSON.parse(chunks.toString());

                    if (chunks.isSuccess && chunks.result) {
                        console.log('result = ' + JSON.stringify(chunks.result));

                        console.log('body:');
                        console.log(req.body);

                        proxySSO({
                            path: '/logon/authentication',
                            dataMapper: function (d) {
                                d.value = chunks.result.mobile;
                                d.application_id = config.applicationId;
                                console.log('authcurrent = ' + JSON.stringify(d));
                                console.log('authcurrent.result = ' + JSON.stringify(chunks.result));
                                return d;
                            },
                            responseInterceptor: function (responseStream, responseJson) {
                                console.log('authcurrent response = ');
                                console.log(responseJson);

                                return !!responseJson.isSuccess;
                            }
                        })(req, res, next);
                    } else {
                        res.send(chunks);
                    }
                } catch (ex) {
                    console.log('error!');
                    console.log(chunks.toString());
                    return next(ex);
                }
            });

            response.on('error', next);
        });

        request.on('error', next);

        request.end();
    },
    resetPassword: proxySSO({
        path: '/member/resetPassword'
    }),
    resetPasswordByEmail: proxySSO({path: '/member/password/resetByMail'}),
    logout: createLogoutProcessor(),
    createLogoutProcessor: createLogoutProcessor,
    getMailToken: proxySSO({
        path: '/member/password/mailToken',
        dataMapper: function (d) {
            d.mail = d.to;
            return d;
        },
        responseInterceptor: function (res, json) {
            if (json.isSuccess && json.result) {
                res.locals.mailToken = json.result;
                return true;
            } else {
                res.status(503);
                return false;
            }
        }
    }),
    getMailVerificationToken: function (req, res, next) {
        proxySSO({
            path: '/member/mailValidation/generate/' + res.locals.hcd_user.member_id,
            method: 'GET',
            responseInterceptor: function (res, json) {
                if (json.isSuccess) {
                    res.locals.mailToken = json.result;
                    return true;
                } else {
                    res.status(503);
                    return false;
                }
            }
        })(req, res, next);
    },
    changeMobile: proxySSO({
        path: '/profile/update'
    }),
    changeEmail: proxySSO({
        path: '/profile/update',
        dataMapper: function (d) {
            delete d.mobile;
            d.application_id = config.applicationId;
            d.mail = d.email;

            return d;
        }
        // TODO: Send email verification
    }),
    changePassword: proxySSO({
        path: '/profile/changepassword'
    }),
    updateProfile: proxySSO({
        path: '/profile/update',
        dataMapper: function (d) {
            d.token = d.wechat_token;

            return d;
        }
    }),
    jumpToReturnUrl: jumpToReturnUrl,
    setAuthToken: setAuthToken,
    proxySSO: proxySSO
};