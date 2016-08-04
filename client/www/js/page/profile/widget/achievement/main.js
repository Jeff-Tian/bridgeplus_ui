define([
    "jquery",
    "when"
], function ($, when) {
    var TIP_KEY_PREFIX = "CompleteRateTip";

    var MEMBER_EXT_SERVICE = "memberExt";

    function progressFace(val) {
        val = parseInt(val);
        var progressLeft = document.getElementById('progressLeft'),
            progressRight = document.getElementById('progressRight'),
            space = parseInt(1000 / val),
            maxRight = val >= 50 ? 180 : (val <= 0 ? 0 : val * 3.6),
            maxLeft = (val > 50 && val < 100) ? (val - 50) * 3.6 : 180;
        progressRight.style.transform = 'rotate(0deg)';
        progressLeft.style.transform = 'rotate(0deg)';

        function circleRight() {
            var deg = Math.round(progressRight.style.transform.toString().match(/rotate\(([\d\.]+)deg\)/im)[1]);
            if (deg < maxRight) {
                progressRight.style.transform = 'rotate(' + (deg + 1) + 'deg)';
                setTimeout(circleRight, space);
            } else if (val > 50) {
                circleLeft();
            }
        }

        function circleLeft() {
            var deg = Math.round(progressLeft.style.transform.toString().match(/rotate\(([\d\.]+)deg\)/im)[1]);
            if (deg < maxLeft) {
                progressLeft.style.transform = 'rotate(' + (deg + 1) + 'deg)';
                setTimeout(circleLeft, space);
            }
        }

        circleRight();
    }

    return function (agModule) {
        agModule.controller('achievement', ['$scope', '$rootScope', '$http', "personalinfoService", "DeviceHelper", function ($scope, $rootScope, $http, model, DeviceHelper) {
            $scope.classNameFaceEdit = '';
            $scope.dataLoaded = false;
            $scope.data = {
                gender: "",
                avatar: "",
                face: "",
                progress: 0,
                rate: 0
            };

            var moduleTrack = new window.ModuleTrack(DeviceHelper.isMobile() ? 'm.profile' : 'profile');

            $scope.editface = function () {
                moduleTrack.send('image.click');

                return $("#avatarUpload .upload-file")[0].click();
            };
            $scope.avatarMouseOver = function () {

            };
            $scope.avatarMouseLeave = function () {

            };
            $scope.handle = function (ret) {
                var imgUrl = "//" + ret.host + "/" + ret.key;
                var dataToUpdate = {avatar: imgUrl};

                model.updateData(MEMBER_EXT_SERVICE, dataToUpdate).then(function () {
                    model.getData(MEMBER_EXT_SERVICE, null, true);
                });
            };
//          $http.get('/mock/profile-achievement.json').success( function (data) {
            var updateAchievement = function () {
                $scope.data.progress = 0;
                var patterns = model.getPattern();
                var servicesArray = [];
                for (var i in patterns) {
                    servicesArray.push(i);
                }
                var servicePromiseArray = servicesArray.map(function (value, key) {
                    return model.getData(value);
                });

                when.all(servicePromiseArray).then(function (serviceData) {
                    $scope.dataLoaded = true;
                    serviceData.forEach(function (value, index) {
                        if (servicesArray[index] === MEMBER_EXT_SERVICE) {
                            $scope.data.gender = value[0].gender;
                            $scope.data.avatar = value[0].avatar || "";
                        }
                        if (value.length > 0) {
                            $scope.data.progress++;
                        }
                    });

                    (function () {
                        if ($scope.data.avatar !== "") {
                            $scope.data.face = $rootScope.getAvatarUrl($scope.data.avatar, '-small');
                        } else if ($scope.data.gender.toString().toUpperCase() !== 'F') {
                            $scope.data.face = '/img/profile/icon_profile_picture_male_big.png';
                        } else {
                            $scope.data.face = '/img/profile/icon_profile_picture_female_big.png';
                        }
                        // }
                    })();

                    //              (function () {
                    //                  var list = (data.list instanceof Array) ? data.list : [];
                    //                  for (var i = 0, len = list.length; i < len; i++) {
                    //                      var item = list[i];
                    //                      if (('score' in item) && !/^[\+\-]/gim.test(item.score.toString())) {
                    //                          item.score = '+' + item.score;
                    //                      }
                    //                  }
                    //              })();
                    //
                    //              if ('score' in data) {
                    //                  data.score = '+' + data.score;
                    //              }
                    $scope.data.tip = TIP_KEY_PREFIX + $scope.data.progress;
                    var oldRate = $scope.data.rate;
                    $scope.data.rate = Math.floor($scope.data.progress / servicesArray.length * 100);
                    $scope.$apply();

                    if (oldRate !== $scope.data.rate) {
                        when().delay(500).then(function () {
                            progressFace($scope.data.rate);
                        });
                    }
                });
            };
            updateAchievement();
            model.addForceDataUpdateEventListener(function () {
                updateAchievement();
            });
        }]);
    };
});