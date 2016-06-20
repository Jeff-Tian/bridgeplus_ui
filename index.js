var pages = require('./util/page');

module.exports = {
    render: function(lang, page, req, res, next) {
        if (!(lang == 'zh' || lang == 'en')) {
            return next();
        }
        page = page.toLowerCase();
        var page_info = pages[page][lang];
        if (!page_info) {
            return next();
        }
        res.render('portal/' + lang + '/' + page, {
            page: page,
            lang: lang,
            page_info: page_info
        });
    }
};