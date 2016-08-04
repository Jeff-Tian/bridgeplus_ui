angular.module('opdModule').directive('bopdrecommendation', ['$q', '$timeout', function ($q, $timeout) {
    return {
        restrict: "E",
        scope: true,
        templateUrl: '/view-partial/opd/detail-recommendation.html',
        link: function ($scope, element, attrs) {
            if (!$scope.hasLoggedin()) {
                // location.href = "/signin#/login?return_url=opportunity-detail%23%2Frecommended-positions";
                return;
            }
            var FIRST_PAGE = 1;
            var search = function (currentPage, target, options) {
                var findConditionValue = function (key) {
                    var ret = options.condition[key];
                    if (ret.hasOwnProperty('id')) {
                        if (ret.id === 0 || ret.id === "0") {
                            ret = "";
                            if (key === "monthlySalary") {
                                ret = ["", ""];
                            }
                        } else {
                            ret = ret.text;
                        }
                    } else if (key === "monthlySalary") {
                        ret = ret.split("-");
                    }
                    return ret;
                };
                var conditions = {};
                if (options.condition && Object.keys(options.condition).length > 0) {
                    conditions = {
                        education: findConditionValue("diplomas"),
                        industry: findConditionValue("industry"),
                        jobType: findConditionValue("jobCategory"),
                        natureOfFirms: findConditionValue("companyType"),
                        salaryFrom: findConditionValue("monthlySalary")[0].trim(),
                        salaryTo: findConditionValue("monthlySalary")[1].trim(),
                        workLocation: findConditionValue("workPlace")
                    };
                }
                return $scope.getPositions(
                    options.searchKeyWord,
                    conditions,
                    target.NUMBER_PER_PAGE,
                    currentPage ? currentPage : FIRST_PAGE,
                    $scope.STATIC_PARAMS.POSITION_SOURCE.SEARCH,
                    options.sorting
                ).then(function (ret) {
                        target.currentPage = currentPage;
                        target.data = new Array(ret.total);
                        for (var i = 0; i < ret.total; i++) {
                            target.data[i] = {};
                        }
                        ret.jobs.forEach(function (value, index) {
                            target.data[(ret.currentPage - 1) * target.NUMBER_PER_PAGE + index] = value;
                        });
                        target.totalPage = ret.total;
                    });
            };
            $scope.isSearching = true;
            //Init the page
            var data = {};
            var dataPromises = Object.keys($scope.STATIC_PARAMS.RESOURCE_TYPE).map(function (key) {
                var value = $scope.STATIC_PARAMS.RESOURCE_TYPE[key];
                var promise;
                if (value !== $scope.STATIC_PARAMS.RESOURCE_TYPE.REGION) {
                    promise = $scope.getResource(value);
                } else {
                    promise = $scope.getRegionResource();
                }
                return promise.then(function(ret) {
                    data[value] = [];
                    ret.forEach(function(rawData, index) {
                        if (rawData.searchPrioirty !== 0) {
                            data[value].push({
                                id: rawData.id || index + 1,
                                value: rawData.text || "",
                                data: rawData.text || "",
                                text: rawData.text || "",
                            });
                        }
                    });
                    return ret;
                });
            });
            $q.all(dataPromises).then(function () {
                var DISPLAY_COUNT = 7;
                //Search conditions
                var placesRaw = data[$scope.STATIC_PARAMS.RESOURCE_TYPE.REGION];
                var industriesRaw = data[$scope.STATIC_PARAMS.RESOURCE_TYPE.INDUSTRY];
                var jobsRaw = data[$scope.STATIC_PARAMS.RESOURCE_TYPE.JOB];
                $scope.filters = [{
                    key: 'workPlace',
                    label: '工作地点：',
                    more: placesRaw.slice(DISPLAY_COUNT),
                    list: [{
                        id: 0,
                        value: '全国',
                        data: '全国',
                        text: '全国'
                    }].concat(placesRaw.slice(0, DISPLAY_COUNT))
                }, {
                    key: 'diplomas',
                    label: '学历要求：',
                    list: [{
                        id: 0,
                        text: '不限'
                    }].concat(data[$scope.STATIC_PARAMS.RESOURCE_TYPE.QUALIFICATIONS])
                }, {
                    key: 'industry',
                    label: '行业领域：',
                    extraListValue: '',
                    autoComplete: industriesRaw,
                    autoCompletePlaceHolder: "",
                    list: [{
                        id: 0,
                        text: '不限'
                    }, {
                        id: 1,
                        text: '互联网'
                    }, {
                        id: 2,
                        text: '计算机'
                    }, {
                        id: 3,
                        text: '地产'
                    }, {
                        id: 4,
                        text: '能源'
                    }, {
                        id: 5,
                        text: '快消'
                    }, {
                        id: 6,
                        text: '零售'
                    }, {
                        id: 7,
                        text: '金融'
                    }, {
                        id: 8,
                        text: '游戏'
                    }, {
                        id: 9,
                        text: '教育'
                    }]
                }, {
                    key: 'companyType',
                    label: '公司性质：',
                    list: [{
                        id: 0,
                        value: '不限',
                        data: '全国',
                        text: '全国'
                    }].concat(data[$scope.STATIC_PARAMS.RESOURCE_TYPE.NATIRE_OF_FIRM])
                }, {
                    key: 'jobCategory',
                    label: '工作性质：',
                    list: [{
                        id: 0,
                        text: '不限'
                    }].concat(data[$scope.STATIC_PARAMS.RESOURCE_TYPE.WORKTYPE])
                }, {
                    key: 'monthlySalary',
                    label: '年\u2001\u2001薪：',
                    rangeLabel: '元',
                    type: 'range',
                    list: [{
                        id: 0,
                        text: '不限'
                    }],
                    range: {
                        from: "",
                        to: "",
                        change: function (thisscope) {
                            var fromValue = thisscope.range.from === undefined ? "" : thisscope.range.from;
                            var toValue = thisscope.range.to === undefined ? "" : thisscope.range.to;
                            if (fromValue === "" && toValue === "") {
                                $scope.filterSetting.monthlySalary = thisscope.list[0];
                            } else if (fromValue !== "" && toValue !== "") {
                                var valueA = parseInt(fromValue);
                                var valueB = parseInt(toValue);
                                if (valueA > valueB) {
                                    var tmpValue = valueA;
                                    valueA = valueB;
                                    valueB = tmpValue;
                                }
                                $scope.filterSetting.monthlySalary = valueA + " - " + valueB;
                            } else {
                                $scope.filterSetting.monthlySalary = fromValue + " - " + toValue;
                            }
                        }
                    }
                }, {
                    key: 'position',
                    label: '职\u2001\u2001位：',
                    autoComplete: jobsRaw,
                    autoCompletePlaceHolder: "请输入想订阅的职位",
                    list: [{
                        id: 0,
                        text: '不限'
                    }]
                }];
                var f = {};
                for (var i = 0; i < $scope.filters.length; i++) {
                    f[$scope.filters[i].key] = $scope.filters[i];
                }

                $scope.filterSetting = {
                    findKey: function (scope, target) {
                        var result = scope.list.find(function (value) {
                            return (target === value.text);
                        });
                        return result;
                    },
                    autoCompleteConfirm: function (filterSetting, scope, target) {
                        if (target && target !== "") {
                            filterSetting[scope.key] = target;
                            scope.type = "";
                        }
                    },
                    showThumb: false,
                    showDetail: true,
                    hasThumbView: false,
                    // workPlace: f.workPlace.list[0],
                    // diplomas: f.diplomas.list[0],
                    // industry: f.industry.list[3],
                    // companyType: f.companyType.list[0],
                    // jobCategory: f.jobCategory.list[0],
                    // monthlySalary: f.monthlySalary.list[0],
                    // position: f.position.list[0]
                };
                var rawSubscription = {};
                var staticSubscription = {
                    workPlace: f.workPlace.list[0],
                    diplomas: f.diplomas.list[0],
                    industry: f.industry.list[0],
                    companyType: f.companyType.list[0],
                    jobCategory: f.jobCategory.list[0],
                    monthlySalary: f.monthlySalary.list[0],
                    position: f.position.list[0]
                };
                $scope.hasSubscribed = false;
                $scope.loadSubscription().then(function (value) {
                    if (value.length > 0) {
                        $scope.hasSubscribed = true;
                        try {
                            rawSubscription = JSON.parse(value[0].value);
                        } catch (e) {
                            $scope.hasSubscribed = false;
                            rawSubscription = staticSubscription;
                        }
                    } else {
                        rawSubscription = staticSubscription;
                    }
                    Object.keys(staticSubscription).forEach(function (key) {
                        $scope.filterSetting[key] = rawSubscription[key];
                    });

                    $scope.data.subscriptionOpiton = {
                        searchKeyWord: "",
                        condition: rawSubscription,
                        sorting: $scope.STATIC_PARAMS.SORT_KEYS.DEFAULT
                    };
                    var searchPromises = [
                        search(FIRST_PAGE, $scope.data.subscribePositions, $scope.data.subscriptionOpiton),
                        search(FIRST_PAGE, $scope.data.recommendPositions, recommendOption),
                        search(FIRST_PAGE, $scope.data.competivePositions, competiveOption)
                    ];
                    $q.all(searchPromises).then(function () {
                        $scope.isSearching = false;
                        $timeout(function () {
                            $('.b-opd-favorite .tabular.menu .item').tab();
                        });
                    });
                });

                $scope.subscribe = function () {
                    var paramToSave = {};
                    Object.keys(staticSubscription).forEach(function (key) {
                        paramToSave[key] = $scope.filterSetting[key];
                    });
                    $scope.saveSubscription(JSON.stringify(paramToSave));
                    $scope.data.subscriptionOpiton = {
                        searchKeyWord: "",
                        condition: paramToSave,
                        sorting: $scope.STATIC_PARAMS.SORT_KEYS.DEFAULT
                    };
                    $scope.isSubscriptionSearching = true;
                    search(FIRST_PAGE, $scope.data.subscribePositions, $scope.data.subscriptionOpiton).then(function () {
                        rawSubscription = paramToSave;
                        $scope.isSubscriptionSearching = false;
                    });
                };
                $scope.subscribeCancel = function () {
                    Object.keys(staticSubscription).forEach(function (key) {
                        $scope.filterSetting[key] = rawSubscription[key];
                    });
                };

            });

            var subscriptionOpiton = {
                searchKeyWord: "",
                condition: {},
                sorting: $scope.STATIC_PARAMS.SORT_KEYS.DEFAULT
            };
            var recommendOption = {
                searchKeyWord: "",
                condition: {},
                sorting: $scope.STATIC_PARAMS.SORT_KEYS.DEFAULT
            };
            var competiveOption = {
                searchKeyWord: "",
                condition: {},
                sorting: $scope.STATIC_PARAMS.SORT_KEYS.COMPETIVE
            };
            //Data for positions
            //Other names can also be used
            $scope.data = {};
            $scope.data.subscriptionOpiton = {};
            $scope.data.subscribePositions = {
                NUMBER_PER_PAGE: 10,
                loginin: $scope.hasLoggedin(),
                showPosition: true,
                showPageMenu: true,
                showPageMore: false,
                deleteable: "false",
                getData: function (currentPage) {
                    $scope.isSubscriptionSearching = true;
                    return search(currentPage, $scope.data.subscribePositions, $scope.data.subscriptionOpiton).then(function () {
                        $scope.isSubscriptionSearching = false;
                    });
                },
                totalPage: 0,
                currentPage: FIRST_PAGE,
                data: [{}]
            };
            $scope.isSubscriptionSearching = false;
            $scope.data.recommendPositions = {
                NUMBER_PER_PAGE: 10,
                loginin: $scope.hasLoggedin(),
                showPosition: true,
                showPageMenu: true,
                showPageMore: false,
                deleteable: "false",
                getData: function (currentPage) {
                    $scope.isRecommendPositionSearching = true;
                    return search(currentPage, $scope.data.recommendPositions, recommendOption).then(function () {
                        $scope.isRecommendPositionSearching = false;
                    });
                },
                totalPage: 0,
                currentPage: FIRST_PAGE,
                data: [{}]
            };
            $scope.isRecommendPositionSearching = false;
            $scope.data.competivePositions = {
                NUMBER_PER_PAGE: 10,
                loginin: $scope.hasLoggedin(),
                showPosition: true,
                showPageMenu: true,
                showPageMore: false,
                deleteable: "false",
                getData: function (currentPage) {
                    $scope.isCompetivePositionSearching = true;
                    return search(currentPage, $scope.data.competivePositions, competiveOption).then(function () {
                        $scope.isCompetivePositionSearching = false;
                    });
                },
                totalPage: 0,
                currentPage: FIRST_PAGE,
                data: [{}]
            };
            $scope.isCompetivePositionSearching = false;
        }
    };
}]);