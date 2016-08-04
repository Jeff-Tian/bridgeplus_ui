angular.module('corpModule')
.directive('corpCvList', [function () {
    return {
        templateUrl: 'js/page/corp/directives/corpCVList.html',
        scope: true
    };
}])
;