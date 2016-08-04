(function (exports) {
    exports.RankingWechatCtrl = function (service, WechatWrapper) {
        var pageTitle = "Bridge+商战排行榜";
        var pageDescription = "商战风云，谁主沉浮！";
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
                            title: pageTitle,
                            desc: pageDescription,
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
                            title: pageTitle,
                            link: location.href,
                            imageUrl: imageUrl
                        });
                    }
                });
            });
        });
    };

    exports.RankingWechatCtrl.$inject = ["service", "WechatWrapper"];
})(angular.bplus = angular.bplus || {});