angular
    .module('opdModule', [
        'bplusModule',
        'ui.router',
        'chart.js'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var states = ['home', 'job', 'favorite', 'recommended-positions', 'applied-positions', 'training'];

        $urlRouterProvider.otherwise('/' + states[0]);

        for (var i = 0; i < states.length; i++) {
            var state = states[i];

            $stateProvider
                .state(state, {
                    url: '/' + state,
                    templateUrl: state + '.html'
                });
        }
    }])
    .config(angular.bplus.translate)
    .run(['$rootScope', function ($rootScope) {
        $rootScope.cdn = angular.bplus.config.cdn;
    }])
    .filter('encodeURIComponent', ['$window', function($window) {
        return $window.encodeURIComponent;
    }])
    .controller('OpdMenuCtrl', angular.bplus.OpdMenuCtrl)
    .controller('OpdCtrl', angular.bplus.OpdCtrl)
    .directive('autocomplete', angular.bplus.autoComplete)
    .factory('PipeCacheService', angular.bplus.PipeCacheService)
    .factory('FormValidation', angular.bplus.FormValidation)
;