var Logger = require('greenShared').logger;
var pack = require('../package.json');
var config = require('../config');
var logger = (Logger.init(config.logger), Logger(pack.name + pack.version));
var bodyParser = require('body-parser');
var mobileDetector = require('../mobile/mobileDetector');
var configHelper = require('../config/configHelper');

function setLogger(req, res, next) {
    function dualLogError(o) {
        logger.error(o);
        console.error(o);
    }

    function dualLog(o) {
        logger.info(o);
        console.log(o);
    }

    req.logger = logger;
    req.dualLogError = dualLogError;
    req.dualLog = dualLog;

    next();
}

function setCDN(req, res, next) {
    res.locals.cdn = config.cdn;

    next();
}

function setFeatureSwitcher(req, res, next) {
    res.locals.featureSwitcher = config.featureSwitcher;
    next();
}

function setConfig(req, res, next) {
    res.locals.config = config;
    next();
}

function setDeviceHelper(req, res, next) {
    var ua = req.headers['user-agent'];

    res.locals.device = {
        isFromMobile: mobileDetector.isFromMobile(ua),
        isFromWechatBrowser: mobileDetector.isFromWechatBrowser(ua),
        isFromAndroid: mobileDetector.isFromAndroid(ua)
    };

    next();
}

function setMode(req, res, next) {
    res.locals.dev_mode = (configHelper.getMode() === 'dev');

    next();
}

function onlineOfflinePathSwitch(onlinePath, offlinePath) {
    return !(process.env.RUN_FROM === 'jeff') ? onlinePath : offlinePath;
}

function setOnlineStoreTemplate(req, res, next) {
    res.locals.onlineStoreTemplate = __dirname + '/..' + onlineOfflinePathSwitch(
            '/node_modules/',
            '/../') +
        'online-store/views/';

    next();
}

module.exports = function (server) {
    server
        .use(Logger.express("auto"))
        .use(setLogger)
        .use(setCDN)
        .use(setFeatureSwitcher)
        .use(setConfig)
        .use(setDeviceHelper)
        .use(setMode)
        .use(setOnlineStoreTemplate)
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({
            extended: true
        }))
    ;
};