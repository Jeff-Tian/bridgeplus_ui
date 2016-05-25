(function () {
    function controlShowHideOn(parentSelector, svgGroup) {
        $get(parentSelector)
            .children()
            .each(function () {
                var $this = $get(this);
                if ($this.attr('data-group') === svgGroup) {
                    $this.show();
                } else {
                    $this.hide();
                }
            })
        ;
    }

    $get(document).on('show_content', function (event, source, svgGroup) {
        controlShowHideOn('.group-description', svgGroup);
        controlShowHideOn('.carousel-items', svgGroup);
        controlShowHideOn('.services', svgGroup);
    });
})();