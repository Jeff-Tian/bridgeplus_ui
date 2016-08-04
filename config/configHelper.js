var config = require('./index.js');

function getMode() {
    return process.env.NODE_ENV || 'dev';
}

function filterConfig(config) {
    var filtered = {};

    filtered.captcha = config.captcha;
    filtered.payment = config.payment.public;
    filtered.cdn = config.cdn;
    filtered.featureSwitcher = config.featureSwitcher;
    filtered.service_upload = config.service_upload;
    filtered.trackingUrl = config.trackingUrl;
    filtered.serviceUrls = config.serviceUrls;
    filtered.competitions = config.competitions;
    filtered.mode = getMode();
    filtered.durableMessageSource = config.durableMessageSource;
    filtered.upload = config.upload.public;

    return filtered;
}

function filterClientConfig() {
    return JSON.stringify(filterConfig(config));
}
function setJavaScriptHeader(res) {
    res.setHeader("Content-Type", "text/javascript; charset=utf-8");
}
function serveClientConfig(req, res, next) {
    var filteredConfig = filterClientConfig();

    setJavaScriptHeader(res);
    res.send('if (typeof angular !== "undefined") {angular.bplus = angular.bplus || {}; angular.bplus.config = ' + filteredConfig + '; } angular.module("bplusConfigModule", []).run(["$rootScope", function($rootScope){$rootScope.config = ' + filteredConfig + '; }]).value("bplusConfig", ' + filteredConfig + ');');
}

function serveBplusConfigModule(req, res, next) {
    var filteredConfig = filterClientConfig();
    setJavaScriptHeader(res);
    res.send('angular.module("bplusConfigModule", []).run(["$rootScope", function($rootScope){$rootScope.config = ' + filteredConfig + '; }]).value("bplusConfig", ' + filteredConfig + ');');
}

module.exports = {
    getMode: getMode,
    filterConfig: filterConfig,
    serveClientConfig: serveClientConfig,
    serveBplusConfigModule: serveBplusConfigModule
};