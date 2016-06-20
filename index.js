"use strict";
var fs = require('fs');
var pages = require('./util/page');

module.exports = {
    render: function(lang, page, jade, req, res, next) {
        if (!(lang == 'zh' || lang == 'en')) {
            return next();
        }
        page = page.toLowerCase();
        var page_info = pages[page][lang];
        if (!page_info) {
            return next();
        }
        res.render(__dirname + '/views/portal/' + lang + '/' + page + '.jade', {
            page: page,
            lang: lang,
            title: page_info.title,
            locals: res.locals
        }));
    }
};