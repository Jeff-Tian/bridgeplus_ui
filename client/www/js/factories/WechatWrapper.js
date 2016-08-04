(function (exports) {
    exports.WechatWrapper = function () {
        function mockWechat() {
            function nonce() {
            }

            return {
                config: nonce,
                ready: nonce,
                checkJsApi: nonce,
                chooseWXPay: nonce,
                onMenuShareAppMessage: nonce,
                onMenuShareTimeline: nonce
            };
        }

        function getWechat() {
            var wechat = mockWechat();

            if (typeof window.wx !== 'undefined') {
                wechat = window.wx;
            }

            return wechat;
        }

        return getWechat();
    };

    exports.WechatWrapper.$inject = [];
})(angular.bplus = angular.bplus || {});