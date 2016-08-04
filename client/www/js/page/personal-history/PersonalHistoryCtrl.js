(function (exports) {
    exports.PersonalHistoryCtrl = function ($scope, FormValidation, $timeout, service, $filter, msgBus, $q, DeviceHelper) {
        var moduleTrack = new window.ModuleTrack(DeviceHelper.isMobile() ? 'm.personalHis' : 'personalHis');

        $('.ui.checkbox.set-privacy')
            .checkbox({
                'onChecked': function () {
                    $scope.personalInfo.setPrivacy = true;
                },
                onUnchecked: function () {
                    $scope.personalInfo.setPrivacy = false;
                }
            })
        ;

        var $shape = $('.ui.shape.personal-history');
        $shape.shape();

        $scope.tryingNextStep = false;
        $scope.tryNextStep = function ($event) {
            moduleTrack.send('finPersonalInfo.click');

            $event.preventDefault();
            $event.stopPropagation();

            if (!$form1.form('is valid')) {
                return;
            }

            if ($scope.tryingNextStep) {
                return;
            }

            $scope.tryingNextStep = true;

            $q.all([
                service
                    .post('/service-proxy/member/update-sso-profile', $scope.memberInfo)
                    .then(function (res) {
                        console.log(res);

                        $scope.fetchProfile();

                        //$shape.shape('flip over').find('.active.side').removeClass('hidden');
                    })
                    .catch(FormValidation.delegateHandleFormError($form1)),

                service
                    .post('/service-proxy/member/update-profile', $scope.personalInfo)
                    .then(function (res) {
                        console.log(res);
                        loadBPlusProfile();
                    })
                    .catch(FormValidation.delegateHandleFormError($form1))])
                .then(function () {
                    $scope.gotoNextStep();
                })
                .finally(function () {
                    $scope.tryingNextStep = false;
                });
        };

        $scope.gotoNextStep = function () {
            $shape.shape()
                .find('.second.side').addClass('active')
                .end()
                .find('.first.side').removeClass('active');
        };

        $scope.prevStep = function () {
            $shape.shape().find('.first.side').addClass('active')
                .end()
                .find('.second.side').removeClass('active');

            setForm1Value();
        };

        /**
         * This should not be necessary, but due to some yet unknown angular and semantic issues,
         * sometimes the value can't be bound to the UI components automatically. (The bindings are
         * not stable), so make a workaround here
         */
        function setForm1Value() {
            $('input[name=realName]').val($scope.memberInfo.real_name);
            $('select[name=gender]').val($scope.memberInfo.gender);
            $('select[name=yearOfBirth]').val($scope.personalInfo.yearOfBirth);
            $('select[name=monthOfBirth]').val($scope.personalInfo.monthOfBirth);
            $('select[name=dayOfBirth]').val($scope.personalInfo.dayOfBirth);
            $('input[name=currentLocation]').val($scope.personalInfo.currentLocation);
            $('input[name=setPrivacy]').prop('checked', $scope.personalInfo.setPrivacy);
        }

        $scope.gotoComplete = function () {
            window.location.href = $scope.localeUrl('/');
        };

        $scope.gotoGamePage = function () {
            window.location.href = $scope.localeUrl('/game');
        };

        $scope.gotoPay = function () {
            if (!DeviceHelper.isMobile()) {
                window.location.href = $scope.localeUrl('/select-payment-method');
            } else {
                window.location.href = $scope.localeUrl('/m/index#/select-payment-method');
            }
        };

        $scope.tryingSubmit = false;
        $scope.trySubmit = function ($event) {
            moduleTrack.send('finEducation.click');

            $event.preventDefault();
            $event.stopPropagation();

            if (!$form2.form('is valid')) {
                return;
            }

            if ($scope.schoolInfo.endYear && !$scope.schoolInfo.endMonth) {
                FormValidation.handleFormError($form2, $filter('translate')('请选择毕业月份'));

                return;
            }

            if ($scope.schoolInfo.endMonth && !$scope.schoolInfo.endYear) {
                FormValidation.handleFormError($form2, $filter('translate')('请选择毕业年份'));

                return;
            }

            if ($scope.tryingSubmit) {
                return;
            }

            $scope.tryingSubmit = true;

            var path = '/service-proxy/member/add-education';

            if ($scope.schoolInfo.educationId) {
                path = '/service-proxy/member/update-education';
            }

            service
                .post(path, $scope.schoolInfo)
                .then(function (res) {
                    //$scope.gotoPay();
                    $scope.gotoGamePage();
                })
                .catch(FormValidation.delegateHandleFormError($form2))
                .finally(function () {
                    $scope.tryingSubmit = false;
                })
            ;
        };

        $scope.birthYearList = (function () {
            var res = [];
            var thisYear = new Date().getUTCFullYear();
            for (var i = 1960; i < thisYear - 1; i++) {
                res.push(i.toString());
            }

            return res;
        })();

        var prefilledDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

        $scope.getBirthDayList = function () {
            var year = Number($scope.personalInfo.yearOfBirth);
            var month = Number($scope.personalInfo.monthOfBirth);
            var days = [];

            if (!year || !month) {
                days = prefilledDays;
            } else {
                var date = new Date(Date.UTC(year, month - 1, 1));

                while (date.getUTCMonth() === month - 1) {
                    days.push(date.getUTCDate());
                    date.setUTCDate(date.getUTCDate() + 1);
                }
            }

            if ($scope.personalInfo.dayOfBirth && days.indexOf(Number($scope.personalInfo.dayOfBirth)) < 0) {
                $scope.personalInfo.dayOfBirth = days[days.length - 1];
                $('.ui.dropdown.dayOfBirth:not(.no-semantic)').dropdown('set text', $scope.personalInfo.dayOfBirth);
            }

            return days;
        };

        $scope.startYearList = (function () {
            var res = [];
            var thisYear = new Date().getUTCFullYear();
            for (var i = 1865; i <= thisYear; i++) {
                res.push(i);
            }

            return res;
        })();
        $scope.endYearList = (function () {
            var y = $scope.startYearList[$scope.startYearList.length - 1];
            var res = [].concat($scope.startYearList);

            for (var i = 0; i < 8; i++) {
                res.push(y + i + 1);
            }

            return res;
        })();
        $scope.startYearList = $scope.startYearList.reverse();
        $scope.endYearList = $scope.endYearList.reverse();
        $scope.monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        msgBus.onMsg(msgBus.events.profile.loaded, $scope, function () {
            function findGenderText(value) {
                var $options = $('select[name=gender]').find('option');

                for (var i = 0; i < $options.length; i++) {
                    var $element = $($options[i]);

                    if (value === $element.val()) {
                        return $element.text();
                    }
                }

                return value;
            }

            $('select.ui.dropdown[name=gender]')
                .dropdown()
                .dropdown('set text', findGenderText($scope.memberInfo.gender))
            ;

            if ($scope.memberInfo.birthday) {
                var d = new Date($scope.memberInfo.birthday);

                $scope.personalInfo.yearOfBirth = d.getUTCFullYear().toString();
                $scope.personalInfo.monthOfBirth = (d.getUTCMonth() + 1).toString();
                $scope.personalInfo.dayOfBirth = d.getUTCDate().toString();

                setSomeForm1Value();
            }
        });

        $scope.qualifications = [];

        service
            .get('/service-proxy/bplus-resource/qualifications/' + angular.bplus.localeHelper.getLocale(window.location.pathname))
            .then(function (res) {
                $scope.qualifications = res.map(function (q) {
                    return {
                        value: q.id,
                        text: q.text
                    };
                });
            })
            .finally(function () {
                loadBPlusProfile();
            });

        var $form1 = $('.ui.form.personal-history.step-1');
        var $form2 = $('.ui.form.personal-history.step-2');

        $form1.form(angular.extend({}, FormValidation.defaultSetting, {
            fields: {
                realName: {
                    identifier: 'realName',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('PleaseInputRealName')
                    }]
                },
                gender: {
                    identifier: 'gender',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('PleaseChooseGender')
                    }]
                },
                yearOfBirth: {
                    identifier: 'yearOfBirth',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('请选择出生年份')
                    }]
                },
                monthOfBirth: {
                    identifier: 'monthOfBirth',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('请选择出生月份')
                    }]
                },
                dayOfBirth: {
                    identifier: 'dayOfBirth',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('请选择出生日期')
                    }]
                },
                currentLocation: {
                    identifier: 'currentLocation',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('请输入当前所在地')
                    }]
                }
            }
        }));

        $form2.form(angular.extend({}, FormValidation.defaultSetting, {
            fields: {
                schoolName: {
                    identifier: 'schoolName',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('PleaseInputSchoolName')
                    }]
                },

                schoolMajor: {
                    identifier: 'schoolMajor',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('PleaseInputMajor')
                    }]
                },

                schoolEducationBackground: {
                    identifier: 'schoolEducationBackground',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('请选择学历')
                    }]
                },

                schoolStartYear: {
                    identifier: 'schoolStartYear',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('请选择求学开始年份')
                    }]
                },

                schoolStartMonth: {
                    identifier: 'schoolStartMonth',
                    rules: [{
                        type: 'empty',
                        prompt: $filter('translate')('请选择求学开始月份')
                    }]
                }
            }
        }));

        $scope.schoolInfo = {
            educationId: '',
            name: '',
            major: '',
            educationBackground: null,
            startYear: '',
            startMonth: '',
            endYear: '',
            endMonth: ''
        };

        $scope.personalInfo = {
            yearOfBirth: '',
            monthOfBirth: '',
            dayOfBirth: '',
            setPrivacy: true,
            currentLocation: ''
        };

        function findQualificationText(value) {
            for (var i = 0; i < $scope.qualifications.length; i++) {
                if ($scope.qualifications[i].value === value) {
                    return $scope.qualifications[i].text;
                }
            }

            return '';
        }

        function loadBPlusProfile() {
            service
                .get('/service-proxy/member/bplus-profile')
                .then(function (res) {
                    if (res.memberExt) {
                        if (typeof res.memberExt.hide_birthday !== 'undefined') {
                            $scope.personalInfo.setPrivacy = /^true$/i.test(res.memberExt.hide_birthday);
                        }

                        $scope.personalInfo.currentLocation = res.memberExt.current_location;
                    }

                    if (res.education && res.education.length) {
                        var first = res.education[0];

                        $scope.schoolInfo.educationId = first.education_id;
                        $scope.schoolInfo.name = first.university;
                        $scope.schoolInfo.major = first.major;
                        $scope.schoolInfo.educationBackground = first.qualifications_id;

                        $('select[name=schoolEducationBackground]').dropdown('set text', findQualificationText($scope.schoolInfo.educationBackground));

                        var startDate = null;
                        if (first.start_date) {
                            startDate = new Date(first.start_date);
                        }
                        var endDate = null;
                        if (first.end_date) {
                            endDate = new Date(first.end_date);
                        }
                        $timeout(function () {

                            $scope.schoolInfo.startYear = startDate ? startDate.getUTCFullYear().toString() : null;
                            $scope.schoolInfo.startMonth = startDate ? (startDate.getUTCMonth() + 1).toString() : null;
                            $scope.schoolInfo.endYear = endDate ? endDate.getUTCFullYear().toString() : null;
                            $scope.schoolInfo.endMonth = endDate ? (endDate.getUTCMonth() + 1).toString() : null;

                            if ($scope.schoolInfo.startYear) {
                                $('select[name=schoolStartYear].dropdown.defer').dropdown('set text', $scope.schoolInfo.startYear);
                            }

                            if ($scope.schoolInfo.startMonth) {
                                $('select[name=schoolStartMonth].dropdown.defer').dropdown('set text', $scope.schoolInfo.startMonth);
                            }

                            if ($scope.schoolInfo.endYear) {
                                $('select[name=schoolEndYear].dropdown.defer').dropdown('set text', $scope.schoolInfo.endYear);
                            }

                            if ($scope.schoolInfo.endMonth) {
                                $('select[name=schoolEndMonth].dropdown.defer').dropdown('set text', $scope.schoolInfo.endMonth);
                            }
                        }, 1000);
                    }
                });
        }

        /**
         * Workaround for unknown angular and semantic issues
         */
        function setSomeForm1Value() {
            $('select[name=yearOfBirth].dropdown.defer').dropdown('set text', $scope.personalInfo.yearOfBirth);
            $('select[name=monthOfBirth].dropdown.defer').dropdown('set text', $scope.personalInfo.monthOfBirth);
            $('select[name=dayOfBirth].dropdown.defer').dropdown('set text', $scope.personalInfo.dayOfBirth);
        }

        $scope.$watch('personalInfo.yearOfBirth', updateMemberInfoBirthday);
        $scope.$watch('personalInfo.monthOfBirth', updateMemberInfoBirthday);
        $scope.$watch('personalInfo.dayOfBirth', updateMemberInfoBirthday);

        function updateMemberInfoBirthday() {
            var year = Number($scope.personalInfo.yearOfBirth);
            var month = $scope.personalInfo.monthOfBirth ? Number($scope.personalInfo.monthOfBirth) - 1 : 1;
            var day = $scope.personalInfo.dayOfBirth ? Number($scope.personalInfo.dayOfBirth) : 1;

            $scope.memberInfo.birthday = new Date(Date.UTC(year, month, day));
        }

        $scope.isFromAndroid = /android/i.test(window.navigator.userAgent || window.navigator.vender);

        $scope.locale = angular.bplus.localeHelper.getLocale(location.pathname);
    };

    exports.PersonalHistoryCtrl.$inject = ['$scope', 'FormValidation', '$timeout', 'service', '$filter', 'msgBus', '$q', 'DeviceHelper'];
})(angular.bplus = angular.bplus || {});