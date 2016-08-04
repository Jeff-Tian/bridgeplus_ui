'use strict';

angular
    .module('bplus', ['bplusModule',
        'cmpt'
    ])
    .controller('DurableMessageCtrl', ['$http', '$scope', function ($http, $scope) {
        $http.get(angular.bplus.config.durableMessageSource, {
            headers: {
                'X-Requested-With': undefined
            }
        })
            .then(function (result) {
                $scope.durableMessages = result.data;
            })
        ;
    }])
;