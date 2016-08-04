var http = require('http');
var config = require('../config');
var linkedIn = config.thirdPartyLogon;
var proxy = require('./proxy');
var sso = require('./sso');

var leaveTrimmer = require('../utils/leaveTrimmer');
var linkedInServiceUrls = leaveTrimmer.trim(config.serviceUrls.linkedIn, '/service-proxy/linked-in');

function proxyLinkedIn(options) {
    options.host = linkedIn.host;
    options.port = linkedIn.port;

    var dm = options.dataMapper;

    options.dataMapper = function (d, req) {
        d.application_id = config.applicationId;
        d.app_id = linkedIn.app_id;

        return typeof dm === 'function' ? dm(d, req) : d;
    };

    return proxy(options);
}

function oAuthLogon(req, res, next) {
    proxyLinkedIn({
        path: config.serviceUrls.linkedIn.oauth.serverSide,
        method: 'POST'
    })(req, res, next);
}


module.exports = require('express').Router()
    .post(linkedInServiceUrls.oauth.frontEnd, oAuthLogon)
    .post(linkedInServiceUrls.bindMobile.frontEnd, function (req, res, next) {
        sso.proxySSO({
            path: linkedInServiceUrls.bindMobile.serverSideStep1,
            responseInterceptor: function (originResponse, upstreamJson) {

                function setAuthToken() {
                    sso.setAuthToken(res, upstreamJson.result.token, true, upstreamJson.result.memeber_id);
                }

                var ret = false;

                if (upstreamJson.isSuccess) {
                    if (!req.body.linkedInProfile) {
                        setAuthToken();

                        if (sso.jumpToReturnUrl(req, res)) {
                            return undefined;
                        }
                    } else {
                        sso.proxySSO({
                            path: linkedInServiceUrls.bindMobile.serverSideStep2,
                            dataMapper: function (d) {
                                d.member_id = upstreamJson.result.member_id;
                                d.profile = req.body.linkedInProfile;

                                return d;
                            },
                            responseInterceptor: function (theOriginResponse, theUpstreamJson) {
                                if (theUpstreamJson.isSuccess) {
                                    setAuthToken();

                                    if (sso.jumpToReturnUrl(req, res)) {
                                        return undefined;
                                    }
                                }

                                res.send(theUpstreamJson);
                            }
                        })(req, res, next);

                        ret = undefined;
                    }
                }

                return ret;
            }
        })(req, res, next);
    })
    .post(linkedInServiceUrls.logonByToken.frontEnd, sso.delegateSetAuthToken)
;