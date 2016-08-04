var proxy = require('./proxy');

var leaveTrimmer = require('../utils/leaveTrimmer');
var config = require('../config');
var studyCenterServiceUrls = leaveTrimmer.trim(config.serviceUrls.studyCenter, '/service-proxy/study-center');

var proxyBPlus = proxy.proxyBPlus;

module.exports = require('express').Router()
    .post(studyCenterServiceUrls.classBooking.cancel, proxyBPlus({
        path: '/classRequest/cancel',
        method: 'POST'
    }))
    .post(studyCenterServiceUrls.classBooking.booked, proxyBPlus({path: '/classRequest/load', method: 'POST'}))
    .get(studyCenterServiceUrls.classBooking.coming, proxyBPlus({path: '/classBooking/coming', method: 'POST'}))
    // .get(studyCenterServiceUrls.classBooking.coming, function (req, res, next) {
    //    var result = {
    //        "isSuccess": true,
    //        "result": [{
    //            "class_id": "0d30fc84-78f5-4cbc-8e89-0ecd32e64838",
    //            "course_id": "40b09bfc-ad14-4271-a992-2523a72c4ac1",
    //            "description": "description14",
    //            "end_time": "2016-12-17T07:40:51.723Z",
    //            "start_time": "2016-03-25T07:40:51.723Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "9ca41718-1f50-4a65-8725-536bf8689055",
    //            "title": "title14",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "9ca41718-1f50-4a65-8725-536bf8689055",
    //                "tags": ["t_tag17"],
    //                "display_name": "teacher17",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 9ca41718-1f50-4a65-8725-536bf8689055"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 24
    //        }, {
    //            "class_id": "294b66aa-ec16-4c1a-a39c-5003077c85b1",
    //            "course_id": "f9a30306-ea01-49af-8751-6839664ae7d7",
    //            "description": "description8",
    //            "end_time": "2016-03-25T03:27:49.008Z",
    //            "start_time": "2016-03-25T03:27:49.008Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "8682c150-84bc-4e99-b49f-511a9b84a792",
    //            "title": "title8",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "8682c150-84bc-4e99-b49f-511a9b84a792",
    //                "tags": ["t_tag8"],
    //                "display_name": "teacher8",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 8682c150-84bc-4e99-b49f-511a9b84a792"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 18
    //        }, {
    //            "class_id": "30aa75d3-b949-455a-bdcc-666c5d5a18ff",
    //            "course_id": "84685efc-5096-44fc-baa6-6bac1aa673b8",
    //            "description": "description2",
    //            "end_time": "2016-12-17T07:40:51.670Z",
    //            "start_time": "2016-04-01T11:30:51.670Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "de557af6-9654-48d7-95f2-33fc17780a24",
    //            "title": "title2",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "de557af6-9654-48d7-95f2-33fc17780a24",
    //                "tags": ["t_tag9"],
    //                "display_name": "teacher9",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title de557af6-9654-48d7-95f2-33fc17780a24"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 12
    //        }, {
    //            "class_id": "3b637afd-0425-4d63-ae08-197203b17653",
    //            "course_id": "f9e50a96-7bc2-432b-bcf6-6ad33330d5c7",
    //            "description": "description17",
    //            "end_time": "2016-12-17T07:40:51.729Z",
    //            "start_time": "2016-12-17T07:40:51.729Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "d7bef13a-bffc-44db-aa1a-2ba35e927c2e",
    //            "title": "title17",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "d7bef13a-bffc-44db-aa1a-2ba35e927c2e",
    //                "tags": ["t_tag17"],
    //                "display_name": "teacher17",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title d7bef13a-bffc-44db-aa1a-2ba35e927c2e"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 27
    //        }, {
    //            "class_id": "44675389-19a7-4c0f-89c5-994c1f2679da",
    //            "course_id": "bc50d4fe-8e51-4614-bd75-1aefcf412cad",
    //            "description": "description18",
    //            "end_time": "2016-04-06T07:40:51.733Z",
    //            "start_time": "2016-04-06T07:40:51.733Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "c937dc30-1513-4075-abf0-a042b3d6021d",
    //            "title": "title18",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "c937dc30-1513-4075-abf0-a042b3d6021d",
    //                "tags": ["t_tag18"],
    //                "display_name": "teacher18",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title c937dc30-1513-4075-abf0-a042b3d6021d"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 2,
    //            "capability": 28
    //        }, {
    //            "class_id": "51fc2789-5e44-49ec-bc91-62f8f39d6453",
    //            "course_id": "69e1feda-d30b-4441-91cb-e1357ff3292d",
    //            "description": "description16",
    //            "end_time": "2016-12-17T03:27:49.025Z",
    //            "start_time": "2016-12-17T03:27:49.025Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "53718262-1118-4502-b825-8abe50c7767f",
    //            "title": "title16",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "53718262-1118-4502-b825-8abe50c7767f",
    //                "tags": ["t_tag16"],
    //                "display_name": "teacher16",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 53718262-1118-4502-b825-8abe50c7767f"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 26
    //        }, {
    //            "class_id": "5f5a9318-c166-451e-bef4-42f1cbe59a6a",
    //            "course_id": "842db90d-87bd-469d-96da-bfce1a9cf652",
    //            "description": "description17",
    //            "end_time": "2016-07-10T03:10:21.729Z",
    //            "start_time": "2016-07-10T03:10:21.729Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "db52cd73-e9a1-45c4-b3a5-348b1be5e379",
    //            "title": "title17",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "db52cd73-e9a1-45c4-b3a5-348b1be5e379",
    //                "tags": ["CMO"],
    //                "display_name": "TeacherWithTag17",
    //                "image_url": null,
    //                "rank": null,
    //                "title": null
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 27
    //        }, {
    //            "class_id": "64a9124a-607a-4537-9a24-9a347ed6e207",
    //            "course_id": "30decd23-9a5b-4737-bdf3-668888e760de",
    //            "description": "description15",
    //            "end_time": "2016-12-17T07:40:51.725Z",
    //            "start_time": "2016-12-17T07:40:51.725Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "4406c1f1-3a94-4d66-a222-6022c5f0fe4f",
    //            "title": "title15",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "4406c1f1-3a94-4d66-a222-6022c5f0fe4f",
    //                "tags": ["t_tag15"],
    //                "display_name": "teacher15",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 4406c1f1-3a94-4d66-a222-6022c5f0fe4f"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 25
    //        }, {
    //            "class_id": "68a5e44e-072b-41cb-9c4c-9097b9919d9d",
    //            "course_id": "84685efc-5096-44fc-baa6-6bac1aa673b8",
    //            "description": "description9",
    //            "end_time": "2016-12-17T03:27:49.011Z",
    //            "start_time": "2016-12-17T03:27:49.011Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "de557af6-9654-48d7-95f2-33fc17780a24",
    //            "title": "title9",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "de557af6-9654-48d7-95f2-33fc17780a24",
    //                "tags": ["t_tag9"],
    //                "display_name": "teacher9",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title de557af6-9654-48d7-95f2-33fc17780a24"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 19
    //        }, {
    //            "class_id": "8c263a64-cb06-4a8d-af2c-522c51d5822b",
    //            "course_id": "d39c7ec6-f66f-446b-a118-97e3add254a9",
    //            "description": "description3",
    //            "end_time": "2016-12-17T03:27:48.997Z",
    //            "start_time": "2016-12-17T03:27:48.997Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "6a77557b-4293-4f77-a23d-66fb61e303e4",
    //            "title": "title3",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "6a77557b-4293-4f77-a23d-66fb61e303e4",
    //                "tags": ["t_tag3"],
    //                "display_name": "teacher3",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 6a77557b-4293-4f77-a23d-66fb61e303e4"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 13
    //        }, {
    //            "class_id": "a8b3654d-e99c-4942-b682-00ec5468d89b",
    //            "course_id": "1598808a-63be-42b8-b49f-cf26cb197583",
    //            "description": "description10",
    //            "end_time": "2016-12-17T07:40:51.710Z",
    //            "start_time": "2016-12-17T07:40:51.710Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "38fc425d-e2a0-49c0-adab-7b25c698bcbe",
    //            "title": "title10",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "38fc425d-e2a0-49c0-adab-7b25c698bcbe",
    //                "tags": ["t_tag10"],
    //                "display_name": "teacher10",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 38fc425d-e2a0-49c0-adab-7b25c698bcbe"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 20
    //        }, {
    //            "class_id": "c2f99765-c14a-44af-8176-44fd5849761a",
    //            "course_id": "c8332536-97ec-45c1-9873-37e508092897",
    //            "description": "description19",
    //            "end_time": "2016-12-17T07:40:51.736Z",
    //            "start_time": "2016-12-17T07:40:51.736Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "332f50c9-b417-46e9-8e41-10db9b707d91",
    //            "title": "title19",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "332f50c9-b417-46e9-8e41-10db9b707d91",
    //                "tags": ["t_tag19"],
    //                "display_name": "teacher19",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 332f50c9-b417-46e9-8e41-10db9b707d91"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 29
    //        }, {
    //            "class_id": "cc222319-5e34-46cb-addc-a289562f5e3b",
    //            "course_id": "af500636-7d34-4523-856e-3c1b68cdd2b4",
    //            "description": "description10",
    //            "end_time": "2016-07-10T03:10:21.702Z",
    //            "start_time": "2016-07-10T03:10:21.702Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "e82f409c-327e-41a9-aa83-793575589f89",
    //            "title": "title10",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "e82f409c-327e-41a9-aa83-793575589f89",
    //                "tags": ["COO"],
    //                "display_name": "TeacherWithTag10",
    //                "image_url": null,
    //                "rank": null,
    //                "title": null
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 20
    //        }, {
    //            "class_id": "ccedc646-8004-4e09-839d-46450ec67455",
    //            "course_id": "5a501eb8-290c-424f-8e33-bb4bc0c3fc37",
    //            "description": "description6",
    //            "end_time": "2016-12-17T03:27:49.004Z",
    //            "start_time": "2016-12-17T03:27:49.004Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "0c030812-deb7-46ea-b9cd-c3b424595bee",
    //            "title": "title6",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "0c030812-deb7-46ea-b9cd-c3b424595bee",
    //                "tags": ["t_tag6"],
    //                "display_name": "teacher6",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 0c030812-deb7-46ea-b9cd-c3b424595bee"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 16
    //        }, {
    //            "class_id": "d0f6eb04-0bf8-4311-bd47-5bd640a3b819",
    //            "course_id": "e280c114-e7df-4352-b022-b03ad6ba1429",
    //            "description": "description1",
    //            "end_time": "2016-12-17T03:27:48.992Z",
    //            "start_time": "2016-12-17T03:27:48.992Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "1ce3af2d-8e13-45d1-9eb9-9851139fa80b",
    //            "title": "title1",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "1ce3af2d-8e13-45d1-9eb9-9851139fa80b",
    //                "tags": ["t_tag1"],
    //                "display_name": "teacher1",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 1ce3af2d-8e13-45d1-9eb9-9851139fa80b"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 11
    //        }, {
    //            "class_id": "d38b72ee-ca36-44ad-9e57-2119a9a90e73",
    //            "course_id": "63673ead-1dcf-4435-9d0a-99691456dd5b",
    //            "description": "description4",
    //            "end_time": "2016-12-17T03:27:48.999Z",
    //            "start_time": "2016-12-17T03:27:48.999Z",
    //            "student_id": "759c1586-2e9b-4535-9d43-01a8cc8f2e89",
    //            "teacher_id": "083c8c10-0378-4c92-a0cc-b239c0504b28",
    //            "title": "title4",
    //            "booking_status": "book",
    //            "teacher": {
    //                "teacher_id": "083c8c10-0378-4c92-a0cc-b239c0504b28",
    //                "tags": ["t_tag4"],
    //                "display_name": "teacher4",
    //                "image_url": null,
    //                "rank": null,
    //                "title": "title 083c8c10-0378-4c92-a0cc-b239c0504b28"
    //            },
    //            "bookingCount": 1,
    //            "mincapability": 1,
    //            "capability": 14
    //        }]
    //    };
    //
    //    res.json(result);
    // })
    .get(studyCenterServiceUrls.classBooking.unevaluated, function (req, res, next) {
        return proxyBPlus({
            path: '/classBooking/unevaluated',
            method: 'POST',
            dataMapper: function (d) {
                d.pageSize = req.query.pageSize;
                d.page = req.query.page;

                return d;
            }
        })(req, res, next);
    })
    .get(studyCenterServiceUrls.classBooking.evaluated, function (req, res, next) {
        return proxyBPlus({
            path: '/classBooking/evaluated',
            method: 'POST',
            dataMapper: function (d) {
                d.pageSize = req.query.pageSize;
                d.page = req.query.page;

                return d;
            }
        })(req, res, next);
    })
    .get(studyCenterServiceUrls.my.favorite.teachers, proxyBPlus({
        path: '/my/favorite/loadex', method: 'POST', dataMapper: function (d) {
            d.category = 'teacher';

            return d;
        }
    }))
    .delete(studyCenterServiceUrls.my.favorite.teachers, function (req, res, next) {
        return proxyBPlus({
            path: '/my/favorite/remove', method: 'POST', dataMapper: function (d) {
                d.category = 'teacher';
                d.item_id = req.query.teacher_id;

                return d;
            }
        })(req, res, next);
    })
    .get(studyCenterServiceUrls.teacher.latestCourses, function (req, res, next) {
        return proxyBPlus({
            path: '/teacher/latestclass', method: 'POST', dataMapper: function (d) {
                d.teacher_id = req.params.teacherId;

                return d;
            }
        })(req, res, next);
    })
    .get(studyCenterServiceUrls.classFeedback, function (req, res, next) {
        return proxyBPlus({
            path: '/classfeedback/load/' + req.params.feedbackId
        })(req, res, next);
    })
    .put(studyCenterServiceUrls.teacher.feedback, proxyBPlus({
        path: '/classfeedback/toTeacher',
        method: 'POST'
    }))
;