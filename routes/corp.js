var corp = require('express').Router();
var fs = require('fs');
var path = require('path');
var mixedViewEngine = require('./mixedViewEngine');
var config = require('../config/index');
var localeHelper = require('../locales/localeHelper.js');
var membership = require('../serviceProxy/membership.js');

function getRenderer(title, target, ignoreLayout, options) {
    var jadeLayout = ignoreLayout === true ? null : "layout.jade";
    return function (req, res, next) {
        res.locals.title = title + ' -- Bridge+';
        res.locals.cdnify = function (url) {
            if (url[0] === '/') {
                url = url.substr(1);
            }

            return config.cdn.normal + url + '?' + config.cdn.version;
        };

        if (options) {
            for (var p in options) {
                res.locals[p] = options[p];
            }
        }

        mixedViewEngine.render(res, 'corp/' + target + '.jade', jadeLayout, res.locals);
    };
}

function routerFactory(name, title, pipes, ignoreLayout, options) {
    var target = name;

    if (target === '') {
        target = 'index';
    }

    var args = [localeHelper.localePath('/' + name)];

    if (pipes) {
        args = args.concat(pipes);
    }

    args = args.concat([getRenderer(title, target, ignoreLayout, options)]);

    corp.get.apply(corp, args);
}

routerFactory("", '企业首页');
routerFactory("register", '企业注册', membership.ensureAuthenticated);
routerFactory("edit", '修改企业资料', membership.ensureAuthenticated, false, {
    serviceUrls: config.serviceUrls
});
//CV
routerFactory("cv", '简历管理', membership.ensureAuthenticated);
routerFactory("printCV", '简历打印', null, true);
//Find
routerFactory("find", '找人才', membership.ensureAuthenticated);
//Post
routerFactory("jobpost", '发布职位', membership.ensureAuthenticated);
//Setting
routerFactory("setting", '账户管理', membership.ensureAuthenticated);
routerFactory('about-us', '关于我们');
routerFactory('school', '学校合作');
routerFactory('contact-us', '联系我们');
routerFactory('statement', '服务声明');
routerFactory('reset-password-by-email', '通过邮箱找回密码', null, false, {
    legacy: true
});
routerFactory('reset-password', '找回密码', null, false, {
    legacy: true
});
routerFactory('set-password', '重设密码', null, false, {
    legacy: true
});

corp.get(localeHelper.localePath('/signin'), getRenderer('企业登录 - Bridge+', 'index'));
corp.get(localeHelper.localePath('/sign-in'), getRenderer('企业登录 - Bridge+', 'index'));

module.exports = corp;