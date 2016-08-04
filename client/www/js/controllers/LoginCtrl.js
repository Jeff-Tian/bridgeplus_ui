(function (exports) {
    exports.LoginCtrl = function ($scope, FormValidation, service, MessageStore, $filter, DeviceHelper, queryParser, msgBus, WechatLogon, linkedInLogOn) {

        $('.ui.checkbox.remember-me').checkbox({
            'onChecked': function () {
                var ngModel = $(this).attr('ng-model');
                var ngModels = ngModel.split('.');
                $scope[ngModels[0]][ngModels[1]] = true;
            },
            onUnchecked: function () {
                var ngModel = $(this).attr('ng-model');
                var ngModels = ngModel.split('.');
                $scope[ngModels[0]][ngModels[1]] = false;
            }
        });

        $scope.loginData = {
            mobile: '',
            password: '',
            rememberMe: false,
            wechatToken: queryParser.get('wechat_token'),
            linkedInToken: queryParser.get('linked_in_token'),
            linkedInProfile: decodeURIComponent(queryParser.get('linked_in_profile')).replace(/[ \s\r\n]/g, '')
        };

        $scope.isInBindMobileMode = !!($scope.loginData.wechatToken || $scope.loginData.linkedInProfile);

        $scope.thirdPartyAccount = $scope.loginData.wechatToken ? '微信' : ($scope.loginData.linkedInProfile ? '领英' : '第三方');

        var moduleTrack = new window.ModuleTrack(
            DeviceHelper.isMobile() ? 'm.login' : 'login',
            function (sender, args) {
                if (args.hash === 'login') {
                    moduleTrack.send(null, {checkAutoLogin: $scope.loginData.rememberMe});
                }
            });

        var hash = moduleTrack.currentHash();
        if (!hash || hash === 'login') {
            moduleTrack.send(null, {checkAutoLogin: $scope.loginData.rememberMe});
        }

        var serverResponse = queryParser.get('server_response');
        if (serverResponse) {
            console.log(serverResponse);
            console.log(window.atob(serverResponse));
        }

        var $loginForm = $('.ui.form.login');

        $scope.isLoginFormValid = function () {
            if ($scope.loginForm.$pristine) {
                return false;
            }

            return $loginForm.form('is valid');
        };

        $scope.submitting = false;
        $scope.resetPassword = function ($event) {
            $event.preventDefault();

            moduleTrack.send('forgetPwd.click', {checkAutoLogin: $scope.loginData.rememberMe});

            window.setTimeout(function () {
                window.location.href = $($event.target).attr('href');
            }, 300);
        };

        $scope.register = function () {
            moduleTrack.send('registerBtn.click', {checkAutoLogin: $scope.loginData.rememberMe});
        };

        function handleLoginSuccess(res) {
            moduleTrack.send('login.afterClick', {
                isLoginSuc: true,
                checkAutoLogin: $scope.loginData.rememberMe
            });

            try {
                MessageStore.set($filter('translate')('SignedInWelcomeMessage'));
            } catch (ex) {
            } finally {
                setTimeout(function () {
                    if (!(DeviceHelper.isMobile() || DeviceHelper.isPad())) {
                        $scope.submitting = true;

                        setTimeout(function () {
                            window.location.href = '/zh/cmpt';
                        }, 300);
                    } else {
                        $scope.submitting = true;

                        setTimeout(function () {
                            window.location.href = '/m/youth';
                        }, 300);
                    }

                }, 1);
            }
        }

        function handleFailure(reason) {
            FormValidation.delegateHandleFormError($loginForm)(reason);

            moduleTrack.send('login.afterClick', {
                isLoginSuc: false,
                checkAutoLogin: $scope.loginData.rememberMe
            });
        }

        function handleLinkedInBindMobile() {
            service.executePromiseAvoidDuplicate($scope, 'submitting', function () {
                return linkedInLogOn.bindMobile($scope.loginData).then(handleLoginSuccess).catch(handleFailure);
            });
        }

        $scope.tryLogin = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            moduleTrack.send('login.beforeclick', {checkAutoLogin: $scope.loginData.rememberMe});
            if (!$scope.isLoginFormValid()) {
                return;
            }

            if ($scope.loginData.linkedInProfile) {
                return handleLinkedInBindMobile();
            }

            service.executePromiseAvoidDuplicate($scope, 'submitting', function () {
                return service.post(angular.bplus.config.serviceUrls.logOnAuthenticate, {
                    value: $scope.loginData.mobile,
                    password: $scope.loginData.password,
                    remember: $scope.loginData.rememberMe,
                    wechat_token: $scope.loginData.wechatToken,
                    return_url: queryParser.get('return_url')
                }).then(handleLoginSuccess).catch(handleFailure);
            });
        };

        $scope.logging = false;
        $scope.logOnViaWechat = function () {
            moduleTrack.send('loginWechat.click', {checkAutoLogin: $scope.loginData.rememberMe});

            if (!DeviceHelper.isInWechatBrowser()) {
                $('.ui.bottom.attached.tab').closest('[tab]').tab('change tab', 'wechat-logon');
            } else {
                if ($scope.$parent.oAuthLink) {
                    window.setTimeout(function () {
                        window.location.href = $scope.$parent.oAuthLink;
                    }, 300);
                } else {
                    loginFromWechat();
                }
            }
        };

        if (DeviceHelper.isInWechatBrowser() && (!queryParser.get('wechat_token')) && (location.href.indexOf('token') < 0) && (location.href.indexOf('is_registed') < 0)) {
            // If the wechat_token is not present, then auto login to get the wechat token.

            if (angular.bplus.config.mode !== 'dev') {
                loginFromWechat();
            }
        }

        function loginFromWechat() {
            WechatLogon.sendRequest($scope, 'logging')
                .then(function (res) {
                    $scope.$parent.oAuthLink = res;
                    window.location.href = $scope.$parent.oAuthLink;
                });
        }
    };

    exports.LoginCtrl.$inject = ['$scope', 'FormValidation', 'service', 'MessageStore', '$filter', 'DeviceHelper', 'queryParser', 'msgBus', 'WechatLogon', 'linkedInLogOn'];
})(angular.bplus = angular.bplus || {});