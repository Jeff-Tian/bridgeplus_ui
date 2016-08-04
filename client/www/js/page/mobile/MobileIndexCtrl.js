(function (exports) {
    exports.MobileIndexCtrl = function ($scope, $stateParams, $state, $rootScope, msgBus, queryParser) {
        $scope.showQRCode = document.cookie.indexOf("source=wechatServiceAccount") === -1;
        msgBus.onMsg(msgBus.events.viewContent.loaded, $scope, function (event, viewConfig) {
            if ($state.current.name === 'home' && $scope.$parent) {
                $scope.$parent.menuHref = '#/menu';
            }
        });

        var continueAction = queryParser.get('continue');

        if (continueAction) {
            var paymentMethod = queryParser.get('payment_method');
            var kind = queryParser.get('kind');

            $state.go(continueAction, {paymentMethod: paymentMethod, kind: kind});
        }
    };

    exports.MobileIndexCtrl.$inject = ['$scope', '$stateParams', '$state', '$rootScope', 'msgBus', 'queryParser'];
})(angular.bplus = angular.bplus || {});