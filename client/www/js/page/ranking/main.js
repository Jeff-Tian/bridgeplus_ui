'use strict';
angular
    .module('bplusRanking', ['bplusModule'])
    .controller('RankingCtrl', angular.cmpt.rankingCtrl)
    .factory('FormValidation', angular.bplus.FormValidation)
;