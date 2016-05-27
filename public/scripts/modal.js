$(document).ready(function () {
    function prepare() {
        $('.mask .text').each(function () {
            var $this = $(this);
            var $image = $this.next('.image');
            $image.load(function () {
                console.log('image load', this);
                $this.css('width', $image[0].width + 'px');
                $this.css('min-height', $image[0].height + 'px');
            });
        });

        $('.mask .close.button').click(function () {
            $(this).closest('.mask').hide();
        });

        $('.mask')
            .css('background-color', 'rgba(0, 0, 0, 0.4)')
            .css('padding-left', 0)
            .hide()
        ;

        console.log('hided modals: ', $('.mask').length);

        // Show modal on click
        $('[data-modal-selector]').on('click', function () {
            var $this = $(this);
            $($this.attr('data-modal-selector')).css('display', 'flex');
        });

        console.log('modals prepared.');
    }

    prepare();
});