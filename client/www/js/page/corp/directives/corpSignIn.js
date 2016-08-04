angular.module('corpModule')
    .directive('corpSignIn', ['service', 'serviceErrorParser', '$rootScope', 'queryParser', 'DeviceHelper', function (service, serviceErrorParser, $rootScope, queryParser, DeviceHelper) {
        return {
            template: '' +
            '\
            <form class="ui large fluid form login" ng-class="{\'loading\': submitting, \'error\': errorMessages.length > 0}"\
                  ng-submit="tryLogin($event)"\
                  name="loginForm">\
                <form-error></form-error>\
                <div class="ui">\
                    <div class="field">\
                        <div class="ui left icon input">\
                            <i class="user icon"></i>\
                            <input type="text" name="username" placeholder="用户名"\
                                   ng-model="loginData.username" ng-required="true">\
                            </div>\
                        </div>\
                        <div class="field">\
                            <div class="ui left icon input">\
                                <i class="lock icon"></i>\
                                <input type="password" name="password" placeholder="请输入密码"\
                                       ng-model="loginData.password" ng-required="true">\
                                </div>\
                            </div>\
                            <div class="fields">\
                                <div class="eight wide field">\
                                    <div class="ui checkbox remember-me" ng-hide="!!loginData.wechatToken"\
                                         ng-cloak>\
                                        <input type="checkbox" ng-model="loginData.rememberMe"\
                                               id="remember-me-check-box">\
                                            <label for="remember-me-check-box">下次自动登录</label>\
                            </div>\
                        </div>\
                        <div class="eight wide field ui right aligned container subcontainer">\
                            <a href="reset-password" ng-click="resetPassword($event)">忘记密码</a>\
                        </div>\
                    </div>\
                    <div>&nbsp;</div>\
                    <button loading type="submit" class="ui fluid large red submit button"\
                            ng-disabled="!loginForm.$valid" ng-cloak>\
                            登录\
                    </button>\
                </div>\
                <div class="ui right aligned container subcontainer">\
                    <div>&nbsp;</div>\
                    <div>没有账号? <a href="#register" ng-click="register()">马上注册</a></div>\
                </div>\
            </form>',
            scope: {},
            link: function ($scope, $element, attrs) {
                $scope.tryLogin = function ($event) {
                    $scope.submitting = false;
                    service.executePromiseAvoidDuplicate($scope, 'submitting', function () {
                        return service.post($rootScope.config.serviceUrls.corp.member.login, {
                            userName: $scope.loginData.username,
                            password: $scope.loginData.password,
                            remember: $scope.loginData.rememberMe,
                            return_url: queryParser.get('return_url')
                        })
                            .then(function (result) {
                                console.log(result);
                                if (result.company.status === 'passed' && DeviceHelper.getCookie('corp_status') !== 'audit') {
                                    window.location.href = '/';
                                } else {
                                    window.location.href = '/register?company_id=' + result.company.company_id;
                                }
                            }, function (reason) {
                                $scope.errorMessages = [serviceErrorParser.getErrorMessage(reason)];
                            });
                    });
                };
            }
        };
    }])
;