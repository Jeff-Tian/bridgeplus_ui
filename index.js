'use strict';
var express = require('express'),
    bodyParser = require('body-parser');
express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    })).use(express.static(__dirname + '/public', {
        dotfiles: 'ignore',
        etag: true,
        extensions: false,
        index: 'index.html',
        lastModified: true,
        maxAge: 1000 * 3600 * 24 * 30,
        redirect: true,
        setHeaders: function(res, path) {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
    }))
    .listen(3000);
console.log('app listening on port %d', 3000);