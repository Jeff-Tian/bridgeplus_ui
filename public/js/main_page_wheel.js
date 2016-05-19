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
        var scale = config.currentH / 780;
        //var scaleX = config.currentW / 2000;
        //var scale = Math.min(scaleX, scaleY);
        //$('#bridge_plus_wheel').css({
        //    transform: 'scale3d(' + scale + ',' + scale + ',1)'
        //});
        //$('#logo').css({
        //    transform: 'scale3d(' + scale + ',' + scale + ',1)'
        //});
        //$('#bridge_plus_intro').css({
        //    transform: 'scale3d(' + scale + ',' + scale + ',1)'
        //});
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
            //var circleBig = intro
            //    .circle(halfWidth, halfHeight, 0)
            //    .attr({
            //        fill: "#e7e7e7",
            //        stroke: "none"
            //    });
            line.animate({
                path: "M 0," + config.currentH + " L " + halfWidth + "," + halfHeight
            }, 1000, ">", function() {
                //return;
                INTRO.arcouno();
                line.animate({
                    path: "M " + halfWidth + "," + halfHeight + "L " + halfWidth + "," + halfHeight
                }, 1e3, ">", function() {});
                circleSmall.animate({
                    r: "72"
                }, 1800, ">", function() {});
                //setTimeout(function() {
                //    circleBig.animate({
                //        r: "92"
                //    }, 1200, ">", function() {});
                //}, 800);
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
                    //INTRO.intro.clear();
                    setTimeout(function() {
                        BridgeWheel.start();
                    }, 500);
                    return;
                    setTimeout(function() {
                        function a() {
                            var c = circleSmall.clone().attr({
                                transform: "r" + rot + ",151,156t0,-10"
                            });
                            c.animate({
                                transform: "r" + rot + ",151,156t0,0s0.9",
                                opacity: 0
                            }, 2e3, "elastic", function() {});
                            if (350 > rot) {
                                setTimeout(function() {
                                    a()
                                }, 20);
                                rot += 10;
                            } else {
                                //$("body").css("background", "#111");
                                //$('.logo_img').addClass('show');
                                //INTRO.intro.clear();
                            }
                        }
                        //var logodeco = new Raphael("logodeco", 390, 390);
                        //var b = logodeco.path("M 149,23 L 153,23 L 151,30 z").attr({
                        //    fill: "#ccc",
                        //    opacity: 0,
                        //    stroke: "none"
                        //});
                        a();
                        //INTRO.intro.clear();
                        //setTimeout(BridgeWheel.start, 1e3);
                    }, 1400);
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
            paper: null,
            sourceArr: [],
            imgAll: [],
            logo2: null,
            logo3: null,
            init: function() {
                INTRO.init();
            },
            evHandlers: function() {},
            start: function() {
                BridgeWheel.resize();
                //setTimeout(function() {
                BridgeWheel.paper = new Raphael("bridge_plus_wheel", 2000, 1000);
                BridgeWheel.sourceArr = vmvideos;
                BridgeWheel.paper.wheel(440, BridgeWheel.sourceArr.slice(32, 51), 2, BridgeWheel.sourceArr, [], additionInfo);
                //}, 500);
            },
            slicetoVideoInit: function(a, b, c) {},
            slicetoVideo: function(a, b, c) {},
            resize: resizeWheel
        };
    })();
    $(window).on('resize', function() {
        resize();
        BridgeWheel.resize();
    });
    resize();
    BridgeWheel.init();
    BridgeWheel.evHandlers();
});