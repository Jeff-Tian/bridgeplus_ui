angular
    .module('opdModule')
    .directive('opdFilter', function () {
        return {
            templateUrl: 'js/page/opportunity-detail/widget/filter/main.html',
            scope: {
                filters: '=',
                filterSetting: '='
            },
            link: function (scope, element, arrts) {
                scope.equals = angular.equals;
            }
        };
    })
    .directive('opdFilterThumb', function () {
        return {
            templateUrl: 'js/page/opportunity-detail/widget/filter/filter-thumb.html',
            replace: true,
            scope: {
                filters: '=',
                filterSetting: '='
            },
            link: function (scope, element, attrs) {
                scope.equals = angular.equals;
            }
        };
    })
    .directive('opdFilterItem', function () {
        return {
            templateUrl: 'js/page/opportunity-detail/widget/filter/filter-item.html',
            replace: true,
            scope: {
                f: '=',
                filterSetting: '=',
                addShowThumbButton: '='
            },
            link: function (scope, element, attrs) {
                scope.equals = angular.equals;
            }
        };
    })
    .directive('opdSubFilterItem', function () {
        return {
            templateUrl: 'js/page/opportunity-detail/widget/filter/sub-filter-item.html',
            replace: true,
            scope: {
                f: '=',
                filterSetting: '='
            },
            link: function (scope, element, attrs) {
                scope.equals = angular.equals;
            }
        };
    })
    .directive('opdInlineFilter', function () {
        return {
            templateUrl: 'js/page/opportunity-detail/widget/filter/inline-filter.html',
            scope: {
                filters: '=',
                filterSetting: '='
            },
            replace: true,
            link: function (scope, element, attrs) {
                scope.equals = angular.equals;
            }
        };
    })
;