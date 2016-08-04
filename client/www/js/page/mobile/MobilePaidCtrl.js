(function (exports) {
    exports.MobilePaidCtrl = function ($scope, $stateParams, $state, service, msgBus, $rootScope, DeviceHelper, WechatWrapper) {
        function askForPay() {
            $state.go('select-payment-method');
        }

        $scope.gameLink = window.location.protocol + '//' + window.location.host + '/m/national';

        $scope.paidUser = {
            member_id: $stateParams.who,
            displayName: $stateParams.displayName
        };

        $scope.generatedCode = $stateParams.redemptionCode || '';

        function gotRedemptionCode() {
            if ($scope.generatedCode !== '') {
                DeviceHelper.setCookie('redemption_code', $scope.generatedCode);
            } else {
                $scope.generatedCode = DeviceHelper.getCookie('redemption_code');

                if ($scope.generatedCode) {
                    // Got the code then refresh the page to let the url contains the redemption code
                    // to easy the sharing it outward
                    var params = angular.extend({}, $stateParams, {redemptionCode: $scope.generatedCode});
                    if (!params.who || !params.displayName) {
                        msgBus.onMemberLoaded($scope, function () {
                            params.who = $scope.memberInfo.member_id;
                            params.displayName = $scope.memberInfo.displayName;

                            $state.go('paid', params, {reload: true});
                        });
                    } else {
                        $state.go('paid', params, {reload: true});
                    }
                }
            }
        }

        gotRedemptionCode();

        msgBus.onMemberLoaded($scope, function () {
            if ($scope.paidUser.member_id === $scope.memberInfo.member_id) {
                $scope.currentUserIsMe = true;

                if ($state.current.name === 'paid') {
                    service.post(angular.bplus.config.serviceUrls.checkNationalGame2015OrderPayment)
                        .then(function (result) {
                            if (!/^true$/i.test(result.hasRight)) {
                                askForPay();
                            } else {
                                $scope.showPaid = true;
                            }
                        })
                        .catch(askForPay)
                    ;
                }
            } else {
                $scope.showPaid = true;
            }

            service.post('/service-proxy/member/get-setting', {
                member_id: $scope.paidUser.member_id,
                code: 'redemption-code'
            })
                .then(function (result) {
                    console.log('redemption code got:');
                    console.log(result);

                    if (result) {
                        $scope.generatedCode = result;

                        gotRedemptionCode();
                    }
                });


            if ($state.current.name === 'my-code') {
                if (!$scope.memberInfo || !$scope.memberInfo.member_id) {
                    window.location.href = 'sign-in?return_url=' + encodeURIComponent('/m/index#/my-code');
                } else {
                    service.post('/service-proxy/member/get-setting', {
                        member_id: $scope.memberInfo.member_id,
                        code: 'redemption-code'
                    }).then(function (result) {
                        $state.go('paid', {
                            who: $scope.memberInfo.member_id,
                            displayName: $scope.memberInfo.displayName,
                            redemptionCode: result
                        }, {reload: true});
                    }).catch(function () {
                        $state.go('paid', {
                            who: $scope.memberInfo.member_id,
                            displayName: $scope.memberInfo.displayName
                        }, {reload: true});
                    });
                }
            }
        });

        $rootScope.pageTitle = '火遍各大高校的商赛，快来拿免费门票!';
        $rootScope.pageDescription = '限额3名的Bridge+商战模拟游戏大赛免费入场票，再晚就没了！';

        $(document).attr('title', $rootScope.pageTitle);

        service.post(angular.bplus.config.serviceUrls.wechatJsApiConfig, {
            url: window.location.origin + window.location.pathname
        }).then(function (result) {
            var jsApiList = [
                'onMenuShareAppMessage',
                'onMenuShareTimeline'
            ];

            WechatWrapper.config({
                debug: false,
                appId: result.appId,
                timestamp: String(result.timestamp),
                nonceStr: String(result.noncestr),
                signature: result.signature,
                jsApiList: jsApiList
            });

            WechatWrapper.ready(function () {
                WechatWrapper.checkJsApi({
                    jsApiList: jsApiList,
                    success: function (res) {
                        var imageUrl = angular.bplus.config.cdn.normal + 'img/wechat/for_share.png?' + angular.bplus.config.cdn.version;
                        if (imageUrl.indexOf('//') === 0) {
                            imageUrl = 'http:' + imageUrl;
                        } else {
                            imageUrl = location.origin + imageUrl;
                        }

                        WechatWrapper.onMenuShareAppMessage({
                            title: $rootScope.pageTitle,
                            desc: $rootScope.pageDescription,
                            link: location.href,
                            imgUrl: imageUrl,
                            trigger: function (res) {
                                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                                //alert('用户点击发送给朋友');
                            },
                            success: function (res) {
                                //alert('已分享');
                            },
                            cancel: function (res) {
                                //alert('已取消');
                            },
                            fail: function (res) {
                                //alert(JSON.stringify(res));
                            }
                        });

                        WechatWrapper.onMenuShareTimeline({
                            title: $rootScope.pageTitle,
                            link: location.href,
                            imageUrl: imageUrl
                        });
                    }
                });
            });
        });
    };

    exports.MobilePaidCtrl.$inject = ['$scope', '$stateParams', '$state', 'service', 'msgBus', '$rootScope', 'DeviceHelper', 'WechatWrapper'];
})(angular.bplus = angular.bplus || {});