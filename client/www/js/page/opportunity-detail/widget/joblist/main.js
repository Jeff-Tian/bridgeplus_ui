angular
    .module('opdModule')
    .directive('bopdJoblist', function () {
        return {
            templateUrl: 'js/page/opportunity-detail/widget/joblist/main.html',
            scope: {
                joblist: '=list'
            },
            link: function (scope, element, attrs) {
            }
        };
    });