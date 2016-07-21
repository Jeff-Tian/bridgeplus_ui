(function () {
    function controlShowHideOn(parentSelector, svgGroup) {
        $(parentSelector)
            .children()
            .each(function () {
                var $this = $(this);
                if (!$this.attr('data-group') || $this.attr('data-group') === svgGroup) {
                    $this.show();
                } else {
                    $this.hide();
                }
            });
    }

    function pauseVideoIfAny($parent) {
        var $video = $parent.find('video');

        if ($video.length) {
            $video.each(function (index, video) {
                video.pause();
            });
        }
    }

    function hideModal($modal) {
        $modal.removeClass('show');
        pauseVideoIfAny($modal);
    }

    $(document)
        .on('show_content', function (event, source, svgGroup) {
            controlShowHideOn('.group-description', svgGroup);
            controlShowHideOn('.carousel-items', svgGroup);
            controlShowHideOn('.services', svgGroup);
        })
        .on('click', '.mask .close.button', function () {
            hideModal($(this).closest('.mask'));
        })
        .on('click', '.mask .shadow-box', function (e) {
            e.stopPropagation();
        })
        .on('click', '.mask', function () {
            hideModal($(this));
        })
        .on('keydown', function (e) {
            if (e.keyCode === 27) {
                hideModal($('.mask.show'));
            }
        })
        .on('click', '[data-modal-selector]', function ($event) {
            // Show modal on click
            $($(this).attr('data-modal-selector')).addClass('show');
            $event.stopPropagation();
            pauseVideoIfAny($('.ui.embed'));
        });
})();