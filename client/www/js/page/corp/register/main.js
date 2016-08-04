angular
    .module('corpModule')
    .directive('corpRegister', ['$rootScope', function ($rootScope) {
        return {
            //scope: { '*': '=' },
            link: function (scope, element, attrs) {
                $rootScope.$corpRegister = angular.element(element);
            }
        };
    }])
    .value('corpStatus', {
        unknown: '-1',
        init: 'init',
        audit: 'audit',
        pass: 'passed',
        fail: 'fail'
    })
    .value('events', {
        corpStatus: {
            updated: 'corpStatus:updated'
        }
    })
    .controller("corpRegister", ['$scope', '$window', '$interval', '$q', '$timeout', 'service', 'serviceErrorParser', '$rootScope', 'DeviceHelper', 'corpStatus', 'msgBus', 'events', 'corpModuleEvents', function ($scope, $window, $interval, $q, $timeout, service, serviceErrorParser, $rootScope, DeviceHelper, corpStatus, msgBus, events, corpModuleEvents) {
        var config = {
            secondResendCAPTCHA: 60 * 1
        };

        var $form,
            configForm,
            $btnSendCAPTCHA,
            $inputTelephone,
            timerSendCAPTCHA,
            $countdown,
            timerCountdown
            ;

        msgBus.onMsg(corpModuleEvents.corpInfo.loaded, $scope, function (loadEvent, data) {
            $scope.data = data;
            callbackGetStatus(data.auditStatus);
            console.log('reload page by status ', data.auditStatus);
        });

        $scope.status = corpStatus.unknown;

        function getStatus() {
            callbackGetStatus(DeviceHelper.getCookie('corp_status'));
        }

        getStatus();

        msgBus.onMsg(events.corpStatus.updated, $scope, function ($events, status) {
            console.log('on this msg: ', status);
            callbackGetStatus(status);
        });

        function callbackGetStatus(status) {
            switch (status) {
                case corpStatus.init:
                case corpStatus.audit:
                    $scope.status = status;
                    break;
                case corpStatus.pass:
                    $scope.status = status;
                    if ((!$countdown || !$countdown.length) && ($scope.$countdown && $scope.$countdown.length)) {
                        $countdown = $scope.$countdown;
                    }
                    if ($countdown && $countdown.length) {
                        timerCountdown = $interval(function () {
                            var n = parseInt($countdown.html());
                            if (n) {
                                $countdown.html(n - 1);
                            } else {
                                $interval.cancel(timerCountdown);
                                $window.location.href = ('/cv');
                            }
                        }, 1000);
                    }
                    break;
                case corpStatus.fail:
                    $scope.status = status;
                    break;
                default:
                    break;
            }
        }

        $scope.edit = function () {
            callbackGetStatus(corpStatus.init);
        };

        $scope.sendCAPTCHA = function () {
            if ((!$form || !$form.length) && ($scope.$form && $scope.$form.length)) {
                $form = $scope.$form;
            }
            if (!configForm && $scope.configForm) {
                configForm = $scope.configForm;
            }
            if (!$form || !configForm) {
                return;
            }
            if (!$btnSendCAPTCHA || !$btnSendCAPTCHA.length) {
                $btnSendCAPTCHA = $form.find('.btn-sendCAPTCHA');
            }
            if (!$inputTelephone || !$inputTelephone.length) {
                $inputTelephone = $form.find('[name=telephone]');
            }
            if (!$btnSendCAPTCHA || !$btnSendCAPTCHA.length || !$inputTelephone || !$inputTelephone.length) {
                return;
            }
            if ($btnSendCAPTCHA.hasClass('loading') || $btnSendCAPTCHA.hasClass('disabled')) {
                return;
            }
            var isValid = false;
            $form.form({
                on: 'blur',
                inline: true,
                fields: {
                    telephone: {
                        identifier: 'telephone',
                        rules: [{
                            type: 'regExp[/^1\\d{10}$/]',
                            prompt: $form.find('[name=telephone]').attr('data-prompt')
                        }]
                    }
                }
            });
            isValid = $form.form('is valid');
            $form.form(configForm);

            function callbackSendCAPTCHA() {
                $btnSendCAPTCHA.removeClass('loading').addClass('disabled').html(config.secondResendCAPTCHA);
                timerSendCAPTCHA = $interval(function () {
                    var n = parseInt($btnSendCAPTCHA.html());
                    if (n) {
                        $btnSendCAPTCHA.html(n - 1);
                    } else {
                        $interval.cancel(timerSendCAPTCHA);
                        timerSendCAPTCHA = undefined;
                        $btnSendCAPTCHA.removeClass('disabled').html($btnSendCAPTCHA.attr('data-text-resend'));
                    }
                }, 1000);
                $scope.$on('$destroy', function () {
                    $interval.cancel(timerSendCAPTCHA);
                    timerSendCAPTCHA = undefined;
                });
            }

            $scope.sendingVerificationCode = false;
            if (isValid) {
                var valTelephone = $inputTelephone.val();
                $btnSendCAPTCHA.addClass('loading');

                service.executePromiseAvoidDuplicate($scope, 'sendingVerificationCode', function () {
                    return service.put($rootScope.config.serviceUrls.corp.sms.sendWithoutCaptcha, {
                        mobile: valTelephone
                    });
                })
                    .then(function (result) {
                        console.log(result);
                        delete $scope.errorMessages;
                        $rootScope.message = '短信验证码已发送至 ' + valTelephone + ', 请注意查收';
                    })
                    .then(null, function (reason) {
                        $scope.errorMessages = [serviceErrorParser.getErrorMessage(reason)];
                    })
                    .finally(function () {
                        callbackSendCAPTCHA();
                    })
                ;
            }
        };

        $scope.submit = function () {
            if ((!$form || !$form.length) && ($scope.$form && $scope.$form.length)) {
                $form = $scope.$form;
            }
            if (!$form || !$form.length) {
                return false;
            }
            if ($form.hasClass('loading')) {
                return false;
            }

            function post() {
                $form.removeClass('loading');
                callbackGetStatus(1);
            }

            if ($form.form('is valid')) {
                var vals = $form.form('get values');
                $form.addClass('loading');

                $timeout(post, 2000);
            }
            return false;
        };
    }])
    .directive('corpRegisterForm', ['$rootScope', 'service', 'serviceErrorParser', 'DeviceHelper', '$q', '$timeout', 'corpStatus', 'msgBus', 'events', 'requestTransformers', function ($rootScope, service, serviceErrorParser, DeviceHelper, $q, $timeout, corpStatus, msgBus, events, requestTransformers) {
        return {
            //scope: { '*': '=' },
            link: function (scope, element, attrs) {
                var $form = $rootScope.$form = angular.element(element),
                    configForm = $rootScope.configForm = {
                        on: 'blur',
                        inline: true,
                        fields: {
                            corporation: {
                                identifier: 'corporation',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=corporation]').attr('data-prompt')
                                }]
                            },
                            businesslicense: {
                                identifier: 'businesslicense',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=businesslicense]').attr('data-prompt')
                                }]
                            },
                            city: {
                                identifier: 'city',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=city]').prop('placeholder')
                                }]
                            },
                            contact: {
                                identifier: 'contact',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=contact]').attr('placeholder')
                                }]
                            },
                            gender: {
                                identifier: 'gender',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=gender]').attr('placeholder')
                                }]
                            },
                            position: {
                                identifier: 'position',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=position]').attr('placeholder')
                                }]
                            },
                            email: {
                                identifier: 'email',
                                rules: [{
                                    type: 'email',
                                    prompt: $form.find('[name=email]').attr('data-prompt')
                                }]
                            },
                            telephone: {
                                identifier: 'telephone',
                                rules: [{
                                    type: 'regExp[/^1\\d{10}$/]',
                                    prompt: $form.find('[name=telephone]').attr('data-prompt')
                                }]
                            },
                            CAPTCHA: {
                                identifier: 'CAPTCHA',
                                rules: [{
                                    type: 'empty',
                                    prompt: $form.find('[name=CAPTCHA]').prop('placeholder')
                                }]
                            }
                        }
                    };
                $form.form(configForm);

                scope.clearOldFile = function () {
                    delete scope.data.licenseInfo;
                };

                scope.saving = false;
                scope.saveBasicCorpInfo = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    if (!$form.form('is valid')) {
                        $rootScope.errorMessages = ['请填写完整的信息'];

                        return false;
                    }

                    service.executePromiseAvoidDuplicate(scope, 'saving', function () {
                        if (!scope.data.licenseInfo) {
                            return service.put($rootScope.config.serviceUrls.corp.member.uploadLicense, {
                                file: scope.data.license,
                                'x:category': 'upload-' + Math.random().toString()
                            }, {
                                headers: {
                                    'X-Requested-With': undefined,
                                    'Content-Type': undefined
                                },
                                transformRequest: requestTransformers.transformToFormData
                            });
                        } else {
                            console.log('licenseInfo:', scope.data.licenseInfo);
                            var deferred = $q.defer();
                            deferred.resolve(scope.data.licenseInfo);
                            return deferred.promise;
                        }
                    })
                        .then(function (data) {
                            scope.data.licenseInfo = data;

                            return service.executePromiseAvoidDuplicate(scope, 'saving', function () {
                                return service.post($rootScope.config.serviceUrls.corp.member.basicInfo, {
                                    name: scope.data.companyName,
                                    company_id: DeviceHelper.getCookie('corp_id'),
                                    location: scope.data.city,
                                    contact: scope.data.contact,
                                    contact_position: scope.data.position,
                                    contact_gender: scope.data.contact_gender,
                                    contact_mail: scope.data.email,
                                    contact_mobile: scope.data.mobile,
                                    business_license_url: '//' + data.host + '/' + data.key,
                                    verificationCode: scope.data.verificationCode
                                });
                            });
                        })
                        .then(function (result) {
                            console.log(result);
                            DeviceHelper.setCookie('corp_status', corpStatus.audit);
                            msgBus.emitMsg(events.corpStatus.updated, corpStatus.audit);
                        }, function (reason) {
                            $rootScope.errorMessages = [serviceErrorParser.getErrorMessage(reason)];
                            $timeout(function () {
                                $form.addClass('error');
                            });
                        })
                    ;
                };
            }
        };
    }])
    .directive('countDown', angular.bplus.countDown)
;