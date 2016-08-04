'use strict';

// Declare app level module which depends on views, and components
angular.module('bindMobileByPassword', ['bplusModule'])
    .factory('FormValidation', angular.bplus.FormValidation)
    .controller('BindMobileByPasswordCtrl', ['$scope', 'service', 'FormValidation', function ($scope, service, FormValidation) {
        $scope.bindData = {
            mobile: '',
            password: ''
        };

        var $form = $('.ui.form.login');

        $scope.isLoginFormValid = function () {
            if ($scope.loginForm.$pristine) {
                return false;
            }

            return $form.form('is valid');
        };

        $scope.submitting = false;

        $scope.bindMobile = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if (!$scope.isLoginFormValid()) {
                return;
            }

            return service.executePromiseAvoidDuplicate($scope, 'submitting', function () {
                return service
                    .post('/service-proxy/member/bind-mobile-by-password', {
                        value: $scope.bindData.mobile,
                        password: $scope.bindData.password
                    })
                    .then(function () {
                        window.location.href = $scope.localeUrl('/');
                    })
                    .catch(FormValidation.delegateHandleFormError($form));
            });
        };
    }])
;