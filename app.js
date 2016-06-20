'use strict';
var express = require('express');
var path = require('path');
var app = express()
    .set('views', __dirname + '/views')
    .set('view engine', 'jade')
    .use(express.static(path.join(__dirname, '/public')))
    .use('/bower/bridgeplus_ui/public/', express.static(path.join(__dirname, '/public')))
    .use(require('./routes'))
    .use(function(req, res, next) {
        res.status(200).json({
            isSuccess: false,
            code: 404,
            message: 'Not Found'
        });
    })
    .use(function(err, req, res, next) {
        res.status(200).json({
            isSuccess: false,
            code: err.code || 500,
            message: err.message || 'Server Error'
        });
    })
    .listen(13000);
console.log('listen on port 13000');