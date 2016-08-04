angular.module('opdModule').directive('bopdhomepage', function() {
    return {
        restrict: "E",
        scope: true,
        templateUrl: '/view-partial/opd/detail-homepage.html',
        link: function($scope, element, attrs) {
            var FIRST_PAGE = 1;
            //Search bar
            $scope.overallParams.searchKeyWord = "";
            $scope.searchOptions = {
                placeholder: "请输入职位名称或公司名称",
                candidate: {
                    title: "热门搜索",
                    keywords: [
                        "管理培训生",
                        "产品经理",
                        "运营",
                        "前端工程师",
                        "销售",
                        "行政",
                        "市场",
                        "财务"
                    ]
                },
                searchContent: "",
                search: function(keyword) {
                   $scope.overallParams.searchKeyWord = keyword;
                   location.hash = "job";
                }
            };
            //Position
            //Position-Recommendation
            $scope.isSearchingRecommendation = true;
            var searchRecommendation = function(){
                $scope.isSearchingRecommendation = true;
                $scope.getPositions("", 
                    {}, 
                    $scope.recommendation.positions.NUMBER_PER_PAGE, 
                    1,
                    $scope.STATIC_PARAMS.POSITION_SOURCE.SEARCH).then(function(ret){
                        if (!$scope.recommendation.positions.data) {
                            $scope.recommendation.positions.data = new Array(ret.total);
                            for (var i = 0; i < ret.total; i++) {
                                $scope.recommendation.positions.data[i] = {};
                            }
                        }
                        ret.jobs.forEach(function(value, index){
                            $scope.recommendation.positions.data[(ret.currentPage - 1)*$scope.recommendation.positions.NUMBER_PER_PAGE+index] = value;
                        });
                        $scope.recommendation.positions.totalPage = ret.total;
                        $scope.isSearchingRecommendation = false;
                });
            };
            $scope.recommendation = {};
            $scope.recommendation.positions = {
                NUMBER_PER_PAGE: 5,
                loginin: $scope.hasLoggedin(),
                showPosition: true,
                showPageMenu: false,
                showPageMore: true,
                pageMoreHash: "/recommended-positions",
                getData: searchRecommendation,
                deleteable: "false",
                currentPage: FIRST_PAGE,
                totalPage: 0,
                data: []
            };
            searchRecommendation();
            //Position-Hot
            $scope.isSearchingHot = true;
            var searchHot = function() {
                $scope.isSearchingHot = true;
                $scope.getPositions("", 
                        {}, 
                        $scope.hot.positions.NUMBER_PER_PAGE, 
                        1,
                        $scope.STATIC_PARAMS.POSITION_SOURCE.HOT,
                        $scope.STATIC_PARAMS.SORT_KEYS.DEFAULT
                    ).then(function(ret){
                        if (!$scope.hot.positions.data) {
                            $scope.hot.positions.data = new Array(ret.total);
                            for (var i = 0; i < ret.total; i++) {
                                $scope.hot.positions.data[i] = {};
                            }
                        }
                        ret.jobs.forEach(function(value, index){
                            $scope.hot.positions.data[(ret.currentPage - 1)*$scope.hot.positions.NUMBER_PER_PAGE+index] = value;
                        });
                        $scope.hot.positions.totalPage = ret.total;
                        $scope.isSearchingHot = false;
                });
            };
            $scope.hot = {};
            $scope.hot.positions = {
                NUMBER_PER_PAGE: 100,
                loginin: $scope.hasLoggedin(),
                showPosition: true,
                showPageMenu: false,
                showPageMore: false,
                pageMoreHash: "",
                getData: searchHot,
                deleteable: "false",
                currentPage: FIRST_PAGE,
                totalPage: 0,
                data: []
            };
            searchHot();
            //Training
            // $scope.trainingOpportunityList = {
            //     NUMBER_PER_PAGE: 3,
            //     showPageMenu: false,
            //     showPageMore: true,
            //     pageMoreHash: "/training",
            //     data: [{
            //         name: "永苑艺术培训中心",
            //         pic: "/img/opd/ad.jpg",
            //         description: "全清华北大名师",
            //         rate: 3,
            //         read: 190,
            //         field: "创意与设计领域",
            //         labels: [
            //             "创意",
            //             "思维",
            //             "人文",
            //             "创作"
            //         ],
            //         details: [{
            //             pic: "/img/opd/ad.jpg",
            //             title: "商业海报设计基础班 / 免费"
            //         }, {
            //             pic: "/img/opd/ad.jpg",
            //             title: "商业海报设计基础班 / $99.99"
            //         }],
            //         isRecommended: true,
            //         isAD: false,
            //     }, {
            //         name: "永苑艺术培训中心",
            //         pic: "/img/opd/ad.jpg",
            //         description: "全清华北大名师",
            //         rate: 3,
            //         read: 190,
            //         field: "创意与设计领域",
            //         labels: [
            //             "创意",
            //             "思维",
            //             "人文",
            //             "创作"
            //         ],
            //         details: [{
            //             pic: "/img/opd/ad.jpg",
            //             title: "商业海报设计基础班 / 免费"
            //         }, {
            //             pic: "/img/opd/ad.jpg",
            //             title: "商业海报设计基础班 / $99.99"
            //         }, {
            //             pic: "/img/opd/ad.jpg",
            //             title: "设计基础班 / $39.99"
            //         }],
            //         isRecommended: false,
            //         isAD: true,
            //     }]
            // };

            // var originObject1 = $scope.trainingOpportunityList.data[0];
            // for (i = 0; i < 13; i++) {
            //     $scope.trainingOpportunityList.data.push($.extend(true, {}, originObject1));
            // }
            // $scope.trainingOpportunityList.data = [];
            //Semantic UI
            $(".b-opd-homepage .menu .item").tab();
        }
    };
});