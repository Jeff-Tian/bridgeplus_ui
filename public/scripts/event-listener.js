(function () {
    function controlShowHideOn(parentSelector, svgGroup) {
        $(parentSelector)
            .children()
            .each(function () {
                var $this = $(this);
                if ($this.attr('data-group') === svgGroup) {
                    $this.show();
                } else {
                    $this.hide();
                }
            })
        ;
    }

    $(document).on('show_content', function (event, source, svgGroup) {
        controlShowHideOn('.group-description', svgGroup);
        controlShowHideOn('.carousel-items', svgGroup);
        controlShowHideOn('.services', svgGroup);
    });
})();