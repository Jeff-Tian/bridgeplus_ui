angular.module('bridgeplus.corp')
    .service('resourceService', ['$q', '$rootScope', 'service', 'DeviceHelper', function ($q, $rootScope, service, DeviceHelper) {
        var me = this;
        var initialized = false;
        var initialDeferred = $q.defer();
        var resourceData = {};
        var resourceSet = {
            QUALIFICATIONS: "qualifications",
            WORKTYPE: "worktype",
            COMMUNITYPOSITION: "communityposition",
            LANGUAGE: "language",
            LANGGUAGEPROFICIENCY: "langguageproficiency",
            ENGLISHLEVEL: "englishlevel",
            INDUSTRY: "industry",
            SALARYTYPE: "salarytype",
            JOB: "job"
        };
        var RESOURCE_URL_PREFIX = "corp-service-proxy/resource/";

        // Get resources
        var resourceSetValues = Object.keys(resourceSet).map(function(key){
            return resourceSet[key];
        });
        var resourcePromises = resourceSetValues.map(function (value) {
            var url = RESOURCE_URL_PREFIX + value;
            return service.get(url);
        });
        $q.all(resourcePromises).then(function (ret) {
            resourceSetValues.forEach(function (value, index) {
                resourceData[value] = ret[index];
            });
            initialized = true;
            initialDeferred.resolve();
        });
        me.RESOURCE_KEY = resourceSet;
        me.init = function(){
            return initialDeferred.promise;
        };
        me.getResource = function(resourceType, value){
            var data = resourceData[resourceType];
            if (value) {
                // Array.prototype.find
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === value) {
                        return data[i].text;
                    } else if(data[i].text === value) {
                        return data[i].id;
                    }
                }
                return "";
            }
            return data;
        };
    }])
;
