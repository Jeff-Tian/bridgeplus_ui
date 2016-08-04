angular.module('signIn', ['bplusModule', 'linkedInModule'])
    .factory('FormValidation', angular.bplus.FormValidation)
    .directive('captcha', angular.bplus.captcha || {})
    .controller('SignUpCtrl', angular.bplus.SignUpCtrl)
    .controller('BindMobileCtrl', ['$scope', 'service', function ($scope, service) {
        $scope.bindMobileFormCtrl = {};

        var submitting = false;

        $scope.bindMobile = function () {
            if (submitting) {
                return false;
            }

            submitting = true;
            service
                .post('/service-proxy/member/bind-mobile', $scope.bindMobileFormCtrl.getFormData())
                .then(function () {
                    window.location.href = $scope.localeUrl('/');
                })
                .catch($scope.bindMobileFormCtrl.handleFormError)
                .finally(function () {
                    submitting = false;
                });
        };
    }])
    .directive('ngEnter', angular.bplus.ngEnter || {})
    .controller('LoginCtrl', angular.bplus.LoginCtrl)
    .controller('WechatLoginCtrl', angular.bplus.WechatLoginCtrl)
    .controller('SetPasswordCtrl', ['$scope', 'service', 'FormValidation', function ($scope, service, FormValidation) {
        var $form = $('.ui.form.set-password');
        $scope.isSetPasswordFormValid = function () {
            if ($scope.setPasswordForm.$pristine) {
                return false;
            }

            return $form.form('is valid');
        };

        $scope.setData = {
            password: ''
        };

        var submitting = false;
        $scope.trySetPassword = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if (submitting) {
                return;
            }

            if (!$scope.isSetPasswordFormValid()) {
                return;
            }

            var mailToken = window.location.search;
            mailToken = mailToken.replace(/^.+mailToken=([^&]+).*/i, '$1');

            submitting = true;
            $scope.passwordReset = false;
            service
                .post('/service-proxy/member/resetPasswordByEmail', {
                    token: mailToken,
                    password: $scope.setData.password
                })
                .then(function (json) {
                    console.log(json);
                    $scope.passwordReset = true;
                })
                .catch(FormValidation.delegateHandleFormError($form))
                .finally(function () {
                    submitting = false;
                });
        };
    }])
    .directive('dropdown', angular.bplus.dropdown)
    .directive('registerForm', angular.bplus.registerForm || {})
    .directive('tab', angular.bplus.tab || {})
;

// TODO: integrated into JS framework
(function () {
    $('.checkbox').checkbox();
})();