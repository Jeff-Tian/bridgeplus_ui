define([
    "when",
    "jquery",
    "angular",
    "bplus-ui/view/widgets/personalinfo/list_widget_base",
    "text!./list_personalinfo_widget.html"
], function (when, $, angular, BaseClass, template) {

    var ListPersonalInfo = function (externalTemplate) {
        template = externalTemplate ? externalTemplate : template;
        BaseClass.call(this);
    };
    ListPersonalInfo.prototype = Object.create(BaseClass.prototype);
    ListPersonalInfo.prototype.constructor = ListPersonalInfo;

    ListPersonalInfo.prototype.start = function (agModel) {
        var me = this;
        agModel
            .directive("bpluspersonalinfo", function () {
                return {
                    restrict: 'E',
                    template: template,
                    scope: {
                        data: "=",
                    },
                    compile: function () {
                        return {
                            pre: function ($scope, $element) {
                               $($element).find(".isPrivateBirthday").checkbox({
                                    onChecked: function() {
                                        $scope.data.dateOfBirth.isPrivate = true;
                                    },
                                    onUnchecked: function() {
                                        $scope.data.dateOfBirth.isPrivate = false;
                                    }
                                });

                                $($element).find(".isPrivateContractInfo").checkbox({
                                    onChecked: function() {
                                        $scope.data.contractInfo.isPrivate = true;
                                    },
                                    onUnchecked: function() {
                                        $scope.data.contractInfo.isPrivate = false;
                                    }
                                });

                                $scope.ENUM_STATUS = me.ENUM_STATUS;
                                $scope.data.dateOfBirth.isPrivate = $scope.data.dateOfBirth.isPrivate === false ? false : true;
                                $scope.data.contractInfo.isPrivate = $scope.data.contractInfo.isPrivate === false ? false : true;
                                $scope.property = {
                                    status: ($scope.data.name === "") ? me.ENUM_STATUS.STATUS_EDIT : me.ENUM_STATUS.STATUS_READONLY
                                };
                                if ($scope.data.dateOfBirth.value.rawValue) {
                                    var lng = me.getLanguage();
                                    var options = {year: 'numeric', month: 'long', day: 'numeric' };
                                    $scope.data.dateOfBirth.displayValue = $scope.data.dateOfBirth.value.rawValue.toLocaleString(lng, options);
                                    if ($scope.data.dateOfBirth.displayValue.indexOf("GMT") > -1) {
                                        $scope.data.dateOfBirth.displayValue = $scope.data.dateOfBirth.value.year + "-" + $scope.data.dateOfBirth.value.month;
                                    }
                                }
                                $scope.dateSelect = {
                                    config: {
                                        showYear: true,
                                        showMonth: true,
                                        showDay: true,
                                        displayError: false,
                                        display: true
                                    },
                                    value: $scope.data.dateOfBirth.value,
                                    fulfilled: false
                                };
                                me.createActions($scope, "personalinfo", false, true, true, false);
                                $scope.submit = function () {
                                    $scope.clicked = true;
                                    $scope.dateSelect.config.displayError = true;
                                    if (!!(!$scope.dateSelect.fulfilled || $scope.personalinfo.$error.required)) {
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

    return ListPersonalInfo;
});