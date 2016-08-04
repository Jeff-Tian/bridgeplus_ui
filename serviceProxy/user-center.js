var config = require('../config');
var proxyTo = require('./proxyTo');
var router = require('express').Router();

function dataMapper(d) {
    d.userId = d.member_id;
    return d;
}

config.userCenterService.inner.dataMapper = dataMapper;

proxyTo.proxyGetToPost(router, config.serviceUrls.userCenter.bbCoin, config.userCenterService.inner);
proxyTo.proxyGetToPost(router, config.serviceUrls.userCenter.myProducts, config.userCenterService.inner);
proxyTo.proxyPostToPost(router, config.serviceUrls.userCenter.bbCoinHistory, config.userCenterService.inner);
proxyTo.proxyPostToPost(router, config.serviceUrls.userCenter.bbCoinHistory.recent, config.userCenterService.inner);
proxyTo.proxyPostToPost(router, config.serviceUrls.userCenter.productUsageHistory, config.userCenterService.inner);

module.exports = router;