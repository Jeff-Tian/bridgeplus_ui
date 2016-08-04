angular.module('bridgeplus.corp')
    .service('findService', ['$q', '$rootScope', 'service', 'DeviceHelper', function ($q, $rootScope, service, DeviceHelper) {
        var me = this;
        var corpPost = function(url, idParam){
            var param = $.extend(true, {
                member_id: DeviceHelper.getCookie('mid'),
                company_id: DeviceHelper.getCookie('corp_id')
            }, idParam);
            return service.post(url, param);
        };
        me.checkVIP = function(){
            var url = $rootScope.config.serviceUrls.corp.company.hasJobRecommend;
            return corpPost(url);
        };
        me.getSmart = function(param){
            var url = $rootScope.config.serviceUrls.corp.recommend.smart;
            return corpPost(url, param);
        };
        me.getWinner = function(param){
            var url = $rootScope.config.serviceUrls.corp.recommend.champion;
            return corpPost(url, param);
        };
        me.markCandidate = function(param) {
            var url = $rootScope.config.serviceUrls.corp.recommend.markCandidate;
            return corpPost(url, param);
        };
        me.getResume = function (idParam) {
            var url = $rootScope.config.serviceUrls.corp.candidate.resume;
            return corpPost(url, idParam);
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
        me.unlockCV = function (idParam) {
            var url = $rootScope.config.serviceUrls.corp.talent.save;
            return corpPost(url, idParam);
        };
        me.markCV = function (cv) {
            var url = $rootScope.config.serviceUrls.corp.recommend.markCandidate;
            var param = {
                applierList: [cv]
            };
            return corpPost(url, param);
        };
    }])
;
