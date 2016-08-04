define([
    "when",
    "jquery",
    "angular",
    "bplus-ui/view/widgets/personalinfo/list_widget_base",
    "text!./list_skills_widget.html"
], function (when, $, angular, BaseClass, template) {

    var ListSkill = function (externalTemplate) {
        template = externalTemplate ? externalTemplate : template;
        BaseClass.call(this);
    };
    ListSkill.prototype = Object.create(BaseClass.prototype);
    ListSkill.prototype.constructor = ListSkill;

    ListSkill.prototype.start = function (agModel) {
        var me = this;
        agModel
            .directive("bplusskills", function () {
                return {
                    restrict: 'E',
                    template: template,
                    scope: {
                        data: "="
                    },
                    compile: function () {
                        return {
                            pre: function ($scope) {
                                $scope.ENUM_STATUS = me.ENUM_STATUS;
                                $scope.property = {
                                    status: ($scope.data.id === "") ? me.ENUM_STATUS.STATUS_EDIT : me.ENUM_STATUS.STATUS_READONLY
                                };
                                me.createActions($scope, "skills", true, true, true, true);
                            }
                        };
                    }
                };
            });
    };

    return ListSkill;
});