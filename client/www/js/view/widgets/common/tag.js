define([
  "angular",
  "text!./tag.html"
], function(angular, template) {
  var filterTags = function(dataArray) {
    var targetArrary = [];
    var tmpObject = {};
    var targetValue = "";
    dataArray.forEach(function(value){
      if (!tmpObject.hasOwnProperty(value)) {
        targetArrary.push(value);
        tmpObject[value] = true;
      }
    });
    targetValue = targetArrary.join(" ");
    return targetValue;
  };
  
  var hasStarted = false;
  var BplusTag = function() {
  };
  BplusTag.prototype.constructor = BplusTag;
  BplusTag.prototype.start = function(agModel, externalTemplate) {
    template = externalTemplate ? externalTemplate : template;
    if (hasStarted) {
      return;
    }
    hasStarted = true;
    agModel.
    directive("bplustag", function() {
      return {
        restrict: 'E',
        template: template,
        scope: {
//        config: "=",
          value: "=",
          description: "="
        },
        link: function(scope, element) {
          var tmpDataArray = [];
          var latestInput = "";
          scope.displayData = {
            candidates: [],
            tags: ""
          };
          scope.inputChange = function() {
            tmpDataArray = scope.displayData.tags.split(" ");
            var lastValue = tmpDataArray[tmpDataArray.length - 1];
            if (lastValue !== latestInput) {
              latestInput = lastValue;
              //TODO
              //Search something
            }
            scope.value = filterTags(tmpDataArray);
          };
          scope.candidateClick = function(value) {
            if (tmpDataArray.indexOf(value) === -1) {
              tmpDataArray.push(value);
              scope.displayData.tags = tmpDataArray.join(" ");
              scope.value = filterTags(tmpDataArray);
            }
          };
          scope.displayData.tags = scope.value;
          tmpDataArray = scope.displayData.tags.split(" ");
        }
      };
    });
  };
  //TODO:
  //Become an instance
  return BplusTag;
});