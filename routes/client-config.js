var router = require('express').Router();
var config = require('../config/index');
var configHelper = require('../config/configHelper');

router.get('/all.js', function (req, res, next) {
    res.setHeader("Content-Type", "text/javascript; charset=utf-8");

    res.send('if (typeof angular !== "undefined") {' +
        'angular.module("bplusConfigModule", [])' +
        '.value("bplusConfig", ' +
        JSON.stringify(configHelper.filterConfig(config)) +
        ')' +
        ';' +
        '}');
});


module.exports = router;