describe('Wechat Login Controller', function () {
    var scope;

    // load the controller's module
    beforeEach(module('signIn'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('WechatLoginCtrl', {$scope: scope});
    }));

    // tests start here
    it('should not invert cancel button theme by default', function () {
        expect(scope.invertCancelButtonTheme).toEqual(false);
    });
});
