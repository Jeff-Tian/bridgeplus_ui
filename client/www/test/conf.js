exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'top-nav.spec.js',
        'find-password-by-email.spec.js',
        'study-center.spec.js'
    ],
    baseUrl: 'http://10.20.32.51:5678'
};