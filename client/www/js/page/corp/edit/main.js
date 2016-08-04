angular
    .module('corpModule')
    .directive('captcha', angular.bplus.captcha)
    .directive('corpEdit', ['$rootScope', 'service', 'requestTransformers', 'serviceErrorParser', 'DeviceHelper', '$timeout', function ($rootScope, service, requestTransformers, serviceErrorParser, DeviceHelper, $timeout) {
        return {
            //scope: {
            //    '*': '='
            //},
            controller: ['$scope', function ($scope) {
                function clearErrorMessages() {
                    $timeout(function () {
                        $rootScope.errorMessages = [];
                    });
                }

                $scope.showAccountInfo = true;
                $scope.modalPassword = function () {
                    if ($scope.$modalPassword) {
                        $scope.$modalPassword.modal({
                            onHide: function () {
                                clearErrorMessages();

                                $scope.changePasswordData = {};
                            }
                        }).modal('show');
                    }
                };
                $scope.modalTelephone = function () {
                    if ($scope.$modalTelephone) {
                        $scope.$modalTelephone.modal({
                            onHide: function () {
                                clearErrorMessages();

                                $scope.changeMobileData = {};
                            }
                        }).modal('show');
                    }
                };

                $scope.uploading = false;
                $scope.fileChanged = function (avatar) {
                    service.executePromiseAvoidDuplicate($scope, 'uploading', function () {
                        return service.put($rootScope.config.serviceUrls.corp.member.uploadProfile, {
                            file: avatar,
                            'x:category': 'upload-' + Math.random().toString()
                        }, {
                            headers: {
                                'X-Requested-With': undefined,
                                'Content-Type': undefined
                            },
                            transformRequest: requestTransformers.transformToFormData
                        });
                    }).then(function (result) {
                        console.log(result);
                        $scope.avatarUrl = '//' + result.host + '/' + result.key + '';

                        service.executePromiseAvoidDuplicate($scope, 'uploading', function () {
                            return service.post($rootScope.config.serviceUrls.corp.member.profile, {
                                company_id: DeviceHelper.getCookie('corp_id'),
                                logo: $scope.avatarUrl
                            });
                        });
                    }).then(function (result) {
                        console.log(result);
                        $scope.corpProfile = result;
                    }, function (reason) {
                        console.error(reason);
                        $rootScope.message = serviceErrorParser.getErrorMessage(reason);
                    });
                };

                $scope.fetchingData = false;
                service.executePromiseAvoidDuplicate($scope, 'fetchingData', function () {
                    return service.get($rootScope.config.serviceUrls.corp.member.profile, {
                        params: {
                            company_id: DeviceHelper.getCookie('corp_id')
                        }
                    });
                }).then(function (result) {
                    console.log(result);
                    $scope.avatarUrl = result.logo;
                    $scope.corpProfile = result;
                    $scope.corpProfile.name = $scope.corpProfile.name || $rootScope.corpBasicInfo.companyName;
                }).then(null, function (reason) {
                    $rootScope.message = serviceErrorParser.getErrorMessage(reason);
                });

                function findNameByValue(list, value) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].value === value) {
                            return list[i].name;
                        }
                    }

                    return '';
                }

                $scope.savingCorpBasicProfile = false;
                $scope.saveCorpBasicInfo = function () {
                    service.executePromiseAvoidDuplicate($scope, 'savingCorpBasicProfile', function () {
                            return service.post($rootScope.config.serviceUrls.corp.member.profile, {
                                company_id: DeviceHelper.getCookie('corp_id'),
                                name: $scope.corpProfile.name,
                                industry: findNameByValue($scope.industries, $scope.corpProfile.industry_id),
                                industry_id: $scope.corpProfile.industry_id,
                                scale: findNameByValue($scope.corpScales, $scope.corpProfile.scale_id),
                                scale_id: $scope.corpProfile.scale_id,
                                nature_of_firms: findNameByValue($scope.natureOfFirms, $scope.corpProfile.nature_of_firms_id),
                                nature_of_firms_id: $scope.corpProfile.nature_of_firms_id,
                                website: $scope.corpProfile.website,
                                location: $scope.corpProfile.location,
                                contact: $scope.corpProfile.contact,
                                contact_gender: $scope.corpProfile.contact_gender,
                                contact_position: $scope.corpProfile.contact_position
                            });
                        }
                    ).then(function (result) {
                            $rootScope.message = '保存基本信息成功!';
                        })
                        .then(null, serviceErrorParser.handleError)
                    ;
                };

                $scope.savingCorpDescription = false;
                $scope.saveCorpDescription = function () {
                    service.executePromiseAvoidDuplicate($scope, 'savingCorpDescription', function () {
                        return service.post($rootScope.config.serviceUrls.corp.member.profile, {
                            company_id: DeviceHelper.getCookie('corp_id'),
                            display_name: $scope.corpProfile.display_name,
                            abstraction: $scope.corpProfile.abstraction,
                            description: $scope.corpProfile.description,
                            tags: $scope.corpProfile.tags
                        });
                    })
                        .then(function (result) {
                            $rootScope.message = '保存公司介绍成功!';
                        })
                        .then(null, serviceErrorParser.handleFormError)

                    ;
                };

                $scope.fetchingIndustries = false;
                service.executePromiseAvoidDuplicate($scope, 'fetchingIndustries', function () {
                    return service.get($rootScope.config.serviceUrls.corp.resources.industry.replace(':query?', ''));
                }).then(function (data) {
                    $scope.industries = data;
                });

                $scope.fetchingScales = false;
                service.executePromiseAvoidDuplicate($scope, 'fetchingScales', function () {
                    return service.get($rootScope.config.serviceUrls.corp.resources.corpScales.replace(':query?', ''));
                }).then(function (data) {
                    $scope.corpScales = data;
                });

                $scope.fetchingNatureOfFirms = false;
                service.executePromiseAvoidDuplicate($scope, 'fetchingNatureOfFirms', function () {
                    return service.get($rootScope.config.serviceUrls.corp.resources.natureOfFirms.replace(':query', ''));
                }).then(function (data) {
                    $scope.natureOfFirms = data;
                });
            }],
            link: function (scope, element, attrs) {
            }
        }
            ;
    }])
    .directive('formUsername', ['service', 'serviceErrorParser', '$rootScope', function (service, serviceErrorParser, $rootScope) {
        return {
            link: function (scope, element, attrs) {
                scope.loadingSSO = false;
                service.executePromiseAvoidDuplicate(scope, 'loadingSSO', function () {
                    return service.get($rootScope.config.serviceUrls.corp.member.ssoInfo);
                }).then(function (result) {
                    scope.ssoInfo = result;
                }).then(null, serviceErrorParser.handleError);

                var $form = angular.element(element);
                $form.form({
                    on: 'blur',
                    inline: true,
                    fields: {
                        username: {
                            identifier: 'username',
                            rules: [{
                                type: 'empty',
                                prompt: $form.find('[name=username]').attr('data-prompt')
                            }]
                        }
                    }
                });
            }
        };
    }])
    .directive('modalPassword', ['service', 'serviceErrorParser', '$rootScope', '$compile', '$timeout',
        function (service, serviceErrorParser, $rootScope, $compile, $timeout) {
            return {
                link: function (scope, element, attrs) {
                    scope.$modalPassword = angular.element(element);

                    scope.changingPassword = false;
                    scope.changePasswordData = {};
                    scope.changePassword = function ($event) {
                        if (!$form.form('is valid')) {
                            return false;
                        }

                        service.executePromiseAvoidDuplicate(scope, 'changingPassword', function () {
                            return service.post($rootScope.config.serviceUrls.corp.member.changePassword, {
                                password: scope.changePasswordData.oldPassword,
                                newPassword: scope.changePasswordData.newPassword
                            });
                        }).then(function (result) {
                            console.log(result);
                            scope.$modalPassword.modal('hide');
                            $timeout(function () {
                                $rootScope.message = '密码修改成功';
                            });
                        }).then(null, serviceErrorParser.delegateHandleFormError($form));
                    };

                    var $form = angular.element(element).find('form');
                    $form.form({
                        on: 'blur',
                        fields: {
                            oldPassword: {
                                identifier: 'oldPassword',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=oldPassword]').attr('placeholder')
                                }]
                            },
                            newPassword: {
                                identifier: 'newPassword',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=newPassword]').attr('placeholder')
                                }, {
                                    type: 'different[oldPassword]',
                                    prompt: $form.find('[name=newPassword]').attr('data-prompt')
                                }]
                            },
                            reEnterPassword: {
                                identifier: 'reEnterPassword',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=reEnterPassword]').attr('placeholder')
                                }, {
                                    type: 'match[newPassword]',
                                    prompt: $form.find('[name=reEnterPassword]').attr('data-prompt')
                                }]
                            }
                        },

                        templates: {
                            error: function (errors) {
                                scope.$apply(function () {
                                    $rootScope.errorMessages = errors;
                                });
                                return $compile($('<ul class="list"><li ng-repeat="m in (errorMessages || scope.errorMessages || $root.errorMessages)" ng-bind="m"></li></ul><i class="large remove circle icon" ng-click="errorMessages = scope.errorMessages = $root.errorMessages = undefined"></i>'))(scope);
                            }
                        }
                    });
                }
            };
        }])
    .directive('modalTelephone', ['$rootScope', 'service', 'serviceErrorParser', 'DeviceHelper', function ($rootScope, service, serviceErrorParser, DeviceHelper) {
        return {
            link: function (scope, element, attrs) {
                scope.$modalTelephone = angular.element(element);

                scope.changingMobile = false;
                window.scope = scope;
                scope.changeMobile = function () {
                    service.executePromiseAvoidDuplicate(scope, 'changingMobile', function () {
                        return service.post($rootScope.config.serviceUrls.corp.member.changeMobile, {
                            mobile: scope.changeMobileData.mobile,
                            verificationCode: scope.changeMobileData.verificationCode,
                            password: scope.changeMobileData.password,
                            contact_mobile: scope.changeMobileData.mobile,
                            company_id: DeviceHelper.getCookie('corp_id')
                        });
                    })
                        .then(function (result) {
                            scope.corpProfile.contact_mobile = scope.changeMobileData.mobile;
                            $rootScope.message = '修改手机号成功!';
                            scope.$modalTelephone.modal('hide');
                        })
                        .then(null, serviceErrorParser.handleFormError)
                    ;
                };
            }
        };
    }])
    .directive('formEmail', ['service', 'serviceErrorParser', '$rootScope', 'DeviceHelper', function (service, serviceErrorParser, $rootScope, DeviceHelper) {
        return {
            link: function (scope, element, attrs) {
                var $form = angular.element(element);
                $form.form({
                    on: 'blur',
                    inline: true,
                    fields: {
                        email: {
                            identifier: 'email',
                            rules: [{
                                type: 'email',
                                prompt: $form.find('[name=email]').attr('data-prompt')
                            }]
                        }
                    }
                });

                scope.changingEmail = false;
                scope.changeEmail = function () {
                    if (!$form.form('is valid')) {
                        return false;
                    }

                    service.executePromiseAvoidDuplicate(scope, 'changingEmail', function () {
                        return service.post($rootScope.config.serviceUrls.corp.member.profile, {
                            company_id: DeviceHelper.getCookie('corp_id'),
                            contact_mail: scope.corpProfile.contact_mail
                        });
                    })
                        .then(function (result) {
                            $rootScope.message = '更新 Email 成功!';
                        })
                        .then(null, serviceErrorParser.handleError);
                };
            }
        };
    }])
    .directive('selectionDropdown', [function () {
        return {
            link: function (scope, element, attrs) {
                var $combineBox = angular.element(element);
                $combineBox.dropdown();
            }
        };
    }])
    .directive('searchDropdown', ['$timeout', '$http', function ($timeout, $http) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var $select = $(element);

                var dropdownOption = {
                    useLabels: attrs.useLabels === 'true',
                    allowAdditions: attrs.allowAdditions === 'true'
                };

                var remoteUrl = $select.attr('remoteUrl');
                if (remoteUrl) {
                    console.log('remoteUrl', remoteUrl);
                    dropdownOption.apiSettings = {url: remoteUrl.replace(':query?', '{query}')};
                } else {
                    dropdownOption.apiSettings = false;
                }

                $timeout(function () {
                    function fallback() {
                        $dd.dropdown('set selected', ngModel.$viewValue);
                    }

                    var $dd = $select.dropdown(dropdownOption);

                    if (ngModel.$viewValue) {
                        if (!remoteUrl || dropdownOption.useLabels) {
                            fallback();
                        } else {
                            $http.get(dropdownOption.apiSettings.url.replace('{query}', ''))
                                .success(function (result) {
                                    if (result.results instanceof Array && result.results.length >= 0) {
                                        var selected = result.results.filter(function (e) {
                                            return e.value == ngModel.$viewValue;
                                        });

                                        console.log('selected', selected.map(function (s) {
                                            return s.name;
                                        }));

                                        $dd.dropdown('set selected', selected);
                                    } else {
                                        fallback();
                                    }
                                }).error(fallback);
                        }
                    }
                });
            }
        };
    }])
;