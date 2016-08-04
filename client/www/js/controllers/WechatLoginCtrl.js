(function (exports) {
    exports.WechatLoginCtrl = function ($scope, FormValidation, service, MessageStore, $filter, $sce, queryParser, $timeout, DeviceHelper, WechatLogon) {
        var moduleTrack = new window.ModuleTrack(DeviceHelper.isMobile() ? 'm.login' : 'login');

        $scope.wechatQRPage = $sce.trustAsResourceUrl('about:blank');
        $scope.opening = false;
        $scope.logOnViaWechat = function () {
            var returnUrl = queryParser.get('return_url');
            if (!returnUrl) {
                returnUrl = location.pathname;
            }

            var data = {
                returnUrl: window.location.origin + returnUrl
            };

            service.executePromiseAvoidDuplicate($scope, 'opening', function () {
                return service
                    .post('/service-proxy/logon/by-wechat', data)
                    .then(function (res) {
                        $scope.wechatQRPage = $sce.trustAsResourceUrl(res);
                    });
            });
        };

        $scope.logging = false;
        $scope.logOnFromWechat = function () {
            WechatLogon.sendRequest($scope, 'logging')
                .then(function (res) {
                    $scope.$parent.oAuthLink = res;
                });
        };

        if (!DeviceHelper.isInWechatBrowser()) {
            $scope.logOnViaWechat();
        } else {
            if (angular.bplus.config.mode !== 'dev') {
                $scope.logOnFromWechat();
            }
        }

        $scope.cancelWechatLogin = function () {
            moduleTrack.send('cancel.click');
            $('.ui.bottom.attached.tab').closest('[tab]').tab('change tab', 'login');
        };

        $scope.invertCancelButtonTheme = $('.b-signin-narrow').length > 0;
    };

    exports.WechatLoginCtrl.$inject = ['$scope', 'FormValidation', 'service', 'MessageStore', '$filter', '$sce', 'queryParser', '$timeout', 'DeviceHelper', 'WechatLogon'];
})(angular.bplus = angular.bplus || {});