$(function() {
    var config = {
            currentW: 0,
            currentH: 0
        },
        halfWidth,
        halfHeight;

    function resize() {
        config.currentW = $(window).width();
        config.currentH = $(window).height();
        halfWidth = config.currentW * .5;
        halfHeight = config.currentH * .5;
    }

    function resizeWheel() {
        //var scale = config.currentH / 780;
        //var scaleX = config.currentW / 2000;
        //var scale = Math.min(scaleX, scaleY);
        //$('#bridge_plus_wheel').css({
        //    transform: 'scale3d(' + scale + ',' + scale + ',1)'
        //});
        //$('#logo').css({
        //    transform: 'scale3d(' + scale + ',' + scale + ',1)'
        //});
        var intro = $('#bridge_plus_intro svg');
        if (intro.length) {
            var height = intro.attr('height') | 0;
            intro.css({
                transform: 'scale3d(' + 1 + ',' + (config.currentH / height) + ',1)'
            });
        }
    }

    function getClassList(dom) {
        var a = [];

        if (dom.classList && (typeof dom.classList.forEach === 'function')) {
            dom.classList.forEach(function(item) {
                a.push(item);
            });
        } else {
            a = (dom.getAttribute('class') || '').split(' ');
        }

        return a;
    }

    (function() {
        var INTRO = window.INTRO = {
            intro: null,
            init: init,
            arcouno: arcouno,
            arc: function(a, b, c, d) {
                var angle = c;
                var coords = this.toCoords(a, b, angle);
                var path = "M " + coords[0] + " " + coords[1];
                while (d >= angle) {
                    coords = this.toCoords(a, b, angle);
                    path += " L " + coords[0] + " " + coords[1];
                    angle++;
                }
                return path;
            },
            toCoords: function(a, b, c) {
                var d = c / 180 * Math.PI,
                    e = a[0] + Math.cos(d) * b,
                    f = a[1] + Math.sin(d) * b;
                return [e, f];
            }
        };

        function init() {
            var intro = this.intro = new Raphael("bridge_plus_intro", config.currentW, config.currentH);
            var line = intro
                .path("M 0," + config.currentH + " L 0," + config.currentH)
                .attr({
                    fill: "#E71E30",
                    stroke: '#E71E30',
                    'stroke-width': 4
                });
            var circleSmall = intro
                .circle(halfWidth, halfHeight, 0)
                .attr({
                    fill: "#111",
                    stroke: "#111"
                });
            line.animate({
                path: "M 0," + config.currentH + " L " + halfWidth + "," + halfHeight
            }, 1000, ">", function() {
                INTRO.arcouno();
                line.animate({
                    path: "M " + halfWidth + "," + halfHeight + "L " + halfWidth + "," + halfHeight
                }, 1e3, ">", function() {});
                circleSmall.animate({
                    r: "72"
                }, 1800, ">", function() {});
                setTimeout(d, 1100);
            });

            var radiusintro = 0;
            var rot = 0;

            function d() {
                var a = circleSmall.clone().attr({
                    r: radiusintro,
                    opacity: 0,
                    fill: "none",
                    "stroke-width": 1
                });
                a.attr({
                    opacity: 1
                }).animate({
                    r: radiusintro + 10,
                    "stroke-width": 41,
                    stroke: '#FFF'
                }, 1e3, ">", function() {});
                radiusintro += 40;
                if (radiusintro < halfWidth + 150) {
                    setTimeout(d, 50);
                } else {
                    $('#logo').addClass('active');
                    $('.logo_top').addClass('active');
                    //INTRO.intro.clear();
                    setTimeout(function() {
                        BridgeWheel.start();
                    }, 1000);
                }
            }
        }

        function arcouno() {
            var path = INTRO.intro
                .path(INTRO.arc([halfWidth, halfHeight], 120, 120, 320))
                .attr({
                    stroke: "#111",
                    "stroke-width": 1
                });
            path.attr({
                transform: "r0," + halfWidth + "," + halfHeight
            }).animate({
                transform: "r360," + halfWidth + "," + halfHeight
            }, 4000);
        }
    })();
    (function() {
        var BridgeWheel = window.BridgeWheel = {
            first: true,
            sourceArr: [],
            imgAll: [],
            init: function() {
                if (this.first) {
                    this.first = false;
                    INTRO.init();
                }
            },
            start: function() {
                BridgeWheel.resize();
                $('#bridge_plus_wheel').addClass('active');
                var paper = new Raphael("bridge_plus_wheel", 1600, 1000);
                paper.wheel(440, vmvideos.slice(7, 17), 2, vmvideos, [], additionInfo);
            },
            resize: resizeWheel
        };
    })();
    $(window).on('resize', function() {
        resize();
        BridgeWheel.resize();
    });

    var wheel_text = $('.wheel_text');
    var wheel = $('.main_page_wheel');
    var bottom = $('.main_page_bottom');
    var right = $('.main_page_right');

    $(document)
        .on('wheel/show', function() {
            $('.svg_group')
                .hover(function() {
                    $(document).trigger('show_group_desc', getClassList(this));
                }, function() {
                    $(document).trigger('hide_group_desc', getClassList(this));
                })
                .on('click', function() {
                    var g = getClassList(this);
                    var url;

                    if (g.indexOf('svg_group_0') >= 0) {
                        url = '/portal/zh/student-portal';
                    }

                    if (g.indexOf('svg_group_1') >= 0) {
                        url = '/portal/zh/mentor-portal';
                    }

                    if (g.indexOf('svg_group_2') >= 0) {
                        url = '/portal/zh/hr-portal';
                    }

                    // $(document).trigger('show_content', g);
                    $(document).trigger('navigate', url);
                });
        })
        .on('click', '.logo_right', function() {
            $(document).trigger('show_right');
        })
        .on('show_group_desc', function(e, svg_group, klass) {
            wheel_text
                .hide()
                .each(function() {
                    if ($(this).hasClass(klass)) {
                        $(this).show();
                    }
                });
        })
        .on('hide_group_desc', function(e, svg_group, klass) {
            wheel_text
                .each(function() {
                    if ($(this).hasClass(klass)) {
                        $(this).hide();
                    }
                });
        })
        .on('show_wheel', function() {
            wheel
                .animate({
                    top: 0,
                    left: 0
                }, 500);
            bottom
                .animate({
                    top: '100%',
                    left: 0
                }, 500);
            right
                .animate({
                    left: '100%'
                }, 500);
            BridgeWheel.init();
        })
        .on('show_content', function() {
            wheel
                .animate({
                    top: '-100%',
                    left: 0
                }, 500);
            bottom
                .animate({
                    top: 0,
                    left: 0
                }, 500);
            right
                .animate({
                    left: '100%'
                }, 500);
        })
        .on('show_right', function() {
            wheel
                .animate({
                    left: '-100%'
                }, 500);
            bottom
                .animate({
                    left: '-100%'
                }, 500);
            right
                .animate({
                    left: 0
                }, 500);
        })
        .on('pjax/done', document, function() {
            $(document).trigger('show_content', null);
            if (typeof prepareCarousel === 'function') {
                setTimeout(prepareCarousel, 100);
            }
        });
    resize();
    if (location.pathname == '/') {
        BridgeWheel.init();
    } else {
        $(document).trigger('show_content');
    }
});