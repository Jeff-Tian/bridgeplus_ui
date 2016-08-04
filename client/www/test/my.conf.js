// Karma configuration
// Generated on Fri Sep 25 2015 11:54:38 GMT+0800 (CST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            '../bower/jquery/dist/jquery.js',
            '../bower/semantic-ui/dist/semantic.js',
            '../bower/angular/angular.js',
            'mockBplus.js',
            '../bower/angular-sanitize/angular-sanitize.js',
            '../bower/angular-translate/angular-translate.js',
            '../bower/angular-ui-router/release/angular-ui-router.min.js',
            '../bower/angular-auto-complete/dist/scripts/app.js',
            '../js/config/*.js',
            '../js/utils/utils.js',
            '../js/utils/msgbus.js',
            '../js/utils/trackingSender.js',

            '../bower/angularQueryParserModule/dist/scripts/app.js',
            '../bower/angularQueryParserModule/dist/scripts/queryParser.js',
            '../js/common/linkedInModule.js',

            '../js/factories/*.js',
            '../js/controllers/*.js',
            '../js/directives/loading.js',
            '../js/directives/captcha.js',
            '../js/directives/countDown.js',
            '../js/directives/dropdown.js',
            '../js/directives/game.js',
            '../js/directives/map.js',
            '../js/directives/ngEnter.js',
            '../js/directives/registerForm.js',
            '../js/directives/tab.js',
            '../js/config/translate.js',
            '../js/config/xhr.js',
            '../js/page/bplusModule.js',
            '../js/page/register/main.js',
            '../js/page/account-setting/main.js',
            '../js/page/personal-history/PersonalHistoryCtrl.js',
            '../js/page/personal-history/main.js',
            '../js/page/select-payment-method/main.js',
            '../js/page/opportunity-detail/menuDirective.js',
            '../js/page/opportunity-detail/widget/competitiveness/competitiveDirective.js',
            '../bower/angular-service/dist/scripts/app.js',
            '../bower/angular-service/dist/scripts/service.js',
            '../bower/angular-service/dist/scripts/paginationData.js',
            '../js/page/study-center/app.js',
            '../js/page/study-center/controllers.js',
            '../bower/angular-mocks/angular-mocks.js',
            '../../../locales/*.js',
            './**/*tests.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
};