(function () {
    var animationSpeed = 1000;
    var animationEndEvents = 'oanimationend animationend webkitAnimationEnd';

    var slidePages = ['/portal/zh/about-us', '/portal/zh/team', '/portal/zh/video', '/portal/zh/contact-us', '/portal/zh/join-us'];

    var alwaysLeftwardsSlides = ['/portal/zh/student-portal', '/portal/zh/mentor-portal', '/portal/zh/hr-portal'];

    function getAnimation(current, next, inPlaceRefresh, slideLeftwards, slideRightwards) {
        if (alwaysLeftwardsSlides.indexOf(current) >= 0 &&
            alwaysLeftwardsSlides.indexOf(next) >= 0) {
            return slideLeftwards;
        }

        var currentIndex = slidePages.indexOf(current);
        var nextIndex = slidePages.indexOf(next);

        if (currentIndex < 0 || nextIndex < 0 || currentIndex === nextIndex) {
            return inPlaceRefresh;
        }

        return currentIndex < nextIndex ? slideLeftwards : slideRightwards;
    }

    function moveToLeft($prev) {
        $prev.addClass('slide-to-left');
        removePrev($prev);
    }

    function returnToOriginalPos($next) {
        return $next.animate({
            left: '0',
            right: '0'
        }, 'slow', function () {
            $next.css('position', 'relative');
        }).promise();
    }

    function removePrev($prev) {
        $prev.bind(animationEndEvents, function () {
            $prev.remove();
        });
    }

    function moveToRight($prev) {
        $prev.addClass('slide-to-right');
        removePrev($prev);
    }


    function cloneOldSlide(fromNode, then) {
        var prevBody = document.createElement('div');
        prevBody.innerHTML = fromNode.innerHTML;

        var $prevBody = $(prevBody);
        var $body = $(fromNode);

        $prevBody.css({
            position: 'absolute',
            left: '0',
            right: '0',
            height: $body.height() + 'px',
            'background-color': $body.css('background-color')
        });

        $prevBody.insertBefore($body);

        then && then($prevBody, $body);
    }

    function fixFooter() {
        $('#footer').css('position', 'fixed');
    }

    function recoverFooter() {
        setTimeout(function () {
            $('#footer').css('position', 'relative');
        }, animationSpeed);
    }


    function slideToLeft($next, $prev) {
        fixFooter();
        moveToLeft($prev);
        $next
            .addClass('return-to-origin-from-right');
        $next.bind(animationEndEvents, function () {
            $next
                .removeClass('return-to-origin-from-right');
        });
        recoverFooter();
    }


    function slideToRight($next, $prev) {
        fixFooter();
        moveToRight($prev);

        $next.addClass('return-to-origin-from-left');

        $next.bind(animationEndEvents, function () {
            $next
                .removeClass('return-to-origin-from-left');
        });

        recoverFooter();
    }

    window.animationDirector = {
        returnToOriginalPos: returnToOriginalPos,
        cloneOldSlide: cloneOldSlide,
        getAnimation: getAnimation,
        slideToLeft: slideToLeft,
        slideToRight: slideToRight
    };
})();

$(function () {
    var div = document.createElement('DIV'),
        body,
        title,
        bodyCache = [],
        bodyDataCache = [],
        titleCache = [],
        htmlCache = {}
        ;

    function cacheRotate(cache, content) {
        cache.push(content);

        if (cache.length > 5) {
            cache.shift();
        }
    }

    document.addEventListener('click', function (e) {
        var node = e.target;
        if (node.nodeName !== 'A') {
            node = $(node).closest('a');
            if (node.length) {
                node = node[0];
            } else {
                return true;
            }
        }

        var href = node.href ? node.href.toLowerCase() : '';

        if (node.getAttribute('use-pjax') === 'false' || !href.length ||
            (href.charAt(0) == '#') ||
            (href.indexOf('mailto:') == 0) ||
            (href.indexOf('javascript:') == 0)
        ) {
            return true;
        }

        e.preventDefault();
        e.stopPropagation();

        load(href, node, true, animationDirector.getAnimation(location.pathname, node.pathname, refresh, slideLeftToRight, slideRightToLeft));
    }, false);

    window.addEventListener("popstate", function () {
        if (bodyCache && bodyCache.length) {
            refresh(bodyCache.pop(), titleCache.pop(), bodyDataCache.pop());
            return;
        }
        load(location.href);
    });

    $(document).on('navigate', function (e, url) {
        load(url, null, true);
    });

    function refresh(bodyHTML, titleHTML, data) {
        animateWith(titleHTML, data, function () {
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

    function animateWith(titleHTML, data, animation) {
        $(document).trigger('pjax/refresh');
        ensureBodyAndTitle();

        animation();

        setData(data, titleHTML);
        $(document).trigger('pjax/done');
        console.log('pjax/done');
    }

    function slideLeftToRight(bodyHTML, titleHTML, data) {
        animateWith(titleHTML, data, function () {
            animationDirector.cloneOldSlide(body, function ($prev, $next) {
                body.innerHTML = bodyHTML;
                animationDirector.slideToLeft($next, $prev);
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

    var slideToRight = animationDirector.slideToRight;

    function slideRightToLeft(bodyHTML, titleHTML, data) {
        animateWith(titleHTML, data, function () {
            animationDirector.cloneOldSlide(body, function ($prev, $next) {
                body.innerHTML = bodyHTML;
                slideToRight($next, $prev);
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

    function getHtml(url, callback) {
        console.log('getting ', url);

        if (url.indexOf('/') === 0 && url.indexOf('//') < 0) {
            url = location.origin + url;
        }

        if (htmlCache[url]) {
            console.log('from cache');
            callback(htmlCache[url]);
        } else {
            console.log('from server');
            $.get(url, function (html) {
                htmlCache[url] = html;

                callback(html);
            });
        }
    }

    function load(url, target, push, animation) {
        $(document).trigger('pjax/start');
        getHtml(url, function (html) {
            body = body || document.querySelector('.body');
            title = title || document.querySelector('title');
            div.innerHTML = html;
            if (push) {
                history.pushState(url, '', url);
                cacheRotate(bodyCache, body.innerHTML);
                cacheRotate(bodyDataCache, getData(body.attributes));
                if (title) {
                    cacheRotate(titleCache, title.innerHTML);
                }
            }
            var bodyElement = div.querySelector('.body');
            var titleElement = div.querySelector('title');

            animation = animation || refresh;
            animation(bodyElement.innerHTML, titleElement && titleElement.innerHTML, getData(bodyElement.attributes), target);
        });
    }
});