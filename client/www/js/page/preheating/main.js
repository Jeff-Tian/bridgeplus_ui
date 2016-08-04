'use strict';

// Declare app level module which depends on views, and components
angular.module('bplus', [
    'bplusModule',
    'preheating'
])
    .factory('FormValidation', angular.bplus.FormValidation || function () {
        return {};
    })
;