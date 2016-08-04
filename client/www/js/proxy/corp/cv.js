angular.module('bridgeplus.corp')
    .service('cvService', ['$q', 'service', 'DeviceHelper', '$rootScope', function ($q, service, DeviceHelper, $rootScope) {
        var me = this;
        var hasInitialized = false;
        var resourceData = {};
        var resourceSet = [
            "qualifications",
            "worktype",
            "communityposition",
            "language",
            "langguageproficiency",
            "englishlevel",
            "industry",
            "job"
        ];
        var PARAM_MAPPING = {
            'delivered': $rootScope.config.serviceUrls.corp.jobapply.todo,
            'interested': $rootScope.config.serviceUrls.corp.candidate.potential,
            'pool': $rootScope.config.serviceUrls.corp.talent.search,
            'deleted': $rootScope.config.serviceUrls.corp.candidate.dropped
        };
        var RESOURCE_URL_PREFIX = "corp-service-proxy/resource/";

        me.getCV = function (currentTab, option) {
            var url = PARAM_MAPPING[currentTab];
            var param = $.extend(true, {
                company_id: DeviceHelper.getCookie('corp_id')
            }, option);
            return service.post(url, param).then(function (value) {
                return value;
            });
        };
        // Resources
        me.getResourceByID = function (key, id) {
            var data = resourceData[key];
            // Array.prototype.find
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    return data[i].text;
                }
            }
            return "";
        };
        me.getResourceIDByText = function (key, text) {
            var data = resourceData[key];
            // Array.prototype.find
            for (var i = 0; i < data.length; i++) {
                if (data[i].text === text) {
                    return data[i].id;
                }
            }
            return "";
        };
        me.getIndustry = function (id) {
            var key = "industry";
            return me.getResourceByID(key, id);
        };
        me.getLanguage = function (id) {
            var key = "language";
            return me.getResourceByID(key, id);
        };
        me.getCommunityPosition = function (id) {
            var key = "communityposition";
            return me.getResourceByID(key, id);
        };
        me.getLangguageProficiency = function (id) {
            var key = "langguageproficiency";
            return me.getResourceByID(key, id);
        };
        me.getEnglishLevel = function (id) {
            var key = "englishlevel";
            return me.getResourceByID(key, id);
        };
        me.getQulificationsByID = function (id) {
            var key = "qualifications";
            return me.getResourceByID(key, id);
        };
        me.getJobByID = function (id) {
            var key = "job";
            return me.getResourceByID(key, id);
        };
        me.getJobIDByText = function (value) {
            var key = "job";
            return me.getResourceIDByText(key, value);
        };
        me.getWorktypeByID = function (id) {
            var key = "worktype";
            return me.getResourceByID(key, id);
        };

        /////////////
        // Two functions below are utils function for data parsing
        me.produceDataString = function (startDate, endDate) {
            var startDateString = '';
            var endDateString = '';

            function getYearAndMonth(dataString) {
                var date = new Date(dataString);
                return date.getFullYear() + '/' + (date.getMonth() + 1);
            }
            if (startDate !== ""){
                startDateString = getYearAndMonth(startDate);
            }
            if (endDate === "") {
                endDateString = '至今';
            } else {
                endDateString = getYearAndMonth(endDate);
            }
            return startDateString + "~" + endDateString;
        };
        me.levelMapping = function (value) {
            var ret = 0;
            if (value < 20) {
                ret = 'e';
            } else if (value < 40) {
                ret = 'd';
            } else if (value < 60) {
                ret = 'c';
            } else if (value < 80) {
                ret = 'b';
            } else {
                ret = 'a';
            }
            return ret;
        };
        ////////
        var corpPost = function(url, idParam){
            var param = $.extend(true, {
                member_id: DeviceHelper.getCookie('mid'),
                company_id: DeviceHelper.getCookie('corp_id')
            }, idParam);
            return service.post(url, param);
        };
        me.unlockCV = function (idParam) {
            var url = $rootScope.config.serviceUrls.corp.talent.save;
            return corpPost(url, idParam);
        };
        me.markCV = function (cv) {
            var url = $rootScope.config.serviceUrls.corp.jobapply.markCandidate;
            var param = {
                applierList: [cv]
            };
            return corpPost(url, param);
        };
        me.markCVPosition = function (param) {
            var url = $rootScope.config.serviceUrls.corp.talent.assignJob;
            return corpPost(url, param);
        };
        me.restoreCV = function (cv) {
            var url = $rootScope.config.serviceUrls.corp.candidate.restorePotential;
            var param = {
                applierList: [cv]
            };
            return corpPost(url, param);
        };
        me.dropCV = function (cvArray, isStatusApply) {
            var url = isStatusApply ? $rootScope.config.serviceUrls.corp.jobapply.dropCandidate : $rootScope.config.serviceUrls.corp.candidate.dropPotential;
            var param = {
                applierList: cvArray
            };
            return corpPost(url, param);
        };
        me.getResume = function (idParam) {
            var url = $rootScope.config.serviceUrls.corp.candidate.resume;
            return corpPost(url, idParam);
        };
        me.getPublishedJobs = function () {
            // Use resource instead of published jobs here.
            return $q.when(resourceData["job"].map(function(value){
                return value.text;
            }));
        };
        me.getJobStatus = function(idParam){
            var url = $rootScope.config.serviceUrls.corp.candidate.jobstatus;
            return corpPost(url, idParam);
        };
        me.getCoupon = function(){
            var url = $rootScope.config.serviceUrls.corp.account.coupon;
            var param = {
                products: "unlockResume"
            };
            return corpPost(url, param).then(function(ret){
                return ret[0].count || 0;
            });
        };
        me.init = function () {
            // Get resources
            var resourcePromises = resourceSet.map(function (value) {
                var url = RESOURCE_URL_PREFIX + value;
                return service.get(url);
            });
            return $q.all(resourcePromises).then(function (ret) {
                resourceSet.forEach(function (value, index) {
                    resourceData[value] = ret[index];
                });
                hasInitialized = true;
            });
        };
    }])
;
