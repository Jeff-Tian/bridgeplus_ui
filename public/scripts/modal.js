$(document).ready(function () {
    function prepare() {
        $get('.mask .text').each(function () {
            var $this = $(this);
            var $image = $this.next('.image');
            $this.width($image.width() + 'px');
            $this.css('min-height', $image.height() + 'px');
        });

        $get('.mask .close.button').click(function () {
            $(this).closest('.mask').hide();
        });

        $get('.mask')
            .css('background-color', 'rgba(0, 0, 0, 0.4)')
            .css('padding-left', 0)
            .hide()
        ;
    }

    prepare();
});