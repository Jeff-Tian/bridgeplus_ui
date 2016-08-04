define([
    "when",
    "jquery",
    "angular",
    "bplus-ui/view/widgets/personalinfo/list_widget_base",
    "text!./list_educationbackground_widget.html"
], function (when, $, angular, BaseClass, template) {
    var ListEducationBackground = function (externalTemplate) {
        template = externalTemplate ? externalTemplate : template;
        BaseClass.call(this);
    };
    ListEducationBackground.prototype = Object.create(BaseClass.prototype);
    ListEducationBackground.prototype.constructor = ListEducationBackground;

    ListEducationBackground.prototype.start = function (agModel) {
        var me = this;
        agModel
            .directive("bpluseducationalbackground", function () {
                return {
                    restrict: 'E',
                    template: template,
                    scope: {
                        data: "="
                    },
                    compile: function () {
                        return {
                            pre: function ($scope, $element) {
                                $scope.ENUM_STATUS = me.ENUM_STATUS;
                                $scope.property = {
                                    status: ($scope.data.id === "") ? me.ENUM_STATUS.STATUS_EDIT : me.ENUM_STATUS.STATUS_READONLY
                                };
                                var lng = me.getLanguage();
                                var options = {year: 'numeric', month: 'long'};
                                if ($scope.data.dateTo.value.rawValue) {
                                    $scope.data.dateTo.displayValue = $scope.data.dateTo.value.rawValue.toLocaleString(lng, options);
                                    if ($scope.data.dateTo.displayValue.indexOf("GMT") > -1) {
                                        $scope.data.dateTo.displayValue = $scope.data.dateTo.value.year + "-" + $scope.data.dateTo.value.month;
                                    }
                                }
                                if ($scope.data.dateFrom.value.rawValue) {
                                    $scope.data.dateFrom.displayValue = $scope.data.dateFrom.value.rawValue.toLocaleString(lng, options);
                                    if ($scope.data.dateFrom.displayValue.indexOf("GMT") > -1) {
                                        $scope.data.dateFrom.displayValue = $scope.data.dateFrom.value.year + "-" + $scope.data.dateFrom.value.month;
                                    }
                                }
                                var today = new Date();
                                $scope.dateFrom = {
                                    config: {
                                        showYear: true,
                                        showMonth: true,
                                        showDay: false,
                                        displayError: false,
                                        display: true
                                    },
                                    value: $scope.data.dateFrom.value,
                                    fulfilled: false
                                };
                                $scope.dateTo = {
                                    config: {
                                        showYear: true,
                                        showMonth: true,
                                        showDay: false,
                                        displayError: false,
                                        display: false,
                                        end: {
                                            year: today.getFullYear() + 10,
                                            month: 11,
                                            day: 31
                                        }
                                    },
                                    value: $scope.data.dateTo.value,
                                    fulfilled: false
                                };
                                $scope.$watch("dateFrom.value", function (newValue, oldValue) {
                                    if (newValue !== oldValue) {
                                        $scope.dateTo.value.year = "";
                                        $scope.dateTo.value.month = "";
                                        $scope.dateTo.value.day = "";
                                    }
                                    if (newValue && newValue.year && newValue.month) {
                                        $scope.dateTo.config.begin = {
                                            year: $scope.dateFrom.value.year,
                                            month: $scope.dateFrom.value.month - 1
                                        };
                                        $scope.dateTo.config.display = $scope.dateTo.config.display === "true1" ? true : "true1";
                                    } else {
                                        $scope.dateTo.config.display = false;
                                    }
                                }, true);
                                me.createActions($scope, "educationbackground", false, true, true, true);
                                me.getResouce($scope, "background").then(function(data) {
                                    $scope.backgrounds = data;
                                    var i = 0;
                                    for (i = 0; i < data.length; i++) {
                                        if (data[i].id === $scope.data.background.id) {
                                            $scope.data.background.value = data[i].text;
                                            break;
                                        }
                                    }
                                    $scope.$apply();
                                });
                                $scope.submit = function () {
                                    $scope.clicked = true;
                                    $scope.data.name = $($element).find('[name="schoolname"]').val();
                                    $scope.data.major = $($element).find('[name="major"]').val();
                                    $scope.dateFrom.config.displayError = true;
                                    $scope.dateTo.config.displayError = true;
                                    if (!!(!$scope.dateTo.fulfilled || !$scope.dateFrom.fulfilled || $scope.educationbackground.$error.required)) {
                                        return;
                                    }
                                    if (me.submit) {
                                        me.submit($scope);
                                    }
                                };
                            }
                        };
                    }
                };
            });
    };

    return ListEducationBackground;
});