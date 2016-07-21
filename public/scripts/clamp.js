$(function () {
    function clamp() {
        var clamps = document.getElementsByClassName('clamp');
        for (var i = 0; i < clamps.length; i++) {
            var e = clamps[i];
            $clamp(e, {clamp: 5});
        }
    }

    clamp();

    $(document)
        .on('pjax/done', clamp)
        .on('show_content', clamp)
    ;
});