var pages = require('../util/page');
var router = require('express').Router();
router.get('/', function(req, res, next) {
    var lang = 'zh';
    var page = 'index';
    var page_info = pages[page][lang];
    res.render('portal/' + lang + '/' + page, {
        page: page,
        lang: lang,
        page_info: page_info
    });
});

router.get('/portal/:lang/:page', function(req, res, next) {
    var lang = req.params.lang;
    if (!(lang == 'zh' || lang == 'en')) {
        return next();
    }
    var page = req.params.page.toLowerCase();
    var page_info = pages[page][lang];
    if (!page_info) {
        return next();
    }
    res.render('portal/' + lang + '/' + page, {
        page: page,
        lang: lang,
        page_info: page_info
    });
});

router.get('/healthcheck', function(req, res, next) {
    res.json({
        everything: 'is ok',
        time: new Date()
    });
});
module.exports = router;