var http = require('http');
var bplusService = require('../config').bplusService;
var ssoService = require('../config').sso;
var bplusServiceParams = require('../config').bplusServiceParams;
var proxy = require('./proxy');
var extend = require('util')._extend;
var Q = require('q');

function proxyBPlus(options) {
    return function (req, res, next) {
        options.host = bplusService.host;
        options.port = bplusService.port;

        proxy(options)(req, res, next);
    };
}

function mapEducation(d) {
    d.qualifications_id = d.educationBackground;
    delete d.educationBackground;
    d.university = d.name;
    delete d.name;

    if (d.startYear && d.startMonth) {
        d.start_date = new Date(Date.UTC(d.startYear, Number(d.startMonth) - 1, 1));
    }
    delete d.startYear;
    delete d.startMonth;

    if (d.endYear && d.endMonth) {
        d.end_date = new Date(Date.UTC(d.endYear, Number(d.endMonth) - 1, 1));
    }
    delete d.endYear;
    delete d.endMonth;

    return d;
}

function updateMemberData(req, res, next) {
    var $noop = function () {
    };
    var operation = req.params.operation;
    if (operation !== "update") {
        res.send("Method error! Method is---" + operation);
        return;
    }
    var mapping = bplusServiceParams.mapping;
    var serviceNames = ["memberExt", "memberSso"];
    var serviceParams = [
        {
            host: bplusService.host,
            port: bplusService.port,
            path: "/profile/memberExt/update"
        },
        {
            host: ssoService.host,
            port: ssoService.port,
            path: "/profile/update",
            dataMapper: function (d) {
                d.application_id = ssoService.applicationId;
                return d;
            }
        }
    ];
    var rawData = req.body;
    var promiseArray = [];
    serviceNames.forEach(function (serviceValue, index) {
        var paramKeys = bplusServiceParams[serviceValue];
        var param = {};
        var hasData = false;
        param['member_id'] = rawData.member_id;
        paramKeys.forEach(function (value) {
            var rawValue = rawData[mapping[value]];
            if (rawValue || rawValue === false) {
                param[value] = rawValue;
                hasData = true;
            }
        });

        if (hasData) {
            promiseArray.push(Q.promise(function (resolve, reject) {
                var serviceParam = serviceParams[index];
                var newReq = extend({}, req);
                serviceParam.responseInterceptor = function (res, chunks) {
                    resolve(chunks);
                    return true;
                };
                newReq.body = param;
                proxy.execute(newReq, res, $noop, serviceParam);
            }));
        }
    });
    Q.all(promiseArray).then(function (result) {
        res.send(result);
    }, function (error) {
        console.log(error);
        res.send(error.toString());
    });
}

function updateOtherData(req, res, next) {
    var classification = req.params.classification;
    var operation = req.params.operation;
    var mapping = bplusServiceParams.mapping;
    return proxyBPlus({
        path: '/profile/' + classification + '/' + operation,
        dataMapper: function (d) {
            var retParam = {};
            bplusServiceParams[classification].forEach(function (value) {
                var originKey = mapping[value];
                var originValue = d[originKey];
                if (originValue || originValue === false) {
                    retParam[value] = originValue;
                }
            });
            retParam.member_id = d.member_id;
            return retParam;
        }
    })(req, res, next);
}

function deleteData(req, res, next) {
    var classification = req.params.classification;
    var operation = req.params.operation;
    var mapping = bplusServiceParams.mapping;
    return proxyBPlus({
        path: '/profile/' + classification + '/' + operation,
        dataMapper: function (d) {
            var retParam = {};
            var params = bplusServiceParams[classification];
            for (var i = 0; i < params.length; i++) {
                var value = params[i];
                var originKey = mapping[value];
                var originValue = d[originKey];
                if (originKey === "id") {
                    retParam[value] = originValue;
                }
            }
            retParam.member_id = d.member_id;
            return retParam;
        }
    })(req, res, next);
}

module.exports = {
    loadProfile: function (req, res, next) {
        proxyBPlus({path: '/profile/load/' + res.locals.hcd_user.member_id})(req, res, next);
    },

    updateProfile: proxyBPlus({
        path: '/profile/memberExt/update',
        dataMapper: function (d) {
            d.current_location = d.currentLocation;
            d.hide_birthday = d.setPrivacy;

            return d;
        }
    }),

    saveInterests: proxyBPlus({
        path: '/profile/extension'
    }),

    getSetting: proxyBPlus({
        path: '/profile/membersetting/load'
    }),

    addEducation: proxyBPlus({
        path: '/profile/education/add'
    }),

    updateEducation: proxyBPlus({
        path: '/profile/education/update',
        dataMapper: function (d) {
            d.education_id = d.educationId;
            delete d.educationId;

            return d;
        }
    }),

    dataSanitanze: function (req, res, next) {
        mapEducation(req.body);
        next();
    },

    dataValidate: function (req, res, next) {
        if (req.body.end_date < req.body.start_date) {
            res.status(401).json({
                code: 'DATA_ERROR',
                message: 'The end date should not be earlier than the start date'
            });
        } else {
            next();
        }
    },

    loadProfileAll: function (req, res, next) {
        var $noop = function () {
        };
        var memberID = res.locals.hcd_user.member_id;
        var ssoPath = '/profile/load/' + memberID;
        var bplusPath = '/profile/load/' + memberID;
        var ssoProfilePromise = Q.promise(function (resolve, reject) {
            proxy.execute(req, res, $noop, {
                host: ssoService.host,
                port: ssoService.port,
                path: ssoPath,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'User-Agent': 'BridgePlus Web'
                },
                responseInterceptor: function (res, chunks) {
                    resolve(chunks);
                    return true;
                }
            });
        });
        var bplusProfilePromise = Q.promise(function (resolve, reject) {
            proxyBPlus({
                path: bplusPath,
                responseInterceptor: function (res, chunks) {
                    resolve(chunks);
                    return true;
                }
            })(req, res, $noop);
        });
        Q.all([ssoProfilePromise, bplusProfilePromise]).spread(function (ssoProfile, bplusProfile) {
            var targetResult = bplusProfile.result;
            var memberSsoKeys = bplusServiceParams.memberSso;
            var mapping = bplusServiceParams.mapping;
            memberSsoKeys.forEach(function (value) {
                targetResult.memberExt[value] = ssoProfile.result[value];
            });
            var resultString = JSON.stringify(targetResult);
            //Replace service keys to bplus keys
            resultString = resultString.replace(/[,|{]"([^\"]+)":/g, function (value, groupValue) {
                var mappingValue = mapping[groupValue];
                var retString = mappingValue ? value.replace(groupValue, mapping[groupValue]) : value;
                return retString;
            });
            targetResult = JSON.parse(resultString);
            bplusProfile.result = targetResult;
            res.send(bplusProfile);
        }, function (error) {
            console.log(error);
            res.send(error.toString());
        });
    },

    updateData: function (req, res, next) {
        var classification = req.params.classification;
        var operation = req.params.operation;
        if (classification === "memberExt") {
            return updateMemberData(req, res, next);
        } else if (operation === "delete") {
            return deleteData(req, res, next);
        } else {
            return updateOtherData(req, res, next);
        }
    },

    getResource: function (req, res, next) {
        var language = bplusServiceParams.language[req.params.language] || 'zh-CN';

        proxyBPlus({
            path: '/resource/load/' + req.params.resourceKey + '/' + language
        })(req, res, next);
    },

    getResourceLocation: function (req, res, next) {
        var locationID = req.params.locationID;
        var path = "";
        if (locationID) {
            path = '/resource/childregion/' + locationID;
        } else {
            path = '/resource/region/';
        }
        proxyBPlus({
            path: path
        })(req, res, next);
    },

    getOpdOperation: function (req, res, next) {
        proxyBPlus({
            path: '/my/' + req.params.operation + '/load/' + req.params.member_id
        })(req, res, next);
    },

    updateOpdOperation: function (req, res, next) {
        proxyBPlus({
            path: '/my/' + req.params.operation + '/save'
        })(req, res, next);
    },

    searchJobs: function (req, res, next) {
        proxyBPlus({
            path: '/job/advanced'
        })(req, res, next);
    },

    hotJobs: function (req, res, next) {
        proxyBPlus({
            path: '/job/hot'
        })(req, res, next);
    },

    recommendJobs: function (req, res, next) {
        proxyBPlus({
            path: '/job/recommend'
        })(req, res, next);
    },

    favoriteJobs: function (req, res, next) {
        proxyBPlus({
            path: '/my/favorite/' + req.params.operation
        })(req, res, next);
    },

    deliveredJobs: function (req, res, next) {
        proxyBPlus({
            path: '/my/apply/' + req.params.operation
        })(req, res, next);
    },

    subscription: function (req, res, next) {
        proxyBPlus({
            path: '/my/subscription/' + req.params.operation
        })(req, res, next);
    },

    jobDetail: function (req, res, next) {
        proxyBPlus({
            path: '/job/load'
        })(req, res, next);
    },

    companyDetail: function (req, res, next) {
        proxyBPlus({
            path: '/company/load'
        })(req, res, next);
    }
};