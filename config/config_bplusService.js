(function () {
    var constants = {
        operation: ["add", "update", "delete"],
        classification: [
                            "workExperience",
                            "archivement",
                            "communityExperience",
                            "education",
                            "languageSkill",
                            "memberExt",
                            "skill"
                        ],
        reource: [
                    "englishlevel",
                    "qualifications",
                    "communityposition",
                    "worktype",
                    "langguageproficiency",
                    "industry",
                    "job",
                    "language"
                ],
        language: {
          "zh":"zh-CN",
          "en": "en-US"
        },
        mapping: {
            //common
            "name": "name",
            "description": "description",
            "tags": "tags",
            "start_date": "dateFrom.value",
            "end_date": "dateTo.value",
            //memberExt
            "member_id": "id",
            "real_name": "name",
            "gender": "gender",
            "birthday": "dateOfBirth.value",
            "hide_birthday": "dateOfBirth.isPrivate",
            "current_location": "location",
            "address": "contractInfo.value",
            "hide_address": "contractInfo.isPrivate",
            "bg_url": "userBackground",
            "avatar": "avatar",
            //archivement
            "archivement_id": "id",
    //      "name": "name",
            "issue_by": "organization",
    //      "description": "description",
    //      "tags": "tags",
            "issue_date": "prizeDate.value",
            //communityExperience
            "experience_id": "id",
    //      "name": "name",
            "position": "position.id",
    //      "start_date": "dateFrom",
    //      "end_date": "dateTo",
    //      "description": "description",
    //      "tags": "tags",
            //education
            "education_id": "id",
            "university": "name",
            "major": "major",
            "qualifications_id": "background.id",
    //      "start_date": "dateFrom",
    //      "end_date": "dateTo",
            "special_experience": "description",
    //      "tags": "tags",
            //languageSkill
            "skill_id": "id",
            "language_id": "language.id",
            "certification": "certification.id",
            "proficiency_id": "proficiency.id",
            "score": "score",
            //skill
    //      "skill_id": "id",  //Duplicated with the one in languageSkill
    //      "name": "name",
    //      "description": "description",
    //      "tags": "tags",
            //workExperience
    //      "experience_id": "id",  //Duplicated with the one in communityExperience
            "company": "name",
            "work_type": "type.id",
            "industry_id": "industry.id",
            "job_id": "job.id",
    //      "start_date": "dateFrom",
    //      "end_date": "dateTo",
    //      "description": "description",
    //      "tags": "tags"
        },
        memberExt: ["hide_birthday", "current_location", "address", "hide_address", "bg_url"],
        memberSso: ["real_name", "birthday", "gender", "avatar"],
        archivement: ["archivement_id", "name", "issue_by", "issue_date", "description", "tags"],
        communityExperience: ["experience_id", "name", "position", "start_date", "end_date", "description", "tags"],
        education: ["education_id", "university", "major", "qualifications_id", "start_date", "end_date", "special_experience", "tags"],
        languageSkill: ["skill_id", "language_id", "certification", "proficiency_id", "score"],
        skill: ["skill_id", "name", "description", "tags"],
        workExperience: ["experience_id", "company", "work_type", "industry_id", "job_id", "start_date", "end_date", "description", "tags"],
    };
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = constants;
    } else if (typeof angular !== 'undefined') {
        angular.bplus = angular.bplus || {};
        angular.bplus.mappingConfig = constants;
    }
})();