angular.bplus = angular.bplus || {};
angular.bplus.config = angular.bplus.config || {
        cdn: {
            normal: '/',
            version: '1.0'
        },

        serviceUrls: {
            studyCenter: {
                classBooking: {
                    coming: '',
                    unevaluated: '',
                    evaluated: ''
                }
            }
        }
    };

angular.bplus.localeHelper = {
    getLocale: function () {
        return 'zh';
    }
};

angular.bplus.config.featureSwitcher = {
    enableWechat: true
};

angular.module('trackingModule', [])
    .factory('url', [function () {
        return {
            parse: function () {
                return ''
            }
        };
    }])
    .factory('tracking', [function () {
        return {
            send: function () {
            }
        };
    }])
;

angular.module('bplusConfigModule', [])
    .value('bplusConfig', {})
;