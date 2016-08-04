define([
    'angular',
    'jquery',
    'autoComplete'
], function (
    angular,
    $,
    jqueryautocomplete
) {
    return function (agModule) {
        agModule.directive('bplusAutocomplete', ['$http', function ($http) {
            var lng = angular.bplus.localeHelper.getLocale(window.location.pathname);
            function link(scope, element, attrs) {
                var url = attrs.datasourceBplusAutocomplete ? ('/mock/' + attrs.datasourceBplusAutocomplete.replace('.json', '.' + lng + '.json')) : undefined;
                if (url) {
                    $http.get(url).success(function(data) {
                        $(element).autocomplete({
                            lookup: data
                        });
                    });
                }
            }
            return {
                link: link
            };
        }]);
    };
});