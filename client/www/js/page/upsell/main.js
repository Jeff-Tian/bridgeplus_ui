'use strict';
angular
    .module('bplusUpsell', [
        'bplusModule'
    ])
    .controller('UpsellCtrl', angular.bplus.UpsellCtrl)
    .controller('OffersCtrl', angular.bplus.OffersCtrl)
    .factory('FormValidation', angular.bplus.FormValidation)
;