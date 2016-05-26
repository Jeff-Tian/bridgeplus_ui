$(document).ready(function () {
    function prepare() {
        $('.mask .text').each(function () {
            var $this = $(this);
            var $image = $this.next('.image');
            $this.width($image.width() + 'px');
            $this.css('min-height', $image.height() + 'px');
        });

        $('.mask .close.button').click(function () {
            $(this).closest('.mask').hide();
        });

        $('.mask')
            .css('background-color', 'rgba(0, 0, 0, 0.4)')
            .css('padding-left', 0)
            .hide()
        ;

        // Show modal on click
        $('[data-modal-selector]').on('click', function () {
            var $this = $(this);
            $($this.attr('data-modal-selector')).css('display', 'flex');
        });

        console.log('modals prepared.');
    }

    prepare();
});