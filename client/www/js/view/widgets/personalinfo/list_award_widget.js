define([
  "when",
  "jquery",
  "angular",
  "bplus-ui/view/widgets/personalinfo/list_widget_base",
  "text!./list_award_widget.html"
], function(when, $, angular, BaseClass, template) {
  var ListAward = function(externalTemplate) {
    template = externalTemplate ? externalTemplate : template;
    BaseClass.call(this);
  };
  ListAward.prototype = Object.create(BaseClass.prototype);
  ListAward.prototype.constructor = ListAward;
  
  ListAward.prototype.start = function(agModel) {
    var me = this;
    agModel
    .directive("bplusaward", function(){
      return {
        restrict: 'E',
        template: template,
        scope: {
          data: "=",
        },
        compile: function() {
          return {
            pre: function($scope) {
              $scope.ENUM_STATUS = me.ENUM_STATUS;
              $scope.property = {
                status: ($scope.data.id === "") ? me.ENUM_STATUS.STATUS_EDIT : me.ENUM_STATUS.STATUS_READONLY
              };
              if ($scope.data.prizeDate.value.rawValue) {
                  var lng = me.getLanguage();
                  var options = {year: 'numeric', month: 'long'};
                  $scope.data.prizeDate.displayValue = $scope.data.prizeDate.value.rawValue.toLocaleString(lng, options);
                  if ($scope.data.prizeDate.displayValue.indexOf("GMT") > -1) {
                      $scope.data.prizeDate.displayValue = $scope.data.prizeDate.value.year + "-" + $scope.data.prizeDate.value.month;
                  }
              }
               $scope.dateSelect = {
                 config: {
                   showYear: true,
                   showMonth: true,
                   showDay: false,
                   displayError: false,
                   display: true
                 },
                 value: $scope.data.prizeDate.value,
                 fulfilled: false
               };
               me.createActions($scope, "award", false, true, true, true);
               $scope.submit = function() {
                 $scope.clicked = true;
                 $scope.dateSelect.config.displayError = true;
                 if (!!(!$scope.dateSelect.fulfilled || $scope.award.$error.required)) {
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
  
  return ListAward;
});