$(function () {
    function getPopupByTargetId(event) {
        return $('.popup[for="' + $(event.currentTarget).attr('id') + '"]');
    }

    function togglePopup(event) {
        var p = getPopupByTargetId(event);
        p.css({
            left: $(event.currentTarget).offset().left + 'px'
        }).toggle();
    }

    $('.popup-trigger').on('hover click', togglePopup);

});