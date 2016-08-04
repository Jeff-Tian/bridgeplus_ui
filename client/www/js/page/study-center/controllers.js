angular.module('studyCenterModule')
    .value('CourseTypeTags', {
        one2one: '一对一',
        one2many: '小班课',
        lecture: '公开课',
        mentor: '导师课'
    })
    .value('RequestStatus', {
        request: '待确认',
        accept: '已确认',
        reject: '被拒绝',
        cancelled: '已取消'
    })
    .controller('BookedCoursesCtrl', ['$scope', '$timeout', '$q', 'service', 'CourseTypeTags', 'RequestStatus', 'paginationData', '$rootScope', 'serviceErrorParser', function ($scope, $timeout, $q, service, CourseTypeTags, RequestStatus, paginationData, $rootScope, serviceErrorParser) {
        $scope.loading = false;

        $scope.courses = new paginationData({
            sourceUrl: angular.bplus.config.serviceUrls.studyCenter.classBooking.booked,
            dataField: 'requests',
            pageSize: 5,
            dataMapping: function (a) {
                return a.map(function (d) {
                    return {
                        name: d.topic,
                        teacher: d.teacher ? d.teacher.display_name : '',
                        startAt: new Date(d.booking_from),
                        endAt: new Date(d.booking_to),
                        tags: [],
                        teacherInfo: d.teacher,
                        requestStatus: RequestStatus[d.request_status],
                        feedback: d.student_comment,
                        request_id: d.request_id
                    };
                });
            }
        });

        $scope.courses.getNextPage();

        $scope.cancelling = {};
        $scope.cancelBooking = function (c) {
            service.executePromiseAvoidDuplicate($scope.cancelling, c.request_id, function () {
                return service.post(angular.bplus.config.serviceUrls.studyCenter.classBooking.cancel, {
                    request_id: c.request_id
                }).then(function () {
                    c.requestStatus = '已取消';
                }, function (reason) {
                    $rootScope.message = serviceErrorParser.getErrorMessage(reason);
                });
            });
        };
    }])
    .controller('ComingCoursesCtrl', ['$scope', '$timeout', '$q', 'service', 'CourseTypeTags', function ($scope, $timeout, $q, service, CourseTypeTags) {
        $scope.loading = false;

        $scope.courses = {
            rawData: []
        };

        $scope.getCourseStatus = function (registered, mincapability, startAt) {
            var now = new Date();

            if (now < startAt) {
                if (registered < mincapability) {
                    return '未开课';
                } else {
                    return '已开课';
                }
            } else {
                if (registered < mincapability) {
                    return '人数不足';
                } else {
                    return '已开课';
                }
            }
        };

        $scope.getCourseProgress = function (registered, mincapability, capability, startAt) {
            var status = $scope.getCourseStatus(registered, mincapability, startAt);

            return status === '人数不足' ? '开课失败' : registered + '/' + capability;
        };

        $scope.timeThreshold = 1000 * 60 * 60;

        $scope.showProgressCountDown = function (c) {
            return c.status !== -1 &&
                c.countdown.value < 0 &&
                c.statusText[0] !== '开课失败'
                ;
        };

        $scope.showCountDown = function (c) {
            return c.status !== -1 &&
                c.countdown.value >= 0 &&
                c.countdown.value < $scope.timeThreshold &&
                c.statusText[1] !== '未开课'
                ;
        };

        $scope.enableCourseButton = function (c) {
            return c.status !== -1 &&
                c.countdown.value <= $scope.timeThreshold &&
                c.statusText[1] === '已开课'
                ;
        };

        service.executePromiseAvoidDuplicate($scope, 'loading', function () {
            return service.get(angular.bplus.config.serviceUrls.studyCenter.classBooking.coming)
                .then(function (data) {
                    $scope.courses.displayData =
                        data.map(function (d) {
                            var courseStatus = $scope.getCourseStatus(d.bookingCount, d.mincapability, new Date(d.start_time));
                            var progress = $scope.getCourseProgress(d.bookingCount, d.mincapability, d.capability, new Date(d.start_time));

                            return {
                                name: d.title,
                                teacher: d.teacher ? d.teacher.display_name : '',
                                status: Math.round(d.bookingCount / d.capability * 100),
                                statusText: [
                                    progress,
                                    courseStatus
                                ],
                                startAt: new Date(d.start_time),
                                endAt: new Date(d.end_time),
                                tags: (d.class_tags || d.course_tags || []).map(function (t) {
                                    return {
                                        text: t,
                                        special: false
                                    };
                                }).concat(d.product ? [{
                                    text: CourseTypeTags[d.product],
                                    special: true
                                }] : []),
                                class_id: d.class_id,
                                course_id: d.course_id,
                                teacherInfo: d.teacher,
                                classUrl: d.class_url
                            };
                        });

                    angular.forEach($scope.courses.displayData, function (value, key) {
                        value.countdown = new CountDown(new Date(value.startAt));
                    });
                })
                ;
        });

        $scope.showDimmer = function ($event) {
            //$($event.target).closest('.dimmable').dimmer('show');
        };

        $scope.hideDimmer = function ($event) {
            $($event.currentTarget).dimmer('hide');
        };

        $scope.showSharingQRCode = function ($event) {
            $('.ui.modal.qrcode')
                .modal('show')
            ;
        };

        function CountDown(init) {
            this.value = init - (new Date());

            var self = this;
            this.start = function () {
                function countdown() {
                    self.value = init - (new Date());

                    $timeout(countdown, 1000);
                }

                countdown();
            };

            this.start();
        }
    }])
    .controller('FinishedCoursesCtrl', ['$scope', 'service', '$timeout', '$q', 'MessageBox', 'CourseTypeTags', function ($scope, service, $timeout, $q, MessageBox, CourseTypeTags) {
        function mapCourse(d) {
            return {
                name: d.title,
                teacher: d.description,
                startAt: new Date(d.start_time),
                endAt: new Date(d.end_time),
                generalEvaluation: d.general_evaluation,
                feedbackId: d.feedback_id,
                classId: d.class_id,
                teacherId: d.teacher_id,
                courseId: d.course_id,
                class_id: d.class_id,
                teacherInfo: {teacher_id: d.teacher_id},
                course_id: d.course_id,
                tags: (d.class_tags || d.course_tags || []).map(function (t) {
                    return {
                        text: t,
                        special: false
                    };
                }).concat(d.product ? [{
                    text: CourseTypeTags[d.product],
                    special: true
                }] : []),
                feedback: {
                    comment: '',
                    generalEvaluation: 0,
                    evaluations: {
                        '准时': 0,
                        '态度': 0,
                        '专业度': 0,
                        '通话质量': 0
                    }
                }
            };
        }

        $scope.fetching = false;

        var pageSize = 10;
        $scope.courses = new PaginationData('fetching', angular.bplus.config.serviceUrls.studyCenter.classBooking.unevaluated, pageSize, function (data) {
            var ret = data.bookings.map(mapCourse);

            $timeout(function () {
                $('.unrated form .rating').rating({
                    onRate: function (value) {
                        var $this = angular.element(this);
                        var cmd = '$this.scope().' + $this.attr('model') + ' = value';

                        eval(cmd); // jshint ignore : line

                        $this.scope().$apply();
                    }
                });
            });

            return ret;
        });

        $scope.fetchingRated = false;

        $scope.ratedCourses = new PaginationData('fetchingRated', angular.bplus.config.serviceUrls.studyCenter.classBooking.evaluated, pageSize, function (data) {
            var ret = data.bookings.map(mapCourse);

            $timeout(function () {
                $('.rated td .rating').rating('disable');
            });

            return ret;
        });

        function PaginationData(flag, dataSource, numberPerPage, gotData) {
            function getData(page) {
                return service.executePromiseAvoidDuplicate($scope, flag, function () {
                    return service.get(dataSource, {
                        params: {
                            pageSize: numberPerPage,
                            page: page
                        }
                    });
                });
            }

            this.rawData = [];
            this.displayData = [];
            this.NUMBER_PER_PAGE = numberPerPage;
            this.currentPage = 0;

            this.getData = function (page) {
                var self = this;

                return getData(page)
                    .then(function (data) {
                        self.rawData = new Array(data.total);
                        self.currentPage = data.currentPage;
                        self.displayData = gotData(data);
                    });
            };
        }

        $scope.showEvaluationDetail = function (c) {
            if (!c.evaluationDetail) {
                service.get(angular.bplus.config.serviceUrls.studyCenter.classFeedback.replace(':feedbackId', c.feedbackId))
                    .then(function (data) {
                        c.evaluationDetail = data;

                        $timeout(function () {
                            $('form .ui.grid .rating').rating('disable');
                        });
                    })
                ;
            }
        };

        $scope.countItems = function (o) {
            return Object.keys(o).length;
        };

        $scope.addingFeedback = false;
        $scope.addFeedback = function (course) {
            service.executePromiseAvoidDuplicate($scope, 'addingFeedback', function () {
                return service.put(angular.bplus.config.serviceUrls.studyCenter.teacher.feedback, {
                    class_id: course.classId,
                    comment: course.feedback.comment,
                    general_evaluation: course.feedback.generalEvaluation,
                    evaluation: course.feedback.evaluations
                }).then(function (data) {
                    course.feedback.disabled = true;
                    course.rated = true;
                    MessageBox.show('评价成功, 稍候可刷新页面至已评价课程中查看.');
                }, function (reason) {
                    MessageBox.show(reason.message);
                });
            });
        };

        $scope.canAddFeedback = function (course) {
            var can = course.feedback.comment && course.feedback.generalEvaluation;

            for (var key in course.feedback.evaluations) {
                can = can && course.feedback.evaluations[key];
            }

            return can;
        };
    }])
    .controller('FavTeachersCtrl', ['$scope', 'FileReaderService', 'service', 'MessageBox', '$timeout', 'tracking', 'url', function ($scope, FileReaderService, service, MessageBox, $timeout, tracking, url) {
        $scope.teachers = [];
        $scope.fetching = false;

        function getLatestCourses() {
            angular.forEach($scope.teachers, function (t, key) {
                service.get(angular.bplus.config.serviceUrls.studyCenter.teacher.latestCourses.replace(':teacherId', t.id)).then(function (data) {
                    t.courses = data;
                })
                ;
            });
        }

        function refreshTeachers() {
            service.executePromiseAvoidDuplicate($scope, 'fetching', function () {
                return service.get(angular.bplus.config.serviceUrls.studyCenter.my.favorite.teachers)
                    .then(function (data) {
                        $scope.teachers = data.map(function (i) {
                            return {
                                id: i.teacher_id,
                                name: i.display_name,
                                title: i.title,
                                image: i.image_url,
                                rank: i.rank,
                                tags: i.tags,
                                topics: []
                            };
                        });

                        $timeout(function () {
                            $('* > .rating').rating('disable');

                            getLatestCourses();
                        });
                    });
            });
        }

        refreshTeachers();

        $scope.deleting = {};

        $scope.removeFavTeacher = function (t) {
            service.executePromiseAvoidDuplicate($scope.deleting, t.id, function () {
                return service.delete(angular.bplus.config.serviceUrls.studyCenter.my.favorite.teachers, {
                        params: {
                            teacher_id: t.id
                        }
                    })
                    .then(function (data) {
                        //refreshTeachers();
                        for (var i = $scope.teachers.length - 1; i >= 0; i--) {
                            if ($scope.teachers[i].id === t.id) {
                                $scope.teachers.splice(i, 1);
                            }
                        }
                    }, function (reason) {
                        MessageBox.show(reason.message);
                    })
                    ;
            })
            ;
        };

        $scope.replyData = {
            text: '',
            pictures: []
        };

        $scope.picturesAdded = function (element) {
            function successCallback(i) {
                return function (result) {
                    $scope.replyData.pictures.push({
                        index: i,
                        picture: result
                    });
                };
            }

            function errorCallback(i) {
                return function (error) {
                    $scope.replyData.pictures.push({
                        index: i,
                        picture: null,
                        error: error
                    });
                };
            }

            for (var i = 0; i < element.files.length; i++) {
                FileReaderService.readAsDataUri(element.files[i], $scope)
                    .then(successCallback(i), errorCallback(i))
                ;
            }
        };

        $scope.removePicture = function (index) {
            $scope.replyData.pictures.splice(index, 1);
        };

        var l = url.parse(document.referrer);
        if (l.pathname.match(/\/study-center\/teacher\.html/i)) {
            tracking.send('studyCenterMentorDetail.myFavorite.click');
        } else if (l.pathname.match(/\/study-center\/teachercourse\.html/i)) {
            tracking.send('studyCenterMentorCourses.myFavorite.click');
        }
    }])
;