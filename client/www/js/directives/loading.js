(function (exports) {
    exports.loading = function (service, $timeout, msgBus) {
        return {
            restrict: 'A',
            scope: {
                showLoading: '=?'
            },
            link: function ($scope, $element, attrs, ngModel) {
                $scope.showLoading = false;

                msgBus.onMsg(msgBus.events.loading.show, $scope, function () {
                    $scope.showLoading = true;
                    //$element.addClass('loading');
                    if ($element.find('.ui.loading.spinner.icon').length <= 0) {
                        $element.append('<i class="ui loading spinner icon" style="margin-left: 10px;"></i>');
                    }
                });

                msgBus.onMsg(msgBus.events.loading.hide, $scope, function () {
                    $scope.showLoading = false;
                    //$element.removeClass('loading');
                    $element.find('.ui.loading.spinner.icon').remove();
                });

                angular.bplus.loading = {
                    ready: true
                };

                msgBus.notifyLoadingReady();
            }
        };
    };

    exports.loading.$inject = ['service', '$timeout', 'msgBus'];
})(angular.bplus = angular.bplus || {});