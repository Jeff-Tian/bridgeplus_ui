$(document).ready(function () {
    function prepare() {
        $('.mask .text').each(function () {
            function adjustSize() {
                $this.css('width', $image[0].width + 'px');
                $this.css('min-height', $image[0].height + 'px');
            }

            var $this = $(this);
            var $image = $this.next('.image');

            adjustSize();
            $image.load(adjustSize);
        });

        function hideModal($mask) {
            $mask.hide();

            var $video = $mask.find('video');
            if ($video.length) {
                $video[0].pause();
            }
        }

        $('.mask .close.button').click(function () {
            hideModal($(this).closest('.mask'));
        });
        $('.mask').click(function () {
            hideModal($(this));
        });

        $(document).on('keydown', function (e) {
            if (e.keyCode === 27) {
                hideModal($('.mask'));
            }
        });

        $('.mask .shadow-box').click(function (e) {
            e.stopPropagation();
        });

        $('.mask')
            .css('background-color', 'rgba(0, 0, 0, 0.4)')
            .css('padding-left', 0)
            .hide()
        ;

        $('.mask.darker').css('background-color', 'rgba(0, 0, 0, 0.8)');

        console.log('hided modals: ', $('.mask').length);

        // Show modal on click
        $('[data-modal-selector]').on('click', function ($event) {
            var $this = $(this);
            var modalSelector = $this.attr('data-modal-selector');
            var $modal = $(modalSelector);
            $modal.css('display', 'flex');

            $event.stopPropagation();
        });

        console.log('modals prepared.');
    }

    prepare();


    $(document).on('pjax/done', function () {
        setTimeout(prepare, 100);
    });

    window.modals = {
        prepare: prepare
    };
});