var md = {
    isFromMobile: function (ua) {
        return /mobile/i.test(ua);
    },

    isFromWechatBrowser: function (ua) {
        return /MicroMessenger/i.test(ua);
    },

    isFromAndroid: function (ua) {
        return /android/i.test(ua);
    },

    isFromPad: function (ua) {
        return /nexus/i.test(ua);
    }
};

md.isRequestFromMobileOrPad = function (req) {
    var ua = req.headers['user-agent'];
    return md.isFromMobile(ua) || md.isFromPad(ua);
};

module.exports = md;