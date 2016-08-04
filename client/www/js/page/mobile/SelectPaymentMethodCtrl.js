(function (exports) {
    exports.SelectPaymentMethodCtrl = function ($scope, service, FormValidation, $stateParams, $state, queryParser, msgBus, WechatWrapper, DeviceHelper) {
        // Ugly workaround for live issue. TODO: investigate and fix it
        if (queryParser.get('openid').indexOf('%20') === 0) {
            location.href = '/m/#select-payment-method';
            return;
        }

        var moduleTrack = new window.ModuleTrack(DeviceHelper.isMobile() ? 'm.MS2015Pay' : 'MS2015Pay');

        function gotoPaid(result) {
            function gotoPaidInner() {
                $state.go('paid', {
                    who: $scope.memberInfo.member_id,
                    displayName: $scope.memberInfo.displayName,
                    redemptionCode: result && result.generatedRedemption ? (result.generatedRedemption.result || '') : ''
                });
            }

            msgBus.onMemberLoaded($scope, gotoPaidInner);
        }

        function gotoInterests(result) {
            function gotoInterestsInner() {
                $state.go('select-interest', {
                    who: $scope.memberInfo.member_id,
                    displayName: $scope.memberInfo.displayName,
                    redemptionCode: result && result.generatedRedemption ? (result.generatedRedemption.result || '') : ''
                });
            }

            msgBus.onMemberLoaded($scope, gotoInterestsInner);
        }

        $scope.offerData = {
            kind: 'second'
        };

        $scope.payData = {
            redemptionCode: DeviceHelper.getCookie('redemption_code') || DeviceHelper.getCookie('pre_redemption_code') || ''
        };

        $scope.buying = false;
        $scope.buyWithRedemptionCode = function () {
            moduleTrack.send("finPayment.click", {hasInputCode: $scope.payData.redemptionCode});

            service.executePromiseAvoidDuplicate($scope, 'buying', function () {
                return service
                    .post(angular.bplus.config.serviceUrls.createOrderAndPayByRedemptionCode, {
                        redemptionCode: $scope.payData.redemptionCode
                    })
                    .then(function (result) {
                        gotoInterests(result);
                    })
                    .catch(FormValidation.delegateHandleFormError($('.redemption-form')))
                    ;
            });
        };

        $scope.alipaying = false;

        var kindOptionMap = {
            first: 'repechages-2015',
            second: 'repechages-2015-middle',
            third: 'repechages-2015-economy'
        };

        $scope.alipay = function (payFromDevice) {
            moduleTrack.send("alipay.click", {hasInputCode: $scope.payData.redemptionCode});

            var option = kindOptionMap[$scope.offerData.kind];

            if (option) {
                pay($scope, 'alipaying', payFromDevice || 'alipaymobile', angular.bplus.config.serviceUrls.createOrderAndPayByAlipay.replace(':option', option), $('.alipay-form'));
            } else {
                window.alert('不支持的 offer :' + $scope.offerData.kind);
            }
        };

        $scope.pcAlipay = function () {
            $scope.alipay('b_alipay');
        };

        $scope.wechatPaying = false;
        $scope.wechatPay = function () {
            moduleTrack.send("wechatPay.click", {hasInputCode: $scope.payData.redemptionCode});

            var option = kindOptionMap[$scope.offerData.kind];

            if (option) {
                pay($scope, 'wechatPaying', 'wechat', angular.bplus.config.serviceUrls.createOrderAndPayByWechat.replace(':option', option) + '?openid=' + queryParser.get('openid') + '&returnUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + '/m/' + '?continue=continue-paying&payment_method=wechat&kind=' + $scope.offerData.kind), $('.wechat-pay-form'));
            } else {
                window.alert('不支持的 offer :' + $scope.offerData.kind);
            }
        };

        var invokingWechatPay = false;

        function wechatPaid() {
            invokingWechatPay = false;
            msgBus.hideLoading();
        }

        function pay(scope, payingFlag, paymentMethod, url, $form) {
            if (invokingWechatPay) {
                return;
            }

            msgBus.showLoading();
            service.executePromiseAvoidDuplicate(scope, payingFlag, function () {
                    return service
                        .post(url, {
                            payment: paymentMethod,
                            requestFrom: encodeURIComponent(window.location.href)
                        })
                        .then(function (result) {
                            if (/^true$/i.test(result.hasRight)) {
                                gotoInterests(result);
                            } else {
                                if (paymentMethod === 'wechat') {

                                    var wechat_config = {
                                        config: {
                                            appId: result.wechat.appId,
                                            timestamp: result.config.timestamp,
                                            nonceStr: result.config.nonceStr,
                                            signature: result.config.signature
                                        },

                                        payment: {
                                            timestamp: result.wechat.timeStamp,
                                            nonceStr: result.wechat.nonceStr,
                                            package: result.wechat.package,
                                            signType: result.wechat.signType,
                                            paySign: result.wechat.paySign
                                        }
                                    };

                                    wechat_config.config.jsApiList = ['checkJsApi', 'chooseWXPay'];
                                    wechat_config.payment.success = function (res) {
                                        if (res.errMsg === 'chooseWXPay:ok') {
                                            window.alert('支付成功!');
                                            wechatPaid();
                                            //gotoPaid();
                                            window.location.reload();
                                        } else {
                                            window.alert('支付失败!');
                                            wechatPaid();
                                        }
                                    };
                                    wechat_config.payment.cancel = function (res) {
                                        window.alert('支付取消！');
                                        wechatPaid();
                                    };
                                    wechat_config.payment.fail = function (res) {
                                        wechatPaid();
                                    };

                                    var wechat = WechatWrapper;

                                    if (!invokingWechatPay) {
                                        invokingWechatPay = true;

                                        wechat.config(wechat_config.config);
                                        wechat.ready(function () {
                                            wechat.checkJsApi({
                                                jsApiList: ['chooseWXPay'],
                                                success: function (res) {
                                                    wechat.chooseWXPay(wechat_config.payment);
                                                }
                                            });
                                        });
                                    }
                                } else {
                                    window.location.href = '//' + angular.bplus.config.payment.host + ':' + angular.bplus.config.payment.port + '/service/payment/' + paymentMethod + '/pay?orderId=' + result.orderId + '&returnUrl=' + encodeURIComponent(window.location.href + '/' + paymentMethod + '/' + $scope.offerData.kind);
                                }
                            }
                        })
                        .catch(function (reason) {
                            FormValidation.handleFormError($form, reason);
                            msgBus.hideLoading();
                        })
                        ;
                }
            )
            ;
        }

        if ($state.current.name === 'select-payment-method') {
            msgBus.onWechatLogonCallbackHandled($scope, function () {
                service.post('/service-proxy/payment/create-order/national-game-2015/check-has-right')
                    .then(function (result) {
                        if (/^true$/i.test(result.hasRight)) {
                            // Don't generate redemption code
                            gotoPaid();
                        }
                    });
            });
        }

        if ($state.current.name === 'continue-paying') {
            if ($stateParams.paymentMethod === 'wechat') {
                $scope.offerData.kind = $stateParams.kind || 'second';
                $scope.wechatPay();
            }
        }

        if ($stateParams.paidBy === 'alipay' || $stateParams.paidBy === 'alipaymobile') {
            $scope.offerData.kind = $stateParams.kind || 'second';
            $scope.alipay();
        }

        if ($stateParams.paidBy === 'wechat') {
            $scope.offerData.kind = $stateParams.kind || 'second';
            $scope.wechatPay();
        }

        $scope.showGameDetailModal = function () {
            moduleTrack.send("learnMore.click", {hasInputCode: $scope.payData.redemptionCode});

            $('.b-game-detail.modal').modal('show');
            // Workaround for unknown semantic modal issue
            $('.wechat-modal').css('display', 'none');
        };

        function updateNgModel(element) {
            var ngModelString = $(element).attr('ng-model');
            var a = ngModelString.split('.');
            $scope.$apply(function () {
                $scope[a[0]][a[1]] = $(element).val();
            });
        }

        $('.ui.radio.checkbox')
            .checkbox({
                onChecked: function () {
                    updateNgModel(this);
                },
                onUnchecked: function () {
                    updateNgModel(this);
                }
            })
        ;
    };

    exports.SelectPaymentMethodCtrl.$inject = ['$scope', 'service', 'FormValidation', '$stateParams', '$state', 'queryParser', 'msgBus', 'WechatWrapper', 'DeviceHelper'];
})
(angular.bplus = angular.bplus || {});