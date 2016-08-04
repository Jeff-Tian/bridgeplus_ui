define([

], function (

) {
    return function (agModule) {
        agModule.controller('growing', ['$scope', '$http', function ($scope, $http) {
            $scope.data = [];
//          $http.get('/mock/profile-growing.json').success( function (data) {
//              $scope.data = data;
//          });
        }]);
    };
});