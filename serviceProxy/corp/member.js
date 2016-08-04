var proxy = require('../proxy');
var leaveTrimmer = require('../../utils/leaveTrimmer');
var config = require('../../config');
var corpServiceUrls = leaveTrimmer.trim(config.serviceUrls.corp, '/corp-service-proxy/member');
var membership = require('../membership');
var sso = require('../sso');

function handleFiles(req, res, next) {
    req.files = {};

    req.busboy.on('file', function (fieldName, file, fileName, encoding, mimeType) {
        if (!fileName) {
            return;
        }

        file.fileRead = [];

        console.log('uploading: ', fileName);
        console.log(file);
        file.on('data', function (data) {
            console.log('File [' + fieldName + '] got ' + data.length + ' bytes');
            file.fileRead.push(data);
        });

        file.on('end', function () {
            var finalBuffer = Buffer.concat(this.fileRead);

            req.files[fieldName] = {
                buffer: finalBuffer,
                size: finalBuffer.length,
                filename: fileName,
                mimetype: mimeType
            };

            console.log('File [' + fieldName + '] Finished');
        });
    });

    req.busboy.on('field', function (key, value, keyTruncated, valueTruncated) {
        console.log(key, '=', value);
        req.body[key] = value;
    });

    req.busboy.on('finish', function () {
        console.log('busboy finish');
        next();
    });

    return req.pipe(req.busboy);
}

function passFile(req, res, next) {
    req.body.file = req.files.file;
    next();
}

function uploadToBucket(req, res, next) {
    return proxy({
        host: config.upload.inner.host,
        port: config.upload.inner.port,
        path: '/upload/bplus-corp-resource',
        method: 'PUT',
        headers: {
            'Content-Type': 'multipart/form-data; boundary=' + Math.random().toString(16)
        },
        responseInterceptor: function (originalRes, upstreamJson, originalReq, next) {
            originalRes.json({
                isSuccess: true,
                result: upstreamJson
            });

            return undefined;
        }
    })(req, res, next);
}

module.exports = require('express').Router()
    .put(corpServiceUrls.member.register, require('../captcha').validate, proxy.proxyBPlus({
        path: '/corp/member/register',
        method: 'POST'
    }))
    .post(corpServiceUrls.member.login, proxy.proxyBPlus({
        path: '/corp/member/logon',
        method: 'POST',
        responseInterceptor: function (originalResponse, upstreamJson, originalRequest, next) {
            var sso = require('../sso.js');

            if (upstreamJson.isSuccess) {
                sso.setAuthToken(originalResponse, upstreamJson.result.token, originalRequest.body.remember, upstreamJson.result.member_id);

                var cookieSetting = {
                    expires: 0,
                    path: '/',
                    httpOnly: false
                };

                originalResponse.cookie('corp_id', upstreamJson.result.company.company_id, cookieSetting);
                originalResponse.cookie('corp_status', upstreamJson.result.company.status, cookieSetting);

                if (sso.jumpToReturnUrl(originalRequest, originalResponse)) {
                    return undefined;
                }
            }

            return false;
        }
    }))
    .put(corpServiceUrls.member.uploadProfile, handleFiles, passFile, uploadToBucket)
    .put(corpServiceUrls.member.uploadLicense, handleFiles, passFile, uploadToBucket)
    .post(corpServiceUrls.member.basicInfo, function (req, res, next) {
        req.body.mobile = req.body.contact_mobile;

        next();
    }, require('../sms').validate, proxy.proxyBPlus({
        path: '/corp/member/savebasic',
        method: 'POST'
    }))
    .get(corpServiceUrls.member.basicInfo, membership.ensureAuthenticated, function (req, res, next) {
        req.body.company_id = req.query.company_id;
        next();
    }, proxy.proxyBPlus({
        path: '/corp/member/loadbasic',
        method: 'POST'
    }))
    .get(corpServiceUrls.member.profile, membership.ensureAuthenticated, function (req, res, next) {
        proxy.proxyBPlus({
            path: '/corp/company/load/' + req.query.company_id,
            method: 'GET'
        })(req, res, next);
    })
    .post(corpServiceUrls.member.profile, membership.ensureAuthenticated, proxy.proxyBPlus({
        path: '/corp/company/save',
        method: 'POST'
    }))
    .get(corpServiceUrls.member.ssoInfo, membership.ensureAuthenticated, membership.loadProfile)
    .delete(corpServiceUrls.member.signOut, require('../sso').createLogoutProcessor(function (req, res, next) {
        var deleteCookieOption = {
            expires: new Date(Date.now() - (1000 * 60 * 60 * 24 * 365)),
            path: '/',
            httpOnly: true
        };

        res.cookie('corp_id', '', deleteCookieOption);
        //res.cookie('corp_status', '', deleteCookieOption);
    }))
    .post(corpServiceUrls.member.changePassword, membership.ensureAuthenticated, proxy.proxyBPlus({
        path: '/corp/member/changepassword',
        method: 'POST'
    }))
    .post(corpServiceUrls.member.changeMobile, membership.ensureAuthenticated, proxy.proxyBPlus({
        path: '/corp/company/save',
        method: 'POST'
    }))
;
