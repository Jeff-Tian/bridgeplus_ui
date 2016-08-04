var express = require('express');
var fs = require('fs');
var localeHelper = require('../locales/localeHelper.js');
var membership = require('../serviceProxy/membership.js');
var mobileDetector = require('../mobile/mobileDetector');

var router = express.Router();

router.get('/bplusConfigModule.js', require('../config/configHelper').serveBplusConfigModule);

router.use(localeHelper.localePath('/store', false), require('../store'));

router.use(localeHelper.localePath('/study-center', true), function (req, res, next) {
    res.redirect('/study-center/');
});

router.use(localeHelper.localePath('/study-center', false), membership.ensureAuthenticated, require('./study-center.js'));

router.use('/config', require('./client-config.js'));

router.get('/linked-in/oauth/callback', function (req, res, next) {
    res.render('third-party-interactives/linked-in-callback.jade');
});

router.get('/message-listener', function (req, res) {
    res.render('third-party-interactives/messageListener.jade', {
        title: req.query.title
    });
});

router.get('/:lang?/personal-history', membership.ensureAuthenticated, function (req, res, next) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        return res.render('personal-history.html');
    }

    return res.redirect('m/personal-history');
});
router.get('/:lang?/sign-in', function (req, res, next) {
    if (res.locals.signedIn) {
        return res.redirect('/my');
    }

    next();
}, function (req, res) {
    return res.render('sign-in.html');
});

router.get('/:lang?/my', function (req, res, next) {
    res.redirect('/zh/cmpt');
});

module.exports = router;