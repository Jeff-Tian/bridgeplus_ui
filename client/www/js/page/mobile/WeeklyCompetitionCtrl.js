(function (exports) {
    exports.WeeklyCompetitionCtrl = function ($scope, $stateParams, $state, msgBus) {
        msgBus.onMemberLoaded($scope, function () {
            msgBus.onWechatLogonCallbackHandled($scope, function () {
                $scope.memberLoaded = true;
                if ($scope.memberInfo && $scope.memberInfo.member_id) {
                    $scope.loggedOn = true;
                } else {
                    var link = '/m/sign-in?return_url=' + encodeURIComponent(location.pathname + location.hash);
                    window.location.href = link;
                }
            });
        });
    };

    exports.WeeklyCompetitionCtrl.$inject = ['$scope', '$stateParams', '$state', 'msgBus'];
})(angular.bplus = angular.bplus || {});