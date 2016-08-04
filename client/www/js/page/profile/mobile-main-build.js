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
    "text!bplus-ui-mobile/profile/common/date-mobile.html",
    "text!bplus-ui-mobile/profile/common/tag-mobile.html",

    "bplus-ui/view/widgets/personalinfo/list_skills_widget",
    "bplus-ui/view/widgets/personalinfo/list_personalinfo_widget",
    "bplus-ui/view/widgets/personalinfo/list_educationbackground_widget",
    "bplus-ui/view/widgets/personalinfo/list_clubexperience_widget",
    "bplus-ui/view/widgets/personalinfo/list_workingexperience_widget",
    "bplus-ui/view/widgets/personalinfo/list_award_widget",
    "bplus-ui/view/widgets/personalinfo/list_language_widget",

    "text!bplus-ui-mobile/profile/list_skills_widget-mobile.html",
    "text!bplus-ui-mobile/profile/list_personalinfo_widget-mobile.html",
    "text!bplus-ui-mobile/profile/list_educationbackground_widget-mobile.html",
    "text!bplus-ui-mobile/profile/list_clubexperience_widget-mobile.html",
    "text!bplus-ui-mobile/profile/list_workingexperience_widget-mobile.html",
    "text!bplus-ui-mobile/profile/list_award_widget-mobile.html",
    "text!bplus-ui-mobile/profile/list_language_widget-mobile.html",

    "bplus-ui/view/widgets/personalinfo/list_widget_container",
    "text!bplus-ui-mobile/profile/list_personalinfo_container-mobile.html",
    "text!bplus-ui-mobile/profile/list_skills_container-mobile.html",
    "text!bplus-ui-mobile/profile/list_educationbackground_container-mobile.html",
    "text!bplus-ui-mobile/profile/list_clubexperience_container-mobile.html",
    "text!bplus-ui-mobile/profile/list_workingexperience_container-mobile.html",
    "text!bplus-ui-mobile/profile/list_award_container-mobile.html",
    "text!bplus-ui-mobile/profile/list_language_container-mobile.html"
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
             BDateTemplate,
             TagTemplate,
             Skills,
             Personalinfo,
             Educationbackground,
             Club,
             Work,
             Award,
             Language,
             SkillsTemplate,
             PersonalinfoTemplate,
             EducationbackgroundTemplate,
             ClubTemplate,
             WorkTemplate,
             AwardTemplate,
             LanguageTemplate,
             Container,
             personalinfoContainerTemplate,
             skillsContainerTemplate,
             eduContainerTemplate,
             clubContainerTemplate,
             workContainerTemplate,
             awardContainerTemplate,
             languageContainerTemplate) {
    var documentMudule = angular.module('docModule', ['pascalprecht.translate', 'ng.utils', 'bplusModule'])
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
        Container.start(agModule, "bpluspersonalinfooverall", personalinfoContainerTemplate)
            .start(agModule, "bplusskillsoverall", skillsContainerTemplate)
            .start(agModule, "bpluseducationbackgroundall", eduContainerTemplate)
            .start(agModule, "bplusclubexperienceall", clubContainerTemplate)
            .start(agModule, "bplusworkexperienceall", workContainerTemplate)
            .start(agModule, "bplusawardall", awardContainerTemplate)
            .start(agModule, "bpluslanguageall", languageContainerTemplate);
        new BDate().start(agModule, BDateTemplate);
        new Tag().start(agModule, TagTemplate);

        var listWidgets = [
            new Personalinfo(PersonalinfoTemplate),
            new Skills(SkillsTemplate),
            new Educationbackground(EducationbackgroundTemplate),
            new Club(ClubTemplate),
            new Work(WorkTemplate),
            new Award(AwardTemplate),
            new Language(LanguageTemplate)
        ];

        listWidgets.forEach(function (value) {
            value.start(agModule);
        });
    })(documentMudule);

    angular.element(window.document).ready(function () {
        angular.bootstrap(window.document, ['docModule']);
    });
});