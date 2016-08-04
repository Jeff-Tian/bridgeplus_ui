angular.module('corpModule')
.directive('corpCvDetail', ['$rootScope', 'resourceService', function ($rootScope, resourceService) {
    return {
        templateUrl: 'js/page/corp/directives/corpCVDetail.html',
        scope: true,    //Need param: resumeDetail
        link: function($scope) {
            var getAge = function(birthday) {
                return new Date().getFullYear() - new Date(birthday).getFullYear();
            };
            var formatDataPreiod = function(source) {
                var ret = new Date(source);
                if (ret - new Date(1900, 0, 1) === 0) {
                    ret = "";
                } else {
                    ret = ret.getFullYear() + '/' + (ret.getMonth() + 1);
                }
                return ret;
            };
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
            if ($scope.resumeDetail.member) {
                $scope.resumeDetail.member.gender = $scope.resumeDetail.member.gender ? $scope.resumeDetail.member.gender : 'U';
                $scope.resumeDetail.member.avatar = handleHeadshot($scope.resumeDetail.member.avatar, $scope.resumeDetail.member.gender);
            }
            Object.keys($scope.resumeDetail).forEach(function(key){
                var type = $scope.resumeDetail[key];
                type = $.isArray(type) ? type : [type];
                type.forEach(function(value, index){
                    var item = value;
                    Object.keys(item).forEach(function(itemKey){
                        var itemValue = item[itemKey];
                        switch(itemKey) {
                            case "end_date":
                                item.endDate = formatDataPreiod(itemValue);
                                break;
                            case "start_date":
                                item.startDate = formatDataPreiod(itemValue);
                                break;
                            case "issue_date":
                                item.issueDate = formatDataPreiod(itemValue);
                                break;
                            case "birthday":
                                item.age = getAge(itemValue);
                                break;
                            case "qualifications_id":
                            case "job_id":
                            case "language_id":
                                var itemKeyArray = itemKey.split("_");
                                item[itemKey.replace(itemKeyArray[1], "text")] = resourceService.getResource(itemKeyArray[0], itemValue);
                                break;
                            case "work_type":
                                item['work_type_text'] = resourceService.getResource(resourceService.RESOURCE_KEY.WORKTYPE, itemValue);
                                break;
                            case "proficiency_id":
                                item['proficiency_text'] = resourceService.getResource(resourceService.RESOURCE_KEY.LANGGUAGEPROFICIENCY, itemValue);
                                break;
                            case "certification":
                                item['certification_text'] = itemValue ? resourceService.getResource(resourceService.RESOURCE_KEY.ENGLISHLEVEL, itemValue) : "";
                                break;
                            case "position":
                                item['position_text'] = resourceService.getResource(resourceService.RESOURCE_KEY.COMMUNITYPOSITION, itemValue);
                                break;
                            case "tags":
                                if (itemValue) {
                                    item['tagsDisplay'] = itemValue.split(" ").slice(0, 2);
                                } else {
                                    item['tagsDisplay'] = [];
                                }
                                break;
                        }
                    });
                });
            });
        }
    };
}])
;