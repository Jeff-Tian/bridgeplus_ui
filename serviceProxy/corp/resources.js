var proxy = require('../proxy');
var resources = require('express').Router();
var config = require('../../config');
var leaveTrimmer = require('../../utils/leaveTrimmer');
var corpServiceUrls = leaveTrimmer.trim(config.serviceUrls.corp, '/corp-service-proxy/resources');
var localeHelper = require('../../locales/localeHelper.js');

var localeMap = {
    'en': 'en-US',
    'zh': 'zh-CN'
};

function proxyResource(path) {
    return function (req, res, next) {
        var locale = localeMap[localeHelper.getLocale(req.url, req)];

        proxy.proxyBPlus({
            path: path + locale,
            method: 'GET',
            responseInterceptor: function (originalRes, upstreamJson) {
                if (upstreamJson.isSuccess) {
                    var allResults = upstreamJson.result.map(function (e) {
                        return {
                            name: e.text,
                            value: e.id
                        };
                    });

                    var filteredResults = [];

                    if (req.params.query) {
                        filteredResults = allResults.filter(function (e) {
                            return e.name.indexOf(req.params.query) >= 0;
                        });
                    }

                    if (filteredResults.length <= 0) {
                        filteredResults = allResults;
                    }

                    var json = {
                        success: true,
                        isSuccess: true,
                        results: filteredResults
                    };

                    res.json(json);

                    return undefined;
                } else {
                    return false;
                }
            }
        })(req, res, next);
    };
}

resources.get(corpServiceUrls.resources.natureOfFirms, proxyResource('/resource/load/natureoffirm/'));

resources.get(corpServiceUrls.resources.corpScales, proxyResource('/resource/load/corpscale/'));

resources.get(corpServiceUrls.resources.industry, proxyResource('/resource/load/industry/'));

resources.get(corpServiceUrls.resources.tags, function (req, res, next) {
    //var results = [
    //    {
    //        name: 'abc',
    //        value: 'abc'
    //    },
    //    {
    //        name: 'cde',
    //        value: 'cde'
    //    }
    //];

    var results = [];

    if (req.params.query) {
        results.push({
            name: req.params.query,
            value: req.params.query
        });
    }

    res.json({
        success: true,
        isSuccess: true,
        results: req.params.query ? results.filter(function (e) {
            return e.value.indexOf(req.params.query) >= 0
        }) : results
    });
});

module.exports = resources;
