module.exports = function () {
    return {
        scripts: ['<%= config.src %>/widgets/**/*.js'],
        options: {
            jquery: true,
            //大括号包裹
            curly: true,
            //构造函数名首字母必须大写
            newcap: false,
            //禁用arguments.caller和arguments.callee
            noarg: true,
            //对于属性使用aaa.bbb而不是aaa['bbb']
            sub: true,
            //禁止使用不在全局变量列表中的未定义的变量
            undef: true,
            //允许在if，for，while语句中使用赋值
            //boss: true,
            //指定运行环境为node.js
            node: true,
            multistr: true,
            // global variables
            "globals": {
                "angular": false,
                "jasmine": false,
                "$": false,
                "_": false,
                "module": false,
                "require": false,
                "window": false,
                "define": false,
                "document": false,
                "Image": false,
                "location": false
            },
            reporter: 'jslint'
        },
        //具体任务配置
        files: {
            src: ['client/www/js/**/*.js', 'client/www/api/*.js', '!client/www/js/utils/html5shiv.js', '!client/www/js/utils/respond.min.js']
        }
    }
};