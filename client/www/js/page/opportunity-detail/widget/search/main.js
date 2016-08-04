angular
    .module('opdModule')
    .directive('opdSearch', function () {
        return {
            scope: {
                options: "="
            },
            templateUrl: 'js/page/opportunity-detail/widget/search/main.html',
            link: function (scope, element, arrts) {
                scope.onKeyWordClick = function(keyword) {
                    scope.options.searchContent = keyword;
                    scope.options.search(keyword);
                };
            }
        };
    })
;