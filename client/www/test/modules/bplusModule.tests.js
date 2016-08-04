describe('bplusModule', function () {
    var scope;

    // load the controller's module
    beforeEach(module('bplusModule'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
    }));

    // tests start here
    it('should get avatar url', function () {
        expect(scope.getAvatarUrl('http://wx.qlogo.cn/mmopen/HoGxrZYTwPFI41jDzTXXVbTPegxibFlLvvkwTRfPn8XUbicHGtn1khJlWhxia8tuHF9l6E9QvyHia8hqqy6rSX9XRafyt6fdoRtp/0', '-small')).toEqual('http://wx.qlogo.cn/mmopen/HoGxrZYTwPFI41jDzTXXVbTPegxibFlLvvkwTRfPn8XUbicHGtn1khJlWhxia8tuHF9l6E9QvyHia8hqqy6rSX9XRafyt6fdoRtp/0');
        expect(scope.getAvatarUrl('//upload.bridgeplus.cn/FkWD404PANIU4xHgPhtJRij9wypY', '-small')).toEqual('//upload.bridgeplus.cn/FkWD404PANIU4xHgPhtJRij9wypY-small');
    });

    it('should get avatar url for uploaded from hcd learning site', function () {
        expect(scope.getAvatarUrl('//img.hcdlearning.com/FuY5UaTZhsoq797pbqSQ4OfccMIp', '-small')).toEqual('//img.hcdlearning.com/FuY5UaTZhsoq797pbqSQ4OfccMIp-small');
    });
});