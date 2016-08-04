// Use Expressjs as Node.js web framework
var express = require('express');
var server = express();
var i18n = require('i18n');
var localeHelper = require('./locales/localeHelper.js');
var config = require('./config');
var configHelper = require('./config/configHelper');
var membership = require('./serviceProxy/membership.js');
var url = require('url');

var mobileDetector = require('./mobile/mobileDetector');
var urlParser = require('url');
var fs = require('fs');

var supportedLocales = localeHelper.supportedLocales;
i18n.configure({
    locales: supportedLocales,
    directory: __dirname + '/locales',
    updateFiles: false
});

// Node.js template engine
var ejs = require('ejs');

require('./server-prepare/student')(server);

// Set the view engine to ejs, but specify file type with ".html"
server.engine('html', ejs.renderFile);
server.set('view engine', 'html');

server.use(i18n.init);

server.all('*', localeHelper.setLocale, localeHelper.setLocalVars, function (req, res, next) {
    if (req.query.code && req.query.state) {
        // Redirected from Wechat?
        return res.redirect(new Buffer(req.query.state, 'base64').toString());
    }

    next();
});

server.use('/', membership.setSignedInUser);

var staticFolder = __dirname + (configHelper.getMode() === 'dev' ? '/client/www' : '/client/dist');
var viewFolder = __dirname + '/client/views';

var staticSetting = {
    etag: true,
    lastModified: true,
    maxAge: 1000 * 3600 * 24 * 30,
    setHeaders: function (res, path) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
};

require('./routes/student-homepage')(server);

// Customize client file path
server.set('views', [staticFolder, viewFolder]);

function setupStaticResources() {
    var staticServer = express.static(staticFolder, staticSetting);

    server.use(staticServer);
    supportedLocales.map(function (l) {
        server.use('/' + l, staticServer);
    });
}

setupStaticResources();

server.use(localeHelper.localePath('/m', false), express.static(staticFolder));

if (configHelper.getMode() === 'dev') {
    server.use('/translation/localeHelper.js', express.static(__dirname + '/locales/localeHelper.js', staticSetting));
} else {
    server.use('/translation/localeHelper.js', express.static(__dirname + '/client/dist/translation/localeHelper.js', staticSetting));
}

server.use(/\/(?:corp\/)?config\.js/, function (req, res, next) {
    res.setHeader("Content-Type", "text/javascript; charset=utf-8");
    res.send('if (typeof angular !== "undefined") {angular.bplus = angular.bplus || {}; angular.bplus.config = ' + JSON.stringify(configHelper.filterConfig(config)) + ';}');
});

require('./pre-check/education-background')(server);

server.all('*', localeHelper.setLocale, localeHelper.setLocalVars);

server.use('/', require('./serviceProxy/membership.js').setSignedInUser);

function renderTemplate(name) {
    return function (req, res, next) {
        res.render(name);
    };
}

function renderOrRedirect(req, res, template) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        res.render(template);
    } else {
        console.log('request from mobile');
        try {
            var stats = fs.lstatSync(staticFolder + '/mobile/' + template + '.html');
            if (stats.isFile()) {
                var redirectTo = '/m/' + template;
                var query = urlParser.parse(req.url).query;
                res.redirect(query ? redirectTo + '?' + query : redirectTo);
            } else {
                res.render(template);
            }
        } catch (e) {
            res.render(template);
        }
    }
}
function mapRoute2Template(url, template, pipes) {
    if (typeof template !== 'string') {
        pipes = template;
        template = url;

        if (template[0] === '/') {
            template = template.substr(1);
        }
    }
    pipes = pipes || [];
    pipes.push(function (req, res, next) {
        renderOrRedirect(req, res, template);
    });

    var args = [localeHelper.localePath(url)].concat(pipes);

    server.get.apply(server, args);
}

server.use('/translation', localeHelper.serveTranslations);

function checkWechatHostAndSetCookie(req, res, next) {
    var query = urlParser.parse(req.url).query;
    if (query && query.indexOf("source=wechatServiceAccount") > -1) {
        res.cookie('source', "wechatServiceAccount");
    }
    next();
}
server.use(localeHelper.localePath('/m', false), checkWechatHostAndSetCookie);
server.use(localeHelper.localePath('/m', false), require('./mobile'));

function onlineOfflinePathSwitch(onlinePath, offlinePath) {
    return (process.env.RUN_FROM !== 'jeff') ? onlinePath : offlinePath;
}

function setupOnlineStoreStaticResources(staticFolder) {
    server.use(
        localeHelper.localePath('/' + staticFolder, false),
        express.static(
            __dirname +
            onlineOfflinePathSwitch(
                '/node_modules/',
                '/../') +
            (configHelper.getMode() === 'dev' ? 'online-store/public/' : 'online-store/dist/') +
            staticFolder,
            staticSetting
        )
    );
}

function serveSharedUI() {
    if (process.env.RUN_FROM === 'jeff') {
        server.use(localeHelper.localePath('/bower/SHARED-UI', false), express.static('/Users/tianjie/SHARED-UI', staticSetting));

        server.use(localeHelper.localePath('/bower_components/SHARED-UI', false), express.static('/Users/tianjie/SHARED-UI', staticSetting));
    } else {
        server.use(localeHelper.localePath('/bower_components/SHARED-UI', false), express.static(__dirname + '/node_modules/online-store/public/bower_components/SHARED-UI', staticSetting));
        server.use(localeHelper.localePath('/bower/SHARED-UI', false), express.static(__dirname + '/node_modules/online-store/public/bower_components/SHARED-UI', staticSetting));
    }
}

serveSharedUI();

//setupOnlineStoreStaticResources('semantic');
server.use(localeHelper.localePath('/semantic', false), express.static(__dirname + '/client/dist/semantic-online-store', staticSetting));
//setupOnlineStoreStaticResources('bower_components');
server.use(localeHelper.localePath('/bower_components', false), express.static(__dirname + '/client/dist/bower', staticSetting));
setupOnlineStoreStaticResources('images');
setupOnlineStoreStaticResources('stylesheets');
setupOnlineStoreStaticResources('scripts');

server.use(require('./routes/student'));

server.use(localeHelper.localePath('/corp', false), require('./routes/corp.js'));

server.use('/service-proxy', require('./serviceProxy'));

//Competion Integration

server
    .get('/:lang/game', function (req, res, next) {
        var lang = req.params.lang;
        if (['zh', 'en'].indexOf(lang) < 0) {
            return next();
        }
        if (!res.locals.hcd_user) {
            return next();
        }
        res.redirect('/zh/cmpt');
    })
    .get('/:lang/cmpt/:page?', function (req, res, next) {
        var lang = req.params.lang;
        if (['zh', 'en'].indexOf(lang) < 0) {
            return next();
        }
        var page = req.params.page || 'index';
        if (page == 'index' && !res.locals.hcd_user) {
            return membership.ensureAuthenticated(req, res, next);
        }
        res.render('competion/' + page, {
            page: page,
            lang: lang
        });
    })
    .use('/cmpt', (process.env.RUN_FROM !== 'jeff') ? require('competion-api')(express) : require('../cmpt2015-api')(express))
    .use('/studycenter', require('study-center-proxy')(express));

mapRoute2Template('/game');
mapRoute2Template('/contractus');
mapRoute2Template('/aboutus');
mapRoute2Template('/school');
mapRoute2Template('/statement');
mapRoute2Template('/youth');
mapRoute2Template('/preheating');
mapRoute2Template('/opportunity');
server.get('/data', require('./client/www/api/data.js').getData);
mapRoute2Template('/reset-password-by-email');
mapRoute2Template('/reset-password');
mapRoute2Template('/set-password');
mapRoute2Template('/sign-up-from', 'bind-mobile', [membership.ensureAuthenticated]);
mapRoute2Template('/bind-mobile', [membership.ensureAuthenticated]);
mapRoute2Template('/profile', [membership.ensureAuthenticated]);
mapRoute2Template('/game-training', [membership.ensureAuthenticated]);
mapRoute2Template('/upsell', [membership.ensureAuthenticated]);
mapRoute2Template('/offers');
mapRoute2Template('/paymentresult', [membership.ensureAuthenticated]);
mapRoute2Template('/map');
server.get(localeHelper.localePath('/opportunity-detail'), function (req, res, next) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        res.render('opportunity-detail');
    } else {
        res.render('mobile/opportunity-detail');
    }
});

server.get(localeHelper.localePath('/ranking'), function (req, res, next) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        if (res.locals.hcd_user) {
            res.redirect('/zh/cmpt/ranking');
        } else {
            res.render('ranking');
        }
    } else {
        res.render('mobile/ranking');
    }
});

server.get(localeHelper.localePath('/study'), membership.ensureAuthenticated, function (req, res, next) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        res.render('game-training');
    } else {
        res.redirect('/m/game-training');
    }
});
server.get(localeHelper.localePath('/select-payment-method'), membership.ensureAuthenticated, function (req, res, next) {
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        res.render('select-payment-method');
    } else {
        res.redirect('/m#/select-payment-method');
    }
});
server.get(localeHelper.localePath('/account-setting'), membership.ensureAuthenticated, renderTemplate('account-setting'));
server.get(localeHelper.localePath('/email-verify'), require('./email-verify.js'));

server.get('/messages', function (req, res, next) {
    res.json(JSON.parse(fs.readFileSync('messages.json')));
});

server.use('/healthcheck', function (req, res, next) {
    res.json({
        everything: 'is ok',
        time: new Date()
    });
});

function errorHandler(err, req, res, next) {
    req.dualLogError(err);
    res.status(500);
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        res.render('error', {error: err});
    } else {
        res.render('mobile/error', {error: err});
    }
}

server.use('*', function (req, res) {
    req.dualLogError('404 Error met for "' + ((req.headers['origin'] + '') + req.originalUrl) + '". The referer is "' + req.headers['referer'] + '".');

    res.status(404);
    if (!mobileDetector.isRequestFromMobileOrPad(req)) {
        res.render('404.html');
    } else {
        res.render('mobile/404.html');
    }
});

var commonServer = require('./server');
commonServer.handleError(server);
server.use(errorHandler);

// Host & Port
var port = process.env.PORT || config.port;
server.listen(port, function () {
    console.log(port + ' is for Bridge+ ');
});