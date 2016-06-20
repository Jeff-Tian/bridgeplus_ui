var path = require('path');

module.exports = function(app, express) {
    return app
        .use(express.static(path.join(__dirname, 'public')))
        .use('/bower/bridgeplus_ui/public/', express.static(path.join(__dirname, 'public')))
        .use('/', require('./routes')(express));
};