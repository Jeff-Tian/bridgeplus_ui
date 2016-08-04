var router = require('express').Router();
var fs = require('fs');
var config = require('../config/index');
var mixedEngine = require('./mixedViewEngine');
var localeHelper = require('../locales/localeHelper');

router.get('/my', function (req, res, next) {
    mixedEngine.render(res, 'study-center.jade', 'study-center-layout.jade', {
        cdn: config.cdn,
        trackingJs: config.trackingJs + '?' + config.cdn.version,
        title: '学习中心'
    });
});

router.get('/:page?', function (req, res, next) {
    var lang = req.params.lang || localeHelper.getLocale(req.url, req);

    if (localeHelper.supportedLocales.indexOf(lang) < 0) {
        return next();
    }

    var page = req.params.page || 'teacherbook';

    try {
        res.render('study-center-ui/' + page, {
            page: page,
            lang: lang
        });
    } catch (ex) {
        next();
    }
})
;

module.exports = router;