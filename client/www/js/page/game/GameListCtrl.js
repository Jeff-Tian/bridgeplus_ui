(function (exports) {
    exports.GameListCtrl = function ($scope, service) {
        service.get(angular.bplus.config.serviceUrls.loadGameSeries.replace(':seriesId', angular.bplus.config.competitions['national-2015'].seriesId))
            .then(function (result) {
                $scope.top10Epics = result.epics.sort(function (epic1, epic2) {
                    return (new Date(epic2.game_from)) - (new Date(epic1.game_from));
                }).slice(0, 10);
            });

        $scope.hasGameEnd = function (epic) {
            var now = new Date();

            return new Date(epic.game_end) < now;
        };

        $scope.getShortDescription = function (desc) {
            var index = desc.indexOf('<br');
            if (index >= 0) {
                return desc.substr(0, index);
            } else {
                return desc;
            }
        };
    };

    exports.GameListCtrl.$inject = ['$scope', 'service'];
})(angular.bplus = angular.bplus || {});