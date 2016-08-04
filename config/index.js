var config = {};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
    config = require('./config_dev.js');
} else if (process.env.NODE_ENV === 'prd') {
    if (!(process.env.RUN_FROM === 'local')) {
        config = require('./config_prd.js');
    } else {
        config = require('./config_dev.js');
    }
} else if (process.env.NODE_ENV === 'uat') {
    config = require('./config_uat.js');
} else {
    config = require('./config_prd.js.');
}

config.cdn.cdnify = function (resource) {
    return config.cdn.normal + resource + '?' + config.cdn.version;
};

config.serviceUrls = require('./serviceUrls.js');

module.exports = config;