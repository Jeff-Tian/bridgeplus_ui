describe('sign in', function () {
    it('goes to sign in page', function () {
        browser.get('/zh/game');

        browser.sleep(2000);
        browser.driver.findElement(by.css('.ui.b-header.top-nav .ui.menu.b-header-account .right.item .ui.button:first-child')).click().then(function () {
            expect(browser.driver.getTitle()).toEqual('登录到 Bridge+');
        });

    });
});