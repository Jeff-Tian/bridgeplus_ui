'use strict';

// Declare app level module which depends on views, and components
angular.module('bplus', ['bplusModule'])
    .factory('FormValidation', angular.bplus.FormValidation || function() {
        return {};
    })
    .directive('chinaMap', angular.bplus.chinaMap || {})
    .directive('radarMap', angular.bplus.radarMap || {})
    .directive('gameHome', angular.bplus.gameHome)
    .directive('gameOfficial', angular.bplus.gameOfficial)
    .directive('gameNational', angular.bplus.gameNational)
    .directive('gameSeason', angular.bplus.gameSeason)
    .directive('gamePersonalRecord', angular.bplus.gamePersonalRecord)
    .directive('gameRankingList', angular.bplus.gameRankingList)
    .controller('gameCtrl', angular.bplus.gameCtrl)
;
(function() {
})();