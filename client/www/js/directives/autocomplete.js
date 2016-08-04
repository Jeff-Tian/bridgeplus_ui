(function (exports) {
    exports.autoComplete = function ($http) {
        var findScopeValue = function ($scope, sourceStr, value) {
            var parentTarget = null;
            var lastKey = "";
            var result = sourceStr.split(".").reduce(function (target, key) {
                lastKey = key;
                if (target) {
                    parentTarget = target;
                    return target[key];
                } else {
                    return null;
                }
            }, $scope);

            if (value) {
                parentTarget[lastKey] = value;
            }
            return result;
        };

        return {
            link: function (scope, element, attrs) {
                var lng = angular.bplus.localeHelper.getLocale(window.location.pathname);
                var url = attrs.datasourceBplusAutocomplete;
                if (url.indexOf('f.autoComplete') > -1) {
                }
                if (url) {
                    var dataSource = findScopeValue(scope, url);
                    if (dataSource) {
                        $(element).autocomplete({
                            lookup: dataSource,
                            onSelect: function (suggestion) {
                                var ngModelString = $(this).attr('ng-model');
                                findScopeValue(scope, ngModelString, suggestion.value);
                            }
                        });
                    } else if (url.indexOf('.json') > -1) {
                        url = '/mock/' + url.replace('.json', '.' + lng + '.json');
                        $http.get(url).success(function (data) {
                            $(element).autocomplete({
                                lookup: data,
                                onSelect: function (suggestion) {
                                    var ngModelString = $(this).attr('ng-model');
                                    findScopeValue(scope, ngModelString, suggestion.value);
                                }
                            });
                        });
                    }
                }
            }
        };
    };

    exports.autoComplete.$inject = ['$http'];
})(angular.bplus = angular.bplus || {});