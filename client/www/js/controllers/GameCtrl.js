(function(exports) {
    exports.gameCtrl = function($scope, $translate) {
        var initItem = function() {
            $scope.css = {
                home: false,
                official: false,
                national: false,
                season: false,
                personalRecord: false,
                rankingList: false
            };
        };

        var initPage = function() {
            initItem();
            $scope.css.home = true;
            $scope.selectedStyle = 'bplus';
            $scope.language = $translate.preferredLanguage();

            $scope.raderData = [1, 2, 3, 4, 5];
        };

        initPage();

        $scope.selectItem = function(item) {
            switch (item) {
                case 'home':
                    initItem();
                    $scope.css.home = true;
                    break;
                case 'official':
                    initItem();
                    $scope.css.official = true;
                    break;
                case 'national':
                    initItem();
                    $scope.css.national = true;
                    break;
                case 'season':
                    initItem();
                    $scope.css.season = true;
                    break;
                case 'personalRecord':
                    initItem();
                    $scope.css.personalRecord = true;
                    break;
                case 'rankingList':
                    initItem();
                    $scope.css.rankingList = true;
                    break;
            }
        };

        $scope.selectStyle = function(style) {
            $scope.selectedStyle = style;
        };

    };

    exports.gameCtrl.$inject = ['$scope', '$translate'];

})(angular.bplus = angular.bplus || {});