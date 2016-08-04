var http = require('http');

/**
 * make a proxy delegate with less options
 * @param req
 * @param res
 * @param next
 * @param host
 * @param port
 * @param requestPath
 * @param map: the mapper function to tweak the passing data
 * @returns {Function|*}
 */
function basicProxy(req, res, next, host, port, requestPath, map) {
    return advancedProxy(req, res, next, {
        host: host,
        port: port,
        path: requestPath,
        dataMapper: map
    });
}

/**
 * make a proxy delegate with more options
 * @param req
 * @param res
 * @param next
 * @param settings
 *          {
 *              // Note: the upstream response stream is not used, the first argument is the original
 *              // response object, i.e., the res
 *              responseInterceptor: function (originalResponse, upstreamJson, originalRequest, next) {}
 *          }
 */
function advancedProxy(req, res, next, settings) {
    var options = {
            hostname: settings.host,
            port: settings.port || '80',
            path: settings.path || req.originalUrl,
            method: settings.method || req.method,
            headers: settings.headers || {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        },

        chunks = []
        ;

    req.dualLog('proxying...');
    req.dualLog(options);
    req.dualLog('data: ');
    req.dualLog(req.body);
    req.dualLog('req original url');
    req.dualLog((req.headers['origin'] || req.headers['host']) + req.originalUrl);

    var request = http.request(options, function (response) {
        if (typeof settings.responseInterceptor === 'function') {
            response.on('data', function (c) {
                chunks.push(c);
            });

            response.on('end', function () {
                chunks = Buffer.concat(chunks);

                try {
                    chunks = JSON.parse(chunks.toString());
                } catch (e) {
                    req.dualLogError('Error while trying to parse JSON from: ');
                    req.dualLogError(chunks.toString());
                    req.dualLogError(e.stack);
                    return next(e);
                }

                req.dualLog('response got from: ' + options.hostname + ':' + options.port + options.path);
                req.dualLog(chunks);

                var continueNext = settings.responseInterceptor(res, chunks, req, next);

                if (continueNext === true) {
                    req.chunks = chunks;
                    next();
                } else if (continueNext === false) {
                    res.send(chunks);
                }
            });

            response.on('error', function (err) {
                req.dualLogError('Server response error in this request: ' + JSON.stringify(options));
                req.dualLogError('The detail error info is ' + JSON.stringify(err));

                next(err);
            });
        } else {
            res.writeHead(response.statusCode, response.headers);
            response.pipe(res);
        }
    });

    request.on('error', function (err) {
        req.dualLogError('Error met in this request: ' + JSON.stringify(options));
        req.dualLogError(err);

        next(err);
    });

    if (typeof settings.requestInterceptor === 'function') {
        settings.requestInterceptor(req, request);
    } else {
        if (options.method !== 'GET') {
            var data = req.body;

            if (typeof settings.dataMapper === 'function') {
                data = settings.dataMapper(data, req);
            }

            if (data) {
                var multipartFlag = 'multipart/form-data; boundary=';
                var contentType = options.headers['Content-Type'];

                if (contentType.indexOf(multipartFlag) < 0) {
                    req.dualLog('proxying data: ' + JSON.stringify(data));
                    request.write(JSON.stringify(data));
                } else {
                    req.dualLog('Posting data...');
                    var boundaryKey = contentType.replace(multipartFlag, '').replace('"', '');
                    request.setHeader('Content-Type', multipartFlag + '"' + boundaryKey + '"');

                    for (var p in data) {
                        console.log('typeof ' + p + ' is: ');
                        console.log(typeof data[p]);

                        if (data[p] instanceof Object && data[p].buffer) {
                            request.write(
                                '--' + boundaryKey + '\r\n'
                                + 'Content-Disposition: form-data; name="' + p + '"; filename="' + data[p].filename + '"\r\n'
                                + 'Content-Type: ' + data[p].mimetype + '\r\n\r\n'
                            );
                            request.write(data[p].buffer);
                        } else {
                            request.write(
                                '--' + boundaryKey + '\r\n'
                                + 'Content-Disposition: form-data; name="' + p + '";' + '\r\n\r\n'
                            );
                            request.write(data[p]);
                        }

                        request.write('\r\n');
                    }

                    request.write('--' + boundaryKey + '--');
                }
            } else {
                req.dualLog('proxying with no data.');
            }
        }
    }

    request.end();
}

/**
 * make a proxy delegate
 * @param options
 * @returns {Function}
 */
function proxy(options) {
    var args = arguments;

    return function (req, res, next) {
        if (typeof options === 'object' && !!options) {
            advancedProxy.apply(this, [req, res, next, options]);
        } else {
            basicProxy.apply(this, [req, res, next, args[0], args[1], args[2], args[3]]);
        }
    };
}

/**
 * execute a proxy request immediately
 * @param req
 * @param res
 * @param next
 * @param options
 */
proxy.execute = function (req, res, next, options) {
    advancedProxy(req, res, next, options);
};

proxy.proxyBPlus = function (options) {
    return function (req, res, next) {
        var config = require('../config');

        options.host = config.bplusService.host;
        options.port = config.bplusService.port;

        proxy(options)(req, res, next);
    };
};

module.exports = proxy;

