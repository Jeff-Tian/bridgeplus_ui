angular.module('opdModule').directive('bopdfavourite', ['$q', function ($q) {
    return {
        restrict: "E",
        scope: true,
        templateUrl: '/view-partial/opd/detail-favourite.html',
        link: function ($scope, element, attrs) {
            var FIRST_PAGE = 1;
            var positionData = [];
            var companyData = [];
            $scope.isSearching = true;
            var search = function() {
                $scope.isSearching = true;
                return $scope.getFavoritePositions(
                    ).then(function(ret){
                        positionData = ret.jobs;
                        companyData = ret.company;
                        $scope.data.positions.totalPage = positionData.length;
                        $scope.data.companies.totalPage = companyData.length;
                        $scope.data.positions.data = positionData;
                        $scope.data.companies.data = companyData;
                        $scope.isSearching = false;
                });
            };
            $scope.data = {};
            $scope.data.positions = {
                NUMBER_PER_PAGE: 10,
                loginin: $scope.hasLoggedin(),
                showPosition: true,
                showPageMenu: true,
                showPageMore: false,
                deleteable: "true",
                delete: function(target) {
                    return $scope.removeFavoritePosition(target.jobID, true).then(function() {
                        return search();
                    });
                },
                getData: function (currentPage) {
                    $scope.data.positions.data = [];
                    positionData.forEach(function(value) {
                        $scope.data.positions.data.push(value);
                    });
                    $scope.data.positions.currentPage = currentPage;
                    var deferred = $q.defer();
                    deferred.resolve($scope.data.positions.data);
                    return deferred.promise;
                },
                totalPage: 1,
                currentPage: FIRST_PAGE,
                data: []
            };

            $scope.data.companies = {
                NUMBER_PER_PAGE: 10,
                loginin: $scope.hasLoggedin(),
                totalPage: 1,
                currentPage: FIRST_PAGE,
                delete: function(target) {
                    return $scope.removeFavoritePosition(target.id, false).then(function() {
                        return search();
                    });
                },
                getData: function (currentPage) {
                    $scope.data.companies.data = [];
                    companyData.forEach(function(value) {
                        $scope.data.companies.data.push(value);
                    });
                    $scope.data.companies.currentPage = currentPage;
                    var deferred = $q.defer();
                    deferred.resolve($scope.data.companies);
                    return deferred.promise;
                },
                redirectToPosition: function(target) {
                    $scope.overallParams.searchCompanyID = target.id;
                    location.hash = "/job";
                },
                data: []
            };
            if ($scope.hasLoggedin()) {
                search();
            }
            $(".b-opd-favorite .menu .item").tab();
        }
    };
}]);