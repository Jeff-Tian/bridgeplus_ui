(function() {
    var urlPrefix = '/bower/bridgeplus_ui/public/images/';
    var wheel_images_url = [
        'wheel/student_1.jpg',
        'wheel/student_2.jpg',
        'wheel/student_3.jpg',
        'wheel/student_4.jpg',
        'wheel/student_5.jpg',
        'wheel/student_6.jpg',
        'wheel/student_7.jpg',
        'wheel/student_8.jpg',
        'wheel/student_9.jpg',
        'wheel/student_10.jpg',
        'wheel/mentor_1.jpg',
        'wheel/mentor_2.jpg',
        'wheel/mentor_3.jpg',
        'wheel/mentor_4.jpg',
        'wheel/mentor_5.jpg',
        'wheel/mentor_6.jpg',
        'wheel/mentor_7.jpg',
        'wheel/mentor_8.jpg',
        'wheel/mentor_9.jpg',
        'wheel/mentor_10.jpg',
        'wheel/corporate_1.jpg',
        'wheel/corporate_2.jpg',
        'wheel/corporate_3.jpg',
        'wheel/corporate_4.jpg',
        'wheel/corporate_5.jpg',
        'wheel/corporate_6.jpg',
        'wheel/corporate_7.jpg',
        'wheel/corporate_8.jpg',
        'wheel/corporate_9.jpg',
        'wheel/corporate_10.jpg'
    ].map(function(url) {
        return urlPrefix + url;
    });
    var advertiseInfo = [
        [{
            url: urlPrefix + 'CORPORATE_PG.png',
            width: 460,
            height: 102,
            x: 600,
            y: 120
        }, {
            url: urlPrefix + 'CORPORATE.png',
            width: 123,
            height: 41,
            x: 739,
            y: 220
        }],
        [{
            url: urlPrefix + 'MENTOR_PG.png',
            width: 245,
            height: 183,
            x: 677.5,
            y: 110
        }, {
            url: urlPrefix + 'MENTOR.png',
            width: 123,
            height: 41,
            x: 739,
            y: 290
        }],
        [{
            url: urlPrefix + 'STUDENT_PG.png',
            width: 446,
            height: 207,
            x: 620,
            y: 200
        }, {
            url: urlPrefix + 'STUDENT.png',
            width: 123,
            height: 41,
            x: 739,
            y: 360
        }]
    ];

    var imageWidth = 210,
        imageHeight = 100,
        angle = 36,
        namespace = 'http://www.w3.org/2000/svg',
        imageNodesArray = [];

    function getSlicePath(raphael, wheel_index) {
        var path;
        switch (wheel_index) {
            case 0:
                //10 pieces, radius 160
                path = 'M,800,500,L,849.4427190999916, 347.8309573927754,A,160,160,0,0,0,750.5572809000084, 347.8309573927754,z'
                break;
            case 1:
                //10 pieces, radius 230
                path = 'M,800,500,L,871.073908706238, 281.2570012521147,A,230,230,0,0,0,728.926091293762, 281.2570012521147,z';
                break;
            case 2:
                //10 pieces, radius 300
                path = 'M,800,500,L,892.7050983124842, 214.68304511145396,A,300,300,0,0,0,707.2949016875158, 214.68304511145396,z';
        }
        return raphael.path(path).attr({ stroke: "none" });
    }

    function addClassToDom(item, klass) {
        if (item.classList) {
            item.classList.add(klass);
        } else {
            var className = (item.getAttribute('class') || '').split(' ');
            if (className.indexOf(klass) == -1) {
                className.push(klass);
                item.setAttribute('class', className.join(' '));
            }
        }
    }

    function rotateImage(img, angle, index) {
        img.attr({ transform: 'r' + angle * index + ',800,500t0,140' });
    }

    function loadImages(raphael, json, wheel_index, callback) {
        var imageLoadedCount = 0;
        var imagesTotal = json.length;
        var images = [];
        json.forEach(function(item, index) {
            var img = new Image;
            img.onload = onImageLoad;
            img.onerror = onImageLoad;
            img.src = item;
            img.id = 'wheel_image_' + index;
        });

        function onImageLoad() {
            var img = raphael
                .image(this.src, 690, 340 - 70 * wheel_index, imageWidth, imageHeight)
                .attr({
                    opacity: 0
                });
            img.node.id = this.id;
            images.push(img);

            if (++imageLoadedCount == imagesTotal) {
                callback(raphael, images, wheel_index);
            }
        }
    }

    function initWheel(raphael, images, index) {
        var addition = [];
        advertiseInfo[advertiseInfo.length - (index + 1)].forEach(function(image) {
            var imageNode = raphael
                .image(image.url, image.x, image.y, image.width, image.height)
                .attr({
                    opacity: 1
                });
            addClassToDom(imageNode.node, 'svg_group_addition');
            addition.push(imageNode);
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

        //overlay
        var scale = (radius - 100) / radius;
        scale = ((scale * 100) | 0) / 100;
        var circle = raphael.circle(800, 500, radius)
            .attr({ fill: '#000', stroke: "none" });
        circle.node.style.transform = 'scale(' + scale + ',' + scale + ')';
        raphael.group([addition[0]].concat(images, circle, addition[1]), 'svg_group_' + index);

        clipImages(raphael, images, index);
        imageNodesArray.push(images);
        if (index > 0) {
            initWheelWithIndex(raphael, index - 1);
        } else {
            animateCircleImages(2);
            $(document).trigger('wheel/show');
        }
    }

    function clipImages(raphael, images, index) {
        var clipPath = document.createElementNS(namespace, "clipPath");
        clipPath.setAttribute("id", "clip_ring" + index);
        clipPath.appendChild(getSlicePath(raphael, index).node);
        raphael.canvas.appendChild(clipPath);
        images.forEach(function(img, i) {
            var rotate = angle * i;
            img.rotate(rotate, 800, 500);
            img.node.setAttribute("clip-path", "url(#clip_ring" + index + ")");
            img.node.style.cursor = "pointer";
            img.attr({ opacity: 0 });
            rotateImage(img, angle, i);
        });
    }

    function animateCircleImagesCallback(images, circleIndex) {
        images.forEach(function(image, i) {
            image.animate({
                transform: "r" + ((circleIndex == 1 ? -360 : 360) + angle * i) + ",800,500"
            }, 30000);
        });
        if (circleIndex > 0) {
            animateCircleImages(--circleIndex);
        }
    }

    function animateCircleImages(circleIndex) {
        var images = imageNodesArray[circleIndex];
        var total = images.length;
        images.forEach(function(image, index) {
            image
                .attr({ opacity: 1 })
                .animate({
                    transform: "r" + angle * index + ",800,500t0,0"
                }, 1000, "<>", function() {
                    if (index == total - 1) {
                        animateCircleImagesCallback(images, circleIndex);
                    }
                });
        });
    }

    function initWheelWithIndex(raphael, index) {
        var start = index * 10;
        loadImages(raphael, wheel_images_url.slice(start, start + 10), index, initWheel);
    }

    Raphael.fn.group = function(elements, klass) {
        var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        addClassToDom(group, 'svg_group');
        addClassToDom(group, klass);
        if (elements) {
            for (var i = 0, j = elements.length; i < j; i++) {
                group.appendChild(elements[i].node);
            }
        }
        this.canvas.appendChild(group);
        return group;
    };
    Raphael.fn.wheel = function() {
        initWheelWithIndex(this, 2);
    };
})();