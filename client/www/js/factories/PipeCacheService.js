(function (exports) {
    var dataArray = [];
    var dataObject = {};
    var todoIndex = 0;
    var doingPromise = {};
    var PROMISE_STATUS = {
        PENDING: "pending",
        WORKING: "working",
        DONE: "done",
        INVALID: "invalid"
    };
    var KeyStructure = {
        url: "",
        params: ""
    };
    var INTERVAL_GAP = 500;
    exports.PipeCacheService = function (service, $http, $q) {
        var createPromise = function (paramWithURL) {
            return $http({
                url: paramWithURL.url,
                params: paramWithURL.params,
                method: 'GET'
            }).then(function(ret) {
                if (ret.data && ret.data.isSuccess) {
                    return ret.data.result;
                }
            });
        };
        var findNext = function () {
            var next = dataArray[todoIndex++];
            var nextObject = dataObject[JSON.stringify(next)];
            if (next) {
                if (nextObject && nextObject.status === PROMISE_STATUS.PENDING) {
                    return next;
                } else {
                    return findNext();
                }
            }
        };
        var run = function () {
            setInterval(function () {
                if (Object.keys(doingPromise).length === 0) {
                    var next = findNext();
                    if (next) {
                        getData(next);
                    }
                }
            }, INTERVAL_GAP);
        };
        var addKeyWithStatus = function (paramWithURL, status) {
            dataObject[JSON.stringify(paramWithURL)] = {
                data: {},
                index: dataArray.push(paramWithURL) - 1,
                status: status,
                promise: null
            };
        };
        var getData = function (paramWithURL) {
            var data = dataObject[JSON.stringify(paramWithURL)];
            doingPromise[JSON.stringify(paramWithURL)] = true;
            var promise = createPromise(paramWithURL).then(function (retData) {
                if (data) {
                    data.status = (data.status === PROMISE_STATUS.INVALID) ? PROMISE_STATUS.INVALID : PROMISE_STATUS.DONE;
                    data.promise = null;
                    data.data = retData;
                }
                delete doingPromise[JSON.stringify(paramWithURL)];
                return retData;
            });
            if (data) {
                if (data.status === PROMISE_STATUS.PENDING) {
                    data.status = PROMISE_STATUS.WORKING;
                    data.promise = promise;
                }
            }
            return promise;
        };
        var pipeCacheService = {
            add: function (paramWithURL) {
                var data = dataObject[JSON.stringify(paramWithURL)];
                if (!data) {
                    addKeyWithStatus(paramWithURL, PROMISE_STATUS.PENDING);
                }
            },
            get: function (paramWithURL) {
                var deferred = $q.defer();
                var data = dataObject[JSON.stringify(paramWithURL)];
                doingPromise[JSON.stringify(paramWithURL)] = true;
                var index;
                if (data) {
                    if (data.status === PROMISE_STATUS.DONE) {
                        // data.status = PROMISE_STATUS.INVALID;
                        delete doingPromise[JSON.stringify(paramWithURL)];
                        deferred.resolve(data.data);
                    } else if (data.status === PROMISE_STATUS.WORKING) {
                        deferred.resolve(data.promise);
                    } else {
                        deferred.resolve(getData(paramWithURL));
                    }
                } else {
                    deferred.resolve(getData(paramWithURL));
                }
                return deferred.promise;
            }
        };
        //Start service
        run();

        return pipeCacheService;
    };
    exports.PipeCacheService.$inject = ['service', '$http', '$q'];
})(angular.bplus = angular.bplus || {});