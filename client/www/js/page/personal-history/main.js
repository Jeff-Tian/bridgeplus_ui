'use strict';

// Declare app level module which depends on views, and components
angular.module('personalHistory', ['bplusModule', 'angular-auto-complete'])
    .factory('FormValidation', angular.bplus.FormValidation)
    .controller('PersonalHistoryCtrl', angular.bplus.PersonalHistoryCtrl)
    .directive('dropdown', angular.bplus.dropdown)
;