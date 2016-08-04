(function (exports) {
    exports.countDown = function ($timeout) {
        return {
            restrict: 'A',
            scope: {},
            link: function ($scope, $element, attrs, ngModel) {
                function countDown(value) {
                    if (value <= 0) {
                        window.location.href = attrs.href;
                        return;
                    } else {
                        value--;
                        $element.text(value);

                        $timeout(function () {
                            countDown(value);
                        }, 1000);
                    }
                }

                countDown(Number($element.val() || $element.text()));
            }
        };
    };

    exports.countDown.$inject = ['$timeout'];
})(angular.bplus = angular.bplus || {});