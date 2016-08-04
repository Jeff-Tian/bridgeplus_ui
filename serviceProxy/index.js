var sms = require('./sms'),
    captcha = require('./captcha'),
    sso = require('./sso'),
    mail = require('./mail'),
    membership = require('./membership'),
    bplusService = require('./bplusService'),
    wechat = require('./wechat'),
    commerceService = require('./commerceService'),
    usercenterService = require('./usercenter'),
    productService = require('./productService'),
    uploadCallbackService = require('./uploadCallbackService'),
    infomationService = require('./informationService'),
    config = require('../config'),
    leaveTrimmer = require('../utils/leaveTrimmer')
    ;

var serviceUrls = leaveTrimmer.trim(config.serviceUrls, '/service-proxy');

module.exports = require('express').Router()
    .use(function (req, res, next) {
        req.dualLog('service-proxy is being calling as ' + req.method + ' from this host: ' + req.hostname + '...');
        req.dualLog((req.headers['origin'] || '') + req.originalUrl);

        next();
    })
    .use('/study-center', require('./study-center.js'))
    .use('/linked-in', require('./linked-in'))
    .use('/user-center', require('./user-center'))
    .use('/cms', require('./cms'))
    .use('/commerce-center', require('./commerce-center'))
    .post(serviceUrls.general.sms.send, captcha.validate, sms.getVerificationCode)
    .post('/member/register', sms.validate, sso.signUp)
    .post('/member/change-mobile', membership.ensureAuthenticated, sms.validate, sso.authenticateCurrentUser, sso.changeMobile)
    .post('/member/bind-mobile', membership.ensureAuthenticated, sms.validate, sso.changeMobile)
    .post('/member/bind-mobile-by-password', sso.authenticate /* TODO : Bind wechat to member account  */)
    .post('/member/change-email', membership.ensureAuthenticated, sso.changeEmail)
    .post('/member/change-password', membership.ensureAuthenticated, sso.authenticateCurrentUser, sso.changePassword)
    .post('/member/update-sso-profile', membership.ensureAuthenticated, sso.updateProfile)
    .post('/member/update-profile', membership.ensureAuthenticated, bplusService.updateProfile)
    .post('/member/save-interests', membership.ensureAuthenticated, bplusService.saveInterests)
    .post('/member/get-setting', bplusService.getSetting)
    .post('/member/add-education', membership.ensureAuthenticated, bplusService.dataSanitanze, bplusService.dataValidate, bplusService.addEducation)
    .post('/member/update-education', membership.ensureAuthenticated, bplusService.dataSanitanze, bplusService.dataValidate, bplusService.updateEducation)
    .post(serviceUrls.logOnAuthenticate, sso.authenticate)
    .post(serviceUrls.logOnByToken, sso.delegateSetAuthToken)
    .post('/member/resetPassword', sms.validate, sso.resetPassword)
    .post('/member/resetPasswordByEmail', sso.resetPasswordByEmail)
    .post('/mail/send', captcha.validate, sso.getMailToken, mail.tokenCheck, mail.send)
    .post('/mail/send-verification', sso.getMailVerificationToken, mail.tokenCheck, mail.sendVerification)
    .get('/member/profile', membership.loadProfile)
    .get('/member/bplus-profile', membership.ensureAuthenticated, bplusService.loadProfile)
    .get('/member/bplus-profile-all', membership.ensureAuthenticated, bplusService.loadProfileAll)
    .post('/member/:classification/:operation', membership.ensureAuthenticated, bplusService.updateData)
    .post('/logon/logout', sso.logout)
    .post('/logon/by-wechat', wechat.qrLogon)
    .post(serviceUrls.logOnFromWechat, wechat.oAuthLogon)
    .post('/bind-wechat', wechat.bind)
    .get('/bplus-resource/:resourceKey/:language', bplusService.getResource)
    .get('/bplus-resource-location/', bplusService.getResourceLocation)
    .get('/bplus-resource-location/:locationID', bplusService.getResourceLocation)
    .get('/bplus-opd/load/:operation/:member_id', bplusService.getOpdOperation)
    // .post('/bplus-opd/update/:operation', bplusService.updateOpdOperation)
    .post('/bplus-opd/jobsearch', bplusService.searchJobs)
    .post('/bplus-opd/jobdetail', bplusService.jobDetail)
    .post('/bplus-opd/companydetail', bplusService.companyDetail)
    .post('/bplus-opd/hotjob', bplusService.hotJobs)
    .post('/bplus-opd/recommendjob', bplusService.recommendJobs)
    .post('/bplus-opd/subscription/:operation', bplusService.subscription)
    .post('/bplus-opd/favoritejob/:operation', bplusService.favoriteJobs)
    .post('/bplus-opd/deliveredjob/:operation', bplusService.deliveredJobs)
    .get('/upload/callback', uploadCallbackService)
    .get('/info/ranking/:type/:target/:count', infomationService)
    .post('/payment/create-order/national-upsell-:option/by-b_alipay', membership.ensureAuthenticated, commerceService.createOrder)
    .post(serviceUrls.createOrderAndPayByWechat, membership.ensureAuthenticated, commerceService.checkUserAccessAndGenerateRedemptionCodeIfHasRight, commerceService.createOrderByWechat)
    .post(serviceUrls.createOrderAndPayByAlipay, membership.ensureAuthenticated, commerceService.checkUserAccessAndGenerateRedemptionCodeIfHasRight, commerceService.createOrder)
    .post(serviceUrls.createUpsellOrderByAlipay, membership.ensureAuthenticated, commerceService.createOrder)
    .post(serviceUrls.createOrderAndPayByRedemptionCode, membership.ensureAuthenticated, commerceService.createUpSellOrderByRedemptionCode)
    .post(serviceUrls.createStoreOrderAndPayByRedemptionCode, membership.ensureAuthenticated, commerceService.createStoreOrderAndPayByRedemptionCode)
    .post(serviceUrls.checkNationalGame2015OrderPayment,
        membership.ensureAuthenticated,
        commerceService.checkUserAccessForNationalGame2015,
        commerceService.checkUserAccessForNationalGame2015Middle,
        commerceService.checkUserAccessForNationalGame2015Economy,
        commerceService.checkUserAccessForRepechages2015,
        commerceService.checkUserAccessForRepechages2015Middle,
        commerceService.checkUserAccessForRepechages2015Economy, function (req, res, next) {
            res.send(req.chunks);
        })
    .post(serviceUrls.wechatJsApiConfig, wechat.getJsApiConfig)

    .post(serviceUrls.getMyOrderList, membership.ensureAuthenticated, commerceService.getMyOrderList)
    .get(serviceUrls.getOrderDetail, membership.ensureAuthenticated, commerceService.getOrderDetail)
    .post(serviceUrls.getMyProductList, membership.ensureAuthenticated, productService.getMyProductList)
    .post(serviceUrls.getUnusedProducts, membership.ensureAuthenticated, productService.getMyUnusedProducts)
    .post(serviceUrls.getUsedProducts, membership.ensureAuthenticated, productService.getMyUsedProducts)

    .post(serviceUrls.getOfferInfo, commerceService.getOfferInfo)
    .post(serviceUrls.searchOffer, commerceService.searchOffer)
    .post(serviceUrls.bbcoinBalance, membership.ensureAuthenticated, usercenterService.bbcoinBalance)
    .post(serviceUrls.bbcoinExchange, membership.ensureAuthenticated, usercenterService.bbcoinExchange)
;