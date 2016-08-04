var membership = require('../membership');

module.exports = require('express').Router()
    .use('/member', require('./member'))
    .use('/account', membership.ensureAuthenticated, require('./account'))
    .use('/company', membership.ensureAuthenticated, require('./company'))
    .use('/jobapply', membership.ensureAuthenticated, require('./jobapply'))
    .use('/candidate', membership.ensureAuthenticated, require('./candidate'))
    .use('/talent', membership.ensureAuthenticated, require('./talent'))
    .use('/resource', membership.ensureAuthenticated, require('./resource'))
    .use('/job', membership.ensureAuthenticated, require('./job'))
    .use('/resources', membership.ensureAuthenticated, require('./resources'))
    .use('/recommend', require('./recommend'))
    .use('/sms', require('./sms.js'))
;