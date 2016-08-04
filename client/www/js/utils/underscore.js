'use strict';

angular.module('ng.utils')
    .factory('_', ['$window', function($window) {
        return $window._;
    }]);