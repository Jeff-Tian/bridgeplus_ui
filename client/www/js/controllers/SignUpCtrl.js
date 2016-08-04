(function (exports) {
    exports.SignUpCtrl = function ($scope, service, queryParser, DeviceHelper, linkedInLogOn) {
        var moduleTrack = new window.ModuleTrack(
            DeviceHelper.isMobile() ? 'm.register' : 'register',
            function (sender, args) {
                if (args.hash === 'register') {
                    sender.send(null);
                }
            });

        if (moduleTrack.currentHash() === 'register') {
            moduleTrack.send(null);
        }

        $scope.sendTracking = function (event, data) {
            if (!event) {
                return;
            }

            if (data) {
                moduleTrack.send(event, data);
            }
            else {
                moduleTrack.send(event);
            }
        };

        $scope.login = function () {
            moduleTrack.send('loginBtn.click');
        };

        $scope.registerFormCtrl = {};

        $scope.registering = false;
        $scope.signUp = function () {
            function autoSignIn() {
                return service.post('/service-proxy/logon/authentication', {
                    value: signUpData.mobile,
                    password: signUpData.password,
                    wechat_token: queryParser.get('wechat_token')
                })
                    .then(function (json) {
                        moduleTrack.send('register.afterClick', {isRegisterSuc: true});

                        window.setTimeout(function () {
                            window.location.href = $scope.localeUrl('/personal-history');
                        }, 500);
                    }, $scope.registerFormCtrl.handleFormError);
            }

            var signUpData = $scope.registerFormCtrl.getFormData();

            return service.executePromiseAvoidDuplicate($scope, 'registering', function () {
                return service.post('/service-proxy/member/register', signUpData)
                    .then(function () {
                        var linkedInProfile = queryParser.get('linked_in_profile');

                        if (!linkedInProfile) {
                            return autoSignIn();
                        } else {
                            return linkedInLogOn.bindMobile({
                                mobile: signUpData.mobile,
                                password: signUpData.password,
                                linkedInProfile: linkedInProfile
                            });
                        }
                    })
                    .catch(function (reason) {
                        $scope.registerFormCtrl.handleFormError(reason);

                        moduleTrack.send('register.afterClick', {isRegisterSuc: false});
                    });
            });
        };
    };

    exports.SignUpCtrl.$inject = ['$scope', 'service', 'queryParser', 'DeviceHelper', 'linkedInLogOn'];
})(angular.bplus = angular.bplus || {});