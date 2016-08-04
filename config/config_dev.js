var fs = require('fs');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config_dev.json'), 'utf-8'));
config.bplusServiceParams = require("./config_bplusService");
config.cdn.version = config.version + "_" + config.date;
config.service_upload = "//" + config.upload.public.host + ":" + config.upload.public.port;
module.exports = config;