angular.module('opdModule').directive('bopdcompanylistpattern', ['$timeout', function($timeout) {
    var NUMBER_PER_PAGE = 10;

    return {
        restrict: "E",
        scope: {
            positions: '='
        },
        templateUrl: '/view-partial/opd/detail-companylist-pattern.html',
        link: function($scope, element, attrs) {
            $scope.isRending = true;
            var data = $scope.positions.data;
            var currentPage = $scope.positions.currentPage;
            var loginin = $scope.positions.loginin;
            // $scope.rawData = data;
            $scope.sid = $scope.$id; 
            NUMBER_PER_PAGE = $scope.positions.NUMBER_PER_PAGE || NUMBER_PER_PAGE;
            $scope.choisenLevel = "";
            $scope.displayData = {
                NUMBER_PER_PAGE: $scope.positions.NUMBER_PER_PAGE || NUMBER_PER_PAGE,
                loginin: loginin,
                data: data.slice(0, NUMBER_PER_PAGE),
                rawData: $scope.positions.data,
                currentPage: currentPage,
                getData: $scope.positions.getData,
                onCompanyClick: function(target) {
                    location.hash = "/job/corporation/" + target.id;
                },
                onPositionClick: $scope.positions.redirectToPosition,
                onDelete: function(target, $event) {
                    $event.stopPropagation();
                    $scope.positions.delete(target);
                },
                onMatchlevelClick: function(matchlevel) {
                    $scope.choisenLevel = matchlevel;
                    $('.matchlevel').popup("hide");
                    $('.b-opd-matchLevelDescription-' + $scope.sid)
                      .modal("show")
                    ;
                }
            };
            $timeout(function() {
                $scope.isRending = false;
                 $('.b-opd-help-company-matching')
                  .popup({
                    popup: '.b-opd-popup-help-company-matchlevel.popup',
                    position: 'bottom left',
                  })
                 ;
                $('.matchlevel')
                    .popup({
                        inline   : true,
                        hoverable: true,
                        position : 'top left',
                        delay: {
                          show: 300,
                          hide: 100
                        }
                      })
                    ;
            });
        }
    };
}]);