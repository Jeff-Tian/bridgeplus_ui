angular.module('corpModule')
    .directive('corpSignInWidget', [function () {
        return {
            template: '\
            <div class="ui container">\
                <div class="b-sign-in-position-wrapper">\
                    <div class="b-sign-in-position">\
                        <div class="ui b-signin-semi-transparent-wrapper">\
                            <div class="ui column b-signin-semi-transparent-container">\
                                <div class="b-signin-narrow" tab=".b-signin-narrow">\
                                    <div class="ui fluid two item top pointing secondary menu brand">\
                                        <a class="active item" data-tab="login" ng-cloak>{{"SignIn" | translate }}</a>\
                                        <a class="item" data-tab="register" ng-cloak>{{ "SignUp" | translate }}</a>\
                                    </div>\
                                    <div class="ui bottom attached tab active" data-tab="login">\
                                        <corp-sign-in></corp-sign-in>\
                                    </div>\
                                    <div class="ui bottom attached tab" data-tab="register">\
                                        <div class="ui center aligned container subcontainer mobile">\
                                        </div>\
                                        <corp-register></corp-register>\
                                        <div class="field ui right aligned container subcontainer" ng-cloak>\
                                            {{ "HasAccount" | translate }} <a href="#/login" ng-click="login()">{{ "SignInNow" | translate }}</a>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>',
            scope: {},
            link: function ($scope, $element, attrs) {
                angular.element($element).find('.menu.brand .item').tab({
                    history: true
                });
            }
        };
    }])
;