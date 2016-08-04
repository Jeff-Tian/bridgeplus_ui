var proxy = require('../serviceProxy/proxy.js');
var config = require('../config');

function checkEducationBackgroundForSignedInUser(req, res, next) {
    if (res.locals.hcd_user && res.locals.hcd_user.member_id) {
        return proxy.execute(req, res, next, {
            host: config.bplusService.host,
            port: config.bplusService.port,
            method: 'GET',
            path: '/profile/load/' + res.locals.hcd_user.member_id,
            responseInterceptor: function (originalResponse, upstreamJson, originalRequest, next) {
                res.locals.needFillEducation = !upstreamJson.result.education || upstreamJson.result.education.length <= 0;

                next();
            }
        });
    }

    next();
}

function forceFillFormForEduBackgroundEmptyUsers(req, res, next) {
    if (res.locals.needFillEducation === true) {
        req.dualLog('======= Need to fill education info ===========');
        req.dualLog(' redirecting to /personal-history from ' + req.url);
        req.dualLog('===============================================');
        res.redirect('/personal-history');
    } else {
        next();
    }
}

module.exports = function (server) {
    server.use(/^\/((zh|en)\/)?(?:study-center|cmpt|opportunity|store|profile)\/?.*$/i, checkEducationBackgroundForSignedInUser, forceFillFormForEduBackgroundEmptyUsers);

    server.use(/^\/((zh|en)\/)?m\/(?:profile)\/?.*$/i, checkEducationBackgroundForSignedInUser, forceFillFormForEduBackgroundEmptyUsers);
};