(function (exports) {
    exports.ResetPasswordByEmailCtrl = function ($scope, FormValidation, service, $filter) {
        $scope.resetData = {};

        var $shape = $('.shape.reset-by-email');
        $shape.shape();

        var $form = $('.ui.form.reset-by-email');
        $scope.isResetPasswordFormValid = function () {
            var result = $scope.resetData.email && $scope.resetData.email.match(FormValidation.validEmailRegex) && $scope.resetData.captcha;

            return result;
        };

        var submitting = false;
        $scope.tryResetPassword = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if (submitting) {
                return;
            }

            $form.form('validate form');

            if (!$scope.isResetPasswordFormValid()) {
                return;
            }

            submitting = true;
            service.post('/service-proxy/mail/send', {
                to: $scope.resetData.email,
                linkPasswordReset: window.location.origin + '/set-password',
                displayName: $scope.resetData.email.substr(0, $scope.resetData.email.indexOf('@')),
                captcha: $scope.resetData.captcha,
                captchaId: $scope.resetData.captchaId,
                subject: $filter('translate')('请重设您的密码')
            })
                .then(function (res) {
                    $form.form('clear');
                    $shape.shape('flip over').find('.active.side').removeClass('hidden');
                }, function (reason) {
                    FormValidation.handleFormError($form, reason, $scope.resetData.email);
                    $scope.refreshCaptcha(function () {
                        $scope.resetData.captcha = '';
                    });
                }).finally(function () {
                    submitting = false;
                });
        };

        $scope.getEmailProviderLink = function () {
            if (!$scope.resetData.email) {
                return 'about:blank';
            }

            function endsWith(str, suffix) {
                if (!str || !str.length) {
                    return false;
                }

                return str.indexOf(suffix, str.length - suffix.length) >= 0;
            }

            var providers = {
                "hotmail.com": "//outlook.com"
            };

            for (var p in providers) {
                if (endsWith($scope.resetData.email, p)) {
                    return providers[p];
                }
            }

            return '//mail.' + $scope.resetData.email.substr($scope.resetData.email.indexOf('@') + 1);
        };
    };

    exports.ResetPasswordByEmailCtrl.$inject = ['$scope', 'FormValidation', 'service', '$filter'];
})(angular.bplus = angular.bplus || {});