"use strict";
var fs = require('fs');
var pages = require('./util/page');
//for not dev environment, cache all the compiled templates
var useCache = ('dev' !== (process.env.NODE_ENV || 'dev'));
var tplCache = {};

function compileTpl(jade, file) {
    var content = fs.readFileSync(file, 'utf-8');
    return jade.compile(content, {
        basedir: __dirname,
        filename: file
    });
}

function getTplFn(jade, file) {
    var fn;
    if (useCache) {
        fn = tplCache[file];
        if (!fn) {
            fn = compileTpl(jade, file);
            tplCache[file] = fn;
        }
    } else {
        fn = compileTpl(jade, file);
    }
    return fn;
}

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
        var fn = getTplFn(jade, __dirname + '/views/portal/' + lang + '/' + page + '.jade');
        res.send(fn({
            page: page,
            lang: lang,
            title: page_info.title,
            locals: res.locals
        }));
    }
};