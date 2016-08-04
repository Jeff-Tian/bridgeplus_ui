describe('App Controller', function () {
    var scope;

    // load the controller's module
    beforeEach(module('bplusModule'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('AppCtrl', {$scope: scope});
    }));

    // tests start here
    it('', function () {
    });
});