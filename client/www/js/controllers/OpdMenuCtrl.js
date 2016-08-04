(function (exports) {
    exports.OpdMenuCtrl = function ($scope, $state, $rootScope) {
        $scope.currentState = $state.current.name;

        $rootScope.$on('$stateChangeSuccess', function () {
            $scope.currentState = $state.current.name;
        });
    };

    exports.OpdMenuCtrl.$inject = ['$scope', '$state', '$rootScope'];
})(angular.bplus = angular.bplus || {});