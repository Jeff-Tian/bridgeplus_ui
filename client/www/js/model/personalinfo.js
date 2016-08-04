define([
  "when",
  "jquery",
  "angular",
  "bplus-ui/model/modelbase",
  "json!bplus-ui/model/profileData/education.json",
  "json!bplus-ui/model/profileData/skill.json",
  "json!bplus-ui/model/profileData/memberExt.json",
  "json!bplus-ui/model/profileData/communityExperience.json",
  "json!bplus-ui/model/profileData/workExperience.json",
  "json!bplus-ui/model/profileData/archivement.json",
  "json!bplus-ui/model/profileData/languageSkill.json"
], function(when, $, angular, BaseClass, education, skill, memberExt, communityExperience, workExperience, archivement, languageSkill) {
  
  var _getDataPromise;
  var _data;
  
  var parseData = function(dataArray, patternFormat) {
      var targetArray = [];
      dataArray = $.isArray(dataArray) ? dataArray : [dataArray];
      dataArray.forEach(function(data) {
          var pattern = $.extend(true, {}, patternFormat);
          for (var i in data) {
              var value = data[i];
              var keyArray = i.split(".");
              var firstKey = keyArray[0];
              var secondKey = keyArray[1];
              var isDate = (firstKey.indexOf("date") > -1 || firstKey.indexOf("Date") > -1) && secondKey === "value";
              if (isDate) {
                  var targetObject = secondKey ? pattern[firstKey][secondKey] : pattern[firstKey];
                  if (value) {
                      var dateValue = new Date(value);
                      if (targetObject.hasOwnProperty("tillNow") && (dateValue.getFullYear() === 1900) && (dateValue.getMonth() === 0) && (dateValue.getDate() === 1)) {
                          targetObject.tillNow = true;
                      } else {
                          targetObject.rawValue = dateValue;
                          targetObject.year = dateValue.getFullYear();
                          targetObject.month = dateValue.getMonth() + 1;
                          targetObject.day = dateValue.getDate();
                      }
                  } else if (targetObject.hasOwnProperty("tillNow")){
                      targetObject.tillNow = true;
                  }
              } else if (value){
                  if (value === "true") {
                      value = true;
                  }
                  if (value === "false") {
                      value = false;
                  }
                  if (secondKey) {
                      pattern[firstKey][secondKey] = value;
                  } else {
                      pattern[firstKey] = value;
                  }
              }
          }
          targetArray.push(pattern);
      });
      return targetArray;
  };
  
  var parseDataReverse = function(data) {
      var targetObject = {};
      for(var i in data) {
          var value = data[i];
          if (typeof value === "object") {
               for(var j in value) {
                   var secondValue = value[j];
                   if (typeof secondValue === "object") {
                       //Date!!
                       if (secondValue.tillNow) {
                           targetObject[i + "." + j] = new Date(1900, 0, 1);
                       } else {
                           var day = secondValue.day === "" ? 1 : secondValue.day;
                           targetObject[i + "." + j] = new Date(secondValue.year, secondValue.month - 1, day);
                       }
                   } else {
                       targetObject[i + "." + j] = secondValue;
                   }
              }
          } else {
              targetObject[i] = value;
          }
      }
      return targetObject;
  };
  
  var PersonalInfo = function() {
    var me = this;
    BaseClass.call(me);

    me.SERVICENAME = "personalinfoService";

    var ajaxParam = {
        url: "/service-proxy/member/bplus-profile-all",
        type: "get",
        dataType: "json"
    };
    
    me.PATTERN = {
      "education" : education,
      "skill": skill,
      "memberExt": memberExt,
      "communityExperience": communityExperience,
      "workExperience": workExperience,
      "archivement": archivement,
      "languageSkill": languageSkill
    };
    me.SERVICES = {
      "bpluspersonalinfooverall": "memberExt",
      "bplusskillsoverall": "skill",
      "bpluseducationbackgroundall": "education",
      "bplusclubexperienceall": "communityExperience",
      "bplusworkexperienceall": "workExperience",
      "bplusawardall": "archivement",
      "bpluslanguageall": "languageSkill"
    };
    me.REOURCE = {
        //Language
        "certification": "englishlevel",
        "proficiency": "langguageproficiency",
        "language": "language",
        //Edu
        "background": "qualifications",
        //Community
        "position": "communityposition",
        //Work
        "type": "worktype",
        "industry": "industry",
        "job": "job",
        //MemberExt
        "gender": "gender"
    };
    me.rawdata = {};
    me.getRawData = function(dataKey, dataParam, forceUpdate) {
        if (forceUpdate || !_data) {
            if (!_getDataPromise) {
                _getDataPromise = $.ajax(ajaxParam);
            }
            return _getDataPromise.then(function(data) {
                _getDataPromise = null;
                if (data && data.isSuccess) {
                    _data = data.result;
                    return parseData(_data[dataKey], me.getPattern(dataKey)); 
                } else {
                    return when.reject("bplus-profile-all fails!");
                }
            });
        } else {
            return when(parseData(_data[dataKey], me.getPattern(dataKey))); 
        }
    };
    me.updateData = function(dataKey, dataParam){
        var key = dataKey;
        var method = "add";
        if (dataKey === "memberExt" || dataParam.id !== "") {
            method = "update";
        }
        var data = parseDataReverse(dataParam);
        var param = {
            url: "/service-proxy/member/" + key + "/" + method,
            type: "post",
            dataType: "json",
            data: data
        };
        return $.ajax(param);
    };

    me.deleteData = function(dataKey, dataParam) {
        var data = {
            id: dataParam.id
        };
        var param = {
            url: "/service-proxy/member/" + dataKey + "/delete",
            type: "post",
            dataType: "json",
            data: data
        };
        return $.ajax(param);
    };
  };
  
  PersonalInfo.prototype = Object.create(BaseClass.prototype);
  PersonalInfo.prototype.constructor = PersonalInfo;

  return PersonalInfo;
});