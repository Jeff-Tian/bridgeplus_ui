(function (exports) {
    exports.xhr = function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    };

    exports.xhr.$inject = ['$httpProvider'];
})(angular.bplus = angular.bplus || {});