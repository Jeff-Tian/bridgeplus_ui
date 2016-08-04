(function (exports) {
    exports.tab = function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs, ngModel) {
                $('.menu .item')
                    .tab({
                        context: attrs.tab,
                        history: true
                    });
            }
        };
    };

    exports.tab.$inject = [];
})(angular.bplus = angular.bplus || {});