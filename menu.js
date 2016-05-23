$(document).ready(function(){
    var isMenuActive = false;
    $(".menu-button").click(function() {
        if (!isMenuActive) {
            $(".menu").addClass("active");
        } else {
            $(".menu").removeClass("active");
        }
        isMenuActive = !isMenuActive;
    });

    //On receive event
    (function(){
        $("#pic-entrance").addClass("active");
    })();
});