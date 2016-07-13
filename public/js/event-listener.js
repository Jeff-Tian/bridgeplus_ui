(function() {
    function controlShowHideOn(parentSelector, svgGroup) {
        $(parentSelector)
            .children()
            .each(function() {
                var $this = $(this);
                if (!$this.attr('data-group') || $this.attr('data-group') === svgGroup) {
                    $this.show();
                } else {
                    $this.hide();
                }
            });
    }

    $(document)
        .on('show_content', function(event, source, svgGroup) {
            controlShowHideOn('.group-description', svgGroup);
            controlShowHideOn('.carousel-items', svgGroup);
            controlShowHideOn('.services', svgGroup);
        })
        .on('click', '.mask .close.button', function() {
            var $this = $(this).closest('.mask').removeClass('show');

            var $video = $this.find('video');
            if ($video.length) {
                $video[0].pause();
            }
        })
        .on('click', '[data-modal-selector]', function($event) {
            // Show modal on click
            $($(this).attr('data-modal-selector')).addClass('show');
            $event.stopPropagation();
        });
})();