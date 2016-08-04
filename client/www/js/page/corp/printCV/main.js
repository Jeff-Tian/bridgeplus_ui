angular.module('corpModule')
    .controller("printcvCtrl", ['$scope', '$timeout', 'cvService', function ($scope, $timeout, cvService) {
        $scope.resumeDetail = {};
        $scope.isLoading = true;
        var processHash = function () {
            var hash = location.hash.substr(1);
            var seperator = ";";
            var objectSeperator = "=";
            var hashArray = hash.split(seperator);
            var ret = {};
            hashArray.forEach(function (value) {
                var keyValuePaires = value.split(objectSeperator);
                ret[keyValuePaires[0]] = keyValuePaires[1];
            });
            return ret;
        };
        var hashObject = processHash();
        var param = {
            candidate_id: hashObject.cid,
            job_id: hashObject.jid
        };
        cvService.init().then(function () {
            return cvService.getResume(param);
        }).then(function (detail) {
            $scope.isLoading = false;
            $scope.resumeDetail = detail;
        });
    }]);
