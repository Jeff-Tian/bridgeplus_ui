(function (exports) {
    var PAYMENT_OPTIONS = {
        "wechat": "wechat",
        "b_alipay": "b_alipay"
    };
    var OPTIONS = {
        "upsellA": {
            "name": "planA",
            "paymentInfo": "upsell-certification-chinese",
            "offerId": "c75da8f9-37f4-4199-bf68-0197b2477d8e",
            "certification": 1,
            "certificationType": "1",
            "report": 0,
            "comment": 0,
            "price": "50.00"
        },
        "upsellB": {
            "name": "planB",
            "paymentInfo": "upsell-report",
            "offerId": "4ca82ace-f8ac-4189-a2af-9192f1727598",
            "certification": 1,
            "certificationType": "1",
            "report": 1,
            "comment": 0,
            "price": "180.00"
        },
        "upsellC": {
            "name": "planC",
            "paymentInfo": "upsell-comments",
            "offerId": "e2d556df-ad40-4cbf-b12f-30f3a8a1328d",
            "certification": 1,
            "certificationType": "1",
            "report": 1,
            "comment": 1,
            "price": "350.00"
        }
    };
    var PAYMENT_BASIC_URL = "/service-proxy/payment/create-upsell-order";
    var getOrderUrl = function (paymentMethod) {
        return PAYMENT_BASIC_URL + "/by-" + paymentMethod;
    };

    var moduleTrack = new window.ModuleTrack('upsell2');

    exports.OffersCtrl = function ($scope, service, queryParser, DeviceHelper, FormValidation) {
        var extraInfo = queryParser.parse(window.location.search);

        var paymentTarget = OPTIONS["upsellA"];
        $scope.detail = paymentTarget;
        $scope.itemA = {
            price: OPTIONS["upsellA"].price
        };
        $scope.itemB = {
            price: OPTIONS["upsellB"].price
        };
        $scope.itemC = {
            price: OPTIONS["upsellC"].price
        };
        $scope.displayDetail = false;
        $scope.mouseleave = function () {
            $(".b-upsell-detail").css('visibility', 'hidden');
        };
        $scope.select = function (option) {
            $(".b-upsell-detail").css('visibility', 'visible');
            paymentTarget = OPTIONS[option];
            $scope.detail = paymentTarget;
        };
        $scope.pay = function () {
            var paymentMethod = "b_alipay";

            if ($scope.paymentMethod) {
                paymentMethod = PAYMENT_OPTIONS[$scope.paymentMethod];
                moduleTrack.send("pay.click", {option: $scope.paymentMethod});
            }
            if (paymentTarget) {
                return service
                    .post(getOrderUrl(paymentMethod), {
                        payment: paymentMethod,
                        offerId: paymentTarget.offerId,
                        extraInfo: JSON.stringify(extraInfo),
                        requestFrom: encodeURIComponent(window.location.href),
                        paymentInfo: paymentTarget.paymentInfo
                    })
                    .then(function (result) {
                        window.location.href = '//' + angular.bplus.config.payment.host + ':' + angular.bplus.config.payment.port +
                            '/service/payment/' + paymentMethod + '/pay?orderId=' + result.orderId +
                            '&returnUrl=' + encodeURIComponent(location.protocol + "\\\\" + location.host + "\\paymentresult?isSuccess=true");
                    })
                    .catch(function (reason) {
                        if (reason) {
                            console.error(reason);
                            window.alert('创建订单失败');
                        } else {
                            window.location.href = location.protocol + "\\\\" + location.host + "\\paymentresult?isSuccess=false";
                        }
                    });
            }
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
                        window.location.href = '/paymentresult?isSuccess=true';
                    })
                    .catch(FormValidation.delegateHandleFormError($('.redemption-form')))
                    ;
            });
        };
    };
    exports.OffersCtrl.$inject = ['$scope', 'service', 'queryParser', 'DeviceHelper', 'FormValidation'];
})(angular.bplus = angular.bplus || {});