angular.module('opdModule').directive('bopddelivered', ['$q', function($q) {
        return {
            restrict: "E",
            scope: true,
            templateUrl: '/view-partial/opd/detail-delivered.html',
            link: function($scope, element, attrs) {
                var FIRST_PAGE = 1;
                var positionData = [];
                $scope.isSearching = true;
                var search = function() {
                    $scope.isSearching = true;
                    return $scope.getDeliveredPositions(
                        ).then(function(ret){
                            positionData = ret;
                            $scope.positions.totalPage = positionData.length;
                            $scope.positions.data = positionData;
                            $scope.isSearching = false;
                    });
                };
                $scope.positions = {
                    NUMBER_PER_PAGE: 10,
                    loginin: $scope.hasLoggedin(),
                    showPosition: false,
                    showPageMenu: true,
                    showPageMore: false,
                    deleteable: "false",
                    delete: function(target) {},
                    getData: function (currentPage) {
                        $scope.positions.data = [];
                        positionData.forEach(function(value) {
                            $scope.positions.data.push(value);
                        });
                        $scope.positions.currentPage = currentPage;
                        var deferred = $q.defer();
                        deferred.resolve($scope.positions.data);
                        return deferred.promise;
                    },
                    totalPage: 1,
                    currentPage: FIRST_PAGE,
                    data: []
                };
                if ($scope.hasLoggedin()) {
                    search();
                }
            }
        };
    }]);