module.exports = {
    canContinueNextPipe: function (json) {
        return json.isSuccess && json.result;
    }
};