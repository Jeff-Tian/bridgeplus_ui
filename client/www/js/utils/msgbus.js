'use strict';

angular.module('ng.utils')
    .factory('msgBus', ['$rootScope', function ($rootScope) {
        var msgBus = {};
        msgBus.emitMsg = function (msg, data) {
            // console.log('msg: ', msg, data);
            $rootScope.$emit(msg, data);
        };
        msgBus.onMsg = function (msg, scope, func) {
            // console.log('on msg ', func);
            var unbind = $rootScope.$on(msg, func);
            scope.$on('$destroy', unbind);
        };

        msgBus.events = {
            profile: {
                loaded: 'profile:loaded',
                updated: 'profile:updated'
            },
            translation: {
                loaded: 'translation:loaded'
            },
            viewContent: {
                loaded: '$viewContentLoaded'
            },
            loading: {
                show: 'loading:show',
                hide: 'loading:hide',
                ready: 'loading:ready'
            },
            wechatLogonCallback: {
                handled: 'wechatLogonCallback:handled'
            }
        };

        msgBus.showLoading = function () {
            if (angular.bplus.loading && angular.bplus.loading.ready === true) {
                msgBus.emitMsg(msgBus.events.loading.show);
            } else {
                msgBus.onMsg(msgBus.events.loading.ready, $rootScope, function () {
                    msgBus.emitMsg(msgBus.events.loading.show);
                });
            }
        };
        msgBus.hideLoading = function () {
            msgBus.emitMsg(msgBus.events.loading.hide);
        };
        msgBus.notifyLoadingReady = function () {
            msgBus.emitMsg(msgBus.events.loading.ready);
        };
        msgBus.onMemberLoaded = function ($scope, callback) {
            if ($scope.memberLoaded) {
                callback();
            } else {
                msgBus.onMsg(msgBus.events.profile.loaded, $scope, callback);
            }
        };
        msgBus.notifyWechatLogonCallbackHandled = function () {
            msgBus.emitMsg(msgBus.events.wechatLogonCallback.handled);
            msgBus.wechatLogonCallbackHandled = true;
        };
        msgBus.onWechatLogonCallbackHandled = function ($scope, callback) {
            if (msgBus.wechatLogonCallbackHandled) {
                callback();
            } else {
                msgBus.onMsg(msgBus.events.wechatLogonCallback.handled, $scope, callback);
            }
        };

        return msgBus;
    }]);