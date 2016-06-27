$(function () {
    var div = document.createElement('DIV'),
        body,
        title,
        bodyCache = [],
        bodyDataCache = [],
        titleCache = [];

    function addBody(html) {
        bodyCache.push(html);
        if (bodyCache.length > 5) {
            bodyCache.shift();
        }
    }

    function addBodyData(data) {
        bodyDataCache.push(data);
        if (bodyDataCache.length > 5) {
            bodyDataCache.shift();
        }
    }

    function addTitle(html) {
        titleCache.push(html);
        if (titleCache.length > 5) {
            titleCache.shift();
        }
    }

    var slidePages = ['/portal/zh/about-us', '/portal/zh/team', '/portal/zh/video', '/portal/zh/contact-us', '/portal/zh/join-us'];

    function getAnimation(current, next) {
        var currentIndex = slidePages.indexOf(current);
        var nextIndex = slidePages.indexOf(next);

        if (currentIndex === nextIndex) {
            return refresh;
        }

        return currentIndex < nextIndex ? slideLeftToRight : slideRightToLeft;

    }

    document.addEventListener('click', function (e) {
        if (e.target.nodeName !== 'A') {
            return true;
        }

        var href = e.target.href ? e.target.href.toLowerCase() : '';
        if (e.target.getAttribute('use-pjax') === 'false' || !href.length ||
            (href.charAt(0) == '#') ||
            (href.indexOf('mailto:') == 0) ||
            (href.indexOf('javascript:') == 0)
        ) {
            return true;
        }

        e.preventDefault();
        e.stopPropagation();

        load(href, e.target, true, getAnimation(location.pathname, e.target.pathname));
    }, false);

    window.addEventListener("popstate", function () {
        if (bodyCache && bodyCache.length) {
            refresh(bodyCache.pop(), titleCache.pop(), bodyDataCache.pop());
            return;
        }
        load(location.href);
    });

    $(document).on('navigate', function (url) {
        load(url, null, true);
    });

    function refresh(bodyHTML, titleHTML, data, target) {
        animateWith(titleHTML, data, target, function () {
            body.classList.add('hide');

            setTimeout(function () {
                body.innerHTML = bodyHTML;
                body.classList.remove('hide');
            }, 100);
        });
    }

    function ensureBodyAndTitle() {
        body = body || document.querySelector('.body');
        title = title || document.querySelector('title');
    }

    function animateWith(titleHTML, data, target, animation) {
        $(document).trigger('pjax/refresh');
        ensureBodyAndTitle();

        animation();

        setData(data, titleHTML);
        $(document).trigger('pjax/done');
    }

    function cloneOldSlide(then) {
        var prevBody = document.createElement('div');
        prevBody.innerHTML = body.innerHTML;

        var $prevBody = $(prevBody);
        var $body = $(body);

        $prevBody.css({
            position: 'absolute',
            left: '0',
            right: '0'
        });

        $prevBody.insertBefore($body);

        then && then($prevBody, $body);

        return {$prevBody: $prevBody, $body: $body};
    }

    function placeToRight($next) {
        $next.css({
            position: 'absolute',
            left: '100%',
            right: '-100%'
        });
    }

    function moveToLeft($prev) {
        $prev.animate({
            left: '-100%',
            right: '100%'
        }, 'slow', function () {
            $prev.remove();
        });
    }

    function slideLeftToRight(bodyHTML, titleHTML, data, target) {
        animateWith(titleHTML, data, target, function () {
            cloneOldSlide(function ($prev, $next) {
                body.innerHTML = bodyHTML;

                placeToRight($next);

                moveToLeft($prev);

                returnToOriginalPos($next);
            });
        });
    }


    function setData(data, titleHTML) {
        Object.keys(data).forEach(function (key) {
            body.setAttribute('data-' + key, data[key]);
        });
        if (title) {
            title.innerHTML = titleHTML;
        }
    }

    function returnToOriginalPos($next) {
        $next.animate({
            left: '0',
            right: '0'
        }, 'slow', function () {
            $next.css('position', 'relative');
        });
    }

    function placeToLeft($next) {
        $next.css({
            position: 'absolute',
            left: '-100%',
            right: '100%'
        });
    }

    function moveToRight($prev) {
        $prev.animate({
            left: '100%',
            right: '-100%'
        }, 'slow', function () {
            $prev.remove();
        });
    }

    function slideRightToLeft(bodyHTML, titleHTML, data, target) {
        animateWith(titleHTML, data, target, function () {
            cloneOldSlide(function ($prev, $next) {
                body.innerHTML = bodyHTML;

                placeToLeft($next);

                moveToRight($prev);

                returnToOriginalPos($next);
            });
        });
    }

    function getData(attributes) {
        var data = {};
        for (var i = attributes.length - 1; i >= 0; i--) {
            var attribute = attributes[i];
            if (attribute.name.indexOf('data-') == 0) {
                data[attribute.name.slice(5)] = attribute.value;
            }
        }
        return data;
    }

    function load(url, target, push, animation) {
        $(document).trigger('pjax/start');
        $.get(url, function (html) {
            body = body || document.querySelector('.body');
            title = title || document.querySelector('title');
            div.innerHTML = html;
            if (push) {
                history.pushState(url, '', url);
                addBody(body.innerHTML);
                addBodyData(getData(body.attributes));
                if (title) {
                    addTitle(title.innerHTML);
                }
            }
            var bodyElement = div.querySelector('.body');
            var titleElement = div.querySelector('title');

            animation = animation || refresh;
            animation(bodyElement.innerHTML, titleElement && titleElement.innerHTML, getData(bodyElement.attributes), target);
        });
    }
});