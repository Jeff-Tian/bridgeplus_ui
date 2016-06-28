(function () {
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

    function returnToOriginalPos($next) {
        return $next.animate({
            left: '0',
            right: '0'
        }, 'slow', function () {
            $next.css('position', 'relative');
        }).promise();
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


    function cloneOldSlide(fromNode, then) {
        var prevBody = document.createElement('div');
        prevBody.innerHTML = fromNode.innerHTML;

        var $prevBody = $(prevBody);
        var $body = $(fromNode);

        $prevBody.css({
            position: 'absolute',
            left: '0',
            right: '0'
        });

        $prevBody.insertBefore($body);

        then && then($prevBody, $body);
    }

    function fixFooter() {
        $('#footer').css('position', 'fixed');
    }

    function recoverFooter() {
        $('#footer').css('position', 'relative');
    }


    function slideToLeft($next, $prev) {
        fixFooter();
        placeToRight($next);
        moveToLeft($prev);
        returnToOriginalPos($next).done(recoverFooter);
    }


    function slideToRight($next, $prev) {
        fixFooter();
        placeToLeft($next);
        moveToRight($prev);
        returnToOriginalPos($next).done(recoverFooter);
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

    document.addEventListener('click', function (e) {
        if (e.target.nodeName !== 'A' && e.target.nodeName !== 'IMG') {
            return true;
        }

        var current = location;
        var next = e.target;

        var href = next.href ? next.href.toLowerCase() : '';

        if (e.target.nodeName === 'IMG') {
            next = $(e.target).closest('a')[0];
            href = next.href;
        }

        if (next.getAttribute('use-pjax') === 'false' || !href.length ||
            (href.charAt(0) == '#') ||
            (href.indexOf('mailto:') == 0) ||
            (href.indexOf('javascript:') == 0)
        ) {
            return true;
        }

        e.preventDefault();
        e.stopPropagation();

        load(href, next, true, animationDirector.getAnimation(current.pathname, next.pathname, refresh, slideLeftToRight, slideRightToLeft));
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