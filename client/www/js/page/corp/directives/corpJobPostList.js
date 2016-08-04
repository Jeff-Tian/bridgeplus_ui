angular.module('corpModule')
.directive('corpJobPostList', [function () {
    return {
        templateUrl: 'js/page/corp/directives/corpJobPostList.html',
        scope: true
    };
}])
;