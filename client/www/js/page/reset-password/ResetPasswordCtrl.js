(function (exports) {
    exports.ResetPasswordCtrl = function ($scope, $element, service) {
        $scope.formCtrl = {};

        $scope.submitting = false;
        $scope.resetPassword = function () {
            return service.executePromiseAvoidDuplicate($scope, 'submitting', function () {
                return service.post('/service-proxy/member/resetPassword', $scope.formCtrl.getFormData())
                    .then(function () {
                        $('.reset.shape').shape('flip over').find('.active.side').removeClass('hidden');
                        $scope.passwordReset = true;
                    }, $scope.formCtrl.handleFormError);
            });
        };

        $('.reset.shape').shape();
    };

    exports.ResetPasswordCtrl.$inject = ['$scope', '$element', 'service'];
})(angular.bplus = angular.bplus || {});