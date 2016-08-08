exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'study-center.spec.js',
        'top-nav.spec.js',
        'account-setting.spec.js',
        'find-password-by-email.spec.js'
    ],
    baseUrl: 'http://10.20.32.51:5678'
};