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
    $(document).on("show_right", function(){
        $("#pic-entrance").addClass("active");
    }).on("show_wheel", function(){
        $("#pic-entrance").removeClass("active");
    }).on('click', '.left-arrow', function() {
        $(document).trigger('show_wheel');
    });
});