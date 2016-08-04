(function (exports) {
    exports.SelectInterestCtrl = function ($scope, service, FormValidation, $stateParams, $state) {
        $('.ui.checkbox').checkbox({
            'onChecked': function () {
                var ngModel = $(this).attr('ng-model');
                var ngModels = ngModel.split('.');
                $scope[ngModels[0]][ngModels[1]] = true;
            },
            onUnchecked: function () {
                var ngModel = $(this).attr('ng-model');
                var ngModels = ngModel.split('.');
                $scope[ngModels[0]][ngModels[1]] = false;
            }
        });

        $scope.interests = {
            businessEnglish: false,
            overseesStudy: false,
            itTraining: false,
            mba: false,
            accounting: false,
            other: ''
        };

        $scope.saving = false;
        $scope.saveInterests = function () {
            service.executePromiseAvoidDuplicate($scope, 'saving', function () {
                return service
                    .post('/service-proxy/member/save-interests', {
                        data: [
                            {
                                key: "business-english",
                                value: String($scope.interests.businessEnglish)
                            },
                            {
                                key: "oversees-study",
                                value: String($scope.interests.overseesStudy)
                            },
                            {
                                key: "it-training",
                                value: String($scope.interests.itTraining)
                            },
                            {
                                key: "mba",
                                value: String($scope.interests.mba)
                            },
                            {
                                key: "accounting",
                                value: String($scope.interests.accounting)
                            },
                            {
                                key: "other",
                                value: String($scope.interests.other)
                            }
                        ]
                    })
                    .then(function (result) {
                        console.log(result);
                        $state.go('paid', $stateParams);
                    })
                    .catch(FormValidation.delegateHandleFormError($('.ui.form.interests-form')))
                    ;
            });
        };
    };

    exports.SelectInterestCtrl.$inject = ['$scope', 'service', 'FormValidation', '$stateParams', '$state'];
})
(angular.bplus = angular.bplus || {});