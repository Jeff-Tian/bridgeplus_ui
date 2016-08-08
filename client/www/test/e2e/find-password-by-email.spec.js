describe('find password by email', function () {
    it('should display error message when input wrong captcha', function () {
        browser.get('/zh/reset-password-by-email');

        element(by.model('resetData.email')).sendKeys('jie.tian@hotmail.com');
        element(by.model('resetData.captcha')).sendKeys('wrong captcha');
        element(by.css('button')).click();

        expect(element(by.css('.error.message')).getText()).toEqual('验证码输入错误或者已过期，请换一张重试');
    });
});