define([
    "when",
    "jquery",
    "angular",
    "bplus-ui/model/personalinfo"
], function (when, $, angular, personalinfoData) {
    var _instance;

    var moduleTrack = new window.ModuleTrack(angular.bplus.DeviceHelper().isMobile() ? 'm.profile' : 'profile');
    var moduleTrackingNames = {
        "bpluspersonalinfooverall": {cancel: "cancelPersonInfo.click", save: "savePersonInfo.click"},
        "bpluseducationbackgroundall":{add: "addEducation.click", cancel: "cancelEducation.click", del:"removeEducation.click", save: "saveEducation.click"},
        "bplusclubexperienceall":{add: "addOrg.click", cancel: "cancelOrg.click", del:"removeOrg.click", save: "saveOrg.click"},
        "bplusworkexperienceall":{add: "addJob.click", cancel: "cancelJob.click", del:"removeJob.click", save: "saveJob.click"},
        "bpluslanguageall":{add: "addLng.click", cancel: "cancelLng.click", del:"removeLng.click", save: "saveLng.click"},
        "bplusskillsoverall":{add: "addSkill.click", cancel: "cancelSkill.click", del:"removeSkill.click", save: "saveSkill.click"},
        "bplusawardall":{add: "addHoner.click", cancel: "cancelHoner.click", del:"removeHoner.click", save: "saveHoner.click"}
    };

    function sendTrack(directiveName, actionName){
        var names = moduleTrackingNames[directiveName];
        if(!names){
            return;
        }

        var action = names[actionName];
        if(action){
            moduleTrack.send(action);
        }
    }

    var ListWidgetContainer = function () {
        Object.call(this);
    };
    ListWidgetContainer.prototype = Object.create(Object.prototype);
    ListWidgetContainer.prototype.constructor = ListWidgetContainer;

    ListWidgetContainer.prototype.start = function (agModel, directiveName, template) {
        agModel
            .directive(directiveName, ["personalinfoService", function (model) {
                return {
                    restrict: 'E',
                    template: template,
                    scope: {},
                    link: function (scope, element) {
                        var service = model.SERVICES[directiveName];
                        var updateData = function (forceRefresh) {
                            var returnPromise;
                            return model.getData(service, null, forceRefresh).then(function (data) {
                                scope.dataCollection = data;
                                scope.dataLoaded = true;
                                scope.hasData = scope.dataCollection && scope.dataCollection.length > 0;
                                scope.$apply();
                            });
                        };
                        updateData();
                        scope.showAddButton = true;
                        scope.add = function () {
                            sendTrack(directiveName, "add");

                            scope.dataCollection.push(model.getPattern(service));
                            scope.showAddButton = false;
                        };
                        scope.submit = function (data) {
                            sendTrack(directiveName, "save");

                            return model.updateData(service, data).then(function() {
                              scope.showAddButton = true;
                              return updateData(true);
                            }, function() {
                              scope.showAddButton = true;
                              return updateData();
                            });
                        };
                        scope.cancel = function (data) {
                            sendTrack(directiveName, "cancel");

                            scope.showAddButton = true;
                            updateData();
                        };
                        scope.edit = function (data) {
                            scope.showAddButton = false;
                            // Don't need to do anything on this action
                        };
                        scope.del = function (data) {
                            sendTrack(directiveName, "del");

                            return model.deleteData(service, data).then(function() {
                                scope.showAddButton = true;
                                return updateData(true);
                            });
                        };
                        scope.getResouce = function (key) {
                            return model.getResource(key);
                        };
                    }
                };
            }]);
        return _instance;
    };

    _instance = _instance ? _instance : new ListWidgetContainer();
    return _instance;
});