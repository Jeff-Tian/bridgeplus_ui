$(function () {
    function getPopupByTargetId(event) {
        return $('.popup[for="' + $(event.currentTarget).attr('id') + '"]');
    }
    var popupHandler = function(handler) {
        return function(event) {
            var p = getPopupByTargetId(event);
            p[handler]("active");
        };
    };
    $('.popup-trigger').hover(popupHandler("addClass"), popupHandler("removeClass"));
});