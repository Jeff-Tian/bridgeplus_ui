$('.masthead-carousel').owlCarousel({
    items: 1,
    lazyLoad: false,
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    nav: true,
    animateIn: 'b-pulse',
    navText: ['<i class="angle left icon"></i>', '<i class="angle right icon"></i>'],
    onTranslate: function () {
        // $('.masthead-carousel').removeClass('animated pulse');
        $('.owl-carousel').find('h1').removeClass('animated b-fadeInLeft');
        $('.owl-carousel').find('h2').removeClass('animated b-fadeInRight');
        //$('.masthead-carousel').removeClass('animated b-pulse');
        $('.owl-carousel').find('h1').hide();
        $('.owl-carousel').find('h2').hide();

        setTimeout(function () {
            $('.active').find('h1').show();
            $('.active').find('h2').show();
            $('.active').find('h1').addClass('animated b-fadeInLeft');
            $('.active').find('h2').addClass('animated b-fadeInRight');
        }, 100);
        setTimeout(function () {
            $('.owl-carousel').find('h1').removeClass('animated b-fadeInLeft');
            $('.owl-carousel').find('h2').removeClass('animated b-fadeInRight');
        }, 1200);
    }
});