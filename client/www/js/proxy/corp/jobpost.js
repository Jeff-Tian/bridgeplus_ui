angular.module('bridgeplus.corp')
    .service('jobpostService', ['$q', '$rootScope', 'service', 'DeviceHelper', function ($q, $rootScope, service, DeviceHelper) {
        var me = this;
        var corpPost = function(url, idParam){
            var param = $.extend(true, {
                member_id: DeviceHelper.getCookie('mid'),
                company_id: DeviceHelper.getCookie('corp_id')
            }, idParam);
            return service.post(url, param);
        };
        me.postJob = function(param) {
            var url = $rootScope.config.serviceUrls.corp.job.publish;
            return corpPost(url, param);
        };
        me.saveDraft = function(param) {
            var url = $rootScope.config.serviceUrls.corp.job.save;
            return corpPost(url, param);
        };
        me.offlinePost = function(param) {
            var url = $rootScope.config.serviceUrls.corp.job.offline;
            return corpPost(url, param);
        };
        me.dropPost = function(param) {
            var url = $rootScope.config.serviceUrls.corp.job.drop;
            return corpPost(url, param);
        };
        me.searchPost = function(param) {
            var url = $rootScope.config.serviceUrls.corp.job.search;
            return corpPost(url, param);
        };
    }])
;