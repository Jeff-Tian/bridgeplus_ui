'use strict';

angular
    .module('bplus', [
        'bplusModule',
        'studyCenter',
        'trackingModule'
    ])
    .directive('bopdmenu', angular.bplus.leftColumnMenu)
    .controller('OpdMenuCtrl', ['$scope', function ($scope) {
        if (window.location.pathname.match(/\/study-center\/teachercourse\.html/i)) {
            $scope.currentState = 'study-plan';
        }

        if (window.location.pathname.match(/\/study-center\/?$/i)) {
            $scope.currentState = 'study-teacher-book';
        }

        if (window.location.pathname.match(/\/study-center\/teacher(?:book)?\.html/i)) {
            $scope.currentState = 'study-teacher-book';
        }
    }])
    .controller('StudyCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $rootScope.current_page = 'study-center';

        $scope.menus = [{
            text: '预约导师',
            href: '/study-center/teacherbook.html',
            icon: 'user',
            states: ['study-teacher-book']
        }, {
            text: '预约课程',
            href: '/study-center/teachercourse.html',
            icon: 'book',
            states: ['study-plan']
        }, {
            text: '我的预约',
            href: '/study-center/my#/course',
            icon: 'calendar',
            states: ['course']
        }, {
            text: '我的收藏',
            href: '/study-center/my#/fav',
            icon: 'bookmark',
            states: ['fav']
        }];
    }])
;