'use strict';


// Declare app level module which depends on views, and components
angular.module('resetPassword', ['bplusModule'])
    .factory('FormValidation', angular.bplus.FormValidation)
    .controller('ResetPasswordCtrl', angular.bplus.ResetPasswordCtrl)
    .directive('registerForm', angular.bplus.registerForm)
    .controller('ResetPasswordByEmailCtrl', angular.bplus.ResetPasswordByEmailCtrl)
    .directive('captcha', angular.bplus.captcha)
    .directive('ngEnter', angular.bplus.ngEnter || {})
;