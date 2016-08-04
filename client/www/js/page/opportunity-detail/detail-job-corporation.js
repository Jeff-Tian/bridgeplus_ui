angular
    .module('opdModule')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('job/corporation', {
            url: '/job/corporation/:corporationid',
            templateUrl: 'job-corporation.html',
            controller: 'detailJobCorporation'
        })
        ;
    }])
    .directive('bopdjobcorporation', function () {
        return {
            templateUrl: '/view-partial/opd/detail-job-corporation.html',
            scope: true,
            link: function (scope, element, attrs) {
                scope.$element = angular.element(element);
            }
        };
    })
    .controller('detailJobCorporation', ['$scope', '$stateParams', '$q', '$templateCache', '$timeout', function ($scope, $stateParams, $q, $templateCache, $timeout) {
        var FIRST_PAGE = 1;
        var corporationID = $stateParams.corporationid;
        $scope.isSearching = true;
        $scope.isContentSearching = true;
        var hasLoggedin = false;
        $scope.isLoggedin = hasLoggedin = $scope.hasLoggedin();
        var search = function(currentPage) {
            $scope.isContentSearching = true;
            return $scope.getPositions(
                    "",
                    {companyID: corporationID},
                    $scope.searchList.NUMBER_PER_PAGE, 
                    currentPage ? currentPage : FIRST_PAGE,
                    $scope.STATIC_PARAMS.POSITION_SOURCE.SEARCH,
                    $scope.STATIC_PARAMS.SORT_KEYS.DEFAULT
                ).then(function(ret){
                    $scope.searchList.currentPage = currentPage;
                    $scope.searchList.data = new Array(ret.total);
                    for (var i = 0; i < ret.total; i++) {
                        $scope.searchList.data[i] = {};
                    }
                    ret.jobs.forEach(function(value, index){
                        $scope.searchList.data[(ret.currentPage - 1)*$scope.searchList.NUMBER_PER_PAGE+index] = value;
                    });
                    $scope.searchList.totalPage = ret.total;
                    $scope.isContentSearching = false;
            });
        };
        //Search config and search results
        $scope.searchList = {
            NUMBER_PER_PAGE: 7,
            showPosition: false,
            showPageMenu: true,
            showPageMore: false,
            deleteable: "false",
            getData: search,
            totalPage: 0,
            currentPage: FIRST_PAGE,
            data: [{
            }]
        };
        var initCalls = [
            search(FIRST_PAGE),
            $scope.getCompanyDetail(corporationID)
        ];
        if (hasLoggedin) {
            initCalls.push($scope.checkFavorite(corporationID, false));
        }
        $q.all(initCalls).then(function(ret){
            var companyDetail = ret[1];
            var hasCollected = ret[2] ? true : false;
            $templateCache.put('companyDescription.html', companyDetail.description);
            $scope.companyData = companyDetail;
            $scope.hasCollected = hasCollected;
            $scope.onCollectClick = function(){
                return $scope.saveFavoritePosition(corporationID, false).then(function(ret){
                    $scope.hasCollected = ret;
                });
            };
            $scope.onLookupPosition = function() {
                $(".opd-intro-company-position").click();
            };
            $scope.isSearching = false;
            $timeout(function(){
                $(".intro-jobs .menu .item").tab();
            });
        });
    }])
    .controller('RadarCtrlCorporation', ['$scope', function ($scope) {
        var dataObject = $scope.companyData.evaluation;
        var keys = Object.keys(dataObject);
        var values = [];
        keys.forEach(function(key){
            values.push(dataObject[key]);
        });
        $scope.labels = keys;
        $scope.data = [values];
        $scope.colors = [
            '#F53E3E'
        ];
        $scope.options = {
            pointDot: false,
            scaleShowLine: true,
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 10,
            scaleStartValue: 0,
            angleLineColor : "rgba(0,0,0,.5)",
            datasetStroke: false,
            datasetStrokeWidth: 0
        };
    }]);