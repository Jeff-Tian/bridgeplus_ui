describe('PersonalHistoryCtrl', function () {
    var scope;

    // load the controller's module
    beforeEach(module('personalHistory'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('PersonalHistoryCtrl', {$scope: scope});

        var baseTime = new Date(2015, 1, 1);
        jasmine.clock().mockDate(baseTime);
    }));

    // tests start here
    it('should generate start year and end year for school information', function () {
        expect(scope.startYearList[0]).toEqual(2015);
        expect(scope.startYearList[scope.startYearList.length - 1]).toEqual(1865);

        expect(scope.endYearList[0]).toEqual(2023);
        expect(scope.endYearList[scope.endYearList.length - 1]).toEqual(1865);
    });
});