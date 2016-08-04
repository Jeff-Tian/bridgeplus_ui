define([
], function() {
    return function(agModle) {
        agModle.service('uploadHandlerService', function() {
            this.handle = {};
            window.upload_callback = (function(json) {
                if (json.isSuccess) {
                    var result = JSON.parse(json.result),
                        handler = this.handle[result['x:category']];
                    if (handler) {
                        handler(result);
                    }
                }
            }).bind(this);
        });
    };
});