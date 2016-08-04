define([
  "when",
  "jquery",
  "angular",
  "bplus-ui/view/widgets/personalinfo/list_widget_base",
  "text!./list_language_widget.html"
], function(when, $, angular, BaseClass, template) {

  var ListLanguage = function(externalTemplate) {
    template = externalTemplate ? externalTemplate : template;
    BaseClass.call(this);
  };
  ListLanguage.prototype = Object.create(BaseClass.prototype);
  ListLanguage.prototype.constructor = ListLanguage;
  
  ListLanguage.prototype.start = function(agModel) {
    var me = this;
    agModel
    .directive("bpluslanguage", function(){
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
              me.createActions($scope, "language", true, true, true, true);
              me.getResouce($scope, "language").then(function(data) {
                  $scope.languages = data;
                  var i = 0;
                  for (i = 0; i < data.length; i++) {
                      if (data[i].id === $scope.data.language.id) {
                          $scope.data.language.value = data[i].text;
                          break;
                      }
                  }
                  $scope.$apply();
              });
              me.getResouce($scope, "proficiency").then(function(data) {
                  $scope.proficiencys = data;
                  var i = 0;
                  for (i = 0; i < data.length; i++) {
                      if (data[i].id === $scope.data.proficiency.id) {
                          $scope.data.proficiency.value = data[i].text;
                          break;
                      }
                  }
                  $scope.$apply();
              });
              $scope.$watch("data.language.id", function(newValue, oldValue) {
                  if (newValue !== oldValue && newValue !== "2dc5e10f-9f2b-4fe8-a5c6-5cf5a571d38d") {
                      $scope.data.certification.id = "";
                      $scope.data.certification.value = "";
                      $scope.data.score = "";
                  }
              });
              me.getResouce($scope, "certification").then(function(data) {
                  $scope.certifications = data;
                  var i = 0;
                  for (i = 0; i < data.length; i++) {
                      if (data[i].id === $scope.data.certification.id) {
                          $scope.data.certification.value = data[i].text;
                          break;
                      }
                  }
                  $scope.$apply();
              });
            }
          };
        }
      };
    });
  };
  
  return ListLanguage;
});