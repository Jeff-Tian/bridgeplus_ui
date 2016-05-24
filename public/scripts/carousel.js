$(document).ready(function () {
    function resizeStage() {
        var $stage = $get('.carousel .carousel-inner');

        var $items = $get('.carousel .item');
        var maxHeight = 0;
        for (var i = 0; i < $items.length; i++) {
            if (maxHeight < $($items[i]).height()) {
                maxHeight = $($items[i]).height();
            }
        }

        $stage.height(maxHeight + 'px');
    }

    var deferreds = $get('img[preload-src]').map(function (i, elem) {
        var deferred = $.Deferred();

        var $this = $(elem);
        var img = new Image();
        img.onload = function () {
            $this.attr('src', img.src);
            resizeStage();

            deferred.resolve(i);
        };
        img.src = $this.attr('preload-src');

        return deferred;
    });

    $.when.apply(null, deferreds.get()).then(function () {
        // Use preload gif to eliminate the slow animation
    });

    var $stage = $get('.carousel .carousel-inner');
    $stage.height($stage.height() + 'px');

    $get('.carousel .item').each(function () {
        var $this = $(this);
        $this
            .css('width', $this.closest('.carousel').width() + 'px')
            .css('float', 'left')
            .css('position', 'absolute')
        ;
    });

    $get('.carousel .nav-bar .prev').click(function () {
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

    var running = false;
    $get('.carousel .nav-bar .next').click(function () {
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
});