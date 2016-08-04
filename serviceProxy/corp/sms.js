var proxy = require('../proxy');
var leaveTrimmer = require('../../utils/leaveTrimmer');
var config = require('../../config');
var corpServiceUrls = leaveTrimmer.trim(config.serviceUrls.corp, '/corp-service-proxy/sms');
var sms = require('../sms');
var captcha = require('../captcha');
var membership = require('../membership');

module.exports = require('express').Router()
    .put(corpServiceUrls.sms.sendWithoutCaptcha, membership.ensureAuthenticated, sms.getVerificationCode)
    .put(corpServiceUrls.sms.sendWithCaptcha, membership.ensureAuthenticated, captcha.validate, sms.getVerificationCode)
;