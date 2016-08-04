var router = require('express').Router();
var membership = require('../serviceProxy/membership');

function mapPath2Template(path) {
    router.get(path, function (req, res, next) {
        res.render('mobile' + path);
    });
}

router.get('/', function (req, res, next) {
    res.render('mobile/index');
});

router.get('/signin', function (req, res, next) {
    res.render('mobile/sign-in');
});

var mobileRoutes = [
    'index',
    'sign-in',
    'aboutus',
    'national',
    'reset-password',
    'reset-password-by-email',
    'personal-history',
    'youth',
    'statement',
    // TODO: Requires Login
    'bind-mobile',
    'bind-mobile-by-password',
    'menu'
];

mobileRoutes.map(function (r) {
    mapPath2Template('/' + r);
});

router.get('/profile', membership.ensureAuthenticated, function (req, res, next) {
    res.render('mobile/profile');
});
router.get('/game-training', membership.ensureAuthenticated, function (req, res, next) {
    res.render('mobile/game-training');
});

module.exports = router;