function logErrors(err, req, res, next) {
    req.logger.error(err);
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (!req.xhr) {
        return next(err);
    }

    req.dualLogError(err);
    res.status(500).send({isSuccess: false, code: '500', message: 'Something blew up!'});
}

module.exports = {
    handleError: function (server) {
        server.use(logErrors);
        server.use(clientErrorHandler);
    }
};