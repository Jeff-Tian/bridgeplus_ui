'use strict';

// Declare app level module which depends on views, and components
angular.module('setPassword', ['bplusModule'])
    .factory('FormValidation', angular.bplus.FormValidation)
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
                    console.log($scope.passwordReset);
                })
                .catch(FormValidation.delegateHandleFormError($form))
                .finally(function () {
                    submitting = false;
                });
        };
    }])
;