module.exports = function () {
    return {
        js: {
            files: ['config/*.js', 'serviceProxy/*.js', 'locales/*.js', 'locales/*.json'],
            options: {
                livereload: true,
                nospawn: true
            },
            tasks: ['jshint'],
        },
        api: {
            files: ['client/www/api/*.js'],
            tasks: ['jshint'],
        },
        html: {
            files: [],
            options: {
                livereload: true
            }
        },
        css: {
            files: ['client/www/css/**/*.less'],
            tasks: ['less:development'],
            options: {
                livereload: true,
            }
        }
    }
};