angular.module('opdModule').directive('bopdtraining', function () {
    return {
        restrict: "E",
        scope: {
            src: '='
        },
        templateUrl: '/view-partial/opd/detail-training.html',
        link: function ($scope, element, attrs) {
            $('.shape').shape();
            $('.ui.left.arrow.icon').on('click', function () {
                $(this).closest('.ui.image').find('.shape').shape('flip left');
            });
            $('.ui.right.arrow.icon').on('click', function () {
                $(this).closest('.ui.image').find('.shape').shape('flip right');
            });

            $scope.settingData = {
                sorting: {
                    id: 0,
                    text: '默认'
                },
                filter: {
                    id: 0,
                    text: '不限'
                }
            };

            $scope.settings = [{
                key: 'sorting',
                label: '排序方式：',
                list: [{
                    id: 0,
                    text: '默认'
                }, {
                    id: 1,
                    text: '最新'
                }, {
                    id: 2,
                    text: '推荐星级'
                }, {
                    id: 3,
                    text: '热门'
                }]
            }, {
                key: 'filter',
                label: '机构专长：',
                list: [{
                    id: 0,
                    text: '不限'
                }, {
                    id: 1,
                    text: '语言'
                }, {
                    id: 2,
                    text: 'IT'
                }, {
                    id: 3,
                    text: '留学'
                }]
            }];

            $scope.trainingOpportunityList = {
                NUMBER_PER_PAGE: 5,
                showPageMenu: true,
                showPageMore: false,
                pageMoreHash: "",
                data: [{
                    name: "永苑艺术培训中心",
                    pic: "/img/opd/ad.jpg",
                    description: "全清华北大名师",
                    rate: 3,
                    read: 180,
                    field: "创意与设计领域",
                    labels: [
                        "创意",
                        "思维",
                        "人文",
                        "创作"
                    ],
                    details: [{
                        pic: "/img/opd/ad.jpg",
                        title: "商业海报设计基础班 / 免费"
                    }, {
                        pic: "/img/opd/ad.jpg",
                        title: "商业海报设计基础班 / $99.99"
                    }],
                    isRecommended: true,
                    isAD: false,
                }, {
                    name: "永苑艺术培训中心",
                    pic: "/img/opd/ad.jpg",
                    description: "全清华北大名师",
                    rate: 3,
                    read: 190,
                    field: "创意与设计领域",
                    labels: [
                        "创意",
                        "思维",
                        "人文",
                        "创作"
                    ],
                    details: [{
                        pic: "/img/opd/ad.jpg",
                        title: "商业海报设计基础班 / 免费"
                    }, {
                        pic: "/img/opd/ad.jpg",
                        title: "商业海报设计基础班 / $99.99"
                    }, {
                        pic: "/img/opd/ad.jpg",
                        title: "设计基础班 / $39.99"
                    }],
                    isRecommended: false,
                    isAD: true,
                }]
            };

            var originObject1 = $scope.trainingOpportunityList.data[0];
            for (var i = 0; i < 13; i++) {
                $scope.trainingOpportunityList.data.push($.extend(true, {}, originObject1));
            }
        }
    };
});