angular.module('widgetModule')
.directive('pagination', [function () {
    // Dependancy:
    // $scope.paginationdata = {
    //     NUMBER_PER_PAGE: 10,
    //     currentPage: 1,
    //     data: [],
    //     rawData: [],
    //     getData: function(){}
    // }
    var FIRST_PAGE = 1;

    var displayPage = function ($scope, data) {
        var NUMBER_PER_PAGE = $scope.paginationdata.NUMBER_PER_PAGE;
        //Common params
        var paginationMenu = $scope.paginationMenu;
        var currentPage = paginationMenu.currentPage;
        var totalPages = $scope.paginationMenu.totalPages = Math.ceil($scope.paginationdata.rawData.length / $scope.paginationdata.NUMBER_PER_PAGE);
        //Refresh paginationdata
        $scope.paginationdata.data = data.slice((currentPage - 1) * NUMBER_PER_PAGE, currentPage * NUMBER_PER_PAGE);
        //Refresh paginationMenu
        switch (currentPage) {
            case 1:
                paginationMenu.activeItem = paginationMenu.FIRST_ITEM;
                break;
            case totalPages:
                paginationMenu.activeItem = paginationMenu.LAST_ITEM;
                break;
            case 2:
                paginationMenu.activeItem = paginationMenu.MIDDLE_ITEM1;
                break;
            case (totalPages - 1):
                paginationMenu.activeItem = paginationMenu.MIDDLE_ITEM3;
                if (totalPages === 4) {
                    //In this case, MIDDLE_ITEM3 is hidden.
                    paginationMenu.activeItem = paginationMenu.MIDDLE_ITEM;
                }
                break;
            default:
                paginationMenu.activeItem = paginationMenu.MIDDLE_ITEM;
                break;
        }
        if (totalPages <= 5) {
            paginationMenu.middleNumber = FIRST_PAGE + 2;
        } else if (currentPage < (FIRST_PAGE + 2)) {
            paginationMenu.middleNumber = FIRST_PAGE + 2;
        } else if (currentPage > totalPages - 2) {
            paginationMenu.middleNumber = totalPages - 2;
        } else {
            paginationMenu.middleNumber = currentPage;
        }
        paginationMenu.showPreEllipsis = paginationMenu.middleNumber >= (FIRST_PAGE + 3);
        paginationMenu.showPostEllipsis = paginationMenu.middleNumber <= (totalPages - 3);
        paginationMenu.leftArrowDisabled = currentPage === FIRST_PAGE;
        paginationMenu.rightArrowDisabled = currentPage === totalPages;
    };
    return {
        restrict: "E",
        scope: {
            paginationdata: '='
        },
        templateUrl: 'js/widget/pagination.html',
        link: function ($scope, element, attrs) {
            var data = $scope.paginationdata.rawData;
            var length = data.length;
            var pages = Math.ceil(length / $scope.paginationdata.NUMBER_PER_PAGE);
            var head = "head";
            $scope.paginationMenu = {
                //Static values
                FIRST_ITEM: head,
                MIDDLE_ITEM1: "middle1",
                MIDDLE_ITEM: "middle",
                MIDDLE_ITEM3: "middle3",
                LAST_ITEM: "tail",
                PREVIOUS: "previous",
                NEXT: "next",
                totalPages: pages,
                currentPage: $scope.paginationdata.currentPage,
                leftArrowDisabled: true,
                rightArrowDisabled: false,
                middleNumber: 1,
                activeItem: head,
                showPreEllipsis: false,
                showPostEllipsis: false,
                //Action
                pageMenuClick: function (item) {
                    var itemChanged = false;
                    switch (item) {
                        case $scope.paginationMenu.PREVIOUS:
                            if ($scope.paginationMenu.currentPage !== FIRST_PAGE) {
                                itemChanged = true;
                                $scope.paginationMenu.currentPage--;
                            }
                            break;
                        case $scope.paginationMenu.NEXT:
                            if ($scope.paginationMenu.currentPage !== $scope.paginationMenu.totalPages) {
                                itemChanged = true;
                                $scope.paginationMenu.currentPage++;
                            }
                            break;
                        default:
                            if ($scope.paginationMenu.currentPage !== item) {
                                itemChanged = true;
                                $scope.paginationMenu.currentPage = item;
                            }
                            break;
                    }
                    if (itemChanged) {
                        $scope.paginationdata.getData($scope.paginationMenu.currentPage).then(function () {
                            data = $scope.paginationdata.rawData;
                            displayPage($scope, data);
                        });
                    }
                }
            };
            displayPage($scope, data);

            if (attrs.autoFetch) {
                $scope.paginationMenu.pageMenuClick(1);
            }
        }
    };
}]);
