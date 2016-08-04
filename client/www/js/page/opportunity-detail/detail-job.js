angular.module('opdModule')
    .directive('bopdjob', ['$rootScope', '$q', function ($rootScope, $q) {
        return {
            restrict: "E",
            scope: true,
            templateUrl: '/view-partial/opd/detail-job.html',
            link: function ($scope, element, attrs) {
                var FIRST_PAGE = 1;
                $scope.isSearching = true;
                var search = function(currentPage) {
                    $scope.isSearching = true;
                    var conditions = $.extend(true, {companyID: $scope.searchOptions.searchCompanyID}, $scope.searchOptions.conditions);
                    return $scope.getPositions(
                            $scope.searchOptions.searchKeyWord,
                            conditions,
                            $scope.searchList.NUMBER_PER_PAGE, 
                            currentPage ? currentPage : FIRST_PAGE,
                            $scope.STATIC_PARAMS.POSITION_SOURCE.SEARCH,
                            $scope.sortingAndFilterSetting.sorting.value
                        ).then(function(ret){
                            $scope.searchList.currentPage = currentPage;
                            $scope.searchList.data = new Array(ret.total);
                            for (var i = 0; i < ret.total; i++) {
                                $scope.searchList.data[i] = {};
                            }
                            ret.jobs.forEach(function(value, index){
                                $scope.searchList.data[(ret.currentPage - 1)*$scope.searchList.NUMBER_PER_PAGE+index] = value;
                            });
                            $scope.searchList.totalPage = ret.total;
                            $scope.isSearching = false;
                    });
                };
                //Init the page
                var data = {
                };
                var dataPromises = Object.keys($scope.STATIC_PARAMS.RESOURCE_TYPE).map(function(key) {
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
                $q.all(dataPromises).then(function() {
                    var DISPLAY_COUNT = 7;
                    //Search conditions
                    var placesRaw = data[$scope.STATIC_PARAMS.RESOURCE_TYPE.REGION];
                    var industriesRaw = data[$scope.STATIC_PARAMS.RESOURCE_TYPE.INDUSTRY];
                    $scope.filters = [{
                        key: 'workPlace',
                        label: '工作地点：',
                        more: null,
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
                        // extraListValue: '',
                        // autoComplete: industriesRaw,
                        list: [{
                            id: 0,
                            text: '不限'
                        }, {
                            id: 1,
                            text: '互联网'
                        // }, {
                        //     id: 2,
                        //     text: '计算机'
                        }, {
                            id: 3,
                            text: '地产'
                        // }, {
                        //     id: 4,
                        //     text: '能源'
                        }, {
                            id: 5,
                            text: '快消'
                        }, {
                            id: 6,
                            text: '零售'
                        }, {
                            id: 7,
                            text: '金融'
                        // }, {
                        //     id: 8,
                        //     text: '游戏'
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
                            data: '不限',
                            text: '不限'
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
                            change: function(thisscope) {
                                var fromValue = thisscope.range.from === undefined ? "" : thisscope.range.from;
                                var toValue = thisscope.range.to === undefined ? "" : thisscope.range.to;
                                if (fromValue === "" && toValue === "") {
                                    $scope.filterSetting.monthlySalary = thisscope.list[0];
                                } else if (fromValue !=="" && toValue !== "") {
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
                    }];
                    var f = {};
                    for (var i = 0; i < $scope.filters.length; i++) {
                        f[$scope.filters[i].key] = $scope.filters[i];
                    }

                    $scope.filterSetting = {
                        findKey: function(scope, target) {
                            var result = scope.list.find(function(value){
                                return  (target === value.text);
                            });
                            return result;
                        },
                        autoCompleteConfirm: function(filterSetting, scope, target) {
                            if (target && target !== "") {
                                filterSetting[scope.key] = target;
                                scope.type = "";
                            }
                        },
                        showThumb: true,
                        showDetail: true,
                        hasThumbView: true,
                        workPlace: f.workPlace.list[0],
                        diplomas: f.diplomas.list[0],
                        industry: f.industry.list[0],
                        companyType: f.companyType.list[0],
                        jobCategory: f.jobCategory.list[0],
                        //In fact it is annual salary
                        monthlySalary: f.monthlySalary.list[0]
                    };

                    search(FIRST_PAGE).then(function(){
                        $scope.searchOptions.searchCompanyID = "";
                    });
                });
                //Search filter
                $scope.sortingAndFilter = [{
                    key: 'sorting',
                    label: '排序方式：',
                    list: [{
                        id: 1,
                        value: $scope.STATIC_PARAMS.SORT_KEYS.MATCH,
                        text: '匹配度'
                    }, {
                        id: 2,
                        value: $scope.STATIC_PARAMS.SORT_KEYS.COMPETIVE,
                        text: '竞争力'
                    }]
                }];

                $scope.sortingAndFilterSetting = {
                    showThumb: false,
                    showDetail: true,
                    hasThumbView: false,
                    inline: true,
                    sorting: $scope.sortingAndFilter[0].list[0],
                    sortingClick: function(key, l) {
                        if ($scope.sortingAndFilterSetting[key].id !== l.id) {
                            $scope.sortingAndFilterSetting[key] = l;
                            search(FIRST_PAGE);
                        }
                    }
                };
                //Search bar
                var keyWordFromHomePage = $scope.overallParams.searchKeyWord;
                var companyIDFromHomePage = $scope.overallParams.searchCompanyID;
                var findConditionValue = function(key) {
                    var ret = $scope.filterSetting[key];
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
                $scope.searchOptions = {
                    placeholder: "请输入职位名称或公司名称",
                    searchContent: keyWordFromHomePage,
                    searchKeyWord: keyWordFromHomePage,
                    searchCompanyID: companyIDFromHomePage,
                    conditions: "",
                    search: function(keyword){
                        $scope.searchOptions.searchKeyWord = keyword;
                        $scope.searchOptions.conditions = {
                            education: findConditionValue("diplomas"),
                            industry: findConditionValue("industry"),
                            jobType: findConditionValue("jobCategory"),
                            natureOfFirms: findConditionValue("companyType"),
                            salaryFrom: findConditionValue("monthlySalary")[0].trim(),
                            salaryTo: findConditionValue("monthlySalary")[1].trim(),
                            workLocation: findConditionValue("workPlace")
                        };
                        search(FIRST_PAGE);
                    }
                };
                $scope.overallParams.searchKeyWord = "";
                $scope.overallParams.searchCompanyID = "";
                //Search config and search results
                $scope.searchList = {
                    NUMBER_PER_PAGE: 10,
                    loginin: $scope.hasLoggedin(),
                    showPosition: true,
                    showPageMenu: true,
                    showPageMore: false,
                    deleteable: "false",
                    getData: search,
                    totalPage: 0,
                    currentPage: FIRST_PAGE,
                    data: [{
                    }]
                };
            }
        };
    }])
;