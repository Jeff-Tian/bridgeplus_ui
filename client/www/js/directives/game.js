(function (exports) {
    exports.gameHome = function () {
        return {
            templateUrl: '../../view-partial/game-home.html',
            scope: {
                css: '=',
                data: '='
            },
            restrict: "E",

            link: {
                pre: function (scope, element, attrs) {
                    scope.showQRCode = document.cookie.indexOf("source=wechatServiceAccount") === -1;
                    scope.selectDirectiveItem = function (item) {
                        switch (item) {
                            case 'official':
                                scope.css.home = false;
                                scope.css.official = true;
                                break;
                            case 'national':
                                scope.css.home = false;
                                scope.css.national = true;
                                break;
                            case 'season':
                                scope.css.home = false;
                                scope.css.season = true;
                                break;
                            case 'personalRecord':
                                scope.css.home = false;
                                scope.css.personalRecord = true;
                                break;
                            case 'rankingList':
                                scope.css.home = false;
                                scope.css.rankingList = true;
                                break;
                        }
                    };

                    $('.home-wechat-share').popup({
                        on: 'hover',
                    });
                }
                //scope.raderData=[1,2,3,4,5];
            }
        };
    };
    exports.gameOfficial = function () {
        return {
            scope: {},
            restrict: "E",
            templateUrl: '../../view-partial/game-official.html',

            link: {
                pre: function (scope, element, attrs) {
                    console.log('official');
                }
            }
        };
    };
    exports.gameNational = function () {
        return {
            scope: {},
            restrict: "E",
            templateUrl: '../../view-partial/game-national.html',

            link: {
                pre: function (scope, element, attrs) {
                    console.log('national');
                }
            }
        };
    };
    exports.gameSeason = function () {
        return {
            scope: {},
            restrict: "E",
            templateUrl: '../../view-partial/game-season.html',

            link: {
                pre: function (scope, element, attrs) {
                    console.log('season');
                }
            }
        };
    };
    exports.gamePersonalRecord = function () {
        return {
            scope: {
                data: '='
            },
            restrict: "E",
            templateUrl: '../../view-partial/game-personal-record.html',
            link: {
                pre: function (scope, element, attrs) {
                    console.log('personal-record');
                }
            }
        };
    };
    exports.gameRankingList = function ($filter) {
        return {
            templateUrl: '../../view-partial/game-ranking-list.html',
            scope: {},
            restrict: "E",
            link: {
                pre: function (scope, element, attrs) {
                    scope.showQRCode = document.cookie.indexOf("source=wechatServiceAccount") === -1;
                    scope.catetories = [{
                        value: 1,
                        title: 'RankDongBeiDivision',
                    }, {
                        value: 2,
                        title: 'RankHuaBeiDivision',
                    }, {
                        value: 3,
                        title: 'RankHuaDongDivision',
                    }, {
                        value: 4,
                        title: 'RankHuaNanDivision',
                    }, {
                        value: 5,
                        title: 'RankHuaZhongDivision',
                    }, {
                        value: 6,
                        title: 'RankXiNanDivision',
                    }, {
                        value: 7,
                        title: 'RankXiBeiDivision',
                    }];
                    scope.selectCategory = 1;
                    $('.menu .item').tab();
                    $('.ui.dropdown').dropdown({
                        onChange: function (val) {
                            scope.selectCategory = val;
                            scope.$apply();
                        }
                    });
                    $('.rank-wechat-share').popup({
                        on: 'hover',
                    });
                    //scope.selectCategory=scope.catetories[1].value;
                }
            }
        };
    };
    exports.gameHome.$inject = [];
    exports.gameOfficial.$inject = [];
    exports.gameNational.$inject = [];
    exports.gameSeason.$inject = [];
    exports.gamePersonalRecord.$inject = [];
    exports.gameRankingList.$inject = ['$filter'];
})(angular.bplus = angular.bplus || {});