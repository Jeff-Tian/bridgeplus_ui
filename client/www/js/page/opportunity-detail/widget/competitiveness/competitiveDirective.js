(function (exports) {
    exports.bopdcompetitiveness = function () {
        return {
            restrict: "E",
            scope: {
                data: "=",
                classes: '='
            },
            templateUrl: '/js/page/opportunity-detail/widget/competitiveness/main.html',
            link: function ($scope, element, attrs) {
            }
        };
    };

    exports.$injects = [];
})(angular.bplus = angular.bplus || {});