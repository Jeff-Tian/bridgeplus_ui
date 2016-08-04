(function(context){
    var trackSender;

    _load(function () {
        trackSender = _getTrackSender();
    });

    window.setPageStatus = function(status, isDelay){
        try {
            if (trackSender) {
                if (isDelay === true) {
                    (function (status) {
                        setTimeout(function () {
                            trackSender.setPageStatus(status);
                        }, 300);
                    })(status);
                }
                else {
                    trackSender.setPageStatus(status);
                }
            }
            else {
                _load(function () {
                    trackSender = _getTrackSender();

                    if (isDelay === true) {
                        (function (status) {
                            setTimeout(function () {
                                trackSender.setPageStatus(status);
                            }, 300);
                        })(status);
                    }
                    else {
                        trackSender.setPageStatus(status);
                    }
                });
            }
        }
        catch(e){
            console.log('Faild to set page status', {
                status: status
            });
        }
    };

    window.sendTrack = function (pageName, data, isDelay) {
        try {
            if (!pageName) {
                return;
            }

            if (trackSender) {
                if (isDelay === true) {
                    (function (pageName, data) {
                        setTimeout(function () {
                            trackSender.track(pageName, data);
                        }, 300);
                    })(pageName, data);
                }
                else {
                    trackSender.track(pageName, data);
                }
            }
            else {
                _load(function () {
                    trackSender = _getTrackSender();

                    if (isDelay === true) {
                        (function (pageName, data) {
                            setTimeout(function () {
                                trackSender.track(pageName, data);
                            }, 300);
                        })(pageName, data);
                    }
                    else {
                        trackSender.track(pageName, data);
                    }
                });
            }
        }
        catch(e){
            console.log('Faild to send tracking', {
                pageName: pageName,
                properties: data
            });
        }
    };

    window.ModuleTrack = function(moduleName, locationChangeCall){
        var _moduleName = moduleName;

        var me = this;
        if(typeof locationChangeCall === 'function'){
            window.addEventListener('hashchange', function () {
                locationChangeCall(me, { hash: me.currentHash() });
            });
        }

        this.currentHash = function(){
            var hash = window.location.hash;
            if(hash){
                if(hash.indexOf('#') === 0){
                    hash = hash.substr(1, hash.length - 1);
                }

                if(hash.indexOf('/') === 0){
                    hash = hash.substr(1, hash.length - 1);
                }

                hash = hash.toLowerCase();
            }

            return hash;
        };

        this.send = function(name, data, isDelay){
            if(!_moduleName && !name){
                return;
            }

            if(_moduleName){
                name = name ? _moduleName + '.' + name : _moduleName;
            }

            window.sendTrack(name, data, isDelay);
        };

        this.setStatus = function(status, isDelay){
            window.setPageStatus(status, isDelay);
        };
    };


    function _load(call){
        try {
            var scriptUrl = context.config.trackingUrl + "/track.js";

            $.getScript(scriptUrl, function (response, status) {
                if (status == "success") {
                    if (call) {
                        call();
                    }
                }
                else{
                    console.log('Faild to load track script.');
                }
            });
        }
        catch(e){
            console.log('Faild to load track script.');
        }
    }

    function _getTrackSender(){
        if(trackSender){
            return trackSender;
        }

        var sender = window.track('collector');
        sender.init({siteUrl: context.config.trackingUrl});

        return sender;
    }


    $(document).ready(function(){
        window.sendTrack(window.t_PageName, null, true);

        $("body").on("click", "a[eventName]", function(e){
            var $currentTarget = $(e.currentTarget);

            var name = $currentTarget.attr("eventName");
            var url = $currentTarget.attr("href");

            if(name){
                window.sendTrack(name);

                if($currentTarget.attr("target") !== '_blank'){
                    e.preventDefault();

                    if(url) {
                        window.setTimeout(function () {
                            window.location.href = url;
                        }, 300);
                    }
                }
            }
        });
    });
})(angular.bplus = angular.bplus || {});