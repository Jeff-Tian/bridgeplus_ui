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

        console.log('resizing footer body');
        var totalHeight = $body.height();
        console.log('total = ', totalHeight);
        var topHeight = $('.to-top').outerHeight();
        console.log('top = ', topHeight);
        var footerHeight = $('#footer').outerHeight();
        console.log('footer = ', footerHeight);
        var bodyHeight = totalHeight - topHeight - footerHeight;
        console.log('body height = ', bodyHeight);
        $footerBody.height(bodyHeight);
    }

    $(window).on('resize', function () {
        console.log('action when resize');
        resizeFooterBody();
        setTimeout(prepareCarousel, 500);
    });

    $(document).on('pjax/done', function () {
        console.log('action when pjax/done');
        setTimeout(prepareCarousel, 500);
    }).on('show_content', function () {
        console.log('action when show_content');
        resizeFooterBody();
        setTimeout(prepareCarousel, 500);
    });

    $('.to-top, #footer').find('img').each(function (index, element) {
        console.log('img load, changed height');
        $(element).on('load', resizeFooterBody);
    });
});