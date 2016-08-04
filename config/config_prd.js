var path = require('path');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config_prd.json'), 'utf-8'));

if (process.env.DATACENTER) {
    config.captcha.host = process.env.DATACENTER + '-' + config.captcha.host;
    config.payment.public.host = process.env.DATACENTER + 'bp-' + config.payment.public.host;
    config.service_upload = "//" + process.env.DATACENTER + '-' + config.upload.public.host + ":" + config.upload.public.port;
}
config.bplusServiceParams = require("./config_bplusService");
config.cdn.version = config.version + "_" + config.date;

if (process.env.IS_QA && /^true$/i.test(process.env.IS_QA.toString())) {
    config.cdn.normal = config.cdn.normal.replace('//cdn', '//qa-cdn');
}

module.exports = config;