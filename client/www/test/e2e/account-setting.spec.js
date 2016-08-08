describe('account setting page', function () {
    it('displays account setting page', function () {
        browser.get('/zh/sign-in?return_url=%2Faccount-setting');

        browser.driver.findElement(by.name('mobile')).sendKeys('18061993746');
        browser.driver.findElement(by.name('password')).sendKeys('hello');
        browser.driver.findElement(by.name('password')).sendKeys(protractor.Key.ENTER);

        browser.sleep(2000);
        expect(browser.driver.getTitle()).toEqual('账户设置 - Bridge+');
    });
});