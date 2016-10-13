(function(config) {
    if (window.tracker && window.tracker.send) {
        return;
    }
    var _tracker = window.tracker = {
        send: function () { }
    };

    if(!config || !config.trackingSite){
        return;
    }

    var _loadFailed, _delayTimes = 0;
    var _trackInstace, _trackingSite = config.trackingSite;

    function _init(siteUrl) {
        _registerTrack(siteUrl);
    }

    function _registerTrack(siteUrl) {
        try {
            $.getScript(siteUrl + "/track.js", function (res, status) {
                if (status == "success") {
                    if (_trackInstace) {
                        return;
                    }

                    _trackInstace = window.track('collector');
                    _trackInstace.init({siteUrl: siteUrl});
                }
                else {
                    _loadFailed = true;
                    console.log('Faild to load track script.');
                }
            });
        }
        catch (e) {
            _loadFailed = true;
            console.log('Faild to load track script.');
        }
    }

    _tracker.send = function (pageName, data) {
        if(_loadFailed === true){
            console.log('Faild to load track script.');
            return;
        }

        try {
            if (!pageName) {
                return;
            }

            delaySend(pageName, data);
        }
        catch (e) {
            console.log('Faild to send tracking', {
                pageName: pageName,
                properties: data
            });
        }

        function delaySend(pageName, data) {
            if(_delayTimes >= 5){
                _delayTimes = 0;
                return;
            }

            if (_trackInstace) {
                _delayTimes = 0;

                _trackInstace.track(pageName, data);
            }
            else {
                _delayTimes++;

                setTimeout(function () {
                    delaySend(pageName, data);
                }, 300);
            }
        }
    };

    _init(_trackingSite);

})(window.config);