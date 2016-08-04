define([

], function (

) {
    var $html = window ? window.document.getElementsByTagName('html') : undefined;
    if ($html && $html.length) {
        $html = $html[0];
    }

    (function () {
        $html.className = $html.className.replace(/(^|\s)bplus-lng-[a-z]{2}(\s|$)/i, '');
        var maLng = window.location.pathname.toString().toLowerCase().match(/^\/([a-z]{2})\/.*?/i),
            lng = maLng ? maLng[1] : 'zh';
        $html.className += ($html.className ? ' ' : '') + 'bplus-lng-' + lng;
    })();
});