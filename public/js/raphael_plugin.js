Raphael.fn.group = function(elements, klass) {
    var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    group.style && (group.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
    if (group.classList) {
        group.classList.add('svg_group');
        group.classList.add(klass);
    } else {
        var className = (group.getAttribute('class') || '').split(' ');
        var refresh = false;
        if (className.indexOf('svg_group') == -1) {
            className.push('svg_group');
            refresh = true;
        }
        if (className.indexOf(klass) == -1) {
            className.push(klass);
            refresh = true;
        }
        if (refresh) {
            group.setAttribute('class', className.join(' '));
        }
    }
    if (elements) {
        for (var i = 0, j = elements.length; i < j; i++) {
            group.appendChild(elements[i].node);
        }
    }
    this.canvas.appendChild(group);
    return group;
};

Raphael.fn.wheel = function(radius, json, index, dataAll, array, additionInfo) {
    var raphael = this;
    var imagesTotal = json.length;
    var imageLoadedCount = 0;
    var images = [];
    var angle = 360 / imagesTotal;
    //var y = 240 - 100 * index;
    var y = 340 - 70 * index;
    var namespace = 'http://www.w3.org/2000/svg';

    var imageWidth = 210,
        imageHeight = 100;
    json.forEach(function(item) {
        var img = new Image;
        img.onload = onImageLoad;
        img.onerror = onImageError;
        img.src = item.thumb;
        img.id = item.url;
        img.title = item.title;
        img.author = item.author;
    });

    function onImageLoad() {
        var img = raphael
            .image(this.src, 690, y, imageWidth, imageHeight)
            .attr({
                opacity: 0
            });
        //img.node.id = this.id;
        images.push(img);

        if (++imageLoadedCount == imagesTotal) {
            init();
        }
    }

    function onImageError() {
        var img = raphael
            .image("http://vlog.it/img/placeholder.jpg", 690, y, imageWidth, imageHeight)
            .attr({
                opacity: 0
            });
        img.node.id = this.id;
        images.push(img);
        if (++imageLoadedCount == imagesTotal) {
            init();
        }
    }

    function rotate(index, images) {
        /*
        210 半径的圆 24度

        左侧:x: 846.729396130826, y: 295.26513844181704
        右侧:x: 741.4729033951616, y: 205.76441587903088
        */
        //744.8751446550289, 205.1080700948295, 855.1248553449711, 205.1080700948295
        var max = 'M,800,500,L,862.3735072453278,206.5557197798583,A,300,300,0,0,0,737.6264927546722,206.5557197798583,z';
        var max = 'M,800,500,L,855.1248553449711, 205.1080700948295,A,300,300,0,0,0,744.8751446550289, 205.1080700948295,z';
        //[707.2949016875158, 214.68304511145396, 892.7050983124842, 214.68304511145396]
        //10 pieces, radius 300
        var max = 'M,800,500,L,892.7050983124842, 214.68304511145396,A,300,300,0,0,0,707.2949016875158, 214.68304511145396,z';
        var middle = 'M,800,500,L,844.8707740637095,274.419385507257,A,230,230,0,0,0,755.1292259362905,274.419385507257,z';
        var middle = 'M,800,500,L,871.073908706238, 281.2570012521147,A,230,230,0,0,0,728.926091293762, 281.2570012521147,z';
        
        var inner = 'M,800,500,L,835.6033494330103,344.0115340509082,A,160,160,0,0,0,764.3966505669897,344.0115340509082,z';
        //10 pieces, radius 160
        var inner = 'M,800,500,L,849.4427190999916, 347.8309573927754,A,160,160,0,0,0,750.5572809000084, 347.8309573927754,z';
        //8 pieces, radius
        //var inner = 'M,800,500,L,861.2293491784144, 352.1792747981941,A,160,160,0,0,0,738.7706508215856, 352.1792747981941,z';
        var slicepath = [
            //raphael.path("M,800,500,L,853.4050241495155,266.01730107636234,A,240,240,0,0,0,746.5949758504846,266.01730107636234,z")
            raphael.path(inner)
            .attr({ stroke: "none" }),
            //raphael.path("M,800,500,L,875.6571175451469,168.52450985817995,A,340,340,0,0,0,724.3428824548531,168.52450985817995,z")
            raphael.path(middle)
            .attr({ stroke: "none" }),
            //raphael.path("M,800,500,L,876.4051981734494,66.68458867462846,A,440,440,0,0,0,723.5948018265507,66.68458867462846,z")
            raphael.path(max)
            .attr({ stroke: "none" })
        ];
        var clipPath = document.createElementNS(namespace, "clipPath");
        clipPath.setAttribute("id", "clip_ring" + index);
        clipPath.appendChild(slicepath[index].node);
        raphael.canvas.appendChild(clipPath);
        images.forEach(function(img, i) {
            var rotate = angle * i;
            img.rotate(rotate, 800, 500);
            img.node.setAttribute("clip-path", "url(#clip_ring" + index + ")");
            img.node.style.cursor = "pointer";
            img.attr({ opacity: 0 });
            transform(img, angle, i);
        });
    }

    function transform(img, angle, index) {
        img.attr({ transform: 'r' + angle * index + ',800,500t0,140' });
    }

    function init() {
        var addtion = [];
        additionInfo[additionInfo.length - (index + 1)].forEach(function(image) {
            var imageNode = raphael
                .image(image.url, image.x, image.y, image.width, image.height)
                .attr({
                    opacity: 1
                });
            imageNode.node.classList.add('svg_group_addtion');
            addtion.push(imageNode);
        });

        var radius;
        switch (index) {
            case 2:
                radius = 300;
                break;
            case 1:
                radius = 230;
                break;
            case 0:
                radius = 160;
                break;
        }
        //var color = ((Math.random() * 0XFFFFFF) | 0).toString(16);
        var scale = (radius - 100) / radius;
        scale = ((scale * 100) | 0) / 100;
        var circle = raphael.circle(800, 500, radius)
            .attr({ fill: '#000', stroke: "none" });
        circle.node.style.transform = 'scale(' + scale + ',' + scale + ')';

        raphael.group([addtion[0]].concat(images, circle, addtion[1]), 'svg_group_' + index);

        rotate(index, images);
        array.push(images);
        if (index == 2) {
            raphael.wheel(340, dataAll.slice(10, 20), 1, dataAll, array, additionInfo);
        } else if (index == 1) {
            raphael.wheel(240, dataAll.slice(20, 30), 0, dataAll, array, additionInfo);
        } else {
            inner();
            $(document).trigger('wheel/show');
        }
    }

    function inner0() {
        function rotate() {
            if (index == images.length) {
                middle();
                images.forEach(function(image, i) {
                    image.animate({
                        transform: "r" + (360 + delta * i) + ",800,500"
                    }, 30000);
                });
            } else {
                images[index]
                    .attr({ opacity: 1 })
                    .animate({
                        transform: "r" + (delta * index) + ",800,500t0,0"
                    }, 100, "<>", function() {
                        index++;
                        rotate();
                    });
            }
        }
        var index = 0,
            images = array[2],
            delta = 360 / 14;
        rotate();
    }

    function inner() {
        var b = 36;
        var images = array[2];
        var total = images.length;
        images.forEach(function(image, index) {
            if (index == total - 1) {
                image
                    .attr({ opacity: 1 })
                    .animate({
                        transform: "r" + (b * index) + ",800,500t0,0"
                    }, 1000, "<>", function() {
                        middle();
                        images.forEach(function(image, i) {
                            image.animate({
                                transform: "r" + (360 + b * i) + ",800,500"
                            }, 30000);
                        });
                    });
            } else {
                image
                    .attr({ opacity: 1 })
                    .animate({
                        transform: "r" + b * index + ",800,500t0,0"
                    }, 1e3, "<>", function() {});
            }
        });
    }

    function middle() {
        var b = 36;
        var images = array[1];
        var total = images.length;
        images.forEach(function(image, index) {
            image
                .attr({ opacity: 1 })
                .animate({
                    transform: "r" + (b * index) + ",800,500t0,0"
                }, 1000, "<>", function() {
                    if (index == total - 1) {
                        outer();
                        images.forEach(function(image, i) {
                            image.animate({
                                transform: "r" + (-360 + b * i) + ",800,500"
                            }, 30000);
                        });
                    }
                });
        });
    }

    function outer() {
        var images = array[0];
        var total = images.length;
        var b = 36;
        images.forEach(function(image, index) {
            image
                .attr({ opacity: 1 })
                .animate({
                    transform: "r" + b * index + ",800,500t0,0"
                }, 1e3, "<", function() {
                    if (index == total - 1) {
                        images.forEach(function(image, i) {
                            image.animate({
                                transform: "r" + (360 + b * i) + ",800,500"
                            }, 3e4);
                        });
                    }
                })

        });
    }

    function pause() {
        array.forEach(function(images) {
            images.forEach(function(image) {
                image.pause();
            });
        });
    }
};