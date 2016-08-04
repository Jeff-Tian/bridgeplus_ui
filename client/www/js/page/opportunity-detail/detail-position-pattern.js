angular.module('opdModule').directive('bopdpositionpattern', ['$window', '$timeout', function($window, $timeout) {
    var NUMBER_PER_PAGE = 10;

    return {
        restrict: "E",
        scope: {
            positions: '='
        },
        templateUrl: '/view-partial/opd/detail-position-pattern.html',
        link: function($scope, element, attrs) {
            $scope.isRending = true;
            var data = $scope.positions.data,
                currentPage = $scope.positions.currentPage,
                $element = angular.element(element);
            $scope.sid = $scope.$id;
            var loginin = $scope.positions.loginin;
            NUMBER_PER_PAGE = $scope.positions.NUMBER_PER_PAGE || NUMBER_PER_PAGE;
            $scope.displayData = {
                NUMBER_PER_PAGE: $scope.positions.NUMBER_PER_PAGE || NUMBER_PER_PAGE,
                loginin: loginin,
                deleteable: $scope.positions.deleteable !== "false",
                showPageMenu: $scope.positions.showPageMenu,
                showPosition: $scope.positions.showPosition,
                showPageMore: $scope.positions.showPageMore,
                pageMoreHash: $scope.positions.pageMoreHash,
                rawData: $scope.positions.data,
                currentPage: currentPage,
                data: data.slice((currentPage - 1) * NUMBER_PER_PAGE, currentPage * NUMBER_PER_PAGE),
                getData: $scope.positions.getData,
                onClick: function(target) {
                    location.hash = "/job/" + target.jobID;
                },
                onCompanyClick: function(target, $event) {
                    $event.stopPropagation();
                    location.hash = "/job/corporation/" + target.companyinfo.id;
                },
                onDelete: function(target, $event) {
                    $event.stopPropagation();
                    $scope.positions.delete(target);
                },
                onMoreClick: function(){
                    location.hash = $scope.positions.pageMoreHash;
                },
                onMatchlevelClick: function(target, level) {
                    $scope.chosenLevel = level;
                    var $target = '.b-opd-modal-position-matchlevel-';
                    if (target === "competitiveness") {
                        $target = '.b-opd-modal-competitiveness-matchlevel-';
                    }
                    $target += $scope.sid;
                    $('.ui.popup').popup("hide");
                    $($target).modal("show");
                }
            };
            $scope.choisenLevel = "";
            
            $timeout(function() {
                $scope.isRending = false;
                $('.b-opd-position-matchlevel')
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
               $('.b-opd-position-progressrate')
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
              $('.b-opd-help-position')
                  .popup({
                    popup: '.b-opd-popup-help-matchlevel.popup',
                    position: 'bottom left',
                  })
                 ;
              $('.b-opd-help-competitiveness')
                  .popup({
                    popup: '.b-opd-popup-help-progressrate.popup',
                    position: 'bottom left',
                  })
                 ;
            });
        }
    };
}]);