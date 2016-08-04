angular.module('studyCenterModule')
    .filter('countdown', ['$filter', function ($filter) {
        return function (input) {
            if (!input) {
                return '';
            }

            var date = new Date(input);
            var format = $filter('date')(date, 'mm:ss');
            return Math.floor(date.getTime() / 1000 / 60 / 60) + ':' + format;
        };
    }])
    .factory('FileReaderService', ['$q', function ($q) {
        function readAsDataUri(file, scope) {
            var deferred = $q.defer();

            var reader = new window.FileReader();
            reader.onload = function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
            reader.onerror = function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
            reader.onprogress = function (event) {
                scope.$broadcast('fileProgress', {
                    total: event.total,
                    loaded: event.loaded
                });
            };

            reader.readAsDataURL(file);

            return deferred.promise;
        }

        return {
            readAsDataUri: readAsDataUri
        };
    }])
    .directive('pagination', angular.bplus.paginationDirective)
;