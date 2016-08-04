require([
    "semantic",
    "angular-translate",
    "angular",

    "bplus-ui/model/personalinfo",

    "bplus-ui/page/profile/widget/banner/main",
    "bplus-ui/page/profile/widget/achievement/main",
    "bplus-ui/page/profile/widget/growing/main",
    "bplus-ui/page/profile/widget/autocomplete/main",

    "bplus-ui/view/widgets/common/upload",
    "bplus-ui/view/widgets/common/upload_handler",
    "bplus-ui/view/widgets/common/date",
    "bplus-ui/view/widgets/common/tag",

    "bplus-ui/view/widgets/personalinfo/list_skills_widget",
    "bplus-ui/view/widgets/personalinfo/list_personalinfo_widget",
    "bplus-ui/view/widgets/personalinfo/list_educationbackground_widget",
    "bplus-ui/view/widgets/personalinfo/list_clubexperience_widget",
    "bplus-ui/view/widgets/personalinfo/list_workingexperience_widget",
    "bplus-ui/view/widgets/personalinfo/list_award_widget",
    "bplus-ui/view/widgets/personalinfo/list_language_widget",
    "bplus-ui/view/widgets/personalinfo/list_widget_container",
    "text!bplus-ui/view/widgets/personalinfo/list_personalinfo_container.html",
    "text!bplus-ui/view/widgets/personalinfo/list_skills_container.html",
    "text!bplus-ui/view/widgets/personalinfo/list_educationbackground_container.html",
    "text!bplus-ui/view/widgets/personalinfo/list_clubexperience_container.html",
    "text!bplus-ui/view/widgets/personalinfo/list_workingexperience_container.html",
    "text!bplus-ui/view/widgets/personalinfo/list_award_container.html",
    "text!bplus-ui/view/widgets/personalinfo/list_language_container.html"
], function (semantic,
             agTranslateangular,
             angular,
             ProfileModel,
             banner,
             achievement,
             growing,
             autocomplete,
             upload,
             uploadHandler,
             BDate,
             Tag,
             Skills,
             Personalinfo,
             Educationbackground,
             Club,
             Work,
             Award,
             Language,
             Container,
             personalinfoContainerTemplate,
             skillsContainerTemplate,
             eduContainerTemplate,
             clubContainerTemplate,
             workContainerTemplate,
             awardContainerTemplate,
             languageContainerTemplate) {
    var documentMudule = angular.module('docModule', ['bplusModule'])
            .factory('FormValidation', angular.bplus.FormValidation)
        ;
    (function (agModule) {
        banner(agModule);
        achievement(agModule);
        growing(agModule);
        upload(agModule);
        uploadHandler(agModule);
        autocomplete(agModule);

        new ProfileModel().start(agModule);
        var instance = Container;
        instance.start(agModule, "bpluspersonalinfooverall", personalinfoContainerTemplate)
            .start(agModule, "bplusskillsoverall", skillsContainerTemplate)
            .start(agModule, "bpluseducationbackgroundall", eduContainerTemplate)
            .start(agModule, "bplusclubexperienceall", clubContainerTemplate)
            .start(agModule, "bplusworkexperienceall", workContainerTemplate)
            .start(agModule, "bplusawardall", awardContainerTemplate)
            .start(agModule, "bpluslanguageall", languageContainerTemplate);
        new BDate().start(agModule);
        new Tag().start(agModule);

        var listWidgets = [
            new Personalinfo(),
            new Skills(),
            new Educationbackground(),
            new Club(),
            new Work(),
            new Award(),
            new Language()
        ];

        listWidgets.forEach(function (value) {
            value.start(agModule);
        });
    })(documentMudule);

    angular.element(window.document).ready(function () {
        angular.bootstrap(window.document, ['docModule']);
    });
});