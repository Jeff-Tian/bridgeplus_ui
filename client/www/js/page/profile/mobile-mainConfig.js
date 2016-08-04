require.config({
    "waitSeconds": 0,
    "baseUrl": "bower",
    "packages": [{
        "name": "jquery",
        "location": "jquery/dist",
        "main": "jquery.min"
    }, {
        "name": "when",
        "location": "when",
        "main": "when"
    }, {
        "name": "bplus-ui",
        "location": "../js"
    }, {
        "name": "bplus-ui-mobile",
        "location": "../mobile"
    }],
    "paths": {
        "text": "requirejs-plugins/lib/text",
        "image": "requirejs-plugins/src/image",
        "json": "requirejs-plugins/src/json",
        "propertyParser": "requirejs-plugins/src/propertyParser",
        'domReady': 'requirejs-domready/domReady',
        "angular": "angular/angular.min",
        "angular-translate": "angular-translate/angular-translate.min",
        "semantic": "semantic-ui/dist/semantic.min",
        "autoComplete": "devbridge-autocomplete/dist/jquery.autocomplete.min"
    },
    "shim": {
        'angular': {
            exports: 'angular'
        },
        "angular-translate": {
            deps: ["angular"],
            exports: "angular-translate"
        },
        'autoComplete': {
            deps: ["jquery"]
        },
        'semantic': {
            deps: ["jquery"]
        }
    }
});
