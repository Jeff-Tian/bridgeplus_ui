define([
  "angular",
  "text!./date.html"
], function(angular, template) {
  var CURRENT_DATE = new Date();
  var CURRENT_YEAR = CURRENT_DATE.getFullYear();
  var CURRENT_MONTH = CURRENT_DATE.getMonth();
  var CURRENT_DAY = CURRENT_DATE.getDate();
  var YEAR_RANGE = 150;
  // Month begins from 0
  var MAX_MONTH = 11;
  var MAX_DAY = 31;
  
  var createYears = function(begin, end) {
    var year = [];
    for (var i = end.year; i >= begin.year; i--) {
      year.push({value: i, id: i});
    }
    return year;
  };
  
  var createMonths = function(year, begin, end) {
    if (!year) {
      return;
    }
    var selectedYear = year;
    var monthBegin = selectedYear === begin.year ? begin.month : 0;
    var monthEnd = selectedYear === end.year ? end.month : MAX_MONTH;
    var targetMonths = [];
    for (var i = monthBegin; i <= monthEnd; i++) {
      targetMonths.push({
        value: i + 1,
        id: i + 1
      });
    }
    return targetMonths;
  };
  
  var createDays = function(year, month, begin, end) {
    if (!year || !month) {
      return ;
    }
    var selectedYear = year;
    var selectedMonth = month - 1;
    var targetDate = new Date(selectedYear + "/" + (selectedMonth + 1) + "/01");
    var targetMonth = targetDate.getMonth();
    var dayBegin = (selectedYear === begin.year && selectedMonth === begin.month) ? begin.day : 1;
    var dayEnd = (selectedYear === end.year && selectedMonth === end.month) ? end.day : MAX_DAY;
    var targetDays = [];
    for (var i = dayBegin; i <= dayEnd; i++) {
      targetDate.setDate(i);
      if (targetDate.getMonth() === targetMonth) {
        targetDays.push({
          value: i,
          id: i
        });
      } else {
        break;
      }
    }
    return targetDays;
  };
  var hasStarted = false;
  var BplusDate = function() {
  };
  BplusDate.prototype.constructor = BplusDate;
  BplusDate.prototype.start = function(agModel, externalTemplate) {
    template = externalTemplate ? externalTemplate : template;
    if (hasStarted) {
      return;
    }
    hasStarted = true;
    agModel.
    directive("bplusdate", function() {
      return {
        restrict: 'E',
        template: template,
        scope: {
//        config: {
//          showYear,
//          showMonth,
//          showDay,
//          begin: {
//            year,
//            month,
//            day
//          },
//          end: {
//            year,
//            month,
//            day
//          }
//        }
          config: "=",
          value: "=",
          fulfilled: "=",
          displayError: "="
        },
        link: function(scope, element) {
          if (!scope.config.begin) {
            scope.config.begin = {
              year: CURRENT_YEAR - YEAR_RANGE,
              month: 0,
              day: 1
            };
          }
          if (!scope.config.end) {
            scope.config.end = {
              year: CURRENT_YEAR,
              month: CURRENT_MONTH,
              day: CURRENT_DAY
            };
          }
          scope.displayData = {
            years: [],
            months: [],
            days: [],
            value: {
              year: scope.value.year,
              month: scope.value.month,
              day: scope.value.day
            }
          };
          scope.$watch("config.display", function(newVal, oldVal) {
            scope.displayData.years = newVal ? createYears(scope.config.begin, scope.config.end) : [];
            scope.displayData.value.year = scope.value.year;
            scope.displayData.value.month = scope.value.month;
            scope.displayData.value.day = scope.value.day;
            scope.selectYear(true);
          });
          
          scope.selectYear = function(fillData) {
            var chosenYear = scope.displayData.value.year;
            if (scope.config.showMonth) {
              if (!fillData) {
                scope.displayData.value.day = "";
                scope.displayData.value.month = "";
              }
              scope.displayData.months = createMonths(chosenYear, scope.config.begin, scope.config.end);
              if (scope.value.month) {
                scope.selectMonth(true);
              }
            }
          };
          scope.selectMonth = function(fillData) {
            var chosenYear = scope.displayData.value.year;
            var chosenMonth = scope.displayData.value.month;
            if (scope.config.showDay) {
              if (!fillData) {
                scope.displayData.value.day = "";
              }
              scope.displayData.days = createDays(chosenYear, chosenMonth, scope.config.begin, scope.config.end);
            }
          };
          scope.$watch("displayData.value", function(newValue){
            if (!newValue) {
              scope.fulfilled = false;
              return;
            }
            if (scope.value.year !== newValue.year) {
              if (newValue.year) {
                scope.value.year = newValue.year;
              } else {
                scope.value.year = "";
              }
            }
            if (scope.value.month !== newValue.month) {
              if (newValue.month) {
                scope.value.month = newValue.month;
              } else {
                scope.value.month = "";
              }
            }
            if (scope.value.day !== newValue.day) {
              if (newValue.day) {
                scope.value.day = newValue.day;
              } else {
                scope.value.day = "";
              }
            }
            var fulfilled = true;
            if (scope.config.showYear && scope.value.year === "") {
              fulfilled = false;
            }
            if (scope.config.showMonth && scope.value.month === "") {
              fulfilled = false;
            }
            if (scope.config.showDay && scope.value.day === "") {
              fulfilled = false;
            }
            scope.fulfilled = fulfilled;
          }, true);
        }
      };
    });
  };
  //TODO:
  //Become an instance
  return BplusDate;
});