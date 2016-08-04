define([
    "jquery",
    "angular"
], function ($, angular) {
    var SERVICE_MEMBER = "memberExt";
    var bgBanner = [
    ];
    for (var i = 0; i < 9; i++) {
        bgBanner.push('img/profile/banner.' + i + '.jpg');
    }
    var createImageUrl = function (imagePath) {
        return angular.bplus.config.cdn.normal + imagePath + "?" + angular.bplus.config.cdn.version;
    };

    return function (agModule) {
        agModule.controller('banner', ['$scope', 'personalinfoService', function ($scope, model) {
            var bannerIndex = 0;
            model.getData(SERVICE_MEMBER).then(function (data) {
                $(".b-profile-banner-btns").removeClass("hidden");
                var memberData = data[0];
                var imagePath = "";
                if (memberData.userBackground) {
                    imagePath = memberData.userBackground;
                    bannerIndex = bgBanner.indexOf(imagePath);
                } else {
                    imagePath = bgBanner[0];
                    bannerIndex = 0;
                }
                $scope.imageBanner = createImageUrl(imagePath);
                $scope.hoverBtn = '';

            });
            $scope.switchBanner = function () {
                bannerIndex = ++bannerIndex >= bgBanner.length ? 0 : bannerIndex;
                var imagePath = bgBanner[bannerIndex];
                $scope.imageBanner = createImageUrl(imagePath);
                model.updateData(SERVICE_MEMBER, {
                    userBackground: imagePath
                });
            };
        }]);
    };
});