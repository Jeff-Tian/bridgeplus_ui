module.exports = function () {
    return {
        main: {
            files: [
                {
                    expand: true,
                    cwd: "<%= config.src %>",
                    src: [
                        'api/**',
                        'bower/**',
                        'competion/**',
                        'css/**',
                        'icon/**',
                        'img/**',
                        'js/**',
                        'mobile/**',
                        'view-partial/**',
                        'mock/major.en.json',
                        'mock/major.zh.json',
                        'mock/schoolname.en.json',
                        'mock/schoolname.zh.json',
                        'mock/social.en.json',
                        'mock/social.zh.json',
                        'mock/match.en.json',
                        'mock/match.zh.json',
                        'semantic-online-store/**',
                        '*'
                    ],
                    dest: "<%= config.dist %>"
                },
                {
                    expand: true,
                    cwd: "./locales/",
                    src: ['localeHelper.js'],
                    dest: "<%= config.dist %>translation/"
                }
            ]
        }
    };
};