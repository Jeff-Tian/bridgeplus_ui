define([
    "angular",
    "text!./upload.html"
], function(angular, template) {
    return function(agModel) {
        agModel.directive("upload", ['uploadHandlerService', function(uploadHandlerService) {
            return {
                restrict: "A",
                scope: {
                    handle: '='
                },
                template: template,
                link: function($scope, $element) {
                    var category = $scope.category = 'upload-' + Math.random().toString();
                    var iframe = document.createElement('iframe');
                    var form = $element.children('form');
                    uploadHandlerService.handle[category] = $scope.handle;
                    iframe.name = category;
                    iframe.id = category;
                    iframe.className = 'hidden';
                    document.body.appendChild(iframe);
                    $scope.name = 'file';
                    $scope.action = angular.bplus.config.service_upload + '/upload/bplus-profile-resource';
                    $scope.callback = location.origin + '/service-proxy/upload/callback';
                    form.attr('action', $scope.action);
                    form.attr('target', category);
                    form.on("change", function(event) {
                        form.submit();
                    });
                }
            };
        }]);
    };
});
