angular.module('corpModule')
    .controller("jobpostCtrl", ['$scope', '$timeout', 'jobpostService', 'resourceService', function ($scope, $timeout, jobpostService, resourceService) {
        var requiredData = [
            "position",
            "jobtitle",
            "jobtype",
            "department",
            "salarytype",
            "location",
            "requirementtag",
            "description",
            "expireyear",
            "expiremonth",
            "expireday"
        ];
        var specialRequiredData = [
            "salaryfrom",
            "salaryto"
        ];
        var FIRST_PAGE = 1;
        var currentPage = FIRST_PAGE;
        var getData = function(currentPage){
            $scope.isLoading = true;
            var param = {
                page: currentPage,
                pageSize: $scope.displayData.NUMBER_PER_PAGE,
                status: $scope.option.type || ""
            };
            return jobpostService.searchPost(param).then(function(ret){
                $scope.displayData.rawData = [];
                $scope.displayData.data = [];
                $scope.displayData.currentPage = ret.currentPage;
                $scope.displayData.totalPages = ret.total;
                for(var i = 0,j = 0; i < ret.total; i++) {
                    if (i >= (ret.currentPage - 1) * $scope.displayData.NUMBER_PER_PAGE && i < ret.currentPage * $scope.displayData.NUMBER_PER_PAGE) {
                        ret.list = ret.list || [];
                        var rawData = ret.list[j++];
                        var expireTime = new Date(rawData.expire_at);
                        rawData.expire_at_text = expireTime.getFullYear() + '-' + (expireTime.getMonth() + 1) + '-' + expireTime.getDate();
                        $scope.displayData.rawData.push(rawData);
                    } else {
                        $scope.displayData.rawData.push({});
                    }
                }
                $scope.isLoading = false;
            });
        };
        $scope.displayData = {
            NUMBER_PER_PAGE: 10,
            currentPage: 1,
            data: [],
            rawData: [],
            totalPages: 10,
            getData: function(targetPage) {
                var me = this;
                me.allChecked = false;
                return getData(targetPage);
            }
        };
        $scope.POST_STATUS = {
            "PUBLISH": "publish",
            "DROPPED": "dropped",
            "EXPIRED": "expired",
            "OFFLINE": "offline",
            "TEMPSAVE": "tempSave"
        };
        $scope.hasError = false;
        $scope.hasSubmitted = false;
        $scope.isloading = false;
        $scope.STATUS = {
            VIEW: "view",
            POST: "post",
            EDIT: "edit"
        };
        $scope.option = {
            type: ""
        };
        $scope.$watch("option.type", function(oldValue, newValue){
            if (oldValue !== newValue) {
                getData(FIRST_PAGE);
            }
        });
        $scope.status = $scope.STATUS.VIEW;
        return resourceService.init().then(function () {
            $scope.edit = function(target){
                var expire = new Date(target.expire_at);
                //Job Post functions
                $scope.postData = {
                    id: target.id,
                    position: target.position,
                    jobtitle: target.title_id,
                    jobtype: target.job_type_id,
                    department: target.department,
                    salarytype: target.salary_type_id,
                    location: (target.location && target.location[0]) || "",
                    salaryfrom: target.annual_salary_from || "",
                    salaryto: target.annual_salary_to || "",
                    slogan: target.slogan,
                    slogantag: target.slogan_tags || [],
                    requirementtag: target.requirement_tags,
                    description: target.description,
                    qualification: target.required_education_id,
                    expireyear: "",
                    expiremonth: "",
                    expireday: ""
                };
                $scope.status = $scope.STATUS.EDIT;
            };
            $scope.offline = function(target){
                var param = { job_id: target.id };
                return jobpostService.offlinePost(param).then(function(){
                    return getData(FIRST_PAGE);
                });
            };
            $scope.delete = function(target){
                var param = { job_id: target.id };
                return jobpostService.dropPost(param).then(function(){
                    return getData(FIRST_PAGE);
                });
            };
            var initPostData = function() {
                $scope.postData = {
                    position: "",
                    jobtitle: "",
                    jobtype: "",
                    department: "",
                    salarytype: "",
                    location: "",
                    salaryfrom: "",
                    salaryto: "",
                    slogan: "",
                    slogantag: [],
                    requirementtag: [],
                    description: "",
                    qualification: "",
                    expireyear: "",
                    expiremonth: "",
                    expireday: ""
                };
            };
            $scope.postJob = function(){
                //Job Post functions
                initPostData();
                $scope.status = $scope.STATUS.POST;
            };
            //Job Post functions
            $scope.postData = initPostData();
            $scope.tmpTags = {
                slogantag: "",
                requirementtag: ""
            };
            $scope.displayForm = {
                jobtitles: resourceService.getResource(resourceService.RESOURCE_KEY.JOB),
                jobtypes: resourceService.getResource(resourceService.RESOURCE_KEY.WORKTYPE),
                salarytypes: resourceService.getResource(resourceService.RESOURCE_KEY.SALARYTYPE),
                qualifications: resourceService.getResource(resourceService.RESOURCE_KEY.QUALIFICATIONS),
                expireyears: [],
                expiredays: [],
                expiremonths: []
            };
            var currentTime = new Date();
            for (var i = 0; i < 10; i++) {
                var year = currentTime.getFullYear() + i;
                $scope.displayForm.expireyears.push({
                    id: year,
                    text: year.toString()
                });
            }

            $scope.yearChange = function () {
                var beginMonth = 0;
                $scope.displayForm.expiremonths = [];
                $scope.displayForm.expiredays = [];
                if ($scope.postData.expireyear === "") {
                    $scope.postData.expiremonth = "";
                    $scope.postData.expireday = "";
                    return;
                }
                if ($scope.postData.expireyear === currentTime.getFullYear().toString()) {
                    beginMonth = currentTime.getMonth();
                }
                for (var i = beginMonth; i < 12; i++) {
                    $scope.displayForm.expiremonths.push({
                        id: i,
                        text: (i + 1).toString()
                    });
                }

                $scope.postData.expiremonth = "";
                $scope.postData.expireday = "";
            };
            $scope.monthChange = function () {
                var endDay = 31;
                var beginDay = 1;
                $scope.displayForm.expiredays = [];
                var date = new Date();
                if ($scope.postData.expiremonth === date.getMonth().toString()) {
                    beginDay = date.getDate();
                }
                $scope.postData.expireday = "";
                for (var i = 31; i > 27; i--) {
                    date.setUTCFullYear($scope.postData.expireyear, $scope.postData.expiremonth, i);
                    if (date.getUTCMonth().toString() === $scope.postData.expiremonth) {
                        endDay = i;
                        break;
                    }
                }

                for (i = beginDay; i <= endDay; i++) {
                    $scope.displayForm.expiredays.push({
                        id: i,
                        text: i.toString()
                    });
                }
            };
            $scope.labelChange = function (labelType) {
                var value;
                var target;
                if (labelType === "slogantag") {
                    value = $scope.tmpTags.slogantag;
                    target = $scope.postData.slogantag;
                } else if (labelType === "requirementtag") {
                    value = $scope.tmpTags.requirementtag;
                    target = $scope.postData.requirementtag;
                }
                if (value.indexOf(' ') === 0 || value.indexOf('　') === 0) {
                    $scope.tmpTags[labelType] = "";
                } else if (value.indexOf(' ') > 0 || value.indexOf('　') > 0) {
                    var index = value.indexOf(' ') > 0 ? value.indexOf(' ') : value.indexOf('　');
                    value = value.substr(0, index);
                    if (target.indexOf(value) < 0) {
                        target.push(value);
                    }
                    $scope.tmpTags[labelType] = "";
                }
            };
            $scope.lableDelete = function (labelType, value) {
                var targetArray = $scope.postData[labelType];
                var index = targetArray.indexOf(value);
                if (index >= 0) {
                    targetArray.splice(index, 1);
                }
            };
            var checkForm = function(){
                $scope.hasSubmitted = true;
                $scope.hasError = false;
                var requiredDataToHandle = requiredData;
                //Handle special requirement
                if ($scope.postData.salarytype !== "e0495498-07e5-420a-9788-603e57e602fc") {
                    var isnumber = /[^\d]+/;
                    if (isnumber.test($scope.postData.salaryfrom)) {
                        $scope.postData.salaryfrom = 0;
                    }
                    if (isnumber.test($scope.postData.salaryto)) {
                        $scope.postData.salaryto = 0;
                    }
                    requiredDataToHandle = requiredData.concat(specialRequiredData);
                }
                //Handle requirement
                for (var i = 0; i < requiredDataToHandle.length; i++) {
                    var value = $scope.postData[requiredDataToHandle[i]];
                    if (!value && value !== 0) {
                        $scope.hasError = true;
                        break;
                    } else if ($.isArray(value) && value.length === 0) {
                        $scope.hasError = true;
                        break;
                    }
                }
                return $scope.hasError;
            };
            var getActionParam = function() {
                var param = {
                    job_id: $scope.postData.id || "",
                    position: $scope.postData.position,
                    title: $scope.postData.jobtitle === "" ? "" : resourceService.getResource(resourceService.RESOURCE_KEY.JOB, $scope.postData.jobtitle),
                    title_id: $scope.postData.jobtitle,
                    job_type_text: $scope.postData.jobtype === "" ? "" : resourceService.getResource(resourceService.RESOURCE_KEY.WORKTYPE, $scope.postData.jobtype),
                    job_type_id: $scope.postData.jobtype,
                    department: $scope.postData.department,
                    location: $scope.postData.location,
                    requirement_tags: $scope.postData.requirementtag,
                    description: $scope.postData.description,
                    required_education_id: $scope.postData.qualification,
                    required_education_text: $scope.postData.qualification === "" ? "" : resourceService.getResource(resourceService.RESOURCE_KEY.QUALIFICATIONS, $scope.postData.qualification),
                    expire_at: new Date($scope.postData.expireyear, $scope.postData.expiremonth, $scope.postData.expireday),
                    salary_type_id: $scope.postData.salarytype,
                    salary_type_text: $scope.postData.salarytype === "" ? "" : resourceService.getResource(resourceService.RESOURCE_KEY.SALARYTYPE, $scope.postData.salarytype),
                    annual_salary_from: parseInt($scope.postData.salaryfrom),
                    annual_salary_to: parseInt($scope.postData.salaryto),
                    slogan: $scope.postData.slogan,
                    slogan_tags: $scope.postData.slogantag
                };
                return param;
            };
            $scope.save = function() {
                if (!checkForm()) {
                    return jobpostService.saveDraft(getActionParam()).then(function(){
                        return getData();
                    }).then(function(){
                        $scope.status = $scope.STATUS.VIEW;
                    });
                }
            };
            $scope.submit = function () {
                if (!checkForm()) {
                    $(".postconfirm").modal("show");
                    return;
                }
            };
            $scope.cancel = function(){
                $scope.status = $scope.STATUS.VIEW;
            };
            return getData(FIRST_PAGE).then(function(ret){
                $timeout(function () {
                    $(".postsuccess").modal({
                        closable: false,
                        onApprove: function () {
                            window.location.reload();
                        }
                    });
                    $(".postfailure").modal({
                        closable: false
                    });
                    $(".postconfirm").modal({
                        allowMultiple: false,
                        closable: false,
                        onApprove: function () {
                            return jobpostService.postJob(getActionParam()).then(function () {
                                $(".postsuccess").modal("show");
                            }, function () {
                                $(".postfailure").modal("show");
                            });
                        }
                    });
                });
            });
        });
    }]);
