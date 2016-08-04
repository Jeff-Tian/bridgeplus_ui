angular
    .module('opdModule')
    .directive('shapeFlip', function () {
        return {
            link: {
                post: function (scope, element, arrts) {
                    var $element = angular.element(element),
                        $shape = $element.find('.shape'),
                        $btnPreview = $element.find('.btn-preview'),
                        isPreview = $btnPreview.find('i').hasClass('grey'),
                        $btnNext = $element.find('.btn-next'),
                        isNext = $btnNext.find('i').hasClass('grey');
                    var findShape = function() {
                        return angular.element(element).find('.shape');
                    };

                    if ($shape.length && $shape.shape) {
                        $shape.shape();
                        $btnPreview.on('click', function () {
                            var shape = findShape().shape();
                            if (isPreview) {
                                shape.shape('flip left');
                            }
                        });
                        $btnNext.on('click', function () {
                            var shape = findShape().shape();
                            findShape().shape();
                            if (isNext) {
                                shape.shape('flip right');
                            }
                        });
                    }
                }
            }
        };
    })
    .directive('bopdTraininglist', function () {
        var NUMBER_PER_PAGE = 10;

        return {
            templateUrl: 'js/page/opportunity-detail/widget/traininglist/main.html',
            scope: {
                datalist: '='
            },
            link: function ($scope, element, attrs) {
                NUMBER_PER_PAGE =  $scope.datalist.NUMBER_PER_PAGE || NUMBER_PER_PAGE;
                var data = $scope.datalist.data;
                $scope.rawData = data;
                $scope.displayData = {
                    NUMBER_PER_PAGE: $scope.datalist.NUMBER_PER_PAGE || NUMBER_PER_PAGE,
                    showPageMenu: $scope.datalist.showPageMenu,
                    showPageMore: $scope.datalist.showPageMore,
                    pageMoreHash: $scope.datalist.pageMoreHash,
                    data: data.slice(0, NUMBER_PER_PAGE),
                    onClick: function(target) {
                        //TODO
                        console.log("traininglist.onClick", target);
                    },
                    onItemClick: function(target) {
                        //TODO
                        console.log("traininglist.onItemClick", target);
                    },
                    onMoreClick: function() {
                        location.hash = $scope.datalist.pageMoreHash;
                    }
                };
            }
        };
    });