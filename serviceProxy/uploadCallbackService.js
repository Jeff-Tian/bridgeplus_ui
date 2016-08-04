module.exports = function(req, res, next) {
    var data = {
        isSuccess: true,
        code: 30000,
        result: '',
        message: ''
    };

    var upload_ret = req.query.upload_ret;
    if (upload_ret) {
        try {
            data.result = new Buffer(upload_ret, 'base64').toString('utf-8');
        } catch (e) {
            data.isSuccess = false;
            data.message = "Can't parse query string from qiniu.";
        }
    } else {
        data.code = req.query.error;
    }

    res.send('<script>\
    try {\
        window.top.window.upload_callback(' +
        JSON.stringify(data) +
        ');\
    } catch (e) {\
        /*window.top.window.console.log(e);*/\
    } </script>');
};