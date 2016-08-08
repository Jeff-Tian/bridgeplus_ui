describe('click links to go to detail page', function () {
    it('go to teacher detail page by click links in the fav page', function () {
        browser.get('/zh/sign-in?return_url=%2Fstudy-center%2Fmy#fav');

        browser.driver.findElement(by.name('mobile')).sendKeys('18061993746');
        browser.driver.findElement(by.name('password')).sendKeys('hello');
        browser.driver.findElement(by.name('password')).sendKeys(protractor.Key.ENTER);

        // browser.ignoreSynchronization = true;

        browser.sleep(2000);
        browser.driver.findElement(by.css('.basic.table.positions .avatar')).click().then(function () {
            browser.getAllWindowHandles().then(function (handles) {
                browser.switchTo().window(handles[handles.length - 1]).then(function () {
                    browser.sleep(2000);
                    expect(browser.driver.findElement(by.css('.teacher-info.course-item .title')).getText()).toEqual('导师详情');
                });

                browser.switchTo().window(handles[0]);
            });
        });

    });
});