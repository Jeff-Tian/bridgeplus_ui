var mobileDetector = require('../mobile/mobileDetector');
var fs = require('fs');
var urlParser = require('url');
var localeHelper = require('../locales/localeHelper.js');
var supportedLocales = localeHelper.supportedLocales;
var Portal = process.env.RUN_FROM === 'jeff' ? require('/Users/tianjie/bridgeplus_ui') : require('../client/www/bower/bridgeplus_ui');

function renderIndex(req, res, next) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        return Portal.render('zh', 'index', req, res, next);
    }

    tryRenderMobileTemplate('index', req, res);
}

function render20152016Index(req, res, next) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        return res.render('index');
    }

    tryRenderMobileTemplate('index', req, res);
}

function renderMobileTemplate(template, req, res) {
    var redirectTo = '/m/' + template;
    var query = urlParser.parse(req.url).query;

    return res.redirect(query ? redirectTo + '?' + query : redirectTo);
}

function tryRenderMobileTemplate(template, req, res) {
    try {
        var stats = fs.lstatSync(staticFolder + '/mobile/' + template + '.html');

        if (stats.isFile()) {
            return renderMobileTemplate(template, req, res);
        }

        return res.render(template);
    } catch (ex) {
        return res.render(template);
    }
}

module.exports = function (server) {
    server.get('/', renderIndex);
    server.get('/index', function (req, res, next) {
        res.redirect(301, '/');
    });
    server.get('/portal/:lang/:page', function (req, res, next) {
        Portal.render(req.params.lang, req.params.page, req, res, next);
    });
    supportedLocales.map(function (l) {
        server.get('/' + l, renderIndex);
        server.get('/' + l + '/index', function (req, res, next) {
            res.redirect(301, '/');
        });
    });

    server.get(localeHelper.localePath('/index-2015-2016', false), render20152016Index);
};