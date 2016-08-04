(function (exports) {
    exports.captcha = function (service, $timeout) {
        function pollWait(condition, callback) {
            if (condition()) {
                callback(null, true);
            } else {
                $timeout(function () {
                    pollWait(condition, callback);
                }, 500);
            }
        }

        var captchaServiceDomain = '//' + angular.bplus.config.captcha.host + ':' + angular.bplus.config.captcha.port;

        return {
            restrict: 'A',
            require: 'ngModel',
            template: '<img ng-src="{{captchaImageUrl}}" ng-click="refreshCaptcha()" style="max-height: 100%;">',
            link: function ($scope, $element, attrs, ngModel) {
                function errorHandler(res) {
                    console.error(res);
                    //$element.hide();
                }

                function refreshCaptcha(successCallback, isInit) {
                    if (isInit !== true && typeof $scope.sendTracking === 'function') {
                        $scope.sendTracking('changeIdentityCode.click');
                    }

                    service.jsonp(captchaServiceDomain + '/captcha/generator/p?callback=JSON_CALLBACK&appid=bplus').then(function (result) {
                        $scope.captchaImageUrl = captchaServiceDomain + result.url;
                        ngModel.$setViewValue(result.id);

                        if (typeof successCallback === 'function') {
                            successCallback();
                        }
                    }).catch(errorHandler);
                }

                $scope.refreshCaptcha = refreshCaptcha;

                pollWait(function () {
                    return $element.is(':visible');
                }, refreshCaptcha);
            }
        };
    };

    exports.captcha.$inject = ['service', '$timeout'];
})(angular.bplus = angular.bplus || {});