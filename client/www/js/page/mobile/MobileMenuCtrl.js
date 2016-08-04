(function (exports) {
    exports.MobileMenuCtrl = function ($scope, $stateParams, $state, $rootScope, msgBus, DeviceHelper) {
        $scope.showQRCode = document.cookie.indexOf("source=wechatServiceAccount") === -1;
        msgBus.onMsg(msgBus.events.viewContent.loaded, $scope, function (event, viewConfig) {
            if ($state.current.name === 'menu' && $scope.$parent) {
                $scope.$parent.menuHref = '#/home';
            }
        });
    };

    exports.MobileMenuCtrl.$inject = ['$scope', '$stateParams', '$state', '$rootScope', 'msgBus', 'DeviceHelper'];
})(angular.bplus = angular.bplus || {});