(function (exports) {
    exports.dropdown = function ($timeout) {
        return {
            link: function (scope, element, attrs, ngModel) {
                if (scope.$last) {
                    var $select = $(element).parent();

                    $timeout(function () {
                        $select.dropdown();
                    });
                }
            }
        };
    };

    exports.dropdown.$inject = ['$timeout'];
})(angular.bplus = angular.bplus || {});