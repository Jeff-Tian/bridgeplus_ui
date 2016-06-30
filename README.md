## Run on your machine
```
npm install
bower install

npm start
```

# Generate minified css and js
Run the following command before commit and push code to ensure the minified files are updated:
```
gulp
```

~~# Generate html files from jade
If you changed jade file, you should run~~ 
~~```
gulp jade

~~```
to generate html files accordingly.

~~You develop footer part using `jade` template, and run `gulp jade` to generate result html.

# Routers
http://localhost:13000 to show the index page.
http://localhost:13000/index-footer to show only the footer.

# Static resource references:
Because this repo will be bower included into bplus_ui, so for the static resource, you should include them like this(notice the `/bower/bridgeplus_ui/public` part) :
```
link(rel="stylesheet", href="/bower/bridgeplus_ui/public/stylesheets/page/index_modal.css")
```