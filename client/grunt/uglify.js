module.exports = function () {
    return {
        development: {
            options: {
                mangle: false,
                compress: false,
                beautify: true
                /*Sitemap*/
            },
            files: {}
        },
        production: {
            files: [{
                expand: true,
                cwd: '<%= config.dist %>js',
                src: '**/*.js',
                dest: '<%= config.dist %>js'
            }, {
                expand: true,
                cwd: '<%= config.dist %>translation',
                src: 'localeHelper.js',
                dest: '<%= config.dist %>translation'
            }],
            options: {
                mangle: true
            }
        }
    };
};