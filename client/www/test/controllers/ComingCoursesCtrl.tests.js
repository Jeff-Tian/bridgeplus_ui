describe('ComingCoursesCtrl', function () {
    var scope;

    // load the controller's module
    beforeEach(module('studyCenterModule'));

    beforeEach(inject(function ($rootScope, $controller) {
        console.log('before each executing...');
        scope = $rootScope.$new();
        $controller('ComingCoursesCtrl', {$scope: scope});

        var baseTime = new Date(2015, 11, 1);
        jasmine.clock().mockDate(baseTime);
    }));

    // tests start here
    it('should decide the course status', function () {
        expect(scope.getCourseStatus(1, 1, new Date(2016, 10, 21))).toEqual('已开课');

        expect(scope.getCourseStatus(18, 10, new Date(2016, 10, 22))).toEqual('已开课');

        expect(scope.getCourseStatus(4, 10, new Date(2016, 11, 22))).toEqual('未开课');

        expect(scope.getCourseStatus(4, 10, new Date(2015, 10, 23))).toEqual('人数不足');
    });

    it('should decide the course progress', function () {
        expect(scope.getCourseProgress(18, 10, 20, new Date(2316, 10, 22))).toEqual('18/20');
        expect(scope.getCourseProgress(4, 10, 20, new Date(2000, 10, 22))).toEqual('开课失败');
    });
});