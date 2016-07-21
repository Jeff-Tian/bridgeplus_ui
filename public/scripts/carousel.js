$(document).ready(function () {
    function loadImage(index, imageToLoad) {
        var $imageToLoad = $(imageToLoad);
        var img = new Image();
        img.onload = function () {
            $imageToLoad.attr('src', img.src);
            resizeStage();
        };
        img.src = $imageToLoad.attr('preload-src');
    }

    function loadImages() {
        $('img[preload-src]').map(loadImage);
    }

    function adjustItemWidth() {
        $('.carousel .item').each(function () {
            var $this = $(this);
            $this
                .css('width', $this.closest('.carousel').width() + 'px')
                .css('float', 'left')
                .css('position', 'absolute')
            ;
        });
    }

    function resizeStage() {
        var $stage = $('.carousel .carousel-inner');

        var $items = $('.carousel .item');
        var maxHeight = 0;
        for (var i = 0; i < $items.length; i++) {
            if (maxHeight < $($items[i]).height()) {
                maxHeight = $($items[i]).height();
            }
        }

        $stage.height(maxHeight + 'px');
    }

    function loadImageAndAdjustWidth() {
        loadImages();
        adjustItemWidth();
    }

    function clickToSlide() {
        var running = false;
        $(document).on('click', '.carousel .nav-bar .prev', function () {
            if (running) {
                return;
            }

            running = true;

            var $carousel = $(this).closest('.carousel');
            var $currentItem = $carousel.find('.item.active');
            var $prev = $currentItem.prev('.item');
            $prev.addClass('active').css('margin-left', '-100%');
            if ($prev.length <= 0) {
                $prev = $carousel.find('.item').last();
                $prev.addClass('active').css('margin-left', '-200%');
            }

            $currentItem.animate({
                'margin-left': '100%'
            }, function () {
                $currentItem.removeClass('active');
                $currentItem.css('margin-left', 0);
                $prev.animate({'margin-left': 0}, function () {
                    running = false;
                });
            });

        });

        $(document).on('click', '.carousel .nav-bar .next', function () {
            if (running) {
                return;
            }

            running = true;

            var $carousel = $(this).closest('.carousel');
            var $currentItem = $carousel.find('.item.active');
            var $next = $currentItem.next('.item');
            if ($next.length <= 0) {
                $next = $carousel.find('.item:first-child');
            }
            $next.addClass('active').css('margin-left', '100%');

            $currentItem.animate({
                'margin-left': '-100%'
            }, function () {
                $currentItem.removeClass('active');
                $currentItem.css('margin-left', 0);
                $next.animate({'margin-left': 0}, function () {
                    running = false;
                });
            });
        });
    }

    clickToSlide();
    loadImageAndAdjustWidth();

    $(document).on('pjax/done', function () {
        setTimeout(loadImageAndAdjustWidth, 100);
    });

    $(window).on('resize', adjustItemWidth);
});