define([
  "when",
  "jquery",
  "angular",
  "bplus-ui/view/widgets/personalinfo/list_widget_base",
  "text!./list_clubexperience_widget.html"
], function(when, $, angular, BaseClass, template) {
  var ListClubBackground = function(externalTemplate) {
    template = externalTemplate ? externalTemplate : template;
    BaseClass.call(this);
  };
  ListClubBackground.prototype = Object.create(BaseClass.prototype);
  ListClubBackground.prototype.constructor = ListClubBackground;
  
  ListClubBackground.prototype.start = function(agModel) {
    var me = this;
    agModel
    .directive("bplusclubexperience", function(){
      return {
        restrict: 'E',
        template: template,
        scope: {
          data: "=",
        },
        compile: function() {
          return {
            pre: function($scope, $element) {
              $scope.ENUM_STATUS = me.ENUM_STATUS;
              $($element).find(".tillnow").checkbox({
                  onChecked: function() {
                      $scope.data.dateTo.value.tillNow = true;
                  },
                  onUnchecked: function() {
                      $scope.data.dateTo.value.tillNow = false;
                  }
              });

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
                   display: false
                 },
                 value: $scope.data.dateTo.value,
                 fulfilled: false,
               };
               $scope.$watch("dateFrom.value", function(newValue, oldValue) {
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
               me.createActions($scope, "clubbackground", false, true, true, true);
               me.getResouce($scope, "position").then(function(data) {
                   $scope.positions = data;
                   var i = 0;
                   for (i = 0; i < data.length; i++) {
                       if (data[i].id === $scope.data.position.id) {
                           $scope.data.position.value = data[i].text;
                           break;
                       }
                   }
                   $scope.$apply();
               });
               $scope.submit = function() {
                 $scope.clicked = true;
                 $scope.dateFrom.config.displayError = true;
                 $scope.dateTo.config.displayError = true;
                 if (!!(!$scope.dateFrom.fulfilled || !($scope.data.dateTo.value.tillNow || $scope.dateTo.fulfilled) || $scope.clubbackground.$error.required)) {
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
  
  return ListClubBackground;
});