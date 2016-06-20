$(function() {
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

    document.addEventListener('click', function(e) {
        if (e.target.nodeName !== 'A') {
            return true;
        }
        var href = e.target.href ? e.target.href.toLowerCase() : '';
        if (e.target.getAttribute('use-pjax') === 'false' ||
            !href.length ||
            (href.charAt(0) == '#') ||
            (href.indexOf('mailto:') == 0) ||
            (href.indexOf('javascript:') == 0)
        ) {
            return true;
        }
        e.preventDefault();
        e.stopPropagation();
        load(href, e.target, true);
    }, false);
    window.addEventListener("popstate", function() {
        if (bodyCache && bodyCache.length) {
            refresh(bodyCache.pop(), titleCache.pop(), bodyDataCache.pop());
            return;
        }
        load(location.href);
    });

    $(document).on('navigate', function(url) {
        load(url, null, true);
    });

    function refresh(bodyHTML, titleHTML, data, target) {
        $(document).trigger('pjax/refresh');
        body = body || document.querySelector('.body');
        title = title || document.querySelector('title');
        body.classList.add('hide');
        setTimeout(function() {
            body.innerHTML = bodyHTML;
            body.classList.remove('hide');
        }, 100);
        Object.keys(data).forEach(function(key) {
            body.setAttribute('data-' + key, data[key]);
        });
        if (title) {
            title.innerHTML = titleHTML;
        }
        $(document).trigger('pjax/done');
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

    function load(url, target, push) {
        $(document).trigger('pjax/start');
        $.get(url, function(e, html) {
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
            refresh(bodyElement.innerHTML, titleElement && titleElement.innerHTML, getData(bodyElement.attributes), target);
        });
    }
});