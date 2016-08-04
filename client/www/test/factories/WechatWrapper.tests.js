describe('Wechat Wrapper', function () {
    var WechatWrapper;

    beforeEach(module('selectPaymentMethod'));

    beforeEach(inject(function (_WechatWrapper_) {
        WechatWrapper = _WechatWrapper_;
    }));

    it('can mock the wx object', function () {
        expect(WechatWrapper.config).toBeDefined();
        expect(WechatWrapper.ready).toBeDefined();
        expect(WechatWrapper.checkJsApi).toBeDefined();
        expect(WechatWrapper.chooseWXPay).toBeDefined();
        expect(WechatWrapper.onMenuShareAppMessage).toBeDefined();
    });
});