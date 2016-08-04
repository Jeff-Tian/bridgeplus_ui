'use strict';

// Declare app level module which depends on views, and components
angular.module('bplusModule', [
    'ng.utils',
    'pascalprecht.translate',
    'ngSanitize',
    'angularQueryParserModule',
    'servicesModule'
])
    .config(angular.bplus.translate)
    .config(angular.bplus.xhr)
    .factory('translationLoader', angular.bplus.translationLoader)
    .factory('MessageStore', angular.bplus.MessageStore)
    .factory('DeviceHelper', angular.bplus.DeviceHelper)
    .factory('WechatLogon', angular.bplus.WechatLogon)
    .directive('loading', angular.bplus.loading)
    .controller('AppCtrl', angular.bplus.AppCtrl)
    .factory('MessageBox', [function () {
        return {
            show: function (msg, keep) {
                var $scope = angular.element('.brand.message-wrapper').scope();

                if (!keep) {
                    $scope.message = msg;
                } else {
                    $scope.shamelessMessage = msg;
                }

                $scope.$apply();
            }
        };
    }])
    .factory('serviceErrorParser', ['$filter', '$rootScope', function ($filter, $rootScope) {
        var o = {};

        o.getErrorMessage = function (reason) {
            console.log('error!', reason);
            var errorCode = 'service-' + reason.code;
            var errorMessage = $filter('translate')(errorCode);
            if (errorMessage === errorCode || !errorMessage) {
                errorMessage = reason.message;
            }

            if (!errorMessage && typeof reason === 'string') {
                errorMessage = reason;
            }

            return errorMessage;
        };

        o.handleError = function (reason) {
            $rootScope.message = o.getErrorMessage(reason);
        };

        o.handleFormError = function (reason) {
            $rootScope.errorMessages = [o.getErrorMessage(reason)];
        };

        o.delegateHandleFormError = function ($form) {
            return function (reason) {
                o.handleFormError(reason);

                if ($rootScope.errorMessages instanceof Array && $rootScope.errorMessages.length) {
                    $form.removeClass('success').addClass('error');
                }
            };
        };

        return o;
    }])
    .run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
        function increaseZIndex() {
            $timeout(function () {
                angular.element('.ui.center.aligned.container.brand.message-wrapper')
                    .css('z-index', '99999999');
            }, 500);
        }

        $rootScope.$watch('message', function (newValue, oldValue) {
            if (newValue) {
                increaseZIndex();

                $timeout(function () {
                    delete $rootScope.message;
                }, 3000);
            }
        });

        $rootScope.$watch('shamelessMessage', function (newValue, oldValue) {
            if (newValue) {
                increaseZIndex();
            }
        });

        $rootScope.getAvatarUrl = function (url, size) {
            if (url.indexOf('//upload.bridgeplus.cn') === 0 || url.indexOf('//img.hcdlearning.com') === 0) {
                return url + size;
            }

            return url;
        };
    }])
;