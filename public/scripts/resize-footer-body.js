$(function () {
    function prepareCarousel() {
        $('.owl-carousel').owlCarousel({
            items: 1,
            lazyLoad: true,
            loop: true,
            autoplayTimeout: 8000,
            autoplayHoverPause: true,
            nav: true,
            navRewind: true,
            smartSpeed: 500,
            navText: ['<i>&lt;</i>', '<i>&gt;</i>'],
            autoHeight: true
        });
    }

    function resizeFooterBody() {
        var $footerBody = $('.body'),
            $body = $('body');

        var totalHeight = $body.height();
        var topHeight = $('.to-top').outerHeight();
        var footerHeight = $('#footer').outerHeight();
        var bodyHeight = totalHeight - topHeight - footerHeight;
        $footerBody.height(bodyHeight);
    }

    $(window).on('resize', function () {
        resizeFooterBody();
        setTimeout(prepareCarousel, 500);
    });

    $(document).on('pjax/done', function () {
        setTimeout(prepareCarousel, 500);
    }).on('show_content', function () {
        resizeFooterBody();
        setTimeout(prepareCarousel, 500);
    });

    $('.to-top, #footer').find('img').each(function (index, element) {
        $(element).on('load', resizeFooterBody);
    });
});