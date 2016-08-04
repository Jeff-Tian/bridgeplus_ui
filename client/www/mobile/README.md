### Bridge+ Mobile page
===========================
For mobile pages, we may use Single Page Application architecture. So in `index.html`, there are `<script type="text/ng-template"></script>` tags. And `angular-ui-router` was introduced into `index.js`.

But for fast reuse some pages that had been done in PC pages, for example, `sign-in`, `reset password`, etc, some pages are OUTSIDE the Single Page Application architecture. So now the mobile module are a hybrid architecture, mixed with Single Page Application pages and legacy PC partial pages.

The rough principle here is:
    - For new mobile specific pages, use Single Page Application structure
    - For reuse already there PC pages, we can mix in them OUTSIDE the Single Page Application structure. However, from now on, there are no such PC pages we can reuse, because Mobile pages are being built faster (at least not slower) than PC pages now.
    
## Caution!
===========================
To be compatible with android old browser, don't use semantic UI's grid system, don't use it's card system.

## Wechat pay error resolution
===========================
- appid and openid not match
    Use the same mp account for paying to and for getting the open id.