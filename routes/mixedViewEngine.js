var jade = require('jade');
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var localeHelper = require('../locales/localeHelper.js');

function renderMixin(res, jadeTemplate, jadeLayout, data) {
    var o = {
        basedir: '/',
        filename: path.join(__dirname, '/../client/views/', jadeTemplate)
    };

    var contents = fs.readFileSync(__dirname + '/../client/views/' + jadeTemplate, 'utf-8');

    if (jadeLayout) {
        contents = 'extends ' + jadeLayout + '\n' + contents;
    }

    var compiled = jade.compile(contents, o);
    compiled = compiled(data || {});

    o.filename = path.join(__dirname, '/../client/www/view-partial/virtual.html');
    res.send(ejs.render(compiled, res.locals, o));
}

function renderJadeLayoutWithEJSContent(res, ejsTemplate, jadeLayout, data) {
    var o = {
        basedir: '/',
        filename: path.join(__dirname, '/../client/views/virtual-jade.jade')
    };

    var contents = 'block content\r\n\tinclude ' + ejsTemplate;

    if (jadeLayout) {
        contents = 'extends ' + jadeLayout + '\n' + contents;
    }

    var compiled = jade.compile(contents, o);

    for (var p in data) {
        res.locals[p] = data[p];
    }

    compiled = compiled(res.locals || {});

    o.filename = path.join(__dirname, '/../client/www/virtual-file.html');
    res.send(ejs.render(compiled, res.locals, o));
}

module.exports = {
    render: renderMixin,
    renderJadeLayoutWithEJSContent: function (app, url, viewPath, jadeLayout, data) {
        var template = viewPath || url;

        if (template[0] === '/') {
            template = template.substr(1);
        }

        app.get(localeHelper.localePath(url), function (req, res, next) {
            renderJadeLayoutWithEJSContent(res, template, jadeLayout, data);
        });

        return this;
    },
    renderEJS: function (app, url, viewPath) {
        var template = viewPath || url;

        if (template[0] === '/') {
            template = template.substr(1);
        }

        app.get(localeHelper.localePath(url), function (req, res, next) {
            res.render(template);
        });

        return this;
    }
};