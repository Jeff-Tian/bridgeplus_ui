define([
  "when",
  "jquery",
  "angular",
], function(when, $, angular) {
  
  var ModelBase = function() {
    var me = this;
    me.rawData = {};
    me.resourceData = {};
    me.resourcePromiseCache = {};
    me.PATTERN = {};
    me.SERVICES = {};
    me.REOURCE = {};
    me.SERVICENAME = "";
    me.forceUpdateEvents = [];
    me.SOURCE_URL = "/service-proxy/bplus-resource/";
    me.getPattern = function(key) {
        return key ? $.extend(true, {}, me.PATTERN[key]) : $.extend(true, {}, me.PATTERN);
    };
    me.updateData = function(dataKey, dataParam) {};
    me.deleteData = function(dataKey, dataParam) {};
  };
  ModelBase.prototype = Object.create(ModelBase);
  ModelBase.prototype.constructor = ModelBase;
  
  ModelBase.prototype.start = function(agModel) {
    var self = this;
    agModel.service(self.SERVICENAME, ["msgBus", function(msgBus) {
      // Use when instead of $q because when provide something better
      // $.ajax itself is a promise A+ method. Just use it.
      // If $q need to be used, have to use $q.deffer() instead.
      var me = this;
      me.SERVICES = self.SERVICES;
      me.getData = function(dataKey, dataParam, forceUpdate) {
        var paramKey = dataParam ? JSON.stringify(dataParam) : "0";
        var retValue;
        if (!forceUpdate && self.rawData[dataKey] && self.rawData[dataKey][paramKey]) {
          retValue = when($.extend(true, [], self.rawData[dataKey][paramKey]));
        } else {
          retValue = self.getRawData(dataKey, dataParam, forceUpdate).then(function(parsedData) {
              if (!self.rawData[dataKey]) {
                self.rawData[dataKey] = {};
              }
              self.rawData[dataKey][paramKey] = parsedData;
              if (forceUpdate) {
                if (dataKey === "memberExt") {
                    msgBus.emitMsg(msgBus.events.profile.updated);
                }
                self.forceUpdateEvents.forEach(function(callbackValue) {
                    callbackValue.call(this);
                });
              }
              return $.extend(true, [], parsedData);
          });
        }
        return retValue;
      };
      me.updateData = function(dataKey, dataParam) {
        return self.updateData(dataKey, dataParam);
      };
      me.deleteData = function(dataKey, dataParam) {
        return self.deleteData(dataKey, dataParam);
      };
      me.addForceDataUpdateEventListener = function(callback) {
          var index = self.forceUpdateEvents.indexOf(callback);
          if (index === -1) {
              self.forceUpdateEvents.push(callback);
          }
      };
      me.removeEventListener = function(callback) {
          var index = self.forceUpdateEvents.indexOf(callback);
          if (index > -1) {
              self.forceUpdateEvents.splice(index, 1);
          }
      };
      me.getPattern = function(key) {
          return self.getPattern(key);
      };
      me.getResource = function(key) {
          var lng = angular.bplus.localeHelper.getLocale(window.location.pathname);
          var sourceKey = self.REOURCE[key];
          var url = self.SOURCE_URL + sourceKey + "/" + lng;
          var cachedData = self.resourceData[url];
          var promise;
          if (cachedData) {
              promise = when(cachedData);
          } else {
              var bridgePromise;
              if (self.resourcePromiseCache[url]) {
                  bridgePromise = self.resourcePromiseCache[url];
              } else {
                  bridgePromise = $.ajax({
                      type:"get",
                      url: url,
                      dataType: "json"
                  });
                  self.resourcePromiseCache[url] = bridgePromise;
              }
              promise = bridgePromise.then(function(data) {
                  delete self.resourcePromiseCache[url];
                  if (data && data.isSuccess) {
                      self.resourceData[url] = data.result;
                      return data.result;
                  } else {
                      return when.reject("get resource fails!");
                  }
              });
          }
          return promise;
      };
    }]);
  };
  return ModelBase;
});