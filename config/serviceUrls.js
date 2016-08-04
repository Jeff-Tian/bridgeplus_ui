function recent(parent) {
    parent.recent = {
        frontEnd: parent.frontEnd + '/recent',
        abbr: parent.abbr + '/recent',
        upstream: parent.upstream + '/recent',
        dataMapper: parent.dataMapper
    };
}

var serviceUrls = {
    "logOnFromWechat": "/service-proxy/logon/from-wechat",
    "logOnByToken": "/service-proxy/logon/by-token",
    "checkNationalGame2015OrderPayment": "/service-proxy/payment/create-order/national-game-2015/check-has-right",
    "logOnAuthenticate": "/service-proxy/logon/authentication",
    "wechatJsApiConfig": "/service-proxy/wechat/js-api-config",
    "loadGameSeries": "/cmpt/game/series/load/:seriesId",
    "createOrderAndPayByWechat": "/service-proxy/payment/create-order/:option/by-wechat",
    "createOrderAndPayByAlipay": "/service-proxy/payment/create-order/:option/by-alipay",
    createUpsellOrderByAlipay: '/service-proxy/payment/create-upsell-order/by-b_alipay',
    "createOrderAndPayByRedemptionCode": "/service-proxy/payment/create-upsell-order/by-redemption-code",
    "createStoreOrderAndPayByRedemptionCode": "/service-proxy/payment/create-store-order/by-redemption-code",
    "getMyOrderList": "/service-proxy/commerce/get-my-order-list",
    getOrderDetail: '/service-proxy/commerce/get-order-detail/:orderId',
    getMyProductList: '/service-proxy/member/get-my-product-list',
    getUnusedProducts: '/service-proxy/member/get-my-unused-products',
    getUsedProducts: '/service-proxy/member/get-my-used-products',
    getOfferInfo: '/service-proxy/commerce/get-offer-info',
    searchOffer: '/service-proxy/commerce/search-offer',
    bbcoinBalance: '/service-proxy/usercenter/bbcoin-balance',
    bbcoinExchange: '/service-proxy/usercenter/bbcoin-exchange',

    studyCenter: {
        classBooking: {
            booked: '/service-proxy/study-center/class-booking/booked',
            coming: '/service-proxy/study-center/class-booking/coming',
            unevaluated: '/service-proxy/study-center/class-booking/unevaluated',
            evaluated: '/service-proxy/study-center/class-booking/evaluated',
            cancel: '/service-proxy/study-center/class-booking/cancel'
        },
        my: {
            favorite: {
                teachers: '/service-proxy/study-center/my/favorite/teachers'
            }
        },
        teacher: {
            latestCourses: '/service-proxy/study-center/teacher/latest-courses/:teacherId',
            feedback: '/service-proxy/study-center/teacher/feedback'
        },
        classFeedback: '/service-proxy/study-center/class-feedback/:feedbackId'
    },

    corp: {
        member: {
            register: '/corp-service-proxy/member/register',
            login: '/corp-service-proxy/member/login',
            uploadLicense: '/corp-service-proxy/member/upload-license',
            uploadProfile: '/corp-service-proxy/member/upload-profile',
            basicInfo: '/corp-service-proxy/member/basic-info',
            signOut: '/corp-service-proxy/member/sign-out',
            profile: '/corp-service-proxy/member/profile',
            ssoInfo: '/corp-service-proxy/member/sso-profile',
            changePassword: '/corp-service-proxy/member/change-password',
            changeMobile: '/corp-service-proxy/member/change-mobile'
        },
        account: {
            coupon: '/corp-service-proxy/account/coupon'
        },
        company: {
            hasJobRecommend: '/corp-service-proxy/company/hasJobRecommend'
        },
        jobapply: {
            publishedPositions: '/corp-service-proxy/jobapply/publishedPositions',
            todo: '/corp-service-proxy/jobapply/todo',
            dropCandidate: '/corp-service-proxy/jobapply/dropCandidate',
            markCandidate: '/corp-service-proxy/jobapply/markCandidate'
        },
        candidate: {
            resume: '/corp-service-proxy/candidate/resume',
            dropPotential: '/corp-service-proxy/candidate/dropPotential',
            restorePotential: '/corp-service-proxy/candidate/restorePotential',
            dropped: '/corp-service-proxy/candidate/dropped',
            jobstatus: '/corp-service-proxy/candidate/jobstatus',
            potential: '/corp-service-proxy/candidate/potential'
        },
        job: {
            publish: '/corp-service-proxy/job/publish',
            offline: '/corp-service-proxy/job/offline',
            save: '/corp-service-proxy/job/save',
            drop: '/corp-service-proxy/job/drop',
            search: '/corp-service-proxy/job/search'
        },
        recommend: {
            smart: '/corp-service-proxy/recommend/smart',
            champion: '/corp-service-proxy/recommend/champion',
            markCandidate: '/corp-service-proxy/recommend/markCandidate'
        },
        talent: {
            save: '/corp-service-proxy/talent/save',
            assignJob: '/corp-service-proxy/talent/assignJob',
            search: '/corp-service-proxy/talent/search'
        },
        resource: {
            qualifications: '/corp-service-proxy/resource/qualifications',
            worktype: '/corp-service-proxy/resource/worktype',
            communityposition: '/corp-service-proxy/resource/communityposition',
            language: '/corp-service-proxy/resource/language',
            langguageproficiency: '/corp-service-proxy/resource/langguageproficiency',
            englishlevel: '/corp-service-proxy/resource/englishlevel',
            industry: '/corp-service-proxy/resource/industry',
            salarytype: '/corp-service-proxy/resource/salarytype',
            job: '/corp-service-proxy/resource/job'
        },
        resources: {
            tags: '/corp-service-proxy/resources/tags/:query?',
            industry: '/corp-service-proxy/resources/industry/:query?',
            corpScales: '/corp-service-proxy/resources/corpscale/:query?',
            natureOfFirms: '/corp-service-proxy/resources/nature-of-firms/:query?'
        },
        sms: {
            sendWithoutCaptcha: '/corp-service-proxy/sms/send-without-captcha',
            sendWithCaptcha: '/corp-service-proxy/sms/send-with-captcha'
        }
    },

    general: {
        sms: {
            send: '/service-proxy/sms/send'
        }
    },

    linkedIn: {
        oauth: {
            frontEnd: '/service-proxy/linked-in/oauth-logon',
            serverSide: '/oauth/linkedin/logon'
        },
        bindMobile: {
            frontEnd: '/service-proxy/linked-in/bind-mobile',
            serverSideStep1: '/logon/authentication',
            serverSideStep2: '/profile/updateFrom3rdParty'
        },
        logonByToken: {
            frontEnd: '/service-proxy/linked-in/logon-by-token'
        }
    },

    userCenter: {
        bbCoin: {
            frontEnd: '/service-proxy/user-center/bbcoin',
            abbr: '/bbcoin',
            upstream: '/service/bbcoin/load'
        },
        myProducts: {
            frontEnd: '/service-proxy/user-center/my-products',
            abbr: '/my-products',
            upstream: '/service/myproductStatus'
        },
        bbCoinHistory: {
            frontEnd: '/service-proxy/user-center/bbcoin-history',
            abbr: '/bbcoin-history',
            upstream: '/service/bbcoinHistory/load'
        },
        productUsageHistory: {
            frontEnd: '/service-proxy/user-center/product-usage-history',
            abbr: '/product-usage-history',
            upstream: '/service/myproductHistory/search',
            dataMapper: function (d) {
                d.userId = d.member_id;

                return d;
            }
        }
    },
    commerceCenter: {
        orderHistory: {
            frontEnd: '/service-proxy/commerce-center/order-history',
            abbr: '/order-history',
            upstream: '/service/orderList/paidList',
            dataMapper: function (d) {
                d.userId = d.member_id;
                d.type = 'cash';
                return d;
            }
        },
        redemptionHistory: {
            frontEnd: '/service-proxy/commerce-center/redemption-history',
            abbr: '/redemption-history',
            upstream: '/service/orderList/paidList',
            dataMapper: function (d) {
                d.userId = d.member_id;
                d.type = 'redemption';
                return d;
            }
        }
    },
    cmsService: {
        getContentByKey: {
            frontEnd: '/service-proxy/cms/get/:key',
            abbr: '/get/:key',
            upstream: '/service/cmsContent/:key'
        }
    }
};

recent(serviceUrls.userCenter.bbCoinHistory);
recent(serviceUrls.commerceCenter.orderHistory);
recent(serviceUrls.commerceCenter.redemptionHistory);

module.exports = serviceUrls;