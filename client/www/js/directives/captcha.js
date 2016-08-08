(function (exports) {
    exports.captcha = function (service) {
        var captchaServiceDomain = '//' + angular.bplus.config.captcha.host + ':' + angular.bplus.config.captcha.port;

        var linked = false;

        return {
            restrict: 'A',
            require: 'ngModel',
            template: '<img ng-src="{{captchaImageUrl}}" ng-click="refreshCaptcha()" style="max-height: 100%;">',
            link: function ($scope, $element, attrs, ngModel) {
                if (linked) {
                    return;
                }

                function errorHandler(res) {
                    console.error(res);
                }

                var refreshing = false;

                function refreshCaptcha(successCallback, isInit) {
                    if (refreshing) {
                        return;
                    }

                    refreshing = true;

                    if (isInit !== true && typeof $scope.sendTracking === 'function') {
                        $scope.sendTracking('changeIdentityCode.click');
                    }

                    service.jsonp(captchaServiceDomain + '/captcha/generator/p?callback=JSON_CALLBACK&appid=bplus')
                        .then(function (result) {
                            $scope.captchaImageUrl = captchaServiceDomain + result.url;
                            ngModel.$setViewValue(result.id);

                            if (typeof successCallback === 'function') {
                                successCallback();
                            }
                        })
                        .catch(errorHandler)
                        .finally(function () {
                            refreshing = false;
                        });
                }

                $scope.refreshCaptcha = refreshCaptcha;

                refreshCaptcha();

                $(window).on('hashchange', refreshCaptcha);

                linked = true;
            }
        };
    };

    exports.captcha.$inject = ['service'];
})(angular.bplus = angular.bplus || {});