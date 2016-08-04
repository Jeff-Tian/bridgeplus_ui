angular.module('corpModule')
.controller("cvCtrl", ['$scope', '$timeout', 'cvService', '$q', '$rootScope', function($scope, $timeout, cvService, $q, $rootScope) {
    var STATIC_PARAM = {
        DELIVERED: 'delivered',
        INTERESTED: 'interested',
        DELETED: 'deleted',
        POOL: "pool"
    };
    var FIRST_PAGE = 1;
    var handleHeadshot = function(url, gender) {
        var femaleDefault = "img/corp/female_default.png";
        var maleDefault = "img/corp/male_default.png";
        var unknownDefault = "img/corp/unknown.png";
        var cndify = function(source) {
            return $rootScope.config.cdn.normal + source + '?' + $rootScope.config.cdn.version;
        };
        var condition = /upload.bridgeplus.cn|img.hcdlearning.com/;
        var ret;
        if (url) {
            if (condition.test(url)) {
                ret = url + "-small";
            } else {
                ret = url;
            }
        } else {
            if (gender === "M") {
                ret = cndify(maleDefault);
            } else if (gender === "F") {
                ret = cndify(femaleDefault);
            } else {
                ret = cndify(unknownDefault);
            }
        }
        return ret;
    };
    var getData = function(currentPage, defautlSort){
        $scope.isSortDesc = defautlSort ? true : $scope.isSortDesc;
        $scope.isLoading = true;
        //Get data according $scope.displayData.currentTab;
        var sortFieldKey = "";
        switch($scope.displayData.currentTab) {
            case STATIC_PARAM.DELIVERED:
                sortFieldKey = "apply_date";
                $scope.displayData.hasCheckbox = true;
                break;
            case STATIC_PARAM.INTERESTED:
                sortFieldKey = "action_date";
                $scope.displayData.hasCheckbox = true;
                break;
            case STATIC_PARAM.POOL:
                sortFieldKey = "add_date";
                $scope.displayData.hasCheckbox = false;
                break;
            case STATIC_PARAM.DELETED:
                sortFieldKey = "action_date";
                $scope.displayData.hasCheckbox = false;
                break;
        }
        var param = {
            page: currentPage,
            jobTitle: $scope.option.type,
            champion: $scope.option.win,
            highMatch: $scope.option.match,
            sortField: sortFieldKey,
            sortDirection: $scope.isSortDesc ? 'desc' : 'asc'
        };
        return cvService.getCV($scope.displayData.currentTab, param).then(function(ret){
            $scope.displayData.allChecked = false;
            $scope.displayData.rawData = [];
            $scope.displayData.data = [];
            $scope.displayData.currentPage = ret.currentPage;
            $scope.displayData.totalPages = ret.total;
            for(var i = 0,j = 0; i < ret.total; i++) {
                if (i >= (ret.currentPage - 1) * $scope.displayData.NUMBER_PER_PAGE && i < ret.currentPage * $scope.displayData.NUMBER_PER_PAGE) {
                    ret.list = ret.list || [];
                    var rawData = ret.list[j++];
                    if (!rawData.education) {
                        rawData.education = {start_date:"", end_date:""};
                    }
                    $scope.displayData.rawData.push({
                        matchLevel: cvService.levelMapping(rawData.job_match),
                        position: rawData.job_position || "",
                        function: rawData.job_title || "",
                        headshot: handleHeadshot(rawData.member.avatar, rawData.member.gender),
                        flag: "",
                        issueDate: (rawData.apply_date || rawData.action_date || rawData.add_date || "").split("T")[0],
                        gender: rawData.member.gender || "",
                        name: rawData.member.real_name || "",
                        eduData: cvService.produceDataString(rawData.education.start_date, rawData.education.end_date),
                        school: rawData.education.university || "",
                        major: rawData.education.major || "",
                        qulification: cvService.getQulificationsByID(rawData.education.qualifications_id),
                        hasChecked: false,
                        jobID: rawData.job_id,
                        companyID: rawData.company_id,
                        memberID: rawData.member_id
                    });
                } else {
                    $scope.displayData.rawData.push({});
                }
            }
            $scope.isLoading = false;
        });
    };
    // Dependancy:
    $scope.displayData = {
        NUMBER_PER_PAGE: 10,
        currentPage: 1,
        data: [],
        rawData: [],
        totalPages: 10,
        currentTab: STATIC_PARAM.DELIVERED,
        getData: function(targetPage) {
            var me = this;
            me.allChecked = false;
            return getData(targetPage);
        },
        hasCheckbox: true,
        allChecked: false,
        detailClick: function (value){
            var param = {
                candidate_id: value.memberID,
                company_id: value.companyID,
                job_id: value.jobID
            };
            $scope.isDetailLoading = true;
            var promiseArray = [
                cvService.getResume(param),
                $scope.displayData.currentTab === STATIC_PARAM.POOL ? $q.when({status:"unlocked"}) : cvService.getJobStatus(param)
            ];
            $q.all(promiseArray).then(function(ret){
                var detail = ret[0];
                var status = ret[1] || "";
                $scope.isDetailLoading = false;
                $scope.resumeParam = param;
                $scope.resumeDetail = detail;
                $scope.resumeStatus = status || "";
                $timeout(function(){
                    $(".corp-cvdetail").modal("show");
                });
            });
        },
        deleteData: function() {
            var me = this;
            var cvArray = me.data.filter(function(value){
                return value.hasChecked;
            }).map(function(value){
                return {
                    candidate_id: value.memberID,
                    job_id: value.jobID
                };
            });
            var isApplied = $scope.displayData.currentTab === STATIC_PARAM.DELIVERED;
            if (cvArray.length > 0){
                cvService.dropCV(cvArray, isApplied).then(function(){
                    getData(FIRST_PAGE);
                });
            }
        },
        sortData: function(){
            var me = this;
            $scope.isSortDesc = !$scope.isSortDesc;
            getData(FIRST_PAGE);
        },
        allCheck: function(){
            var me = this;
            me.data.forEach(function(value){
                value.hasChecked = me.allChecked;
            });
        }
    };
    $scope.option = {
        type: "",
        win: false,
        match: false
    };
    $scope.publishJobs = []; 
    $scope.$watch("option.type", function(newValue, oldValue, scope){
        if (oldValue !== newValue) {
            $scope.option.type = newValue;
            getData(FIRST_PAGE);
        }
    });
    $scope.isSortDesc = true;
    $scope.isDetailLoading = true;

    $scope.resumeDetail = {};
    $scope.resumeStatus = "";
    $scope.resumeParam = {};
    $scope.positionConfirmOption = "";
    $scope.STATIC_PARAM = STATIC_PARAM;
    $scope.tabmemuClick = function(target){
        if ($scope.displayData.currentTab !== target) {
            $scope.displayData.currentTab = target;
            $scope.option.type = "";
            $(".corp-cv .ui.checkbox").checkbox("set unchecked");
            getData(FIRST_PAGE, true);
        }
    };
    $scope.errorConfirm = function(){
        $(".corp-cvdetailerror").modal("hide");
    };
    var handleCV = function(type) {
        var action;
        var param = {
            candidate_id: $scope.resumeParam.candidate_id,
            job_id: $scope.resumeParam.job_id,
            company_id: $scope.resumeParam.company_id
        };
        var isApplied = $scope.resumeStatus==="";
        var endingflow = function(){
            return $q.when();
        };
        switch (type) {
            case "mark":
                action = cvService.markCV;
                break;
            case "pay":
                action = cvService.unlockCV;
                endingflow = function(){
                    var deferred = $q.defer();
                    $scope.successConfirm = function(){
                        $(".corp-cvdetailsuccess").modal("hide");
                        deferred.resolve();
                    };
                    cvService.getCoupon().then(function(amount){
                        $scope.couponLeft = amount;
                        $(".corp-cvdetailsuccess").modal("show");
                    });
                    return deferred.promise;
                };
                break;
            case "restore":
                action = cvService.restoreCV;
                break;
            case "drop":
                action = cvService.dropCV;
                param = [param];
                break;
        }
        action(param, isApplied).then(function(){
            return getData(FIRST_PAGE, true);
        }).then(function(){
            $scope.isDetailLoading = true;
            return $q.all([
                cvService.getResume($scope.resumeParam),
                cvService.getJobStatus($scope.resumeParam)
            ]);
        }).then(function(ret){
            $scope.isDetailLoading = false;
            $scope.resumeDetail = ret[0];
            $scope.resumeStatus = ret[1];
        }).then(function(ret){
            return endingflow();
        }).catch(function(error){
            if (error !== "cancel"){
                $scope.errorInfo = error;
                $(".corp-cvdetailerror").modal("show");
            }
        });
    };
    $scope.editCVFunction = function(target) {
        $scope.positionConfirmOption = target.function;
        $scope.confirmDetailConfirm = function(){
            $(".corp-cvdetail-positionconfirm").modal("hide");
            var param = {
                candidate_id: target.memberID,
                job_title_id: cvService.getJobIDByText($scope.positionConfirmOption),
                job_title_text: $scope.positionConfirmOption
            };
            return cvService.markCVPosition(param).then(function(){
                target.function = $scope.positionConfirmOption;
            });
        };
        $scope.cancelDetailConfirm = function(){
            $(".corp-cvdetail-positionconfirm").modal("hide");
        };
        $(".corp-cvdetail-positionconfirm").modal("show");
    };
    $scope.markCV = function() {
        handleCV("mark");
    };
    $scope.payCV = function() {
        handleCV("pay");
    };
    $scope.printCV = function() {
        var targetURL = "\printcv#cid=" + $scope.resumeParam.candidate_id + ";jid=" + $scope.resumeParam.job_id;
        window.open(targetURL); 
    };
    $scope.dropCV = function(){
        handleCV("drop");
    };
    $scope.restoreCV = function(){
        handleCV("restore");
    };
    $scope.isLoading = true;
    $scope.couponLeft = 0;
    cvService.init().then(function(){
        return cvService.getCoupon();
    }).then(function(amount){
        $scope.couponLeft = amount;
        return cvService.getPublishedJobs();
    }).then(function(publishJobs){
        $scope.publishJobs = publishJobs;
        return getData(FIRST_PAGE, true);
    }).then(function(){
        $timeout(function(){
            $(".corp-cv .ui.checkbox.option-win").checkbox({
                onChecked: function() {
                    $scope.option.win = true;
                    getData(FIRST_PAGE, true);
                },
                onUnchecked: function() {
                    $scope.option.win = false;
                    getData(FIRST_PAGE, true);
                }
            });
            $(".corp-cv .ui.checkbox.option-match").checkbox({
                onChecked: function() {
                    $scope.option.match = true;
                    getData(FIRST_PAGE, true);
                },
                onUnchecked: function() {
                    $scope.option.match = false;
                    getData(FIRST_PAGE, true);
                }
            });
            $(".corp-cv .menu .item").tab();
            $(".corp-cv-modal.ui.modal").modal({
                closable: false,
                allowMultiple: true
            });
        });
    });
}]);
