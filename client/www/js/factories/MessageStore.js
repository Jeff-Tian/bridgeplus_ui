(function (exports) {
    exports.MessageStore = function () {
        var store = {
            getFromStorage: function (key) {
                return JSON.parse(window.localStorage.getItem(key));
            },

            saveToStorage: function (key, value) {
                if (!value) {
                    window.localStorage.removeItem(key);
                    return;
                }

                window.localStorage.setItem(key, JSON.stringify(value));
            }
        };

        var localStorageFactory = {
            create: function (key) {
                return {
                    get: function () {
                        return store.getFromStorage(key);
                    },

                    set: function (value) {
                        store.saveToStorage(key, value);
                    },

                    destroy: function () {
                        this.set(null);
                    },

                    flash: function () {
                        var m = this.get();

                        this.destroy();

                        return m;
                    }
                };
            }
        };

        return localStorageFactory.create('message_store');
    };

    exports.MessageStore.$inject = ['$http', '$q'];
})(angular.bplus = angular.bplus || {});