'use strict';

// Declare app level module which depends on views, and components
angular
    .module('mobile', [
        'ng.utils',
        'pascalprecht.translate',
        'ui.router'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home.html',
                controller: 'MobileIndexCtrl'
            })
            .state('menu', {
                url: "/menu",
                templateUrl: "/m/menu",
                controller: 'MobileMenuCtrl'
            })
            .state('select-payment-method', {
                url: '/select-payment-method',
                templateUrl: 'select-payment-method.html',
                controller: 'SelectPaymentMethodCtrl'
            })
            .state('paidBy', {
                url: '/select-payment-method/:paidBy/:kind',
                templateUrl: 'select-payment-method.html',
                controller: 'SelectPaymentMethodCtrl'
            })
            .state('continue-paying', {
                url: '/continue-paying/:paymentMethod/:kind',
                templateUrl: 'select-payment-method.html',
                controller: 'SelectPaymentMethodCtrl'
            })
            .state('select-interest', {
                url: '/select-interest/:who/:displayName/:redemptionCode',
                templateUrl: 'interest.html',
                controller: 'SelectInterestCtrl'
            })
            .state('paid', {
                url: '/paid/:who/:displayName/:redemptionCode',
                templateUrl: 'paid.html',
                controller: 'PaidCtrl'
            })
            .state('my-code', {
                url: '/my-code',
                templateUrl: 'paid.html',
                controller: 'PaidCtrl'
            })
            .state('weekly-competition', {
                url: '/weekly-competition',
                templateUrl: 'weekly-competition.html',
                controller: 'WeeklyCompetitionCtrl',
                data: {
                    requiresLogin: true
                }
            })
        ;
    }])
    .run(['$rootScope', 'DeviceHelper', 'msgBus', function ($rootScope, DeviceHelper, msgBus) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // TODO: Use mid to detect log on has issues inside wechat browser, try other approaches
            if (toState.data && toState.data.requiresLogin && !DeviceHelper.getCookie('mid')) {
                //window.location.href = '/m/sign-in?return_url=' + encodeURIComponent(location.pathname + location.hash);
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.data && toState.data.requiresLogin && !DeviceHelper.getCookie('mid')) {
                //window.location.href = '/m/sign-in?return_url=' + encodeURIComponent(location.pathname + location.hash);
            }
        });
    }])
    .config(angular.bplus.translate)
    .config(angular.bplus.xhr)
    .directive('loading', angular.bplus.loading)
    .factory('translationLoader', angular.bplus.translationLoader)
    .factory('service', angular.bplus.service)
    .factory('FormValidation', angular.bplus.FormValidation)
    .factory('MessageStore', angular.bplus.MessageStore)
    .factory('queryParser', angular.bplus.queryParser)
    .factory('WechatWrapper', angular.bplus.WechatWrapper)
    .factory('WechatLogon', angular.bplus.WechatLogon)
    .factory('DeviceHelper', angular.bplus.DeviceHelper)
    .controller('AppCtrl', angular.bplus.AppCtrl)
    .controller('MobileIndexCtrl', angular.bplus.MobileIndexCtrl)
    .controller('MobileMenuCtrl', angular.bplus.MobileMenuCtrl)
    .controller('MobileHeadCtrl', angular.bplus.MobileHeadCtrl)
    .controller('MobileAboutusCtrl', angular.bplus.MobileAboutusCtrl)
    .controller('MobileNationalCtrl', angular.bplus.MobileNationalCtrl)
    .controller('PaidCtrl', angular.bplus.MobilePaidCtrl)
    .controller('SelectInterestCtrl', angular.bplus.SelectInterestCtrl)
    .controller('SelectPaymentMethodCtrl', angular.bplus.SelectPaymentMethodCtrl)
    .controller('WeeklyCompetitionCtrl', angular.bplus.WeeklyCompetitionCtrl)
;