angular
    .module('opdModule')
    .directive('bopdChartPentagon', function () {
        return {
            template: '',
            // compile: function (scope, element, attrs) {
            //     ;
            // },
            link: function (scope, element, attrs) {
                var arrBopdChartPentagon = attrs.bopdChartPentagon.split('-');
                angular.element(element).addClass('chart-pentagon-container').append(
                    '<div class="chart-pentagon chart-pentagon-' + arrBopdChartPentagon[4] + '-' + arrBopdChartPentagon[0] + ' chart-pentagon-section-1">' + '<div class="chart-pentagon-inner"></div>' + '</div>' + '<div class="chart-pentagon chart-pentagon-' + arrBopdChartPentagon[3] + '-' + arrBopdChartPentagon[4] + ' chart-pentagon-section-2">' + '<div class="chart-pentagon-inner"></div>' + '</div>' + '<div class="chart-pentagon chart-pentagon-' + arrBopdChartPentagon[2] + '-' + arrBopdChartPentagon[3] + ' chart-pentagon-section-3">' + '<div class="chart-pentagon-inner"></div>' + '</div>' + '<div class="chart-pentagon chart-pentagon-' + arrBopdChartPentagon[1] + '-' + arrBopdChartPentagon[2] + ' chart-pentagon-section-4">' + '<div class="chart-pentagon-inner"></div>' + '</div>' + '<div class="chart-pentagon chart-pentagon-' + arrBopdChartPentagon[0] + '-' + arrBopdChartPentagon[1] + ' chart-pentagon-section-5">' + '<div class="chart-pentagon-inner"></div>' + '</div>'
                );
            }
        };
    });